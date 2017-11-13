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
                            x = _sk[0],
                            y = _sk[1];

                        var rand = G.ctx.BIG.randomnum(o, G.rngGen);
                        var h = G.ctx.PAIR.G1mul(g1, rand);

                        // mcpy = m mod p
                        var mcpy = new G.ctx.BIG(m);
                        mcpy.mod(o);

                        // t1 = y * (m mod p)
                        var t1 = G.ctx.BIG.mul(y, mcpy);

                        // DBIG constructor does not allow to pass it a BIG value hence we copy all word values manually
                        var xDBIG = new G.ctx.DBIG(0);
                        for (var i = 0; i < G.ctx.BIG.NLEN; i++) {
                                xDBIG.w[i] = x.w[i];
                        }

                        // t1 = x + y * (m mod p)
                        t1.add(xDBIG);

                        // K = (x + y * (m mod p)) mod p
                        var K = t1.mod(o);

                        // sig = K * h
                        var sig = G.ctx.PAIR.G1mul(h, K);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QU1NpZy5qcyJdLCJuYW1lcyI6WyJQU1NpZyIsIkciLCJnMSIsImdlbjEiLCJnMiIsImdlbjIiLCJlIiwicGFpciIsIm8iLCJvcmRlciIsInBhcmFtcyIsIngiLCJjdHgiLCJCSUciLCJyYW5kb21udW0iLCJybmdHZW4iLCJ5Iiwic2siLCJwayIsIlBBSVIiLCJHMm11bCIsIm0iLCJyYW5kIiwiaCIsIkcxbXVsIiwibWNweSIsIm1vZCIsInQxIiwibXVsIiwieERCSUciLCJEQklHIiwiaSIsIk5MRU4iLCJ3IiwiYWRkIiwiSyIsInNpZyIsImciLCJYIiwiWSIsInNpZzEiLCJzaWcyIiwiRzJfdG1wMSIsImFmZmluZSIsIkd0XzEiLCJHdF8yIiwiSU5GIiwiZXF1YWxzIiwidCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztJQUVxQkEsSzs7Ozs7Ozt3Q0FFRjtBQUNYLDRCQUFNQyxJQUFJLHVCQUFWOztBQUVBLDRCQUFNQyxLQUFLRCxFQUFFRSxJQUFiO0FBQ0EsNEJBQU1DLEtBQUtILEVBQUVJLElBQWI7QUFDQSw0QkFBTUMsSUFBSUwsRUFBRU0sSUFBWjtBQUNBLDRCQUFNQyxJQUFJUCxFQUFFUSxLQUFaOztBQUVBLCtCQUFPLENBQUNSLENBQUQsRUFBSU8sQ0FBSixFQUFPTixFQUFQLEVBQVdFLEVBQVgsRUFBZUUsQ0FBZixDQUFQO0FBQ0g7Ozt1Q0FFYUksTSxFQUFRO0FBQUEscURBQ1FBLE1BRFI7QUFBQSw0QkFDWFQsQ0FEVztBQUFBLDRCQUNSTyxDQURRO0FBQUEsNEJBQ0xOLEVBREs7QUFBQSw0QkFDREUsRUFEQztBQUFBLDRCQUNHRSxDQURIOztBQUdsQjs7O0FBQ0EsNEJBQU1LLElBQUlWLEVBQUVXLEdBQUYsQ0FBTUMsR0FBTixDQUFVQyxTQUFWLENBQW9CYixFQUFFUSxLQUF0QixFQUE2QlIsRUFBRWMsTUFBL0IsQ0FBVjtBQUNBLDRCQUFNQyxJQUFJZixFQUFFVyxHQUFGLENBQU1DLEdBQU4sQ0FBVUMsU0FB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QSw0QkFBTUcsT0FBT3ZDLEVBQUVtQyxJQUFGLEVBQVFKLENBQVIsQ0FBYjs7QUFFQSwrQkFBTyxDQUFDRCxJQUFJVSxHQUFMLElBQVlGLEtBQUtHLE1BQUwsQ0FBWUYsSUFBWixDQUFuQjtBQUNIOzs7MENBRWdCbkMsTSxFQUFRMEIsRyxFQUFLO0FBQUEsc0RBQ0ExQixNQURBO0FBQUEsNEJBQ25CVCxDQURtQjtBQUFBLDRCQUNoQk8sQ0FEZ0I7QUFBQSw0QkFDYk4sRUFEYTtBQUFBLDRCQUNURSxFQURTO0FBQUEsNEJBQ0xFLENBREs7O0FBQUEsbURBRUw4QixHQUZLO0FBQUEsNEJBRW5CSSxJQUZtQjtBQUFBLDRCQUViQyxJQUZhOztBQUcxQiw0QkFBTU8sSUFBSS9DLEVBQUVXLEdBQUYsQ0FBTUMsR0FBTixDQUFVQyxTQUFWLENBQW9CYixFQUFFUSxLQUF0QixFQUE2QlIsRUFBRWMsTUFBL0IsQ0FBVjs7QUFFQSwrQkFBTyxDQUFDZCxFQUFFVyxHQUFGLENBQU1PLElBQU4sQ0FBV0ssS0FBWCxDQUFpQmdCLElBQWpCLEVBQXVCUSxDQUF2QixDQUFELEVBQTRCL0MsRUFBRVcsR0FBRixDQUFNTyxJQUFOLENBQVdLLEtBQVgsQ0FBaUJpQixJQUFqQixFQUF1Qk8sQ0FBdkIsQ0FBNUIsQ0FBUDtBQUNIOzs7Ozs7a0JBakZnQmhELEsiLCJmaWxlIjoiUFNTaWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnBHcm91cCBmcm9tIFwiLi9CcEdyb3VwXCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBTU2lnIHtcclxuXHJcbiAgICBzdGF0aWMgc2V0dXAoKSB7XHJcbiAgICAgICAgY29uc3QgRyA9IG5ldyBCcEdyb3VwKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGcxID0gRy5nZW4xO1xyXG4gICAgICAgIGNvbnN0IGcyID0gRy5nZW4yO1xyXG4gICAgICAgIGNvbnN0IGUgPSBHLnBhaXI7XHJcbiAgICAgICAgY29uc3QgbyA9IEcub3JkZXI7XHJcblxyXG4gICAgICAgIHJldHVybiBbRywgbywgZzEsIGcyLCBlXVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBrZXlnZW4ocGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcblxyXG4gICAgICAgIC8vIFRhcmdldCB2YWx1ZXM6XHJcbiAgICAgICAgY29uc3QgeCA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xyXG4gICAgICAgIGNvbnN0IHkgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2sgPSBbeCwgeV07XHJcbiAgICAgICAgY29uc3QgcGsgPSBbZzIsIEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgpLCBHLmN0eC5QQUlSLkcybXVsKGcyLCB5KV07XHJcblxyXG4gICAgICAgIHJldHVybiBbc2ssIHBrXVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHNpZyA9ICh4K3kqbSkgKiBoXHJcbiAgICBzdGF0aWMgc2lnbihwYXJhbXMsIHNrLCBtKSB7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gc2s7XHJcblxyXG4gICAgICAgIGNvbnN0IHJhbmQgPSBHLmN0eC5CSUcucmFuZG9tbnVtKG8sIEcucm5nR2VuKTtcclxuICAgICAgICBjb25zdCBoID0gRy5jdHguUEFJUi5HMW11bChnMSwgcmFuZCk7XHJcblxyXG4gICAgICAgIC8vIG1jcHkgPSBtIG1vZCBwXHJcbiAgICAgICAgY29uc3QgbWNweSA9IG5ldyBHLmN0eC5CSUcobSk7XHJcbiAgICAgICAgbWNweS5tb2Qobyk7XHJcblxyXG4gICAgICAgIC8vIHQxID0geSAqIChtIG1vZCBwKVxyXG4gICAgICAgIGNvbnN0IHQxID0gRy5jdHguQklHLm11bCh5LG1jcHkpO1xyXG5cclxuICAgICAgICAvLyBEQklHIGNvbnN0cnVjdG9yIGRvZXMgbm90IGFsbG93IHRvIHBhc3MgaXQgYSBCSUcgdmFsdWUgaGVuY2Ugd2UgY29weSBhbGwgd29yZCB2YWx1ZXMgbWFudWFsbHlcclxuICAgICAgICBjb25zdCB4REJJRyA9ICBuZXcgRy5jdHguREJJRygwKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IEcuY3R4LkJJRy5OTEVOOyBpKyspIHtcclxuICAgICAgICAgICAgeERCSUcud1tpXSA9IHgud1tpXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHQxID0geCArIHkgKiAobSBtb2QgcClcclxuICAgICAgICB0MS5hZGQoeERCSUcpO1xyXG5cclxuICAgICAgICAvLyBLID0gKHggKyB5ICogKG0gbW9kIHApKSBtb2QgcFxyXG4gICAgICAgIGNvbnN0IEsgPSB0MS5tb2Qobyk7XHJcblxyXG4gICAgICAgIC8vIHNpZyA9IEsgKiBoXHJcbiAgICAgICAgY29uc3Qgc2lnID0gRy5jdHguUEFJUi5HMW11bChoLCBLKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtoLCBzaWddXHJcbiAgICB9XHJcblxyXG4gICAgLy8gIGUoc2lnMSwgWCArIG0gKiBZKSA9PSBlKHNpZzIsIGcpXHJcbiAgICBzdGF0aWMgdmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZykge1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IFtnLCBYLCBZXSA9IHBrO1xyXG4gICAgICAgIGNvbnN0IFtzaWcxLCBzaWcyXSA9IHNpZztcclxuXHJcbiAgICAgICAgY29uc3QgRzJfdG1wMSA9IEcuY3R4LlBBSVIuRzJtdWwoWSwgbSk7XHJcbiAgICAgICAgRzJfdG1wMS5hZGQoWCk7XHJcbiAgICAgICAgRzJfdG1wMS5hZmZpbmUoKTtcclxuXHJcbiAgICAgICAgY29uc3QgR3RfMSA9IGUoc2lnMSwgRzJfdG1wMSk7XHJcbiAgICAgICAgY29uc3QgR3RfMiA9IGUoc2lnMiwgZyk7XHJcblxyXG4gICAgICAgIHJldHVybiAhc2lnLklORiAmJiBHdF8xLmVxdWFscyhHdF8yKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmFuZG9taXplKHBhcmFtcywgc2lnKSB7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3NpZzEsIHNpZzJdID0gc2lnO1xyXG4gICAgICAgIGNvbnN0IHQgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtHLmN0eC5QQUlSLkcxbXVsKHNpZzEsIHQpLCBHLmN0eC5QQUlSLkcxbXVsKHNpZzIsIHQpXVxyXG4gICAgfVxyXG59XHJcbiJdfQ==