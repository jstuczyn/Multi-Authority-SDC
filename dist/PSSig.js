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
                        var isMessageHashed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

                        var _params2 = _slicedToArray(params, 5),
                            G = _params2[0],
                            o = _params2[1],
                            g1 = _params2[2],
                            g2 = _params2[3],
                            e = _params2[4];

                        var _sk = _slicedToArray(sk, 2),
                            x = _sk[0],
                            y = _sk[1];

                        // RANDOM h:
                        // const rand = G.ctx.BIG.randomnum(o, G.rngGen);
                        // const h = G.ctx.PAIR.G1mul(g1, rand);

                        // h being hash of message to point on the curve


                        var h = G.hashToPointOnCurve(m);

                        if (!isMessageHashed) {
                                m = G.hashToBIG(m);
                        }

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

                        m = G.hashToBIG(m);

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

                // todo ensure all messages are distinct

        }, {
                key: "aggregateSignatures",
                value: function aggregateSignatures(params, signatures) {
                        var _params5 = _slicedToArray(params, 5),
                            G = _params5[0],
                            o = _params5[1],
                            g1 = _params5[2],
                            g2 = _params5[3],
                            e = _params5[4];

                        var aggregateSignature = new G.ctx.ECP();
                        aggregateSignature.copy(signatures[0]);

                        for (var i = 1; i < signatures.length; i++) {
                                aggregateSignature.add(signatures[1]);
                        }
                        return aggregateSignature;
                }
        }, {
                key: "verifyAggregation",
                value: function verifyAggregation(params, pks, ms, aggregateSignature) {
                        var _params6 = _slicedToArray(params, 5),
                            G = _params6[0],
                            o = _params6[1],
                            g1 = _params6[2],
                            g2 = _params6[3],
                            e = _params6[4];

                        if (new Set(ms).size !== ms.length) {
                                return false; // messages are not distinct
                        }

                        var Gt_1 = e(aggregateSignature, g2);

                        var pairings = [];
                        for (var i = 0; i < ms.length; i++) {
                                var h = G.hashToPointOnCurve(ms[i]);

                                var _pks$i = _slicedToArray(pks[i], 3),
                                    g = _pks$i[0],
                                    X = _pks$i[1],
                                    Y = _pks$i[2];

                                var m = G.hashToBIG(ms[i]); // replace with the other hash?

                                var G2_tmp1 = G.ctx.PAIR.G2mul(Y, m);
                                G2_tmp1.add(X);
                                G2_tmp1.affine();

                                var Gt_2 = e(h, G2_tmp1);

                                pairings.push(Gt_2);
                        }

                        var aggregatePairing = new G.ctx.FP12(pairings[0]);

                        for (var _i = 1; _i < pairings.length; _i++) {
                                // pairings[0].mul(pairings[i]);
                                // operation was not explicitly defined but I assume it follows same pattern as FP4, FP2 and FP addition
                                aggregatePairing.a.add(pairings[_i].a);
                                aggregatePairing.b.add(pairings[_i].b);
                                aggregatePairing.c.add(pairings[_i].c);
                        }

                        return Gt_1.equals(aggregatePairing);
                }
        }]);

        return PSSig;
}();

