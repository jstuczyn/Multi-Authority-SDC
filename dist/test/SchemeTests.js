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

        var m = _PSSig2.default.hashMessage(G, "Hello World!");

        var signature = _PSSig2.default.sign(params, sk, m, true);

        var _signature = _slicedToArray(signature, 2),
            sig1 = _signature[0],
            sig2 = _signature[1];

        it("For signature(sig1, sig2), sig2 = ((x+y*(m mod p)) mod p) * sig1", function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L1NjaGVtZVRlc3RzLmpzIl0sIm5hbWVzIjpbIm1vY2hhIiwiY2hhaSIsImRlc2NyaWJlIiwicGFyYW1zIiwic2V0dXAiLCJHIiwibyIsImcxIiwiZzIiLCJlIiwiaXQiLCJhc3NlcnQiLCJpc05vdE51bGwiLCJpc1RydWUiLCJjdHgiLCJCSUciLCJFQ1AiLCJFQ1AyIiwiRnVuY3Rpb24iLCJrZXlnZW4iLCJzayIsInBrIiwieCIsInkiLCJnIiwiWCIsIlkiLCJlcXVhbHMiLCJtdWwiLCJtIiwiaGFzaE1lc3NhZ2UiLCJzaWduYXR1cmUiLCJzaWduIiwic2lnMSIsInNpZzIiLCJtY3B5IiwibW9kIiwidDEiLCJ4REJJRyIsIkRCSUciLCJpIiwiTkxFTiIsInciLCJhZGQiLCJLIiwic2lnX3Rlc3QiLCJQQUlSIiwiRzFtdWwiLCJzaWciLCJ2ZXJpZnkiLCJtMiIsImlzTm90VHJ1ZSIsInJhbmRvbWl6ZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7SUFBWUEsSzs7QUFDWjs7SUFBWUMsSTs7Ozs7O0FBRVpDLFNBQVMsMERBQVQsRUFBcUUsWUFBTTtBQUN2RUEsYUFBUyxPQUFULEVBQWtCLFlBQU07QUFDcEIsWUFBTUMsU0FBUyxnQkFBTUMsS0FBTixFQUFmOztBQURvQixxQ0FFTUQsTUFGTjtBQUFBLFlBRWJFLENBRmE7QUFBQSxZQUVWQyxDQUZVO0FBQUEsWUFFUEMsRUFGTztBQUFBLFlBRUhDLEVBRkc7QUFBQSxZQUVDQyxDQUZEOztBQUlwQkMsV0FBRyx3QkFBSCxFQUE2QixZQUFNO0FBQy9CVCxpQkFBS1UsTUFBTCxDQUFZQyxTQUFaLENBQXNCUCxDQUF0QjtBQUNBSixpQkFBS1UsTUFBTCxDQUFZRSxNQUFaLENBQW1CUiw4QkFBbkI7QUFDSCxTQUhEOztBQUtBSyxXQUFHLHFCQUFILEVBQTBCLFlBQU07QUFDNUJULGlCQUFLVSxNQUFMLENBQVlDLFNBQVosQ0FBc0JOLENBQXRCO0FBQ0FMLGlCQUFL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YixDQUhPO0FBQUE7QUFBQSxZQUdqQmlCLEVBSGlCO0FBQUEsWUFHYkMsRUFIYTs7QUFBQSxrQ0FJVEQsRUFKUztBQUFBLFlBSWpCRSxDQUppQjtBQUFBLFlBSWRDLENBSmM7O0FBTXhCLFlBQU1NLElBQUksY0FBVjtBQUNBLFlBQUltQixNQUFNLGdCQUFNaEIsSUFBTixDQUFXN0IsTUFBWCxFQUFtQmlCLEVBQW5CLEVBQXVCUyxDQUF2QixDQUFWO0FBQ0FtQixjQUFNLGdCQUFNSSxTQUFOLENBQWdCakQsTUFBaEIsRUFBd0I2QyxHQUF4QixDQUFOOztBQUVBdEMsV0FBRyx3RUFBSCxFQUE2RSxZQUFNO0FBQy9FVCxpQkFBS1UsTUFBTCxDQUFZRSxNQUFaLENBQW1CLGdCQUFNb0MsTUFBTixDQUFhOUMsTUFBYixFQUFxQmtCLEVBQXJCLEVBQXlCUSxDQUF6QixFQUE0Qm1CLEdBQTVCLENBQW5CO0FBQ0gsU0FGRDs7QUFJQXRDLFdBQUcsbUVBQUgsRUFBd0UsWUFBTTtBQUMxRSxnQkFBSXdDLEtBQUssb0JBQVQ7QUFDQWpELGlCQUFLVSxNQUFMLENBQVl3QyxTQUFaLENBQXNCLGdCQUFNRixNQUFOLENBQWE5QyxNQUFiLEVBQXFCa0IsRUFBckIsRUFBeUI2QixFQUF6QixFQUE2QkYsR0FBN0IsQ0FBdEI7QUFDSCxTQUhEO0FBSUgsS0FsQkQ7QUFtQkgsQ0E5SkQiLCJmaWxlIjoiU2NoZW1lVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IFBTU2lnIGZyb20gXCIuLi9QU1NpZ1wiO1xyXG5pbXBvcnQgQnBHcm91cCBmcm9tIFwiLi4vQnBHcm91cFwiO1xyXG5cclxuaW1wb3J0ICogYXMgbW9jaGEgZnJvbSBcIm1vY2hhXCI7XHJcbmltcG9ydCAqIGFzIGNoYWkgZnJvbSAnY2hhaSc7XHJcblxyXG5kZXNjcmliZShcIlBvaW50Y2hldmFsLVNhbmRlcnMgU2hvcnQgUmFuZG9taXphYmxlIFNpZ25hdHVyZXMgc2NoZW1lXCIsICgpID0+IHtcclxuICAgIGRlc2NyaWJlKFwiU2V0dXBcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBCcEdyb3VwIE9iamVjdFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90TnVsbChHKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKEcgaW5zdGFuY2VvZihCcEdyb3VwKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBHcm91cCBPcmRlclwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90TnVsbChvKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKG8gaW5zdGFuY2VvZihHLmN0eC5CSUcpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEdlbjFcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZzEpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZzEgaW5zdGFuY2VvZihHLmN0eC5FQ1ApKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEdlbjJcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZzIpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZzIgaW5zdGFuY2VvZihHLmN0eC5FQ1AyKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBQYWlyIGZ1bmN0aW9uXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKGUpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZSBpbnN0YW5jZW9mKEZ1bmN0aW9uKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZShcIktleWdlblwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xyXG5cclxuICAgICAgICBjb25zdCBbeCwgeV0gPSBzaztcclxuICAgICAgICBsZXQgW2csIFgsIFldID0gcGs7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBTZWNyZXQgS2V5ICh4LHkpXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHggaW5zdGFuY2VvZihHLmN0eC5CSUcpKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHkgaW5zdGFuY2VvZihHLmN0eC5CSUcpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoXCJSZXR1cm5zIFZhbGlkIFByaXZhdGUgS2V5IChnLFgsWSlcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdChcImcgPSBnMlwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZzIuZXF1YWxzKGcpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIlggPSBnMip4XCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShYLmVxdWFscyhnMi5tdWwoeCkpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIlkgPSBnMip5XCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShZLmVxdWFscyhnMi5tdWwoeSkpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBoLCBzaWcgPSAoeCt5Km0pICogaFxyXG4gICAgZGVzY3JpYmUoXCJTaWduXCIsICgpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gc2s7XHJcblxyXG4gICAgICAgIGNvbnN0IG0gPSBQU1NpZy5oYXNoTWVzc2FnZShHLCBcIkhlbGxvIFdvcmxkIVwiKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2lnbmF0dXJlID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtLCB0cnVlKTtcclxuICAgICAgICBjb25zdCBbc2lnMSwgc2lnMl0gPSBzaWduYXR1cmU7XHJcblxyXG5cclxuICAgICAgICBpdChcIkZvciBzaWduYXR1cmUoc2lnMSwgc2lnMiksIHNpZzIgPSAoKHgreSoobSBtb2QgcCkpIG1vZCBwKSAqIHNpZzFcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBtY3B5ID0gbmV3IEcuY3R4LkJJRyhtKTtcclxuICAgICAgICAgICAgbWNweS5tb2Qobyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0MSA9IEcuY3R4LkJJRy5tdWwoeSxtY3B5KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHhEQklHID0gIG5ldyBHLmN0eC5EQklHKDApO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IEcuY3R4LkJJRy5OTEVOOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHhEQklHLndbaV0gPSB4LndbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdDEuYWRkKHhEQklHKTtcclxuICAgICAgICAgICAgY29uc3QgSyA9IHQxLm1vZChvKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNpZ190ZXN0ID0gRy5jdHguUEFJUi5HMW11bChzaWcxLCBLKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHNpZzIuZXF1YWxzKHNpZ190ZXN0KSlcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBkZXNjcmliZShcIlZlcmlmeVwiLCAoKSA9PiB7XHJcbiAgICAgICAgZGVzY3JpYmUoXCJXaXRoIHNrID0gKDQyLCA1MTMpXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcblxyXG4gICAgICAgICAgICAvLyBrZXlnZW4gbmVlZHMgdG8gYmUgZG9uZSBcIm1hbnVhbGx5XCJcclxuICAgICAgICAgICAgY29uc3QgeCA9IG5ldyBHLmN0eC5CSUcoNDIpO1xyXG4gICAgICAgICAgICBjb25zdCB5ID0gbmV3IEcuY3R4LkJJRyg1MTMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2sgPSBbeCwgeV07XHJcbiAgICAgICAgICAgIGNvbnN0IHBrID0gW2cyLCBnMi5tdWwoeCksIGcyLm11bCh5KV07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtID0gXCJIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICAgICAgY29uc3Qgc2lnID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiU3VjY2Vzc2Z1bCB2ZXJpZmljYXRpb24gZm9yIG9yaWdpbmFsIG1lc3NhZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKFBTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtLCBzaWcpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIkZhaWxlZCB2ZXJpZmljYXRpb24gZm9yIGFub3RoZXIgbWVzc2FnZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbTIgPSBcIk90aGVyIEhlbGxvIFdvcmxkIVwiO1xyXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3RUcnVlKFBTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtMiwgc2lnKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoXCJXaXRoICdwcm9wZXInIHJhbmRvbVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgICAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xyXG4gICAgICAgICAgICBjb25zdCBbeCwgeV0gPSBzaztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG0gPSBcIkhlbGxvIFdvcmxkIVwiO1xyXG4gICAgICAgICAgICBjb25zdCBzaWcgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJTdWNjZXNzZnVsIHZlcmlmaWNhdGlvbiBmb3Igb3JpZ2luYWwgbWVzc2FnZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiRmFpbGVkIHZlcmlmaWNhdGlvbiBmb3IgYW5vdGhlciBtZXNzYWdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtMiA9IFwiT3RoZXIgSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdFRydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0yLCBzaWcpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZGVzY3JpYmUoXCJSYW5kb21pemVcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3NrLCBwa10gPSBQU1NpZy5rZXlnZW4ocGFyYW1zKTtcclxuICAgICAgICBjb25zdCBbeCwgeV0gPSBzaztcclxuXHJcbiAgICAgICAgY29uc3QgbSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgbGV0IHNpZyA9IFBTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XHJcbiAgICAgICAgc2lnID0gUFNTaWcucmFuZG9taXplKHBhcmFtcywgc2lnKTtcclxuXHJcbiAgICAgICAgaXQoXCJTdWNjZXNzZnVsIHZlcmlmaWNhdGlvbiBmb3Igb3JpZ2luYWwgbWVzc2FnZSB3aXRoIHJhbmRvbWl6ZWQgc2lnbmF0dXJlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKFBTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtLCBzaWcpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJGYWlsZWQgdmVyaWZpY2F0aW9uIGZvciBhbm90aGVyIG1lc3NhZ2Ugd2l0aCByYW5kb21pemVkIHNpZ25hdHVyZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBtMiA9IFwiT3RoZXIgSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90VHJ1ZShQU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbTIsIHNpZykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pOyJdfQ==