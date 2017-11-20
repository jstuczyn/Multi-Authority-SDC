"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _PSSig = require("../PSSig");

var _PSSig2 = _interopRequireDefault(_PSSig);

var _BpGroup = require("../BpGroup");

var _BpGroup2 = _interopRequireDefault(_BpGroup);

var _mocha = require("mocha");

var mocha = _interopRequireWildcard(_mocha);

var _chai = require("chai");

var chai = _interopRequireWildcard(_chai);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("Pointcheval-Sanders Short Randomizable Signatures scheme", function () {
    /*
    describe("Setup", () => {
        const params = PSSig.setup();
        const [G, o, g1, g2, e] = params;
          it("Returns BpGroup Object", () => {
            chai.assert.isNotNull(G);
            chai.assert.isTrue(G instanceof(BpGroup));
        });
          it("Returns Group Order", () => {
            chai.assert.isNotNull(o);
            chai.assert.isTrue(o instanceof(G.ctx.BIG));
        });
          it("Returns Gen1", () => {
            chai.assert.isNotNull(g1);
            chai.assert.isTrue(g1 instanceof(G.ctx.ECP));
        });
          it("Returns Gen2", () => {
            chai.assert.isNotNull(g2);
            chai.assert.isTrue(g2 instanceof(G.ctx.ECP2));
        });
          it("Returns Pair function", () => {
            chai.assert.isNotNull(e);
            chai.assert.isTrue(e instanceof(Function));
        });
    });
      describe("Keygen", () => {
        const params = PSSig.setup();
        const [G, o, g1, g2, e] = params;
        const [sk, pk] = PSSig.keygen(params);
          const [x, y] = sk;
        let [g, X, Y] = pk;
          it("Returns Secret Key (x,y)", () => {
            chai.assert.isTrue(x instanceof(G.ctx.BIG));
            chai.assert.isTrue(y instanceof(G.ctx.BIG));
        });
          describe("Returns Valid Private Key (g,X,Y)", () => {
            it("g = g2", () => {
                chai.assert.isTrue(g2.equals(g));
            });
              it("X = g2*x", () => {
                chai.assert.isTrue(X.equals(g2.mul(x)));
            });
              it("Y = g2*y", () => {
                chai.assert.isTrue(Y.equals(g2.mul(y)));
            });
          })
    });
      // h, sig = (x+y*m) * h
     describe("Sign", () => {
        const params = PSSig.setup();
        const [G, o, g1, g2, e] = params;
        const [sk, pk] = PSSig.keygen(params);
        const [x, y] = sk;
          let m = "Hello World!";
          const signature = PSSig.sign(params, sk, m);
        const [sig1, sig2] = signature;
            it("For signature(sig1, sig2), sig2 = ((x+y*(m mod p)) mod p) * sig1", () => {
            m = G.hashToBIG(m);
            const mcpy = new G.ctx.BIG(m);
            mcpy.mod(o);
              const t1 = G.ctx.BIG.mul(y,mcpy);
              const xDBIG =  new G.ctx.DBIG(0);
            for (let i = 0; i < G.ctx.BIG.NLEN; i++) {
                xDBIG.w[i] = x.w[i];
            }
            t1.add(xDBIG);
            const K = t1.mod(o);
              const sig_test = G.ctx.PAIR.G1mul(sig1, K);
            chai.assert.isTrue(sig2.equals(sig_test))
        });
    });
        describe("Verify", () => {
        describe("With sk = (42, 513)", () => {
            const params = PSSig.setup();
            const [G, o, g1, g2, e] = params;
              // keygen needs to be done "manually"
            const x = new G.ctx.BIG(42);
            const y = new G.ctx.BIG(513);
              const sk = [x, y];
            const pk = [g2, g2.mul(x), g2.mul(y)];
              const m = "Hello World!";
            const sig = PSSig.sign(params, sk, m);
              it("Successful verification for original message", () => {
                chai.assert.isTrue(PSSig.verify(params, pk, m, sig));
            });
              it("Failed verification for another message", () => {
                let m2 = "Other Hello World!";
                chai.assert.isNotTrue(PSSig.verify(params, pk, m2, sig));
            });
          });
          describe("With 'proper' random", () => {
            const params = PSSig.setup();
            const [G, o, g1, g2, e] = params;
            const [sk, pk] = PSSig.keygen(params);
            const [x, y] = sk;
              const m = "Hello World!";
            const sig = PSSig.sign(params, sk, m);
              it("Successful verification for original message", () => {
                chai.assert.isTrue(PSSig.verify(params, pk, m, sig));
            });
              it("Failed verification for another message", () => {
                let m2 = "Other Hello World!";
                chai.assert.isNotTrue(PSSig.verify(params, pk, m2, sig));
            });
        });
    });
        describe("Randomize", () => {
        const params = PSSig.setup();
        const [G, o, g1, g2, e] = params;
        const [sk, pk] = PSSig.keygen(params);
        const [x, y] = sk;
          const m = "Hello World!";
        let sig = PSSig.sign(params, sk, m);
        sig = PSSig.randomize(params, sig);
          it("Successful verification for original message with randomized signature", () => {
            chai.assert.isTrue(PSSig.verify(params, pk, m, sig));
        });
          it("Failed verification for another message with randomized signature", () => {
            let m2 = "Other Hello World!";
            chai.assert.isNotTrue(PSSig.verify(params, pk, m2, sig));
        });
    });*/

    // todo: better test for whether aggregation is correct

    describe("Aggregate", function () {
        it("Aggregation(s1) = s1", function () {
            var params = _PSSig2.default.setup();

            var _params = _slicedToArray(params, 5),
                G = _params[0],
                o = _params[1],
                g1 = _params[2],
                g2 = _params[3],
                e = _params[4];

            var _PSSig$keygen = _PSSig2.default.keygen(params),
                _PSSig$keygen2 = _slicedToArray(_PSSig$keygen, 2),
                sk = _PSSig$keygen2[0],
                pk = _PSSig$keygen2[1];

            var _sk = _slicedToArray(sk, 2),
                x = _sk[0],
                y = _sk[1];

            var m = "Hello World!";

            var _PSSig$sign = _PSSig2.default.sign(params, sk, m),
                _PSSig$sign2 = _slicedToArray(_PSSig$sign, 2),
                sig1 = _PSSig$sign2[0],
                sig2 = _PSSig$sign2[1];

            var aggregateSig = _PSSig2.default.aggregateSignatures(params, [sig2]);

            chai.assert.isTrue(sig2.equals(aggregateSig));
        });
    });

    describe("Aggregate Verification", function () {
        // returns error when duplicates

        it("using PSSIG", function () {
            var params = _PSSig2.default.setup();

            var _params2 = _slicedToArray(params, 5),
                G = _params2[0],
                o = _params2[1],
                g1 = _params2[2],
                g2 = _params2[3],
                e = _params2[4];

            var messagesToSign = 3;
            var pks = [];
            var ms = [];
            var sigs = [];

            for (var i = 0; i < messagesToSign; i++) {
                var messageToSign = "Test Message " + i;
                ms.push(messageToSign);

                var _PSSig$keygen3 = _PSSig2.default.keygen(params),
                    _PSSig$keygen4 = _slicedToArray(_PSSig$keygen3, 2),
                    sk = _PSSig$keygen4[0],
                    pk = _PSSig$keygen4[1];

                pks.push(pk);

                var _PSSig$sign3 = _PSSig2.default.sign(params, sk, messageToSign),
                    _PSSig$sign4 = _slicedToArray(_PSSig$sign3, 2),
                    sig1 = _PSSig$sign4[0],
                    sig2 = _PSSig$sign4[1];

                sigs.push(sig2);
            }

            var aggregateSignature = _PSSig2.default.aggregateSignatures(params, sigs);

            chai.assert.isTrue(_PSSig2.default.verifyAggregation(params, pks, ms, aggregateSignature));
        });

        it("using modified paper scheme", function () {
            var params = _PSSig2.default.setup();

            var _params3 = _slicedToArray(params, 5),
                G = _params3[0],
                o = _params3[1],
                g1 = _params3[2],
                g2 = _params3[3],
                e = _params3[4];

            var x1 = G.ctx.BIG.randomnum(G.order, G.rngGen);
            var x2 = G.ctx.BIG.randomnum(G.order, G.rngGen);

            var v1 = G.ctx.PAIR.G2mul(g2, x1);
            var v2 = G.ctx.PAIR.G2mul(g2, x2);

            var m1 = "Test1";
            var m2 = "Test2";

            var h1 = G.hashToPointOnCurve(m1);
            var h2 = G.hashToPointOnCurve(m2);

            var sig1 = G.ctx.PAIR.G1mul(h1, x1);
            var sig2 = G.ctx.PAIR.G1mul(h2, x2);

            console.log("ver1: ", e(sig1, g2).equals(e(h1, v1)));
            console.log("ver2: ", e(sig2, g2).equals(e(h2, v2)));

            var aggregateSignature = new G.ctx.ECP();
            aggregateSignature.copy(sig1);

            aggregateSignature.add(sig2); // aggregate signature

            var gt_1 = e(aggregateSignature, g2);

            var pair1 = e(h1, v1);

            var aggregatePairing = new G.ctx.FP12(pair1);

            var pair2 = e(h2, v2);

            aggregatePairing.a.add(pair2.a);
            aggregatePairing.b.add(pair2.b);
            aggregatePairing.c.add(pair2.c);

            chai.assert.isTrue(gt_1.equals(aggregatePairing));
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L1NjaGVtZVRlc3RzLmpzIl0sIm5hbWVzIjpbIm1vY2hhIiwiY2hhaSIsImRlc2NyaWJlIiwiaXQiLCJwYXJhbXMiLCJzZXR1cCIsIkciLCJvIiwiZzEiLCJnMiIsImUiLCJrZXlnZW4iLCJzayIsInBrIiwieCIsInkiLCJtIiwic2lnbiIsInNpZzEiLCJzaWcyIiwiYWdncmVnYXRlU2lnIiwiYWdncmVnYXRlU2lnbmF0dXJlcyIsImFzc2VydCIsImlzVHJ1ZSIsImVxdWFscyIsIm1lc3NhZ2VzVG9TaWduIiwicGtzIiwibXMiLCJzaWdzIiwiaSIsIm1lc3NhZ2VUb1NpZ24iLCJwdXNoIiwiYWdncmVnYXRlU2lnbmF0dXJlIiwidmVyaWZ5QWdncmVnYXRpb24iLCJ4MSIsImN0eCIsIkJJRyIsInJhbmRvbW51bSIsIm9yZGVyIiwicm5nR2VuIiwieDIiLCJ2MSIsIlBBSVIiLCJHMm11bCIsInYyIiwibTEiLCJtMiIsImgxIiwiaGFzaFRvUG9pbnRPbkN1cnZlIiwiaDIiLCJHMW11bCIsImNvbnNvbGUiLCJsb2ciLCJFQ1AiLCJjb3B5IiwiYWRkIiwiZ3RfMSIsInBhaXIxIiwiYWdncmVnYXRlUGFpcmluZyIsIkZQMTIiLCJwYWlyMiIsImEiLCJiIiwiYyJdLCJtYXBwaW5ncyI6Ijs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7SUFBWUEsSzs7QUFDWjs7SUFBWUMsSTs7Ozs7O0FBRVpDLFNBQVMsMERBQVQsRUFBcUUsWUFBTTtBQUN2RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0tBOztBQUVBQSxhQUFTLFdBQVQsRUFBc0IsWUFBTTtBQUN4QkMsV0FBRyxzQkFBSCxFQUEyQixZQUFNO0FBQzdCLGdCQUFNQyxTQUFTLGdCQUFNQyxLQUFOLEVBQWY7O0FB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dkIsRUFBdEIsQ0FBWDs7QUFHQSxnQkFBSWdELFFBQVEvQyxFQUFFcUMsRUFBRixFQUFNTixFQUFOLENBQVo7O0FBRUEsZ0JBQUlpQixtQkFBbUIsSUFBSXBELEVBQUU2QixHQUFGLENBQU13QixJQUFWLENBQWVGLEtBQWYsQ0FBdkI7O0FBR0EsZ0JBQUlHLFFBQVFsRCxFQUFFdUMsRUFBRixFQUFNTCxFQUFOLENBQVo7O0FBRUFjLDZCQUFpQkcsQ0FBakIsQ0FBbUJOLEdBQW5CLENBQXVCSyxNQUFNQyxDQUE3QjtBQUNBSCw2QkFBaUJJLENBQWpCLENBQW1CUCxHQUFuQixDQUF1QkssTUFBTUUsQ0FBN0I7QUFDQUosNkJBQWlCSyxDQUFqQixDQUFtQlIsR0FBbkIsQ0FBdUJLLE1BQU1HLENBQTdCOztBQUtBOUQsaUJBQUtxQixNQUFMLENBQVlDLE1BQVosQ0FBbUJpQyxLQUFLaEMsTUFBTCxDQUFZa0MsZ0JBQVosQ0FBbkI7QUFTSCxTQXJERDtBQXNERixLQWpGRDtBQW1GSCxDQXJRRCIsImZpbGUiOiJTY2hlbWVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgUFNTaWcgZnJvbSBcIi4uL1BTU2lnXCI7XHJcbmltcG9ydCBCcEdyb3VwIGZyb20gXCIuLi9CcEdyb3VwXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBtb2NoYSBmcm9tIFwibW9jaGFcIjtcclxuaW1wb3J0ICogYXMgY2hhaSBmcm9tICdjaGFpJztcclxuXHJcbmRlc2NyaWJlKFwiUG9pbnRjaGV2YWwtU2FuZGVycyBTaG9ydCBSYW5kb21pemFibGUgU2lnbmF0dXJlcyBzY2hlbWVcIiwgKCkgPT4ge1xyXG4gICAgLypcclxuICAgIGRlc2NyaWJlKFwiU2V0dXBcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBCcEdyb3VwIE9iamVjdFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90TnVsbChHKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKEcgaW5zdGFuY2VvZihCcEdyb3VwKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBHcm91cCBPcmRlclwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90TnVsbChvKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKG8gaW5zdGFuY2VvZihHLmN0eC5CSUcpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEdlbjFcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZzEpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZzEgaW5zdGFuY2VvZihHLmN0eC5FQ1ApKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEdlbjJcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZzIpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZzIgaW5zdGFuY2VvZihHLmN0eC5FQ1AyKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBQYWlyIGZ1bmN0aW9uXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKGUpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZSBpbnN0YW5jZW9mKEZ1bmN0aW9uKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZShcIktleWdlblwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xyXG5cclxuICAgICAgICBjb25zdCBbeCwgeV0gPSBzaztcclxuICAgICAgICBsZXQgW2csIFgsIFldID0gcGs7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBTZWNyZXQgS2V5ICh4LHkpXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHggaW5zdGFuY2VvZihHLmN0eC5CSUcpKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHkgaW5zdGFuY2VvZihHLmN0eC5CSUcpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoXCJSZXR1cm5zIFZhbGlkIFByaXZhdGUgS2V5IChnLFgsWSlcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdChcImcgPSBnMlwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZzIuZXF1YWxzKGcpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIlggPSBnMip4XCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShYLmVxdWFscyhnMi5tdWwoeCkpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIlkgPSBnMip5XCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShZLmVxdWFscyhnMi5tdWwoeSkpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBoLCBzaWcgPSAoeCt5Km0pICogaFxyXG4gICAgIGRlc2NyaWJlKFwiU2lnblwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xyXG4gICAgICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xyXG5cclxuICAgICAgICBsZXQgbSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcblxyXG4gICAgICAgIGNvbnN0IHNpZ25hdHVyZSA9IFBTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XHJcbiAgICAgICAgY29uc3QgW3NpZzEsIHNpZzJdID0gc2lnbmF0dXJlO1xyXG5cclxuXHJcbiAgICAgICAgaXQoXCJGb3Igc2lnbmF0dXJlKHNpZzEsIHNpZzIpLCBzaWcyID0gKCh4K3kqKG0gbW9kIHApKSBtb2QgcCkgKiBzaWcxXCIsICgpID0+IHtcclxuICAgICAgICAgICAgbSA9IEcuaGFzaFRvQklHKG0pO1xyXG4gICAgICAgICAgICBjb25zdCBtY3B5ID0gbmV3IEcuY3R4LkJJRyhtKTtcclxuICAgICAgICAgICAgbWNweS5tb2Qobyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0MSA9IEcuY3R4LkJJRy5tdWwoeSxtY3B5KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHhEQklHID0gIG5ldyBHLmN0eC5EQklHKDApO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IEcuY3R4LkJJRy5OTEVOOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHhEQklHLndbaV0gPSB4LndbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdDEuYWRkKHhEQklHKTtcclxuICAgICAgICAgICAgY29uc3QgSyA9IHQxLm1vZChvKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNpZ190ZXN0ID0gRy5jdHguUEFJUi5HMW11bChzaWcxLCBLKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHNpZzIuZXF1YWxzKHNpZ190ZXN0KSlcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBkZXNjcmliZShcIlZlcmlmeVwiLCAoKSA9PiB7XHJcbiAgICAgICAgZGVzY3JpYmUoXCJXaXRoIHNrID0gKDQyLCA1MTMpXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcblxyXG4gICAgICAgICAgICAvLyBrZXlnZW4gbmVlZHMgdG8gYmUgZG9uZSBcIm1hbnVhbGx5XCJcclxuICAgICAgICAgICAgY29uc3QgeCA9IG5ldyBHLmN0eC5CSUcoNDIpO1xyXG4gICAgICAgICAgICBjb25zdCB5ID0gbmV3IEcuY3R4LkJJRyg1MTMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2sgPSBbeCwgeV07XHJcbiAgICAgICAgICAgIGNvbnN0IHBrID0gW2cyLCBnMi5tdWwoeCksIGcyLm11bCh5KV07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtID0gXCJIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICAgICAgY29uc3Qgc2lnID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiU3VjY2Vzc2Z1bCB2ZXJpZmljYXRpb24gZm9yIG9yaWdpbmFsIG1lc3NhZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKFBTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtLCBzaWcpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIkZhaWxlZCB2ZXJpZmljYXRpb24gZm9yIGFub3RoZXIgbWVzc2FnZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbTIgPSBcIk90aGVyIEhlbGxvIFdvcmxkIVwiO1xyXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3RUcnVlKFBTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtMiwgc2lnKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoXCJXaXRoICdwcm9wZXInIHJhbmRvbVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgICAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xyXG4gICAgICAgICAgICBjb25zdCBbeCwgeV0gPSBzaztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG0gPSBcIkhlbGxvIFdvcmxkIVwiO1xyXG4gICAgICAgICAgICBjb25zdCBzaWcgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJTdWNjZXNzZnVsIHZlcmlmaWNhdGlvbiBmb3Igb3JpZ2luYWwgbWVzc2FnZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiRmFpbGVkIHZlcmlmaWNhdGlvbiBmb3IgYW5vdGhlciBtZXNzYWdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtMiA9IFwiT3RoZXIgSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdFRydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0yLCBzaWcpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZGVzY3JpYmUoXCJSYW5kb21pemVcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3NrLCBwa10gPSBQU1NpZy5rZXlnZW4ocGFyYW1zKTtcclxuICAgICAgICBjb25zdCBbeCwgeV0gPSBzaztcclxuXHJcbiAgICAgICAgY29uc3QgbSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgbGV0IHNpZyA9IFBTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XHJcbiAgICAgICAgc2lnID0gUFNTaWcucmFuZG9taXplKHBhcmFtcywgc2lnKTtcclxuXHJcbiAgICAgICAgaXQoXCJTdWNjZXNzZnVsIHZlcmlmaWNhdGlvbiBmb3Igb3JpZ2luYWwgbWVzc2FnZSB3aXRoIHJhbmRvbWl6ZWQgc2lnbmF0dXJlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKFBTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtLCBzaWcpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJGYWlsZWQgdmVyaWZpY2F0aW9uIGZvciBhbm90aGVyIG1lc3NhZ2Ugd2l0aCByYW5kb21pemVkIHNpZ25hdHVyZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBtMiA9IFwiT3RoZXIgSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90VHJ1ZShQU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbTIsIHNpZykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7Ki9cclxuXHJcbiAgICAvLyB0b2RvOiBiZXR0ZXIgdGVzdCBmb3Igd2hldGhlciBhZ2dyZWdhdGlvbiBpcyBjb3JyZWN0XHJcblxyXG4gICAgZGVzY3JpYmUoXCJBZ2dyZWdhdGVcIiwgKCkgPT4ge1xyXG4gICAgICAgIGl0KFwiQWdncmVnYXRpb24oczEpID0gczFcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICAgICAgY29uc3QgW3NrLCBwa10gPSBQU1NpZy5rZXlnZW4ocGFyYW1zKTtcclxuICAgICAgICAgICAgY29uc3QgW3gsIHldID0gc2s7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtID0gXCJIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICAgICAgbGV0IFtzaWcxLCBzaWcyXSA9IFBTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XHJcbiAgICAgICAgICAgIGxldCBhZ2dyZWdhdGVTaWcgPSBQU1NpZy5hZ2dyZWdhdGVTaWduYXR1cmVzKHBhcmFtcywgW3NpZzJdKTtcclxuXHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShzaWcyLmVxdWFscyhhZ2dyZWdhdGVTaWcpKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKFwiQWdncmVnYXRlIFZlcmlmaWNhdGlvblwiLCAoKSA9PiB7XHJcbiAgICAgICAgLy8gcmV0dXJucyBlcnJvciB3aGVuIGR1cGxpY2F0ZXNcclxuXHJcbiAgICAgICBpdChcInVzaW5nIFBTU0lHXCIsICgpID0+IHtcclxuICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgICAgICAgICBjb25zdCBtZXNzYWdlc1RvU2lnbiA9IDM7XHJcbiAgICAgICAgICAgbGV0IHBrcyA9IFtdO1xyXG4gICAgICAgICAgIGxldCBtcyA9IFtdO1xyXG4gICAgICAgICAgIGxldCBzaWdzID0gW107XHJcblxyXG4gICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBtZXNzYWdlc1RvU2lnbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgIGxldCBtZXNzYWdlVG9TaWduID0gYFRlc3QgTWVzc2FnZSAke2l9YDtcclxuICAgICAgICAgICAgICAgbXMucHVzaChtZXNzYWdlVG9TaWduKTtcclxuICAgICAgICAgICAgICAgbGV0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgIHBrcy5wdXNoKHBrKTtcclxuICAgICAgICAgICAgICAgbGV0IFtzaWcxLCBzaWcyXSA9IFBTU2lnLnNpZ24ocGFyYW1zLCBzaywgbWVzc2FnZVRvU2lnbik7XHJcbiAgICAgICAgICAgICAgIHNpZ3MucHVzaChzaWcyKTtcclxuICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgIGxldCBhZ2dyZWdhdGVTaWduYXR1cmUgPSBQU1NpZy5hZ2dyZWdhdGVTaWduYXR1cmVzKHBhcmFtcywgc2lncyk7XHJcblxyXG4gICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShQU1NpZy52ZXJpZnlBZ2dyZWdhdGlvbihwYXJhbXMsIHBrcywgbXMsIGFnZ3JlZ2F0ZVNpZ25hdHVyZSkpO1xyXG5cclxuICAgICAgIH0pO1xyXG5cclxuICAgICAgIGl0KFwidXNpbmcgbW9kaWZpZWQgcGFwZXIgc2NoZW1lXCIsICgpID0+IHtcclxuICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgICAgICAgICBsZXQgeDEgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcclxuICAgICAgICAgICBsZXQgeDIgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcclxuXHJcbiAgICAgICAgICAgbGV0IHYxID0gRy5jdHguUEFJUi5HMm11bChnMiwgeDEpO1xyXG4gICAgICAgICAgIGxldCB2MiA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgyKTtcclxuXHJcbiAgICAgICAgICAgbGV0IG0xID0gXCJUZXN0MVwiO1xyXG4gICAgICAgICAgIGxldCBtMiA9IFwiVGVzdDJcIjtcclxuXHJcbiAgICAgICAgICAgbGV0IGgxID0gRy5oYXNoVG9Qb2ludE9uQ3VydmUobTEpO1xyXG4gICAgICAgICAgIGxldCBoMiA9IEcuaGFzaFRvUG9pbnRPbkN1cnZlKG0yKTtcclxuXHJcbiAgICAgICAgICAgbGV0IHNpZzEgPSBHLmN0eC5QQUlSLkcxbXVsKGgxLCB4MSk7XHJcbiAgICAgICAgICAgbGV0IHNpZzIgPSBHLmN0eC5QQUlSLkcxbXVsKGgyLCB4Mik7XHJcblxyXG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwidmVyMTogXCIsIChlKHNpZzEsIGcyKSkuZXF1YWxzKGUoaDEsIHYxKSkgKTtcclxuICAgICAgICAgICBjb25zb2xlLmxvZyhcInZlcjI6IFwiLCAoZShzaWcyLCBnMikpLmVxdWFscyhlKGgyLCB2MikpICk7XHJcblxyXG4gICAgICAgICAgIGxldCBhZ2dyZWdhdGVTaWduYXR1cmUgPSBuZXcgRy5jdHguRUNQKCk7XHJcbiAgICAgICAgICAgYWdncmVnYXRlU2lnbmF0dXJlLmNvcHkoc2lnMSk7XHJcblxyXG4gICAgICAgICAgIGFnZ3JlZ2F0ZVNpZ25hdHVyZS5hZGQoc2lnMik7IC8vIGFnZ3JlZ2F0ZSBzaWduYXR1cmVcclxuXHJcbiAgICAgICAgICAgbGV0IGd0XzEgPSBlKGFnZ3JlZ2F0ZVNpZ25hdHVyZSwgZzIpO1xyXG5cclxuXHJcbiAgICAgICAgICAgbGV0IHBhaXIxID0gZShoMSwgdjEpO1xyXG5cclxuICAgICAgICAgICBsZXQgYWdncmVnYXRlUGFpcmluZyA9IG5ldyBHLmN0eC5GUDEyKHBhaXIxKTtcclxuXHJcblxyXG4gICAgICAgICAgIGxldCBwYWlyMiA9IGUoaDIsIHYyKTtcclxuXHJcbiAgICAgICAgICAgYWdncmVnYXRlUGFpcmluZy5hLmFkZChwYWlyMi5hKTtcclxuICAgICAgICAgICBhZ2dyZWdhdGVQYWlyaW5nLmIuYWRkKHBhaXIyLmIpO1xyXG4gICAgICAgICAgIGFnZ3JlZ2F0ZVBhaXJpbmcuYy5hZGQocGFpcjIuYyk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShndF8xLmVxdWFscyhhZ2dyZWdhdGVQYWlyaW5nKSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG59KTsiXX0=