exports.default = PSSig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QU1NpZy5qcyJdLCJuYW1lcyI6WyJQU1NpZyIsIkciLCJnMSIsImdlbjEiLCJnMiIsImdlbjIiLCJlIiwicGFpciIsIm8iLCJvcmRlciIsInBhcmFtcyIsIngiLCJjdHgiLCJCSUciLCJyYW5kb21udW0iLCJybmdHZW4iLCJ5Iiwic2siLCJwayIsIlBBSVIiLCJHMm11bCIsIm0iLCJpc01lc3NhZ2VIYXNoZWQiLCJoIiwiaGFzaFRvUG9pbnRPbkN1cnZlIiwiaGFzaFRvQklHIiwibWNweSIsIm1vZCIsInQxIiwibXVsIiwieERCSUciLCJEQklHIiwiaSIsIk5MRU4iLCJ3IiwiYWRkIiwiSyIsInNpZyIsIkcxbXVsIiwiZyIsIlgiLCJZIiwic2lnMSIsInNpZzIiLCJHMl90bXAxIiwiYWZmaW5lIiwiR3RfMSIsIkd0XzIiLCJJTkYiLCJlcXVhbHMiLCJ0Iiwic2lnbmF0dXJlcyIsImFnZ3JlZ2F0ZVNpZ25hdHVyZSIsIkVDUCIsImNvcHkiLCJsZW5ndGgiLCJwa3MiLCJtcyIsIlNldCIsInNpemUiLCJwYWlyaW5ncyIsInB1c2giLCJhZ2dyZWdhdGVQYWlyaW5nIiwiRlAxMiIsImEiLCJiIiwiYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztJQUVxQkEsSzs7Ozs7Ozt3Q0FFRjtBQUNYLDRCQUFNQyxJQUFJLHVCQUFWOztBQUVBLDRCQUFNQyxLQUFLRCxFQUFFRSxJQUFiO0FBQ0EsNEJBQU1DLEtBQUtILEVBQUVJLElBQWI7QUFDQSw0QkFBTUMsSUFBSUwsRUFBRU0sSUFBWjtBQUNBLDRCQUFNQyxJQUFJUCxFQUFFUSxLQUFaOztBQUVBLCtCQUFPLENBQUNSLENBQUQsRUFBSU8sQ0FBSixFQUFPTixFQUFQLEVBQVdFLEVBQVgsRUFBZUUsQ0FBZixDQUFQO0FBQ0g7Ozt1Q0FFYUksTSxFQUFRO0FBQUEscURBQ1FBLE1BRFI7QUFBQSw0QkFDWFQsQ0FEVztBQUFBLDRCQUNSTyxDQURRO0FBQUEsNEJBQ0xOLEVBREs7QUFBQSw0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cEIsSUFBSXBCLEVBQUV3QixTQUFGLENBQVlnQyxHQUFHekIsQ0FBSCxDQUFaLENBQVIsQ0FKK0IsQ0FJSDs7QUFFNUIsb0NBQU1ZLFVBQVUzQyxFQUFFVyxHQUFGLENBQU1PLElBQU4sQ0FBV0MsS0FBWCxDQUFpQnFCLENBQWpCLEVBQW9CcEIsQ0FBcEIsQ0FBaEI7QUFDQXVCLHdDQUFRVCxHQUFSLENBQVlLLENBQVo7QUFDQUksd0NBQVFDLE1BQVI7O0FBRUEsb0NBQU1FLE9BQU96QyxFQUFFaUIsQ0FBRixFQUFLcUIsT0FBTCxDQUFiOztBQUVBZ0IseUNBQVNDLElBQVQsQ0FBY2QsSUFBZDtBQUNIOztBQUVELDRCQUFJZSxtQkFBbUIsSUFBSTdELEVBQUVXLEdBQUYsQ0FBTW1ELElBQVYsQ0FBZUgsU0FBUyxDQUFULENBQWYsQ0FBdkI7O0FBRUEsNkJBQUksSUFBSTVCLEtBQUksQ0FBWixFQUFlQSxLQUFJNEIsU0FBU0wsTUFBNUIsRUFBb0N2QixJQUFwQyxFQUF5QztBQUNyQztBQUNBO0FBQ0E4QixpREFBaUJFLENBQWpCLENBQW1CN0IsR0FBbkIsQ0FBdUJ5QixTQUFTNUIsRUFBVCxFQUFZZ0MsQ0FBbkM7QUFDQUYsaURBQWlCRyxDQUFqQixDQUFtQjlCLEdBQW5CLENBQXVCeUIsU0FBUzVCLEVBQVQsRUFBWWlDLENBQW5DO0FBQ0FILGlEQUFpQkksQ0FBakIsQ0FBbUIvQixHQUFuQixDQUF1QnlCLFNBQVM1QixFQUFULEVBQVlrQyxDQUFuQztBQUVIOztBQUVELCtCQUFPcEIsS0FBS0csTUFBTCxDQUFZYSxnQkFBWixDQUFQO0FBS0g7Ozs7OztrQkFwSmdCOUQsSyIsImZpbGUiOiJQU1NpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCcEdyb3VwIGZyb20gXCIuL0JwR3JvdXBcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUFNTaWcge1xyXG5cclxuICAgIHN0YXRpYyBzZXR1cCgpIHtcclxuICAgICAgICBjb25zdCBHID0gbmV3IEJwR3JvdXAoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZzEgPSBHLmdlbjE7XHJcbiAgICAgICAgY29uc3QgZzIgPSBHLmdlbjI7XHJcbiAgICAgICAgY29uc3QgZSA9IEcucGFpcjtcclxuICAgICAgICBjb25zdCBvID0gRy5vcmRlcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtHLCBvLCBnMSwgZzIsIGVdXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGtleWdlbihwYXJhbXMpIHtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuXHJcbiAgICAgICAgLy8gVGFyZ2V0IHZhbHVlczpcclxuICAgICAgICBjb25zdCB4ID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XHJcbiAgICAgICAgY29uc3QgeSA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xyXG5cclxuICAgICAgICBjb25zdCBzayA9IFt4LCB5XTtcclxuICAgICAgICBjb25zdCBwayA9IFtnMiwgRy5jdHguUEFJUi5HMm11bChnMiwgeCksIEcuY3R4LlBBSVIuRzJtdWwoZzIsIHkpXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtzaywgcGtdXHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2lnID0gKHgreSptKSAqIGhcclxuICAgIHN0YXRpYyBzaWduKHBhcmFtcywgc2ssIG0sIGlzTWVzc2FnZUhhc2hlZCA9IGZhbHNlKSB7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gc2s7XHJcblxyXG4gICAgICAgIC8vIFJBTkRPTSBoOlxyXG4gICAgICAgIC8vIGNvbnN0IHJhbmQgPSBHLmN0eC5CSUcucmFuZG9tbnVtKG8sIEcucm5nR2VuKTtcclxuICAgICAgICAvLyBjb25zdCBoID0gRy5jdHguUEFJUi5HMW11bChnMSwgcmFuZCk7XHJcblxyXG4gICAgICAgIC8vIGggYmVpbmcgaGFzaCBvZiBtZXNzYWdlIHRvIHBvaW50IG9uIHRoZSBjdXJ2ZVxyXG4gICAgICAgIGNvbnN0IGggPSBHLmhhc2hUb1BvaW50T25DdXJ2ZShtKTtcclxuXHJcbiAgICAgICAgaWYoIWlzTWVzc2FnZUhhc2hlZCkge1xyXG4gICAgICAgICAgICBtID0gRy5oYXNoVG9CSUcobSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBtY3B5ID0gbSBtb2QgcFxyXG4gICAgICAgIGNvbnN0IG1jcHkgPSBuZXcgRy5jdHguQklHKG0pO1xyXG4gICAgICAgIG1jcHkubW9kKG8pO1xyXG5cclxuICAgICAgICAvLyB0MSA9IHkgKiAobSBtb2QgcClcclxuICAgICAgICBjb25zdCB0MSA9IEcuY3R4LkJJRy5tdWwoeSxtY3B5KTtcclxuXHJcbiAgICAgICAgLy8gREJJRyBjb25zdHJ1Y3RvciBkb2VzIG5vdCBhbGxvdyB0byBwYXNzIGl0IGEgQklHIHZhbHVlIGhlbmNlIHdlIGNvcHkgYWxsIHdvcmQgdmFsdWVzIG1hbnVhbGx5XHJcbiAgICAgICAgY29uc3QgeERCSUcgPSAgbmV3IEcuY3R4LkRCSUcoMCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBHLmN0eC5CSUcuTkxFTjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHhEQklHLndbaV0gPSB4LndbaV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0MSA9IHggKyB5ICogKG0gbW9kIHApXHJcbiAgICAgICAgdDEuYWRkKHhEQklHKTtcclxuXHJcbiAgICAgICAgLy8gSyA9ICh4ICsgeSAqIChtIG1vZCBwKSkgbW9kIHBcclxuICAgICAgICBjb25zdCBLID0gdDEubW9kKG8pO1xyXG5cclxuICAgICAgICAvLyBzaWcgPSBLICogaFxyXG4gICAgICAgIGNvbnN0IHNpZyA9IEcuY3R4LlBBSVIuRzFtdWwoaCwgSyk7XHJcblxyXG4gICAgICAgIHJldHVybiBbaCwgc2lnXVxyXG4gICAgfVxyXG5cclxuICAgIC8vICBlKHNpZzEsIFggKyBtICogWSkgPT0gZShzaWcyLCBnKVxyXG4gICAgc3RhdGljIHZlcmlmeShwYXJhbXMsIHBrLCBtLCBzaWcpIHtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBbZywgWCwgWV0gPSBwaztcclxuICAgICAgICBjb25zdCBbc2lnMSwgc2lnMl0gPSBzaWc7XHJcblxyXG4gICAgICAgIG0gPSBHLmhhc2hUb0JJRyhtKTtcclxuXHJcbiAgICAgICAgY29uc3QgRzJfdG1wMSA9IEcuY3R4LlBBSVIuRzJtdWwoWSwgbSk7XHJcbiAgICAgICAgRzJfdG1wMS5hZGQoWCk7XHJcbiAgICAgICAgRzJfdG1wMS5hZmZpbmUoKTtcclxuXHJcbiAgICAgICAgY29uc3QgR3RfMSA9IGUoc2lnMSwgRzJfdG1wMSk7XHJcbiAgICAgICAgY29uc3QgR3RfMiA9IGUoc2lnMiwgZyk7XHJcblxyXG4gICAgICAgIHJldHVybiAhc2lnLklORiAmJiBHdF8xLmVxdWFscyhHdF8yKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmFuZG9taXplKHBhcmFtcywgc2lnKSB7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3NpZzEsIHNpZzJdID0gc2lnO1xyXG4gICAgICAgIGNvbnN0IHQgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtHLmN0eC5QQUlSLkcxbXVsKHNpZzEsIHQpLCBHLmN0eC5QQUlSLkcxbXVsKHNpZzIsIHQpXVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyB0b2RvIGVuc3VyZSBhbGwgbWVzc2FnZXMgYXJlIGRpc3RpbmN0XHJcbiAgICBzdGF0aWMgYWdncmVnYXRlU2lnbmF0dXJlcyhwYXJhbXMsIHNpZ25hdHVyZXMpIHtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuXHJcbiAgICAgICAgbGV0IGFnZ3JlZ2F0ZVNpZ25hdHVyZSA9IG5ldyBHLmN0eC5FQ1AoKTtcclxuICAgICAgICBhZ2dyZWdhdGVTaWduYXR1cmUuY29weShzaWduYXR1cmVzWzBdKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8IHNpZ25hdHVyZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgYWdncmVnYXRlU2lnbmF0dXJlLmFkZChzaWduYXR1cmVzWzFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFnZ3JlZ2F0ZVNpZ25hdHVyZTtcclxuICAgIH1cclxuXHJcbiAgIHN0YXRpYyB2ZXJpZnlBZ2dyZWdhdGlvbihwYXJhbXMsIHBrcywgbXMsIGFnZ3JlZ2F0ZVNpZ25hdHVyZSkge1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgICAgICBpZiAoKG5ldyBTZXQobXMpKS5zaXplICE9PSBtcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBtZXNzYWdlcyBhcmUgbm90IGRpc3RpbmN0XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBHdF8xID0gZShhZ2dyZWdhdGVTaWduYXR1cmUsIGcyKTtcclxuXHJcbiAgICAgICAgbGV0IHBhaXJpbmdzID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBoID0gRy5oYXNoVG9Qb2ludE9uQ3VydmUobXNbaV0pO1xyXG4gICAgICAgICAgICBsZXQgW2csIFgsIFldID0gcGtzW2ldO1xyXG5cclxuICAgICAgICAgICAgbGV0IG0gPSBHLmhhc2hUb0JJRyhtc1tpXSk7IC8vIHJlcGxhY2Ugd2l0aCB0aGUgb3RoZXIgaGFzaD9cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IEcyX3RtcDEgPSBHLmN0eC5QQUlSLkcybXVsKFksIG0pO1xyXG4gICAgICAgICAgICBHMl90bXAxLmFkZChYKTtcclxuICAgICAgICAgICAgRzJfdG1wMS5hZmZpbmUoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IEd0XzIgPSBlKGgsIEcyX3RtcDEpO1xyXG5cclxuICAgICAgICAgICAgcGFpcmluZ3MucHVzaChHdF8yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBhZ2dyZWdhdGVQYWlyaW5nID0gbmV3IEcuY3R4LkZQMTIocGFpcmluZ3NbMF0pO1xyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDwgcGFpcmluZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLy8gcGFpcmluZ3NbMF0ubXVsKHBhaXJpbmdzW2ldKTtcclxuICAgICAgICAgICAgLy8gb3BlcmF0aW9uIHdhcyBub3QgZXhwbGljaXRseSBkZWZpbmVkIGJ1dCBJIGFzc3VtZSBpdCBmb2xsb3dzIHNhbWUgcGF0dGVybiBhcyBGUDQsIEZQMiBhbmQgRlAgYWRkaXRpb25cclxuICAgICAgICAgICAgYWdncmVnYXRlUGFpcmluZy5hLmFkZChwYWlyaW5nc1tpXS5hKTtcclxuICAgICAgICAgICAgYWdncmVnYXRlUGFpcmluZy5iLmFkZChwYWlyaW5nc1tpXS5iKTtcclxuICAgICAgICAgICAgYWdncmVnYXRlUGFpcmluZy5jLmFkZChwYWlyaW5nc1tpXS5jKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gR3RfMS5lcXVhbHMoYWdncmVnYXRlUGFpcmluZyk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiJdfQ==