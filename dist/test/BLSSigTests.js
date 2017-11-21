"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _BLSSig = require("../BLSSig");

var _BLSSig2 = _interopRequireDefault(_BLSSig);

var _BpGroup = require("../BpGroup");

var _BpGroup2 = _interopRequireDefault(_BpGroup);

var _mocha = require("mocha");

var mocha = _interopRequireWildcard(_mocha);

var _chai = require("chai");

var chai = _interopRequireWildcard(_chai);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("Boneh–Lynn–Shacham Signatures scheme", function () {
    describe("Setup", function () {
        var params = _BLSSig2.default.setup();

        var _params = _slicedToArray(params, 5),
            G = _params[0],
            o = _params[1],
            g1 = _params[2],
            g2 = _params[3],
            e = _params[4];

        it("Returns BpGroup Object", function () {
            chai.assert.isNotNull(G);
            chai.assert.isTrue(G instanceof _BpGroup2.default);
        });

        it("Returns Group Order", function () {
            chai.assert.isNotNull(o);
            chai.assert.isTrue(o instanceof G.ctx.BIG);
        });

        it("Returns Gen1", function () {
            chai.assert.isNotNull(g1);
            chai.assert.isTrue(g1 instanceof G.ctx.ECP);
        });

        it("Returns Gen2", function () {
            chai.assert.isNotNull(g2);
            chai.assert.isTrue(g2 instanceof G.ctx.ECP2);
        });

        it("Returns Pair function", function () {
            chai.assert.isNotNull(e);
            chai.assert.isTrue(e instanceof Function);
        });
    });

    describe("Keygen", function () {
        var params = _BLSSig2.default.setup();

        var _params2 = _slicedToArray(params, 5),
            G = _params2[0],
            o = _params2[1],
            g1 = _params2[2],
            g2 = _params2[3],
            e = _params2[4];

        var _BLSSig$keygen = _BLSSig2.default.keygen(params),
            _BLSSig$keygen2 = _slicedToArray(_BLSSig$keygen, 2),
            sk = _BLSSig$keygen2[0],
            pk = _BLSSig$keygen2[1];

        it("Returns Secret Key x", function () {
            chai.assert.isTrue(sk instanceof G.ctx.BIG);
        });

        it("Returns Valid Private Key v = x * g2", function () {
            chai.assert.isTrue(pk.equals(G.ctx.PAIR.G2mul(g2, sk)));
        });
    });

    // h, sig = (x+y*m) * h
    describe("Sign", function () {
        var params = _BLSSig2.default.setup();

        var _params3 = _slicedToArray(params, 5),
            G = _params3[0],
            o = _params3[1],
            g1 = _params3[2],
            g2 = _params3[3],
            e = _params3[4];

        var _BLSSig$keygen3 = _BLSSig2.default.keygen(params),
            _BLSSig$keygen4 = _slicedToArray(_BLSSig$keygen3, 2),
            sk = _BLSSig$keygen4[0],
            pk = _BLSSig$keygen4[1];

        var m = "Hello World!";

        var signature = _BLSSig2.default.sign(params, sk, m);

        it("signature = sk * H(m)", function () {
            var h = G.hashToPointOnCurve(m);

            var sig_test = G.ctx.PAIR.G1mul(h, sk);
            chai.assert.isTrue(signature.equals(sig_test));
        });
    });

    describe("Verify", function () {
        var params = _BLSSig2.default.setup();

        var _params4 = _slicedToArray(params, 5),
            G = _params4[0],
            o = _params4[1],
            g1 = _params4[2],
            g2 = _params4[3],
            e = _params4[4];

        var _BLSSig$keygen5 = _BLSSig2.default.keygen(params),
            _BLSSig$keygen6 = _slicedToArray(_BLSSig$keygen5, 2),
            sk = _BLSSig$keygen6[0],
            pk = _BLSSig$keygen6[1];

        var m = "Hello World!";
        var sig = _BLSSig2.default.sign(params, sk, m);

        it("Successful verification for original message", function () {
            chai.assert.isTrue(_BLSSig2.default.verify(params, pk, m, sig));
        });

        it("Failed verification for another message", function () {
            var m2 = "Other Hello World!";
            chai.assert.isNotTrue(_BLSSig2.default.verify(params, pk, m2, sig));
        });
    });

    describe("Aggregate", function () {
        xit("Aggregation(s1) = s1", function () {
            // const params = PSSig.setup();
            // const [G, o, g1, g2, e] = params;
            // const [sk, pk] = PSSig.keygen(params);
            // const [x, y] = sk;
            //
            // const m = "Hello World!";
            // let [sig1, sig2] = PSSig.sign(params, sk, m);
            // let aggregateSig = PSSig.aggregateSignatures(params, [sig2]);
            //
            // chai.assert.isTrue(sig2.equals(aggregateSig));
        });
    });

    describe("Aggregate Verification", function () {
        it("using BLSSig", function () {
            var params = _BLSSig2.default.setup();

            var _params5 = _slicedToArray(params, 5),
                G = _params5[0],
                o = _params5[1],
                g1 = _params5[2],
                g2 = _params5[3],
                e = _params5[4];

            var messagesToSign = 2;
            var pks = [];
            var signatures = [];

            var m = "Hello World!";

            for (var i = 0; i < messagesToSign; i++) {
                var _BLSSig$keygen7 = _BLSSig2.default.keygen(params),
                    _BLSSig$keygen8 = _slicedToArray(_BLSSig$keygen7, 2),
                    sk = _BLSSig$keygen8[0],
                    pk = _BLSSig$keygen8[1];

                pks.push(pk);
                var signature = _BLSSig2.default.sign(params, sk, m);
                signatures.push(signature);
            }

            var aggregateSignature = _BLSSig2.default.aggregateSignatures(params, signatures);

            chai.assert.isTrue(_BLSSig2.default.verifyAggregation(params, pks, m, aggregateSignature));
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L0JMU1NpZ1Rlc3RzLmpzIl0sIm5hbWVzIjpbIm1vY2hhIiwiY2hhaSIsImRlc2NyaWJlIiwicGFyYW1zIiwic2V0dXAiLCJHIiwibyIsImcxIiwiZzIiLCJlIiwiaXQiLCJhc3NlcnQiLCJpc05vdE51bGwiLCJpc1RydWUiLCJjdHgiLCJCSUciLCJFQ1AiLCJFQ1AyIiwiRnVuY3Rpb24iLCJrZXlnZW4iLCJzayIsInBrIiwiZXF1YWxzIiwiUEFJUiIsIkcybXVsIiwibSIsInNpZ25hdHVyZSIsInNpZ24iLCJoIiwiaGFzaFRvUG9pbnRPbkN1cnZlIiwic2lnX3Rlc3QiLCJHMW11bCIsInNpZyIsInZlcmlmeSIsIm0yIiwiaXNOb3RUcnVlIiwieGl0IiwibWVzc2FnZXNUb1NpZ24iLCJwa3MiLCJzaWduYXR1cmVzIiwiaSIsInB1c2giLCJhZ2dyZWdhdGVTaWduYXR1cmUiLCJhZ2dyZWdhdGVTaWduYXR1cmVzIiwidmVyaWZ5QWdncmVnYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7O0lBQVlBLEs7O0FBQ1o7O0lBQVlDLEk7Ozs7OztBQUVaQyxTQUFTLHNDQUFULEVBQWlELFlBQU07QUFDbkRBLGFBQVMsT0FBVCxFQUFrQixZQUFNO0FBQ3BCLFlBQU1DLFNBQVMsaUJBQU9DLEtBQVAsRUFBZjs7QUFEb0IscUNBRU1ELE1BRk47QUFBQSxZQUViRSxDQUZhO0FBQUEsWUFFVkMsQ0FGVTtBQUFBLFlBRVBDLEVBRk87QUFBQSxZQUVIQyxFQUZHO0FBQUEsWUFFQ0MsQ0FGRDs7QUFJcEJDLFdBQUcsd0JBQUgsRUFBNkIsWUFBTTtBQUMvQlQsaUJBQUtVLE1BQUwsQ0FBWUMsU0FBWixDQUFzQlAsQ0FBdEI7QUFDQUosaUJBQUtVLE1BQUwsQ0FBWUUsTUFBWixDQUFtQlIsOEJBQW5CO0FBQ0gsU0FIRDs7QUFLQUssV0FBRyxxQkFBSCxFQUEwQixZQUFNO0FBQzVCVCxpQkFBS1UsTUFBTCxDQUFZQyxTQUFa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YSxFQUFqQjs7QUFFQSxnQkFBTWQsSUFBSSxjQUFWOztBQUVBLGlCQUFLLElBQUllLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsY0FBcEIsRUFBb0NHLEdBQXBDLEVBQXlDO0FBQUEsc0NBQ3RCLGlCQUFPckIsTUFBUCxDQUFjaEIsTUFBZCxDQURzQjtBQUFBO0FBQUEsb0JBQ2hDaUIsRUFEZ0M7QUFBQSxvQkFDNUJDLEVBRDRCOztBQUVyQ2lCLG9CQUFJRyxJQUFKLENBQVNwQixFQUFUO0FBQ0Esb0JBQUlLLFlBQVksaUJBQU9DLElBQVAsQ0FBWXhCLE1BQVosRUFBb0JpQixFQUFwQixFQUF3QkssQ0FBeEIsQ0FBaEI7QUFDQWMsMkJBQVdFLElBQVgsQ0FBZ0JmLFNBQWhCO0FBQ0g7O0FBRUQsZ0JBQUlnQixxQkFBcUIsaUJBQU9DLG1CQUFQLENBQTJCeEMsTUFBM0IsRUFBbUNvQyxVQUFuQyxDQUF6Qjs7QUFFQXRDLGlCQUFLVSxNQUFMLENBQVlFLE1BQVosQ0FBbUIsaUJBQU8rQixpQkFBUCxDQUF5QnpDLE1BQXpCLEVBQWlDbUMsR0FBakMsRUFBc0NiLENBQXRDLEVBQXlDaUIsa0JBQXpDLENBQW5CO0FBRUgsU0FyQkQ7QUF1QkgsS0F4QkQ7QUEyQkgsQ0E3SEQiLCJmaWxlIjoiQkxTU2lnVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQkxTU2lnIGZyb20gXCIuLi9CTFNTaWdcIjtcclxuaW1wb3J0IEJwR3JvdXAgZnJvbSBcIi4uL0JwR3JvdXBcIjtcclxuXHJcbmltcG9ydCAqIGFzIG1vY2hhIGZyb20gXCJtb2NoYVwiO1xyXG5pbXBvcnQgKiBhcyBjaGFpIGZyb20gJ2NoYWknO1xyXG5cclxuZGVzY3JpYmUoXCJCb25laOKAk0x5bm7igJNTaGFjaGFtIFNpZ25hdHVyZXMgc2NoZW1lXCIsICgpID0+IHtcclxuICAgIGRlc2NyaWJlKFwiU2V0dXBcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IEJMU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgICAgICBpdChcIlJldHVybnMgQnBHcm91cCBPYmplY3RcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoRyk7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShHIGluc3RhbmNlb2YgKEJwR3JvdXApKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEdyb3VwIE9yZGVyXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKG8pO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUobyBpbnN0YW5jZW9mIChHLmN0eC5CSUcpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEdlbjFcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZzEpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZzEgaW5zdGFuY2VvZiAoRy5jdHguRUNQKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBHZW4yXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKGcyKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKGcyIGluc3RhbmNlb2YgKEcuY3R4LkVDUDIpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIFBhaXIgZnVuY3Rpb25cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZSk7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShlIGluc3RhbmNlb2YgKEZ1bmN0aW9uKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZShcIktleWdlblwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gQkxTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3NrLCBwa10gPSBCTFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcblxyXG5cclxuICAgICAgICBpdChcIlJldHVybnMgU2VjcmV0IEtleSB4XCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHNrIGluc3RhbmNlb2YgKEcuY3R4LkJJRykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcIlJldHVybnMgVmFsaWQgUHJpdmF0ZSBLZXkgdiA9IHggKiBnMlwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShway5lcXVhbHMoRy5jdHguUEFJUi5HMm11bChnMiwgc2spKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbi8vIGgsIHNpZyA9ICh4K3kqbSkgKiBoXHJcbiAgICBkZXNjcmliZShcIlNpZ25cIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IEJMU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IFtzaywgcGtdID0gQkxTU2lnLmtleWdlbihwYXJhbXMpO1xyXG5cclxuICAgICAgICBsZXQgbSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcblxyXG4gICAgICAgIGNvbnN0IHNpZ25hdHVyZSA9IEJMU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG5cclxuICAgICAgICBpdChcInNpZ25hdHVyZSA9IHNrICogSChtKVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGggPSBHLmhhc2hUb1BvaW50T25DdXJ2ZShtKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNpZ190ZXN0ID0gRy5jdHguUEFJUi5HMW11bChoLCBzayk7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShzaWduYXR1cmUuZXF1YWxzKHNpZ190ZXN0KSlcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBkZXNjcmliZShcIlZlcmlmeVwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gQkxTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3NrLCBwa10gPSBCTFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG0gPSBcIkhlbGxvIFdvcmxkIVwiO1xyXG4gICAgICAgIGNvbnN0IHNpZyA9IEJMU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG5cclxuICAgICAgICBpdChcIlN1Y2Nlc3NmdWwgdmVyaWZpY2F0aW9uIGZvciBvcmlnaW5hbCBtZXNzYWdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKEJMU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbSwgc2lnKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiRmFpbGVkIHZlcmlmaWNhdGlvbiBmb3IgYW5vdGhlciBtZXNzYWdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG0yID0gXCJPdGhlciBIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3RUcnVlKEJMU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbTIsIHNpZykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoXCJBZ2dyZWdhdGVcIiwgKCkgPT4ge1xyXG4gICAgICAgIHhpdChcIkFnZ3JlZ2F0aW9uKHMxKSA9IHMxXCIsICgpID0+IHtcclxuICAgICAgICAgICAgLy8gY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICAgICAgLy8gY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IFt4LCB5XSA9IHNrO1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyBjb25zdCBtID0gXCJIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICAgICAgLy8gbGV0IFtzaWcxLCBzaWcyXSA9IFBTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XHJcbiAgICAgICAgICAgIC8vIGxldCBhZ2dyZWdhdGVTaWcgPSBQU1NpZy5hZ2dyZWdhdGVTaWduYXR1cmVzKHBhcmFtcywgW3NpZzJdKTtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gY2hhaS5hc3NlcnQuaXNUcnVlKHNpZzIuZXF1YWxzKGFnZ3JlZ2F0ZVNpZykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoXCJBZ2dyZWdhdGUgVmVyaWZpY2F0aW9uXCIsICgpID0+IHtcclxuICAgICAgICBpdChcInVzaW5nIEJMU1NpZ1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IEJMU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VzVG9TaWduID0gMjtcclxuICAgICAgICAgICAgbGV0IHBrcyA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgc2lnbmF0dXJlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc3NhZ2VzVG9TaWduOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBbc2ssIHBrXSA9IEJMU1NpZy5rZXlnZW4ocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIHBrcy5wdXNoKHBrKTtcclxuICAgICAgICAgICAgICAgIGxldCBzaWduYXR1cmUgPSBCTFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcclxuICAgICAgICAgICAgICAgIHNpZ25hdHVyZXMucHVzaChzaWduYXR1cmUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYWdncmVnYXRlU2lnbmF0dXJlID0gQkxTU2lnLmFnZ3JlZ2F0ZVNpZ25hdHVyZXMocGFyYW1zLCBzaWduYXR1cmVzKTtcclxuXHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShCTFNTaWcudmVyaWZ5QWdncmVnYXRpb24ocGFyYW1zLCBwa3MsIG0sIGFnZ3JlZ2F0ZVNpZ25hdHVyZSkpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcblxyXG59KTsiXX0=