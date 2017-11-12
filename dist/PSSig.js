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
                        var pk = [g2, G.ctx.PAIR.G2mul(g2, x), G.ctx.PAIR.G2mul(g2, y)];

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
                        var h = G.ctx.PAIR.G1mul(g1, rand);

                        // current broken alternatives:
                        // smul returns instanceof BIG but loses carry of multiplication;
                        // mul returns DBIG, which has correct value, but can't be used to multiply G1Elem
                        var tmp1b = G.ctx.BIG.smul(y, m);
                        var tmp1db = G.ctx.BIG.mul(y, m);

                        var tmp2 = x.add(tmp1b);
                        // tmp1db.add(x);

                        var sig = G.ctx.PAIR.G1mul(h, tmp2);
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

                        var G2_tmp1 = G.ctx.PAIR.G2mul(Y, m);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QU1NpZy5qcyJdLCJuYW1lcyI6WyJQU1NpZyIsIkciLCJnMSIsImdlbjEiLCJnMiIsImdlbjIiLCJlIiwicGFpciIsIm8iLCJvcmRlciIsInBhcmFtcyIsIngiLCJjdHgiLCJCSUciLCJyYW5kb21udW0iLCJybmdHZW4iLCJ5Iiwic2siLCJwayIsIlBBSVIiLCJHMm11bCIsIm0iLCJhIiwiYiIsInJhbmQiLCJoIiwiRzFtdWwiLCJ0bXAxYiIsInNtdWwiLCJ0bXAxZGIiLCJtdWwiLCJ0bXAyIiwiYWRkIiwic2lnIiwiZyIsIlgiLCJZIiwic2lnMSIsInNpZzIiLCJHMl90bXAxIiwiYWZmaW5lIiwiR3RfMSIsIkd0XzIiLCJJTkYiLCJlcXVhbHMiLCJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUE7Ozs7OztJQU9xQkEsSzs7Ozs7Ozt3Q0FFRjtBQUNYLDRCQUFNQyxJQUFJLHVCQUFWOztBQUVBLDRCQUFNQyxLQUFLRCxFQUFFRSxJQUFiO0FBQ0EsNEJBQU1DLEtBQUtILEVBQUVJLElBQWI7QUFDQSw0QkFBTUMsSUFBSUwsRUFBRU0sSUFBWjtBQUNBLDRCQUFNQyxJQUFJUCxFQUFFUSxLQUFaOztBQUVBLCtCQUFPLENBQUNSLENBQUQsRUFBSU8sQ0FBSixFQUFPTixFQUFQLEVBQVdFLEVBQVgsRUFBZUUsQ0FBZixDQUFQO0FBQ0g7Ozt1Q0FFYUksTSxFQUFRO0FBQUEscURBQ01BLE1BRE47QUFBQSw0QkFDYlQsQ0FEYTtBQUFBLDRCQUNWTyxDQURVO0FBQUEsNEJBQ1BOLEVBRE87QUFBQSw0QkFDSEUsRUFERztBQUFBLDRCQUNDRSxDQUREOztBQUdsQjs7O0FBQ0EsNEJBQU1LLElBQUlWLEVBQUVXLEdBQUYsQ0FBTUMsR0FBTixDQUFVQyxTQUFWLENBQW9CYixFQUFFUSxLQUF0QixFQUE2QlIsRUFBRWMsTUFBL0IsQ0FBVjtBQUNBLDRCQUFNQyxJQUFJZixFQUFFVyxHQUFGLENBQU1DLEdBQU4sQ0FBVUMsU0FBVixD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QjtBQUNIOzs7MENBRWdCaEMsTSxFQUFRdUIsRyxFQUFLO0FBQUEsc0RBQ0Z2QixNQURFO0FBQUEsNEJBQ3JCVCxDQURxQjtBQUFBLDRCQUNsQk8sQ0FEa0I7QUFBQSw0QkFDZk4sRUFEZTtBQUFBLDRCQUNYRSxFQURXO0FBQUEsNEJBQ1BFLENBRE87O0FBQUEsbURBRVAyQixHQUZPO0FBQUEsNEJBRXJCSSxJQUZxQjtBQUFBLDRCQUVmQyxJQUZlOztBQUcxQiw0QkFBSU8sSUFBSTVDLEVBQUVXLEdBQUYsQ0FBTUMsR0FBTixDQUFVQyxTQUFWLENBQW9CYixFQUFFUSxLQUF0QixFQUE2QlIsRUFBRWMsTUFBL0IsQ0FBUjs7QUFFQSwrQkFBTyxDQUFDZCxFQUFFVyxHQUFGLENBQU1PLElBQU4sQ0FBV08sS0FBWCxDQUFpQlcsSUFBakIsRUFBdUJRLENBQXZCLENBQUQsRUFBNEI1QyxFQUFFVyxHQUFGLENBQU1PLElBQU4sQ0FBV08sS0FBWCxDQUFpQlksSUFBakIsRUFBdUJPLENBQXZCLENBQTVCLENBQVA7QUFDSDs7Ozs7O2tCQXhGZ0I3QyxLIiwiZmlsZSI6IlBTU2lnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJwR3JvdXAgZnJvbSBcIi4vQnBHcm91cFwiXHJcblxyXG4vKlxyXG4gICAgVE9ETzpcclxuICAgIC0gZml4IGluY29ycmVjdCBzaWduYXR1cmUgd2hlbiBnaXZlbiB4LHkgPSBzaywgeSA+IDUxM1xyXG5cclxuICovXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUFNTaWcge1xyXG5cclxuICAgIHN0YXRpYyBzZXR1cCgpIHtcclxuICAgICAgICBjb25zdCBHID0gbmV3IEJwR3JvdXAoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZzEgPSBHLmdlbjE7XHJcbiAgICAgICAgY29uc3QgZzIgPSBHLmdlbjI7XHJcbiAgICAgICAgY29uc3QgZSA9IEcucGFpcjtcclxuICAgICAgICBjb25zdCBvID0gRy5vcmRlcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtHLCBvLCBnMSwgZzIsIGVdXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGtleWdlbihwYXJhbXMpIHtcclxuICAgICAgICBsZXQgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcblxyXG4gICAgICAgIC8vIFRhcmdldCB2YWx1ZXM6XHJcbiAgICAgICAgY29uc3QgeCA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xyXG4gICAgICAgIGNvbnN0IHkgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcclxuXHJcbiAgICAgICAgLy8gVGVzdCB2YWx1ZXM6ICh0byBjb21wYXJlIGludGVybWVkaWF0ZSBwcm9kdWN0cyB3aXRoIHZhbHVlcyBvZiB3b3JraW5nIGxpYnJhcnkpXHJcbiAgICAgICAgLy8gWCBjYW4gYmUgcmFuZG9tIGFzIGxvbmcgYXMgWSA8PSA1MTMuLi5cclxuXHJcbiAgICAgICAgLy8gY29uc3QgeCA9IG5ldyBHLmN0eC5CSUcoNDIpO1xyXG4gICAgICAgIC8vIGNvbnN0IHkgPSBuZXcgRy5jdHguQklHKDUxMyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNrID0gW3gsIHldO1xyXG4gICAgICAgIGNvbnN0IHBrID0gW2cyLCBHLmN0eC5QQUlSLkcybXVsKGcyLCB4KSwgRy5jdHguUEFJUi5HMm11bChnMiwgeSldO1xyXG5cclxuICAgICAgICByZXR1cm4gW3NrLCBwa11cclxuICAgIH1cclxuXHJcbiAgICAvLyBzaWcgPSAoeCt5Km0pICogaFxyXG4gICAgc3RhdGljIHNpZ24ocGFyYW1zLCBzaywgbSkge1xyXG4gICAgICAgIGxldCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBsZXQgW2EsIGJdID0gc2s7XHJcblxyXG4gICAgICAgIC8vIG1ha2VzIGEgY29weSBvZiB0aGVtIHNvIHRoYXQgd291bGQgbm90IGJlIG92ZXJ3cml0dGVuIGR1cmluZyBhZGRpdGlvblxyXG4gICAgICAgIGxldCB4ID0gbmV3IEcuY3R4LkJJRyhhKTtcclxuICAgICAgICBsZXQgeSA9IG5ldyBHLmN0eC5CSUcoYik7XHJcblxyXG4gICAgICAgIC8vIFRlc3QgdmFsdWUgZm9yIHRlc3RpbmcgYW5kIGNvbXBhcmluZyBpbnRlcm1lZGlhdGUgcHJvZHVjdHMgd2l0aCB3b3JraW5nIGxpYnJhcnlcclxuICAgICAgICAvLyBsZXQgcmFuZCA9IG5ldyBHLmN0eC5CSUcoMzIpO1xyXG5cclxuICAgICAgICAvLyBsZXQgaCA9IEcuY3R4LlBBSVIuRzFtdWwoZzEsIEcuY3R4LkJJRy5yYW5kb21udW0obywgRy5ybmdHZW4pKTtcclxuXHJcbiAgICAgICAgbGV0IHJhbmQgPSBHLmN0eC5CSUcucmFuZG9tbnVtKG8sIEcucm5nR2VuKTtcclxuXHJcbiAgICAgICAgLy8gdGFyZ2V0OlxyXG4gICAgICAgIGxldCBoID0gRy5jdHguUEFJUi5HMW11bChnMSwgcmFuZCk7XHJcblxyXG4gICAgICAgIC8vIGN1cnJlbnQgYnJva2VuIGFsdGVybmF0aXZlczpcclxuICAgICAgICAvLyBzbXVsIHJldHVybnMgaW5zdGFuY2VvZiBCSUcgYnV0IGxvc2VzIGNhcnJ5IG9mIG11bHRpcGxpY2F0aW9uO1xyXG4gICAgICAgIC8vIG11bCByZXR1cm5zIERCSUcsIHdoaWNoIGhhcyBjb3JyZWN0IHZhbHVlLCBidXQgY2FuJ3QgYmUgdXNlZCB0byBtdWx0aXBseSBHMUVsZW1cclxuICAgICAgICBsZXQgdG1wMWIgPSBHLmN0eC5CSUcuc211bCh5LG0pO1xyXG4gICAgICAgIGxldCB0bXAxZGIgPSBHLmN0eC5CSUcubXVsKHksbSk7XHJcblxyXG4gICAgICAgIGxldCB0bXAyID0geC5hZGQodG1wMWIpO1xyXG4gICAgICAgIC8vIHRtcDFkYi5hZGQoeCk7XHJcblxyXG4gICAgICAgIGxldCBzaWcgPSBHLmN0eC5QQUlSLkcxbXVsKGgsIHRtcDIpO1xyXG4gICAgICAgIC8vIGxldCBzaWcgPSBoLm11bCh0bXAxZGIpXHJcblxyXG4gICAgICAgIHJldHVybiBbaCwgc2lnXVxyXG4gICAgfVxyXG5cclxuICAgIC8vICBlKHNpZzEsIFggKyBtICogWSkgPT0gZShzaWcyLCBnKVxyXG4gICAgc3RhdGljIHZlcmlmeShwYXJhbXMsIHBrLCBtLCBzaWcpIHtcclxuICAgICAgICBsZXQgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgbGV0IFtnLCBYLCBZXSA9IHBrO1xyXG4gICAgICAgIGxldCBbc2lnMSwgc2lnMl0gPSBzaWc7XHJcblxyXG4gICAgICAgIGxldCBHMl90bXAxID0gRy5jdHguUEFJUi5HMm11bChZLCBtKTtcclxuICAgICAgICBHMl90bXAxLmFkZChYKTtcclxuICAgICAgICBHMl90bXAxLmFmZmluZSgpO1xyXG5cclxuICAgICAgICBsZXQgR3RfMSA9IGUoc2lnMSwgRzJfdG1wMSk7XHJcbiAgICAgICAgbGV0IEd0XzIgPSBlKHNpZzIsIGcpO1xyXG5cclxuICAgICAgICByZXR1cm4gIXNpZy5JTkYgJiYgR3RfMS5lcXVhbHMoR3RfMik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJhbmRvbWl6ZShwYXJhbXMsIHNpZykge1xyXG4gICAgICAgIGxldCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBsZXQgW3NpZzEsIHNpZzJdID0gc2lnO1xyXG4gICAgICAgIGxldCB0ID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XHJcblxyXG4gICAgICAgIHJldHVybiBbRy5jdHguUEFJUi5HMW11bChzaWcxLCB0KSwgRy5jdHguUEFJUi5HMW11bChzaWcyLCB0KV1cclxuICAgIH1cclxufVxyXG4iXX0=