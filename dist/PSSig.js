"use strict";

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BpGroup = require("./BpGroup");

var _BpGroup2 = _interopRequireDefault(_BpGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
    TODO:
    - fix incorrect signature when given x,y = sk, y > 513

 */

var PSSig = function () {
        function PSSig() {
                _classCallCheck(this, PSSig);
        }

        _createClass(PSSig, null, [{
                key: "setup",
                value: function setup() {
                        var G = new _BpGroup2.default();

                        var g1 = G.gen1;
                        var g2 = G.gen2;
                        var e = G.pair;
                        var o = G.order;

                        return [G, o, g1, g2, e];
                }
        }, {
                key: "keygen",
                value: function keygen(params) {
                        var _params = _slicedToArray(params, 5),
                            G = _params[0],
                            o = _params[1],
                            g1 = _params[2],
                            g2 = _params[3],
                            e = _params[4];

                        // Target values:


                        var x = G.ctx.BIG.randomnum(G.order, G.rngGen);
                        var y = G.ctx.BIG.randomnum(G.order, G.rngGen);

                        // Test values: (to compare intermediate products with values of working library)
                        // X can be random as long as Y <= 513...

                        // const x = new G.ctx.BIG(42);
                        // const y = new G.ctx.BIG(513);

                        var sk = [x, y];
                        var pk = [g2, g2.mul(x), g2.mul(y)];

                        return [sk, pk];
                }

                // sig = (x+y*m) * h

        }, {
                key: "sign",
                value: function sign(params, sk, m) {
                        var _params2 = _slicedToArray(params, 5),
                            G = _params2[0],
                            o = _params2[1],
                            g1 = _params2[2],
                            g2 = _params2[3],
                            e = _params2[4];

                        var _sk = _slicedToArray(sk, 2),
                            a = _sk[0],
                            b = _sk[1];

                        // makes a copy of them so that would not be overwritten during addition


                        var x = new G.ctx.BIG(a);
                        var y = new G.ctx.BIG(b);

                        // Test value for testing and comparing intermediate products with working library
                        // let rand = new G.ctx.BIG(32);

                        // let h = G.ctx.PAIR.G1mul(g1, G.ctx.BIG.randomnum(o, G.rngGen));

                        var rand = G.ctx.BIG.randomnum(o, G.rngGen);

                        // target:
                        // let h = g1.mul(rand);
                        var h = G.ctx.PAIR.G1mul(g1, rand);

                        // current broken alternatives:
                        // smul returns instanceof BIG but loses carry of multiplication;
                        // mul returns DBIG, which has correct value, but can't be used to multiply G1Elem
                        var tmp1b = G.ctx.BIG.smul(y, m);
                        var tmp1db = G.ctx.BIG.mul(y, m);

                        var tmp2 = x.add(tmp1b);
                        // tmp1db.add(x);

                        var sig = h.mul(tmp2);
                        // let sig = h.mul(tmp1db)

                        return [h, sig];
                }

                //  e(sig1, X + m * Y) == e(sig2, g)

        }, {
                key: "verify",
                value: function verify(params, pk, m, sig) {
                        var _params3 = _slicedToArray(params, 5),
                            G = _params3[0],
                            o = _params3[1],
                            g1 = _params3[2],
                            g2 = _params3[3],
                            e = _params3[4];

                        var _pk = _slicedToArray(pk, 3),
                            g = _pk[0],
                            X = _pk[1],
                            Y = _pk[2];

                        var _sig = _slicedToArray(sig, 2),
                            sig1 = _sig[0],
                            sig2 = _sig[1];

                        var G2_tmp1 = Y.mul(m);
                        G2_tmp1.add(X);
                        G2_tmp1.affine();

                        var Gt_1 = e(sig1, G2_tmp1);
                        var Gt_2 = e(sig2, g);

                        return !sig.INF && Gt_1.equals(Gt_2);
                }
        }, {
                key: "randomize",
                value: function randomize(params, sig) {
                        var _params4 = _slicedToArray(params, 5),
                            G = _params4[0],
                            o = _params4[1],
                            g1 = _params4[2],
                            g2 = _params4[3],
                            e = _params4[4];

                        var _sig2 = _slicedToArray(sig, 2),
                            sig1 = _sig2[0],
                            sig2 = _sig2[1];

                        var t = G.ctx.BIG.randomnum(G.order, G.rngGen);

                        return [G.ctx.PAIR.G1mul(sig1, t), G.ctx.PAIR.G1mul(sig2, t)];
                }
        }]);

        return PSSig;
}();

exports.default = PSSig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QU1NpZy5qcyJdLCJuYW1lcyI6WyJQU1NpZyIsIkciLCJnMSIsImdlbjEiLCJnMiIsImdlbjIiLCJlIiwicGFpciIsIm8iLCJvcmRlciIsInBhcmFtcyIsIngiLCJjdHgiLCJCSUciLCJyYW5kb21udW0iLCJybmdHZW4iLCJ5Iiwic2siLCJwayIsIm11bCIsIm0iLCJhIiwiYiIsInJhbmQiLCJoIiwiUEFJUiIsIkcxbXVsIiwidG1wMWIiLCJzbXVsIiwidG1wMWRiIiwidG1wMiIsImFkZCIsInNpZyIsImciLCJYIiwiWSIsInNpZzEiLCJzaWcyIiwiRzJfdG1wMSIsImFmZmluZSIsIkd0XzEiLCJHdF8yIiwiSU5GIiwiZXF1YWxzIiwidCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztBQUVBOzs7Ozs7SUFPcUJBLEs7Ozs7Ozs7d0NBRUY7QUFDWCw0QkFBTUMsSUFBSSx1QkFBVjs7QUFFQSw0QkFBTUMsS0FBS0QsRUFBRUUsSUFBYjtBQUNBLDRCQUFNQyxLQUFLSCxFQUFFSSxJQUFiO0FBQ0EsNEJBQU1DLElBQUlMLEVBQUVNLElBQVo7QUFDQSw0QkFBTUMsSUFBSVAsRUFBRVEsS0FBWjs7QUFFQSwrQkFBTyxDQUFDUixDQUFELEVBQUlPLENBQUosRUFBT04sRUFBUCxFQUFXRSxFQUFYLEVBQWVFLENBQWYsQ0FBUDtBQUNIOzs7dUNBRWFJLE0sRUFBUTtBQUFBLHFEQUNNQSxNQUROO0FBQUEsNEJBQ2JULENBRGE7QUFBQSw0QkFDVk8sQ0FEVTtBQUFBLDRCQUNQTixFQURPO0FBQUEsNEJBQ0hFLEVBREc7QUFBQSw0QkFDQ0UsQ0FERDs7QUFHbEI7OztBQUNBLDRCQUFNSyxJQUFJVixFQUFFVyxHQUFGLENBQU1DLEdBQU4sQ0FBVUMsU0FBVixDQUFvQmIsRUFBRVEsS0FBdEIsRUFBNkJSLEVBQUVjLE1BQS9CLENBQVY7QUFDQSw0QkFBTUMsSUFBSWYsRUFBRVcsR0FBRixDQUFNQyxHQUFOLENBQVVDLFNBQVYsQ0FBb0JiLEVB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Rk87QUFBQSw0QkFFckJJLElBRnFCO0FBQUEsNEJBRWZDLElBRmU7O0FBRzFCLDRCQUFJTyxJQUFJM0MsRUFBRVcsR0FBRixDQUFNQyxHQUFOLENBQVVDLFNBQVYsQ0FBb0JiLEVBQUVRLEtBQXRCLEVBQTZCUixFQUFFYyxNQUEvQixDQUFSOztBQUVBLCtCQUFPLENBQUNkLEVBQUVXLEdBQUYsQ0FBTWEsSUFBTixDQUFXQyxLQUFYLENBQWlCVSxJQUFqQixFQUF1QlEsQ0FBdkIsQ0FBRCxFQUE0QjNDLEVBQUVXLEdBQUYsQ0FBTWEsSUFBTixDQUFXQyxLQUFYLENBQWlCVyxJQUFqQixFQUF1Qk8sQ0FBdkIsQ0FBNUIsQ0FBUDtBQUNIOzs7Ozs7a0JBekZnQjVDLEsiLCJmaWxlIjoiUFNTaWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnBHcm91cCBmcm9tIFwiLi9CcEdyb3VwXCJcclxuXHJcbi8qXHJcbiAgICBUT0RPOlxyXG4gICAgLSBmaXggaW5jb3JyZWN0IHNpZ25hdHVyZSB3aGVuIGdpdmVuIHgseSA9IHNrLCB5ID4gNTEzXHJcblxyXG4gKi9cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQU1NpZyB7XHJcblxyXG4gICAgc3RhdGljIHNldHVwKCkge1xyXG4gICAgICAgIGNvbnN0IEcgPSBuZXcgQnBHcm91cCgpO1xyXG5cclxuICAgICAgICBjb25zdCBnMSA9IEcuZ2VuMTtcclxuICAgICAgICBjb25zdCBnMiA9IEcuZ2VuMjtcclxuICAgICAgICBjb25zdCBlID0gRy5wYWlyO1xyXG4gICAgICAgIGNvbnN0IG8gPSBHLm9yZGVyO1xyXG5cclxuICAgICAgICByZXR1cm4gW0csIG8sIGcxLCBnMiwgZV1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMga2V5Z2VuKHBhcmFtcykge1xyXG4gICAgICAgIGxldCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuXHJcbiAgICAgICAgLy8gVGFyZ2V0IHZhbHVlczpcclxuICAgICAgICBjb25zdCB4ID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XHJcbiAgICAgICAgY29uc3QgeSA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xyXG5cclxuICAgICAgICAvLyBUZXN0IHZhbHVlczogKHRvIGNvbXBhcmUgaW50ZXJtZWRpYXRlIHByb2R1Y3RzIHdpdGggdmFsdWVzIG9mIHdvcmtpbmcgbGlicmFyeSlcclxuICAgICAgICAvLyBYIGNhbiBiZSByYW5kb20gYXMgbG9uZyBhcyBZIDw9IDUxMy4uLlxyXG5cclxuICAgICAgICAvLyBjb25zdCB4ID0gbmV3IEcuY3R4LkJJRyg0Mik7XHJcbiAgICAgICAgLy8gY29uc3QgeSA9IG5ldyBHLmN0eC5CSUcoNTEzKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2sgPSBbeCwgeV07XHJcbiAgICAgICAgY29uc3QgcGsgPSBbZzIsIGcyLm11bCh4KSwgZzIubXVsKHkpXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtzaywgcGtdXHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2lnID0gKHgreSptKSAqIGhcclxuICAgIHN0YXRpYyBzaWduKHBhcmFtcywgc2ssIG0pIHtcclxuICAgICAgICBsZXQgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgbGV0IFthLCBiXSA9IHNrO1xyXG5cclxuICAgICAgICAvLyBtYWtlcyBhIGNvcHkgb2YgdGhlbSBzbyB0aGF0IHdvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiBkdXJpbmcgYWRkaXRpb25cclxuICAgICAgICBsZXQgeCA9IG5ldyBHLmN0eC5CSUcoYSk7XHJcbiAgICAgICAgbGV0IHkgPSBuZXcgRy5jdHguQklHKGIpO1xyXG5cclxuICAgICAgICAvLyBUZXN0IHZhbHVlIGZvciB0ZXN0aW5nIGFuZCBjb21wYXJpbmcgaW50ZXJtZWRpYXRlIHByb2R1Y3RzIHdpdGggd29ya2luZyBsaWJyYXJ5XHJcbiAgICAgICAgLy8gbGV0IHJhbmQgPSBuZXcgRy5jdHguQklHKDMyKTtcclxuXHJcbiAgICAgICAgLy8gbGV0IGggPSBHLmN0eC5QQUlSLkcxbXVsKGcxLCBHLmN0eC5CSUcucmFuZG9tbnVtKG8sIEcucm5nR2VuKSk7XHJcblxyXG4gICAgICAgIGxldCByYW5kID0gRy5jdHguQklHLnJhbmRvbW51bShvLCBHLnJuZ0dlbik7XHJcblxyXG4gICAgICAgIC8vIHRhcmdldDpcclxuICAgICAgICAvLyBsZXQgaCA9IGcxLm11bChyYW5kKTtcclxuICAgICAgICBsZXQgaCA9IEcuY3R4LlBBSVIuRzFtdWwoZzEsIHJhbmQpO1xyXG5cclxuICAgICAgICAvLyBjdXJyZW50IGJyb2tlbiBhbHRlcm5hdGl2ZXM6XHJcbiAgICAgICAgLy8gc211bCByZXR1cm5zIGluc3RhbmNlb2YgQklHIGJ1dCBsb3NlcyBjYXJyeSBvZiBtdWx0aXBsaWNhdGlvbjtcclxuICAgICAgICAvLyBtdWwgcmV0dXJucyBEQklHLCB3aGljaCBoYXMgY29ycmVjdCB2YWx1ZSwgYnV0IGNhbid0IGJlIHVzZWQgdG8gbXVsdGlwbHkgRzFFbGVtXHJcbiAgICAgICAgbGV0IHRtcDFiID0gRy5jdHguQklHLnNtdWwoeSxtKTtcclxuICAgICAgICBsZXQgdG1wMWRiID0gRy5jdHguQklHLm11bCh5LG0pO1xyXG5cclxuICAgICAgICBsZXQgdG1wMiA9IHguYWRkKHRtcDFiKTtcclxuICAgICAgICAvLyB0bXAxZGIuYWRkKHgpO1xyXG5cclxuICAgICAgICBsZXQgc2lnID0gaC5tdWwodG1wMik7XHJcbiAgICAgICAgLy8gbGV0IHNpZyA9IGgubXVsKHRtcDFkYilcclxuXHJcbiAgICAgICAgcmV0dXJuIFtoLCBzaWddXHJcbiAgICB9XHJcblxyXG4gICAgLy8gIGUoc2lnMSwgWCArIG0gKiBZKSA9PSBlKHNpZzIsIGcpXHJcbiAgICBzdGF0aWMgdmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZykge1xyXG4gICAgICAgIGxldCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBsZXQgW2csIFgsIFldID0gcGs7XHJcbiAgICAgICAgbGV0IFtzaWcxLCBzaWcyXSA9IHNpZztcclxuXHJcbiAgICAgICAgbGV0IEcyX3RtcDEgPSBZLm11bChtKTtcclxuICAgICAgICBHMl90bXAxLmFkZChYKTtcclxuICAgICAgICBHMl90bXAxLmFmZmluZSgpO1xyXG5cclxuICAgICAgICBsZXQgR3RfMSA9IGUoc2lnMSwgRzJfdG1wMSk7XHJcbiAgICAgICAgbGV0IEd0XzIgPSBlKHNpZzIsIGcpO1xyXG5cclxuICAgICAgICByZXR1cm4gIXNpZy5JTkYgJiYgR3RfMS5lcXVhbHMoR3RfMik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJhbmRvbWl6ZShwYXJhbXMsIHNpZykge1xyXG4gICAgICAgIGxldCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBsZXQgW3NpZzEsIHNpZzJdID0gc2lnO1xyXG4gICAgICAgIGxldCB0ID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XHJcblxyXG4gICAgICAgIHJldHVybiBbRy5jdHguUEFJUi5HMW11bChzaWcxLCB0KSwgRy5jdHguUEFJUi5HMW11bChzaWcyLCB0KV1cclxuICAgIH1cclxufVxyXG4iXX0=