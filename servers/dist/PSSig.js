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

                        return !sig2.INF && Gt_1.equals(Gt_2);
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
                        aggregateSignature.copy(signatures[0][1]);

                        for (var i = 1; i < signatures.length; i++) {
                                aggregateSignature.add(signatures[i][1]);
                        }

                        aggregateSignature.affine();
                        return [signatures[0][0], aggregateSignature]; // so returns H(m), Sa
                }
        }, {
                key: "verifyAggregation",
                value: function verifyAggregation(params, pks, m, aggregateSignature) {
                        var _params6 = _slicedToArray(params, 5),
                            G = _params6[0],
                            o = _params6[1],
                            g1 = _params6[2],
                            g2 = _params6[3],
                            e = _params6[4];

                        var _aggregateSignature = _slicedToArray(aggregateSignature, 2),
                            h = _aggregateSignature[0],
                            aggregateSign = _aggregateSignature[1];

                        var Gt_1 = e(aggregateSign, g2);

                        m = G.hashToBIG(m);
                        var aggregate = new G.ctx.ECP2();

                        for (var i = 0; i < pks.length; i++) {
                                var _pks$i = _slicedToArray(pks[i], 3),
                                    g = _pks$i[0],
                                    X = _pks$i[1],
                                    Y = _pks$i[2];

                                var G2_tmp = G.ctx.PAIR.G2mul(Y, m);
                                G2_tmp.add(X);
                                G2_tmp.affine();
                                if (i == 0) {
                                        aggregate.copy(G2_tmp);
                                } else {
                                        aggregate.add(G2_tmp);
                                }
                        }
                        aggregate.affine();
                        var Gt_2 = e(h, aggregate);

                        return Gt_1.equals(Gt_2);
                }
        }]);

        return PSSig;
}();

