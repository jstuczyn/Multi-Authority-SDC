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
    describe("Setup", function () {
        var params = _PSSig2.default.setup();

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
        var params = _PSSig2.default.setup();

        var _params2 = _slicedToArray(params, 5),
            G = _params2[0],
            o = _params2[1],
            g1 = _params2[2],
            g2 = _params2[3],
            e = _params2[4];

        var _PSSig$keygen = _PSSig2.default.keygen(params),
            _PSSig$keygen2 = _slicedToArray(_PSSig$keygen, 2),
            sk = _PSSig$keygen2[0],
            pk = _PSSig$keygen2[1];

        var _sk = _slicedToArray(sk, 2),
            x = _sk[0],
            y = _sk[1];

        var _pk = _slicedToArray(pk, 3),
            g = _pk[0],
            X = _pk[1],
            Y = _pk[2];

        it("Returns Secret Key (x,y)", function () {
            chai.assert.isTrue(x instanceof G.ctx.BIG);
            chai.assert.isTrue(y instanceof G.ctx.BIG);
        });

        describe("Returns Valid Private Key (g,X,Y)", function () {
            it("g = g2", function () {
                chai.assert.isTrue(g2.equals(g));
            });

            it("X = g2*x", function () {
                chai.assert.isTrue(X.equals(g2.mul(x)));
            });

            it("Y = g2*y", function () {
                chai.assert.isTrue(Y.equals(g2.mul(y)));
            });
        });
    });

    // h, sig = (x+y*m) * h
    describe("Sign", function () {
        var params = _PSSig2.default.setup();

        var _params3 = _slicedToArray(params, 5),
            G = _params3[0],
            o = _params3[1],
            g1 = _params3[2],
            g2 = _params3[3],
            e = _params3[4];

        var _PSSig$keygen3 = _PSSig2.default.keygen(params),
            _PSSig$keygen4 = _slicedToArray(_PSSig$keygen3, 2),
            sk = _PSSig$keygen4[0],
            pk = _PSSig$keygen4[1];

        var _sk2 = _slicedToArray(sk, 2),
            x = _sk2[0],
            y = _sk2[1];

        var m = "Hello World!";

        var signature = _PSSig2.default.sign(params, sk, m);

        var _signature = _slicedToArray(signature, 2),
            sig1 = _signature[0],
            sig2 = _signature[1];

        it("For signature(sig1, sig2), sig2 = ((x+y*(m mod p)) mod p) * sig1", function () {
            m = G.hashToBIG(m);
            var mcpy = new G.ctx.BIG(m);
            mcpy.mod(o);

            var t1 = G.ctx.BIG.mul(y, mcpy);

            var xDBIG = new G.ctx.DBIG(0);
            for (var i = 0; i < G.ctx.BIG.NLEN; i++) {
                xDBIG.w[i] = x.w[i];
            }
            t1.add(xDBIG);
            var K = t1.mod(o);

            var sig_test = G.ctx.PAIR.G1mul(sig1, K);
            chai.assert.isTrue(sig2.equals(sig_test));
        });
    });

    describe("Verify", function () {
        describe("With sk = (42, 513)", function () {
            var params = _PSSig2.default.setup();

            var _params4 = _slicedToArray(params, 5),
                G = _params4[0],
                o = _params4[1],
                g1 = _params4[2],
                g2 = _params4[3],
                e = _params4[4];

            // keygen needs to be done "manually"


            var x = new G.ctx.BIG(42);
            var y = new G.ctx.BIG(513);

            var sk = [x, y];
            var pk = [g2, g2.mul(x), g2.mul(y)];

            var m = "Hello World!";
            var sig = _PSSig2.default.sign(params, sk, m);

            it("Successful verification for original message", function () {
                chai.assert.isTrue(_PSSig2.default.verify(params, pk, m, sig));
            });

            it("Failed verification for another message", function () {
                var m2 = "Other Hello World!";
                chai.assert.isNotTrue(_PSSig2.default.verify(params, pk, m2, sig));
            });
        });

        describe("With 'proper' random", function () {
            var params = _PSSig2.default.setup();

            var _params5 = _slicedToArray(params, 5),
                G = _params5[0],
                o = _params5[1],
                g1 = _params5[2],
                g2 = _params5[3],
                e = _params5[4];

            var _PSSig$keygen5 = _PSSig2.default.keygen(params),
                _PSSig$keygen6 = _slicedToArray(_PSSig$keygen5, 2),
                sk = _PSSig$keygen6[0],
                pk = _PSSig$keygen6[1];

            var _sk3 = _slicedToArray(sk, 2),
                x = _sk3[0],
                y = _sk3[1];

            var m = "Hello World!";
            var sig = _PSSig2.default.sign(params, sk, m);

            it("Successful verification for original message", function () {
                chai.assert.isTrue(_PSSig2.default.verify(params, pk, m, sig));
            });

            it("Failed verification for another message", function () {
                var m2 = "Other Hello World!";
                chai.assert.isNotTrue(_PSSig2.default.verify(params, pk, m2, sig));
            });
        });
    });

    describe("Randomize", function () {
        var params = _PSSig2.default.setup();

        var _params6 = _slicedToArray(params, 5),
            G = _params6[0],
            o = _params6[1],
            g1 = _params6[2],
            g2 = _params6[3],
            e = _params6[4];

        var _PSSig$keygen7 = _PSSig2.default.keygen(params),
            _PSSig$keygen8 = _slicedToArray(_PSSig$keygen7, 2),
            sk = _PSSig$keygen8[0],
            pk = _PSSig$keygen8[1];

        var _sk4 = _slicedToArray(sk, 2),
            x = _sk4[0],
            y = _sk4[1];

        var m = "Hello World!";
        var sig = _PSSig2.default.sign(params, sk, m);
        sig = _PSSig2.default.randomize(params, sig);

        it("Successful verification for original message with randomized signature", function () {
            chai.assert.isTrue(_PSSig2.default.verify(params, pk, m, sig));
        });

        it("Failed verification for another message with randomized signature", function () {
            var m2 = "Other Hello World!";
            chai.assert.isNotTrue(_PSSig2.default.verify(params, pk, m2, sig));
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L1NjaGVtZVRlc3RzLmpzIl0sIm5hbWVzIjpbIm1vY2hhIiwiY2hhaSIsImRlc2NyaWJlIiwicGFyYW1zIiwic2V0dXAiLCJHIiwibyIsImcxIiwiZzIiLCJlIiwiaXQiLCJhc3NlcnQiLCJpc05vdE51bGwiLCJpc1RydWUiLCJjdHgiLCJCSUciLCJFQ1AiLCJFQ1AyIiwiRnVuY3Rpb24iLCJrZXlnZW4iLCJzayIsInBrIiwieCIsInkiLCJnIiwiWCIsIlkiLCJlcXVhbHMiLCJtdWwiLCJtIiwic2lnbmF0dXJlIiwic2lnbiIsInNpZzEiLCJzaWcyIiwiaGFzaFRvQklHIiwibWNweSIsIm1vZCIsInQxIiwieERCSUciLCJEQklHIiwiaSIsIk5MRU4iLCJ3IiwiYWRkIiwiSyIsInNpZ190ZXN0IiwiUEFJUiIsIkcxbXVsIiwic2lnIiwidmVyaWZ5IiwibTIiLCJpc05vdFRydWUiLCJyYW5kb21pemUiXSwibWFwcGluZ3MiOiI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0lBQVlBLEs7O0FBQ1o7O0lBQVlDLEk7Ozs7OztBQUVaQyxTQUFTLDBEQUFULEVBQXFFLFlBQU07QUFDdkVBLGFBQVMsT0FBVCxFQUFrQixZQUFNO0FBQ3BCLFlBQU1DLFNBQVMsZ0JBQU1DLEtBQU4sRUFBZjs7QUFEb0IscUNBRU1ELE1BRk47QUFBQSxZQUViRSxDQUZhO0FBQUEsWUFFVkMsQ0FGVTtBQUFBLFlBRVBDLEVBRk87QUFBQSxZQUVIQyxFQUZHO0FBQUEsWUFFQ0MsQ0FGRDs7QUFJcEJDLFdBQUcsd0JBQUgsRUFBNkIsWUFBTTtBQUMvQlQsaUJBQUtVLE1BQUwsQ0FBWUMsU0FBWixDQUFzQlAsQ0FBdEI7QUFDQUosaUJBQUtVLE1BQUwsQ0FBWUUsTUFBWixDQUFtQlIsOEJBQW5CO0FBQ0gsU0FIRDs7QUFLQUssV0FBRyxxQkFBSCxFQUEwQixZQUFNO0FBQzVCVCxpQkFBS1UsTUFBTCxDQUFZQyxTQUFaLENBQXNCTixDQUF0QjtBQUNBTCxpQkFBS1Us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QTtBQUFBLFlBR2pCaUIsRUFIaUI7QUFBQSxZQUdiQyxFQUhhOztBQUFBLGtDQUlURCxFQUpTO0FBQUEsWUFJakJFLENBSmlCO0FBQUEsWUFJZEMsQ0FKYzs7QUFNeEIsWUFBTU0sSUFBSSxjQUFWO0FBQ0EsWUFBSW1CLE1BQU0sZ0JBQU1qQixJQUFOLENBQVc1QixNQUFYLEVBQW1CaUIsRUFBbkIsRUFBdUJTLENBQXZCLENBQVY7QUFDQW1CLGNBQU0sZ0JBQU1JLFNBQU4sQ0FBZ0JqRCxNQUFoQixFQUF3QjZDLEdBQXhCLENBQU47O0FBRUF0QyxXQUFHLHdFQUFILEVBQTZFLFlBQU07QUFDL0VULGlCQUFLVSxNQUFMLENBQVlFLE1BQVosQ0FBbUIsZ0JBQU1vQyxNQUFOLENBQWE5QyxNQUFiLEVBQXFCa0IsRUFBckIsRUFBeUJRLENBQXpCLEVBQTRCbUIsR0FBNUIsQ0FBbkI7QUFDSCxTQUZEOztBQUlBdEMsV0FBRyxtRUFBSCxFQUF3RSxZQUFNO0FBQzFFLGdCQUFJd0MsS0FBSyxvQkFBVDtBQUNBakQsaUJBQUtVLE1BQUwsQ0FBWXdDLFNBQVosQ0FBc0IsZ0JBQU1GLE1BQU4sQ0FBYTlDLE1BQWIsRUFBcUJrQixFQUFyQixFQUF5QjZCLEVBQXpCLEVBQTZCRixHQUE3QixDQUF0QjtBQUNILFNBSEQ7QUFJSCxLQWxCRDtBQW1CSCxDQS9KRCIsImZpbGUiOiJTY2hlbWVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgUFNTaWcgZnJvbSBcIi4uL1BTU2lnXCI7XHJcbmltcG9ydCBCcEdyb3VwIGZyb20gXCIuLi9CcEdyb3VwXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBtb2NoYSBmcm9tIFwibW9jaGFcIjtcclxuaW1wb3J0ICogYXMgY2hhaSBmcm9tICdjaGFpJztcclxuXHJcbmRlc2NyaWJlKFwiUG9pbnRjaGV2YWwtU2FuZGVycyBTaG9ydCBSYW5kb21pemFibGUgU2lnbmF0dXJlcyBzY2hlbWVcIiwgKCkgPT4ge1xyXG4gICAgZGVzY3JpYmUoXCJTZXR1cFwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEJwR3JvdXAgT2JqZWN0XCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKEcpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoRyBpbnN0YW5jZW9mKEJwR3JvdXApKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEdyb3VwIE9yZGVyXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKG8pO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUobyBpbnN0YW5jZW9mKEcuY3R4LkJJRykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcIlJldHVybnMgR2VuMVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90TnVsbChnMSk7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShnMSBpbnN0YW5jZW9mKEcuY3R4LkVDUCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcIlJldHVybnMgR2VuMlwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90TnVsbChnMik7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShnMiBpbnN0YW5jZW9mKEcuY3R4LkVDUDIpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIFBhaXIgZnVuY3Rpb25cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZSk7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShlIGluc3RhbmNlb2YoRnVuY3Rpb24pKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKFwiS2V5Z2VuXCIsICgpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xyXG4gICAgICAgIGxldCBbZywgWCwgWV0gPSBwaztcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIFNlY3JldCBLZXkgKHgseSlcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoeCBpbnN0YW5jZW9mKEcuY3R4LkJJRykpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoeSBpbnN0YW5jZW9mKEcuY3R4LkJJRykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZShcIlJldHVybnMgVmFsaWQgUHJpdmF0ZSBLZXkgKGcsWCxZKVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KFwiZyA9IGcyXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShnMi5lcXVhbHMoZykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiWCA9IGcyKnhcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKFguZXF1YWxzKGcyLm11bCh4KSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiWSA9IGcyKnlcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKFkuZXF1YWxzKGcyLm11bCh5KSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGgsIHNpZyA9ICh4K3kqbSkgKiBoXHJcbiAgICAgZGVzY3JpYmUoXCJTaWduXCIsICgpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gc2s7XHJcblxyXG4gICAgICAgIGxldCBtID0gXCJIZWxsbyBXb3JsZCFcIjtcclxuXHJcbiAgICAgICAgY29uc3Qgc2lnbmF0dXJlID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcclxuICAgICAgICBjb25zdCBbc2lnMSwgc2lnMl0gPSBzaWduYXR1cmU7XHJcblxyXG5cclxuICAgICAgICBpdChcIkZvciBzaWduYXR1cmUoc2lnMSwgc2lnMiksIHNpZzIgPSAoKHgreSoobSBtb2QgcCkpIG1vZCBwKSAqIHNpZzFcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBtID0gRy5oYXNoVG9CSUcobSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1jcHkgPSBuZXcgRy5jdHguQklHKG0pO1xyXG4gICAgICAgICAgICBtY3B5Lm1vZChvKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHQxID0gRy5jdHguQklHLm11bCh5LG1jcHkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgeERCSUcgPSAgbmV3IEcuY3R4LkRCSUcoMCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgRy5jdHguQklHLk5MRU47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgeERCSUcud1tpXSA9IHgud1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0MS5hZGQoeERCSUcpO1xyXG4gICAgICAgICAgICBjb25zdCBLID0gdDEubW9kKG8pO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2lnX3Rlc3QgPSBHLmN0eC5QQUlSLkcxbXVsKHNpZzEsIEspO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoc2lnMi5lcXVhbHMoc2lnX3Rlc3QpKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGRlc2NyaWJlKFwiVmVyaWZ5XCIsICgpID0+IHtcclxuICAgICAgICBkZXNjcmliZShcIldpdGggc2sgPSAoNDIsIDUxMylcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuXHJcbiAgICAgICAgICAgIC8vIGtleWdlbiBuZWVkcyB0byBiZSBkb25lIFwibWFudWFsbHlcIlxyXG4gICAgICAgICAgICBjb25zdCB4ID0gbmV3IEcuY3R4LkJJRyg0Mik7XHJcbiAgICAgICAgICAgIGNvbnN0IHkgPSBuZXcgRy5jdHguQklHKDUxMyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzayA9IFt4LCB5XTtcclxuICAgICAgICAgICAgY29uc3QgcGsgPSBbZzIsIGcyLm11bCh4KSwgZzIubXVsKHkpXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG0gPSBcIkhlbGxvIFdvcmxkIVwiO1xyXG4gICAgICAgICAgICBjb25zdCBzaWcgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJTdWNjZXNzZnVsIHZlcmlmaWNhdGlvbiBmb3Igb3JpZ2luYWwgbWVzc2FnZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiRmFpbGVkIHZlcmlmaWNhdGlvbiBmb3IgYW5vdGhlciBtZXNzYWdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtMiA9IFwiT3RoZXIgSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdFRydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0yLCBzaWcpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZShcIldpdGggJ3Byb3BlcicgcmFuZG9tXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpZyA9IFBTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIlN1Y2Nlc3NmdWwgdmVyaWZpY2F0aW9uIGZvciBvcmlnaW5hbCBtZXNzYWdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShQU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbSwgc2lnKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJGYWlsZWQgdmVyaWZpY2F0aW9uIGZvciBhbm90aGVyIG1lc3NhZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG0yID0gXCJPdGhlciBIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90VHJ1ZShQU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbTIsIHNpZykpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBkZXNjcmliZShcIlJhbmRvbWl6ZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xyXG4gICAgICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xyXG5cclxuICAgICAgICBjb25zdCBtID0gXCJIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICBsZXQgc2lnID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcclxuICAgICAgICBzaWcgPSBQU1NpZy5yYW5kb21pemUocGFyYW1zLCBzaWcpO1xyXG5cclxuICAgICAgICBpdChcIlN1Y2Nlc3NmdWwgdmVyaWZpY2F0aW9uIGZvciBvcmlnaW5hbCBtZXNzYWdlIHdpdGggcmFuZG9taXplZCBzaWduYXR1cmVcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcIkZhaWxlZCB2ZXJpZmljYXRpb24gZm9yIGFub3RoZXIgbWVzc2FnZSB3aXRoIHJhbmRvbWl6ZWQgc2lnbmF0dXJlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG0yID0gXCJPdGhlciBIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3RUcnVlKFBTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtMiwgc2lnKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7Il19