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
                        var isMessageHashed = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

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

                        if (!isMessageHashed) {
                                m = G.hashToBIG(m);
                        }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QU1NpZy5qcyJdLCJuYW1lcyI6WyJQU1NpZyIsIkciLCJnMSIsImdlbjEiLCJnMiIsImdlbjIiLCJlIiwicGFpciIsIm8iLCJvcmRlciIsInBhcmFtcyIsIngiLCJjdHgiLCJCSUciLCJyYW5kb21udW0iLCJybmdHZW4iLCJ5Iiwic2siLCJwayIsIlBBSVIiLCJHMm11bCIsIm0iLCJpc01lc3NhZ2VIYXNoZWQiLCJoIiwiaGFzaFRvUG9pbnRPbkN1cnZlIiwiaGFzaFRvQklHIiwibWNweSIsIm1vZCIsInQxIiwibXVsIiwieERCSUciLCJEQklHIiwiaSIsIk5MRU4iLCJ3IiwiYWRkIiwiSyIsInNpZyIsIkcxbXVsIiwiZyIsIlgiLCJZIiwic2lnMSIsInNpZzIiLCJHMl90bXAxIiwiYWZmaW5lIiwiR3RfMSIsIkd0XzIiLCJJTkYiLCJlcXVhbHMiLCJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7O0lBRXFCQSxLOzs7Ozs7O3dDQUVGO0FBQ1gsNEJBQU1DLElBQUksdUJBQVY7O0FBRUEsNEJBQU1DLEtBQUtELEVBQUVFLElBQWI7QUFDQSw0QkFBTUMsS0FBS0gsRUFBRUksSUFBYjtBQUNBLDRCQUFNQyxJQUFJTCxFQUFFTSxJQUFaO0FBQ0EsNEJBQU1DLElBQUlQLEVBQUVRLEtBQVo7O0FBRUEsK0JBQU8sQ0FBQ1IsQ0FBRCxFQUFJTyxDQUFKLEVBQU9OLEVBQVAsRUFBV0UsRUFBWCxFQUFlRSxDQUFmLENBQVA7QUFDSDs7O3VDQUVhSSxNLEVBQVE7QUFBQSxxREFDUUEsTUFEUjtBQUFBLDRCQUNYVCxDQURXO0FBQUEsNEJBQ1JPLENBRFE7QUFBQSw0QkFDTE4sRUFESztBQUFBLDRCQUNERSxFQURDO0FBQUEsNEJBQ0dFLENBREg7O0FBR2xCOzs7QUFDQSw0QkFBTUssSUFBSVYsRUFBRVcsR0FBRixDQUFNQyxHQUFOLENBQVVDLFNBQVYsQ0FBb0JiLEVBQUVRLEtBQXRCLEVBQTZCUixFQUFFYyxNQUEvQixDQUFWO0FBQ0Es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SDs7QUFFRCw0QkFBTXVCLFVBQVUzQyxFQUFFVyxHQUFGLENBQU1PLElBQU4sQ0FBV0MsS0FBWCxDQUFpQnFCLENBQWpCLEVBQW9CcEIsQ0FBcEIsQ0FBaEI7QUFDQXVCLGdDQUFRVCxHQUFSLENBQVlLLENBQVo7QUFDQUksZ0NBQVFDLE1BQVI7O0FBRUEsNEJBQU1DLE9BQU94QyxFQUFFb0MsSUFBRixFQUFRRSxPQUFSLENBQWI7QUFDQSw0QkFBTUcsT0FBT3pDLEVBQUVxQyxJQUFGLEVBQVFKLENBQVIsQ0FBYjs7QUFFQSwrQkFBTyxDQUFDRixJQUFJVyxHQUFMLElBQVlGLEtBQUtHLE1BQUwsQ0FBWUYsSUFBWixDQUFuQjtBQUNIOzs7MENBRWdCckMsTSxFQUFRMkIsRyxFQUFLO0FBQUEsc0RBQ0EzQixNQURBO0FBQUEsNEJBQ25CVCxDQURtQjtBQUFBLDRCQUNoQk8sQ0FEZ0I7QUFBQSw0QkFDYk4sRUFEYTtBQUFBLDRCQUNURSxFQURTO0FBQUEsNEJBQ0xFLENBREs7O0FBQUEsbURBRUwrQixHQUZLO0FBQUEsNEJBRW5CSyxJQUZtQjtBQUFBLDRCQUViQyxJQUZhOztBQUcxQiw0QkFBTU8sSUFBSWpELEVBQUVXLEdBQUYsQ0FBTUMsR0FBTixDQUFVQyxTQUFWLENBQW9CYixFQUFFUSxLQUF0QixFQUE2QlIsRUFBRWMsTUFBL0IsQ0FBVjs7QUFFQSwrQkFBTyxDQUFDZCxFQUFFVyxHQUFGLENBQU1PLElBQU4sQ0FBV21CLEtBQVgsQ0FBaUJJLElBQWpCLEVBQXVCUSxDQUF2QixDQUFELEVBQTRCakQsRUFBRVcsR0FBRixDQUFNTyxJQUFOLENBQVdtQixLQUFYLENBQWlCSyxJQUFqQixFQUF1Qk8sQ0FBdkIsQ0FBNUIsQ0FBUDtBQUNIOzs7Ozs7a0JBN0ZnQmxELEsiLCJmaWxlIjoiUFNTaWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnBHcm91cCBmcm9tIFwiLi9CcEdyb3VwXCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBTU2lnIHtcclxuXHJcbiAgICBzdGF0aWMgc2V0dXAoKSB7XHJcbiAgICAgICAgY29uc3QgRyA9IG5ldyBCcEdyb3VwKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGcxID0gRy5nZW4xO1xyXG4gICAgICAgIGNvbnN0IGcyID0gRy5nZW4yO1xyXG4gICAgICAgIGNvbnN0IGUgPSBHLnBhaXI7XHJcbiAgICAgICAgY29uc3QgbyA9IEcub3JkZXI7XHJcblxyXG4gICAgICAgIHJldHVybiBbRywgbywgZzEsIGcyLCBlXVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBrZXlnZW4ocGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcblxyXG4gICAgICAgIC8vIFRhcmdldCB2YWx1ZXM6XHJcbiAgICAgICAgY29uc3QgeCA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xyXG4gICAgICAgIGNvbnN0IHkgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2sgPSBbeCwgeV07XHJcbiAgICAgICAgY29uc3QgcGsgPSBbZzIsIEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgpLCBHLmN0eC5QQUlSLkcybXVsKGcyLCB5KV07XHJcblxyXG4gICAgICAgIHJldHVybiBbc2ssIHBrXVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHNpZyA9ICh4K3kqbSkgKiBoXHJcbiAgICBzdGF0aWMgc2lnbihwYXJhbXMsIHNrLCBtLCBpc01lc3NhZ2VIYXNoZWQgPSBmYWxzZSkge1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xyXG5cclxuICAgICAgICAvLyBSQU5ET00gaDpcclxuICAgICAgICAvLyBjb25zdCByYW5kID0gRy5jdHguQklHLnJhbmRvbW51bShvLCBHLnJuZ0dlbik7XHJcbiAgICAgICAgLy8gY29uc3QgaCA9IEcuY3R4LlBBSVIuRzFtdWwoZzEsIHJhbmQpO1xyXG5cclxuICAgICAgICAvLyBoIGJlaW5nIGhhc2ggb2YgbWVzc2FnZSB0byBwb2ludCBvbiB0aGUgY3VydmVcclxuICAgICAgICBjb25zdCBoID0gRy5oYXNoVG9Qb2ludE9uQ3VydmUobSk7XHJcblxyXG4gICAgICAgIGlmKCFpc01lc3NhZ2VIYXNoZWQpIHtcclxuICAgICAgICAgICAgbSA9IEcuaGFzaFRvQklHKG0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbWNweSA9IG0gbW9kIHBcclxuICAgICAgICBjb25zdCBtY3B5ID0gbmV3IEcuY3R4LkJJRyhtKTtcclxuICAgICAgICBtY3B5Lm1vZChvKTtcclxuXHJcbiAgICAgICAgLy8gdDEgPSB5ICogKG0gbW9kIHApXHJcbiAgICAgICAgY29uc3QgdDEgPSBHLmN0eC5CSUcubXVsKHksbWNweSk7XHJcblxyXG4gICAgICAgIC8vIERCSUcgY29uc3RydWN0b3IgZG9lcyBub3QgYWxsb3cgdG8gcGFzcyBpdCBhIEJJRyB2YWx1ZSBoZW5jZSB3ZSBjb3B5IGFsbCB3b3JkIHZhbHVlcyBtYW51YWxseVxyXG4gICAgICAgIGNvbnN0IHhEQklHID0gIG5ldyBHLmN0eC5EQklHKDApO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgRy5jdHguQklHLk5MRU47IGkrKykge1xyXG4gICAgICAgICAgICB4REJJRy53W2ldID0geC53W2ldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdDEgPSB4ICsgeSAqIChtIG1vZCBwKVxyXG4gICAgICAgIHQxLmFkZCh4REJJRyk7XHJcblxyXG4gICAgICAgIC8vIEsgPSAoeCArIHkgKiAobSBtb2QgcCkpIG1vZCBwXHJcbiAgICAgICAgY29uc3QgSyA9IHQxLm1vZChvKTtcclxuXHJcbiAgICAgICAgLy8gc2lnID0gSyAqIGhcclxuICAgICAgICBjb25zdCBzaWcgPSBHLmN0eC5QQUlSLkcxbXVsKGgsIEspO1xyXG5cclxuICAgICAgICByZXR1cm4gW2gsIHNpZ11cclxuICAgIH1cclxuXHJcbiAgICAvLyAgZShzaWcxLCBYICsgbSAqIFkpID09IGUoc2lnMiwgZylcclxuICAgIHN0YXRpYyB2ZXJpZnkocGFyYW1zLCBwaywgbSwgc2lnLCBpc01lc3NhZ2VIYXNoZWQgPSBmYWxzZSkge1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IFtnLCBYLCBZXSA9IHBrO1xyXG4gICAgICAgIGNvbnN0IFtzaWcxLCBzaWcyXSA9IHNpZztcclxuXHJcbiAgICAgICAgaWYoIWlzTWVzc2FnZUhhc2hlZCkge1xyXG4gICAgICAgICAgICBtID0gRy5oYXNoVG9CSUcobSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBHMl90bXAxID0gRy5jdHguUEFJUi5HMm11bChZLCBtKTtcclxuICAgICAgICBHMl90bXAxLmFkZChYKTtcclxuICAgICAgICBHMl90bXAxLmFmZmluZSgpO1xyXG5cclxuICAgICAgICBjb25zdCBHdF8xID0gZShzaWcxLCBHMl90bXAxKTtcclxuICAgICAgICBjb25zdCBHdF8yID0gZShzaWcyLCBnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICFzaWcuSU5GICYmIEd0XzEuZXF1YWxzKEd0XzIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByYW5kb21pemUocGFyYW1zLCBzaWcpIHtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBbc2lnMSwgc2lnMl0gPSBzaWc7XHJcbiAgICAgICAgY29uc3QgdCA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xyXG5cclxuICAgICAgICByZXR1cm4gW0cuY3R4LlBBSVIuRzFtdWwoc2lnMSwgdCksIEcuY3R4LlBBSVIuRzFtdWwoc2lnMiwgdCldXHJcbiAgICB9XHJcbn1cclxuIl19