exports.default = PSSig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QU1NpZy5qcyJdLCJuYW1lcyI6WyJQU1NpZyIsIkciLCJnMSIsImdlbjEiLCJnMiIsImdlbjIiLCJlIiwicGFpciIsIm8iLCJvcmRlciIsInBhcmFtcyIsIngiLCJjdHgiLCJCSUciLCJyYW5kb21udW0iLCJybmdHZW4iLCJ5Iiwic2siLCJwayIsIlBBSVIiLCJHMm11bCIsIm0iLCJpc01lc3NhZ2VIYXNoZWQiLCJoIiwiaGFzaFRvUG9pbnRPbkN1cnZlIiwiaGFzaFRvQklHIiwibWNweSIsIm1vZCIsInQxIiwibXVsIiwieERCSUciLCJEQklHIiwiaSIsIk5MRU4iLCJ3IiwiYWRkIiwiSyIsInNpZyIsIkcxbXVsIiwiZyIsIlgiLCJZIiwic2lnMSIsInNpZzIiLCJHMl90bXAxIiwiYWZmaW5lIiwiR3RfMSIsIkd0XzIiLCJJTkYiLCJlcXVhbHMiLCJ0Iiwic2lnbmF0dXJlcyIsImFnZ3JlZ2F0ZVNpZ25hdHVyZSIsIkVDUCIsImNvcHkiLCJsZW5ndGgiLCJwa3MiLCJhZ2dyZWdhdGVTaWduIiwiYWdncmVnYXRlIiwiRUNQMiIsIkcyX3RtcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztJQUVxQkEsSzs7Ozs7Ozt3Q0FFRjtBQUNYLDRCQUFNQyxJQUFJLHVCQUFWOztBQUVBLDRCQUFNQyxLQUFLRCxFQUFFRSxJQUFiO0FBQ0EsNEJBQU1DLEtBQUtILEVBQUVJLElBQWI7QUFDQSw0QkFBTUMsSUFBSUwsRUFBRU0sSUFBWjtBQUNBLDRCQUFNQyxJQUFJUCxFQUFFUSxLQUFaOztBQUVBLCtCQUFPLENBQUNSLENBQUQsRUFBSU8sQ0FBSixFQUFPTixFQUFQLEVBQVdFLEVBQVgsRUFBZUUsQ0FBZixDQUFQO0FBQ0g7Ozt1Q0FFYUksTSxFQUFRO0FBQUEscURBQ1FBLE1BRFI7QUFBQSw0QkFDWFQsQ0FEVztBQUFBLDRCQUNSTyxDQURRO0FBQUEsNEJBQ0xOLEVBREs7QUFBQSw0QkFDREUsRUFEQztBQUFBLDRCQUNHRSxDQURIOztB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LG9DQUN0QkMsQ0FEc0I7O0FBRWpDLG9DQUFJbUIsU0FBUzNELEVBQUVXLEdBQUYsQ0FBTU8sSUFBTixDQUFXQyxLQUFYLENBQWlCcUIsQ0FBakIsRUFBb0JwQixDQUFwQixDQUFiO0FBQ0F1Qyx1Q0FBT3pCLEdBQVAsQ0FBV0ssQ0FBWDtBQUNBb0IsdUNBQU9mLE1BQVA7QUFDQSxvQ0FBR2IsS0FBSyxDQUFSLEVBQVc7QUFDUDBCLGtEQUFVSixJQUFWLENBQWVNLE1BQWY7QUFDSCxpQ0FGRCxNQUdLO0FBQ0RGLGtEQUFVdkIsR0FBVixDQUFjeUIsTUFBZDtBQUNIO0FBRUo7QUFDREYsa0NBQVViLE1BQVY7QUFDQSw0QkFBTUUsT0FBT3pDLEVBQUVpQixDQUFGLEVBQUttQyxTQUFMLENBQWI7O0FBRUEsK0JBQU9aLEtBQUtHLE1BQUwsQ0FBWUYsSUFBWixDQUFQO0FBQ0g7Ozs7OztrQkF0SWdCL0MsSyIsImZpbGUiOiJQU1NpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCcEdyb3VwIGZyb20gXCIuL0JwR3JvdXBcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUFNTaWcge1xyXG5cclxuICAgIHN0YXRpYyBzZXR1cCgpIHtcclxuICAgICAgICBjb25zdCBHID0gbmV3IEJwR3JvdXAoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZzEgPSBHLmdlbjE7XHJcbiAgICAgICAgY29uc3QgZzIgPSBHLmdlbjI7XHJcbiAgICAgICAgY29uc3QgZSA9IEcucGFpcjtcclxuICAgICAgICBjb25zdCBvID0gRy5vcmRlcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtHLCBvLCBnMSwgZzIsIGVdXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGtleWdlbihwYXJhbXMpIHtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuXHJcbiAgICAgICAgLy8gVGFyZ2V0IHZhbHVlczpcclxuICAgICAgICBjb25zdCB4ID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XHJcbiAgICAgICAgY29uc3QgeSA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xyXG5cclxuICAgICAgICBjb25zdCBzayA9IFt4LCB5XTtcclxuICAgICAgICBjb25zdCBwayA9IFtnMiwgRy5jdHguUEFJUi5HMm11bChnMiwgeCksIEcuY3R4LlBBSVIuRzJtdWwoZzIsIHkpXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtzaywgcGtdXHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2lnID0gKHgreSptKSAqIGhcclxuICAgIHN0YXRpYyBzaWduKHBhcmFtcywgc2ssIG0sIGlzTWVzc2FnZUhhc2hlZCA9IGZhbHNlKSB7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gc2s7XHJcblxyXG4gICAgICAgIC8vIFJBTkRPTSBoOlxyXG4gICAgICAgIC8vIGNvbnN0IHJhbmQgPSBHLmN0eC5CSUcucmFuZG9tbnVtKG8sIEcucm5nR2VuKTtcclxuICAgICAgICAvLyBjb25zdCBoID0gRy5jdHguUEFJUi5HMW11bChnMSwgcmFuZCk7XHJcblxyXG4gICAgICAgIC8vIGggYmVpbmcgaGFzaCBvZiBtZXNzYWdlIHRvIHBvaW50IG9uIHRoZSBjdXJ2ZVxyXG4gICAgICAgIGNvbnN0IGggPSBHLmhhc2hUb1BvaW50T25DdXJ2ZShtKTtcclxuXHJcbiAgICAgICAgaWYgKCFpc01lc3NhZ2VIYXNoZWQpIHtcclxuICAgICAgICAgICAgbSA9IEcuaGFzaFRvQklHKG0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbWNweSA9IG0gbW9kIHBcclxuICAgICAgICBjb25zdCBtY3B5ID0gbmV3IEcuY3R4LkJJRyhtKTtcclxuICAgICAgICBtY3B5Lm1vZChvKTtcclxuXHJcbiAgICAgICAgLy8gdDEgPSB5ICogKG0gbW9kIHApXHJcbiAgICAgICAgY29uc3QgdDEgPSBHLmN0eC5CSUcubXVsKHksIG1jcHkpO1xyXG5cclxuICAgICAgICAvLyBEQklHIGNvbnN0cnVjdG9yIGRvZXMgbm90IGFsbG93IHRvIHBhc3MgaXQgYSBCSUcgdmFsdWUgaGVuY2Ugd2UgY29weSBhbGwgd29yZCB2YWx1ZXMgbWFudWFsbHlcclxuICAgICAgICBjb25zdCB4REJJRyA9IG5ldyBHLmN0eC5EQklHKDApO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgRy5jdHguQklHLk5MRU47IGkrKykge1xyXG4gICAgICAgICAgICB4REJJRy53W2ldID0geC53W2ldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdDEgPSB4ICsgeSAqIChtIG1vZCBwKVxyXG4gICAgICAgIHQxLmFkZCh4REJJRyk7XHJcblxyXG4gICAgICAgIC8vIEsgPSAoeCArIHkgKiAobSBtb2QgcCkpIG1vZCBwXHJcbiAgICAgICAgY29uc3QgSyA9IHQxLm1vZChvKTtcclxuXHJcbiAgICAgICAgLy8gc2lnID0gSyAqIGhcclxuICAgICAgICBjb25zdCBzaWcgPSBHLmN0eC5QQUlSLkcxbXVsKGgsIEspO1xyXG5cclxuICAgICAgICByZXR1cm4gW2gsIHNpZ11cclxuICAgIH1cclxuXHJcbiAgICAvLyAgZShzaWcxLCBYICsgbSAqIFkpID09IGUoc2lnMiwgZylcclxuICAgIHN0YXRpYyB2ZXJpZnkocGFyYW1zLCBwaywgbSwgc2lnKSB7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW2csIFgsIFldID0gcGs7XHJcbiAgICAgICAgY29uc3QgW3NpZzEsIHNpZzJdID0gc2lnO1xyXG5cclxuICAgICAgICBtID0gRy5oYXNoVG9CSUcobSk7XHJcblxyXG4gICAgICAgIGNvbnN0IEcyX3RtcDEgPSBHLmN0eC5QQUlSLkcybXVsKFksIG0pO1xyXG4gICAgICAgIEcyX3RtcDEuYWRkKFgpO1xyXG4gICAgICAgIEcyX3RtcDEuYWZmaW5lKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IEd0XzEgPSBlKHNpZzEsIEcyX3RtcDEpO1xyXG4gICAgICAgIGNvbnN0IEd0XzIgPSBlKHNpZzIsIGcpO1xyXG5cclxuICAgICAgICByZXR1cm4gIXNpZzIuSU5GICYmIEd0XzEuZXF1YWxzKEd0XzIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByYW5kb21pemUocGFyYW1zLCBzaWcpIHtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBbc2lnMSwgc2lnMl0gPSBzaWc7XHJcbiAgICAgICAgY29uc3QgdCA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xyXG5cclxuICAgICAgICByZXR1cm4gW0cuY3R4LlBBSVIuRzFtdWwoc2lnMSwgdCksIEcuY3R4LlBBSVIuRzFtdWwoc2lnMiwgdCldXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHN0YXRpYyBhZ2dyZWdhdGVTaWduYXR1cmVzKHBhcmFtcywgc2lnbmF0dXJlcykge1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgICAgICBsZXQgYWdncmVnYXRlU2lnbmF0dXJlID0gbmV3IEcuY3R4LkVDUCgpO1xyXG4gICAgICAgIGFnZ3JlZ2F0ZVNpZ25hdHVyZS5jb3B5KHNpZ25hdHVyZXNbMF1bMV0pO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNpZ25hdHVyZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgYWdncmVnYXRlU2lnbmF0dXJlLmFkZChzaWduYXR1cmVzW2ldWzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFnZ3JlZ2F0ZVNpZ25hdHVyZS5hZmZpbmUoKTtcclxuICAgICAgICByZXR1cm4gW3NpZ25hdHVyZXNbMF1bMF0sIGFnZ3JlZ2F0ZVNpZ25hdHVyZV07IC8vIHNvIHJldHVybnMgSChtKSwgU2FcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdmVyaWZ5QWdncmVnYXRpb24ocGFyYW1zLCBwa3MsIG0sIGFnZ3JlZ2F0ZVNpZ25hdHVyZSkge1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IFtoLCBhZ2dyZWdhdGVTaWduXSA9IGFnZ3JlZ2F0ZVNpZ25hdHVyZTtcclxuXHJcbiAgICAgICAgY29uc3QgR3RfMSA9IGUoYWdncmVnYXRlU2lnbiwgZzIpO1xyXG5cclxuICAgICAgICBtID0gRy5oYXNoVG9CSUcobSk7XHJcbiAgICAgICAgbGV0IGFnZ3JlZ2F0ZSA9IG5ldyBHLmN0eC5FQ1AyKCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGtzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBbZywgWCwgWV0gPSBwa3NbaV07XHJcbiAgICAgICAgICAgIGxldCBHMl90bXAgPSBHLmN0eC5QQUlSLkcybXVsKFksIG0pO1xyXG4gICAgICAgICAgICBHMl90bXAuYWRkKFgpO1xyXG4gICAgICAgICAgICBHMl90bXAuYWZmaW5lKCk7XHJcbiAgICAgICAgICAgIGlmKGkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgYWdncmVnYXRlLmNvcHkoRzJfdG1wKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWdncmVnYXRlLmFkZChHMl90bXApXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFnZ3JlZ2F0ZS5hZmZpbmUoKTtcclxuICAgICAgICBjb25zdCBHdF8yID0gZShoLCBhZ2dyZWdhdGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gR3RfMS5lcXVhbHMoR3RfMik7XHJcbiAgICB9XHJcbn1cclxuIl19