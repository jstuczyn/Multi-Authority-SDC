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

var BLSSig = function () {
        function BLSSig() {
                _classCallCheck(this, BLSSig);
        }

        _createClass(BLSSig, null, [{
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

                        var sk = G.ctx.BIG.randomnum(G.order, G.rngGen);
                        var pk = G.ctx.PAIR.G2mul(g2, sk);

                        return [sk, pk];
                }
        }, {
                key: "sign",
                value: function sign(params, sk, m) {
                        var _params2 = _slicedToArray(params, 5),
                            G = _params2[0],
                            o = _params2[1],
                            g1 = _params2[2],
                            g2 = _params2[3],
                            e = _params2[4];

                        var h = G.hashToPointOnCurve(m);
                        var sig = G.ctx.PAIR.G1mul(h, sk);

                        return sig; // no need to return h as it is constant and deterministic given message
                }
        }, {
                key: "verify",
                value: function verify(params, pk, m, sig) {
                        var _params3 = _slicedToArray(params, 5),
                            G = _params3[0],
                            o = _params3[1],
                            g1 = _params3[2],
                            g2 = _params3[3],
                            e = _params3[4];

                        var h = G.hashToPointOnCurve(m);

                        var Gt_1 = e(sig, g2);
                        var Gt_2 = e(h, pk);

                        return Gt_1.equals(Gt_2);
                }
        }, {
                key: "aggregateSignatures",
                value: function aggregateSignatures(params, signatures) {
                        var _params4 = _slicedToArray(params, 5),
                            G = _params4[0],
                            o = _params4[1],
                            g1 = _params4[2],
                            g2 = _params4[3],
                            e = _params4[4];

                        var aggregateSignature = new G.ctx.ECP();
                        aggregateSignature.copy(signatures[0]);

                        for (var i = 1; i < signatures.length; i++) {
                                aggregateSignature.add(signatures[1]);
                        }

                        aggregateSignature.affine();
                        return aggregateSignature;
                }
        }, {
                key: "verifyAggregation",
                value: function verifyAggregation(params, pks, m, aggregateSignature) {
                        var _params5 = _slicedToArray(params, 5),
                            G = _params5[0],
                            o = _params5[1],
                            g1 = _params5[2],
                            g2 = _params5[3],
                            e = _params5[4];

                        var Gt_1 = e(aggregateSignature, g2);

                        var aggregatePK = new G.ctx.ECP2();
                        aggregatePK.copy(pks[0]);

                        for (var i = 1; i < pks.length; i++) {
                                aggregatePK.add(pks[i]);
                        }

                        // console.log("aggPK:", aggregatePK.toString());

                        // todo: do you need to affine pk?
                        aggregatePK.affine();

                        var h = G.hashToPointOnCurve(m);
                        var Gt_2 = e(h, aggregatePK);

                        return Gt_1.equals(Gt_2);
                }
        }]);

        return BLSSig;
}();

exports.default = BLSSig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CTFNTaWcuanMiXSwibmFtZXMiOlsiQkxTU2lnIiwiRyIsImcxIiwiZ2VuMSIsImcyIiwiZ2VuMiIsImUiLCJwYWlyIiwibyIsIm9yZGVyIiwicGFyYW1zIiwic2siLCJjdHgiLCJCSUciLCJyYW5kb21udW0iLCJybmdHZW4iLCJwayIsIlBBSVIiLCJHMm11bCIsIm0iLCJoIiwiaGFzaFRvUG9pbnRPbkN1cnZlIiwic2lnIiwiRzFtdWwiLCJHdF8xIiwiR3RfMiIsImVxdWFscyIsInNpZ25hdHVyZXMiLCJhZ2dyZWdhdGVTaWduYXR1cmUiLCJFQ1AiLCJjb3B5IiwiaSIsImxlbmd0aCIsImFkZCIsImFmZmluZSIsInBrcyIsImFnZ3JlZ2F0ZVBLIiwiRUNQMiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztJQUVxQkEsTTs7Ozs7Ozt3Q0FFRjtBQUNYLDRCQUFNQyxJQUFJLHVCQUFWOztBQUVBLDRCQUFNQyxLQUFLRCxFQUFFRSxJQUFiO0FBQ0EsNEJBQU1DLEtBQUtILEVBQUVJLElBQWI7QUFDQSw0QkFBTUMsSUFBSUwsRUFBRU0sSUFBWjtBQUNBLDRCQUFNQyxJQUFJUCxFQUFFUSxLQUFaOztBQUVBLCtCQUFPLENBQUNSLENBQUQsRUFBSU8sQ0FBSixFQUFPTixFQUFQLEVBQVdFLEVBQVgsRUFBZUUsQ0FBZixDQUFQO0FBQ0g7Ozt1Q0FFYUksTSxFQUFRO0FBQUEscURBQ1FBLE1BRFI7QUFBQSw0QkFDWFQsQ0FEVztBQUFBLDRCQUNSTyxDQURRO0FBQUEsNEJBQ0xOLEVBREs7QUFBQSw0QkFDREUsRUFEQztBQUFBLDRCQUNHRSxDQURIOztBQUdsQiw0QkFBTUssS0FBS1YsRUFBRVcsR0FBRixDQUFNQyxHQUFOLENBQVVDLFNBQVYsQ0FBb0JiLEVBQUVRLEtBQXRCLEVBQTZCUixFQUFFYyxNQUEvQixDQUFYO0FBQ0EsNEJBQU1DLEtBQUtmLEVBQUVXLEdBQUYsQ0FBTUssSUFBTixDQUFXQyxLQUFYLENBQWlCZCxFQUFqQixF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b3VwXCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJMU1NpZyB7XHJcblxyXG4gICAgc3RhdGljIHNldHVwKCkge1xyXG4gICAgICAgIGNvbnN0IEcgPSBuZXcgQnBHcm91cCgpO1xyXG5cclxuICAgICAgICBjb25zdCBnMSA9IEcuZ2VuMTtcclxuICAgICAgICBjb25zdCBnMiA9IEcuZ2VuMjtcclxuICAgICAgICBjb25zdCBlID0gRy5wYWlyO1xyXG4gICAgICAgIGNvbnN0IG8gPSBHLm9yZGVyO1xyXG5cclxuICAgICAgICByZXR1cm4gW0csIG8sIGcxLCBnMiwgZV1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMga2V5Z2VuKHBhcmFtcykge1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgICAgICBjb25zdCBzayA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xyXG4gICAgICAgIGNvbnN0IHBrID0gRy5jdHguUEFJUi5HMm11bChnMiwgc2spO1xyXG5cclxuICAgICAgICByZXR1cm4gW3NrLCBwa11cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2lnbihwYXJhbXMsIHNrLCBtKSB7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGggPSBHLmhhc2hUb1BvaW50T25DdXJ2ZShtKTtcclxuICAgICAgICBjb25zdCBzaWcgPSBHLmN0eC5QQUlSLkcxbXVsKGgsIHNrKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNpZzsgLy8gbm8gbmVlZCB0byByZXR1cm4gaCBhcyBpdCBpcyBjb25zdGFudCBhbmQgZGV0ZXJtaW5pc3RpYyBnaXZlbiBtZXNzYWdlXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHZlcmlmeShwYXJhbXMsIHBrLCBtLCBzaWcpIHtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBoID0gRy5oYXNoVG9Qb2ludE9uQ3VydmUobSk7XHJcblxyXG4gICAgICAgIGNvbnN0IEd0XzEgPSBlKHNpZywgZzIpO1xyXG4gICAgICAgIGNvbnN0IEd0XzIgPSBlKGgsIHBrKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIEd0XzEuZXF1YWxzKEd0XzIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhZ2dyZWdhdGVTaWduYXR1cmVzKHBhcmFtcywgc2lnbmF0dXJlcykge1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgICAgICBsZXQgYWdncmVnYXRlU2lnbmF0dXJlID0gbmV3IEcuY3R4LkVDUCgpO1xyXG4gICAgICAgIGFnZ3JlZ2F0ZVNpZ25hdHVyZS5jb3B5KHNpZ25hdHVyZXNbMF0pO1xyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDwgc2lnbmF0dXJlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBhZ2dyZWdhdGVTaWduYXR1cmUuYWRkKHNpZ25hdHVyZXNbMV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWdncmVnYXRlU2lnbmF0dXJlLmFmZmluZSgpO1xyXG4gICAgICAgIHJldHVybiBhZ2dyZWdhdGVTaWduYXR1cmU7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB2ZXJpZnlBZ2dyZWdhdGlvbihwYXJhbXMsIHBrcywgbSwgYWdncmVnYXRlU2lnbmF0dXJlKSB7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcblxyXG4gICAgICAgIGxldCBHdF8xID0gZShhZ2dyZWdhdGVTaWduYXR1cmUsIGcyKTtcclxuXHJcbiAgICAgICAgbGV0IGFnZ3JlZ2F0ZVBLID0gbmV3IEcuY3R4LkVDUDIoKTtcclxuICAgICAgICBhZ2dyZWdhdGVQSy5jb3B5KHBrc1swXSk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgaSA9IDE7IGkgPCBwa3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgYWdncmVnYXRlUEsuYWRkKHBrc1tpXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgLy8gY29uc29sZS5sb2coXCJhZ2dQSzpcIiwgYWdncmVnYXRlUEsudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgIC8vIHRvZG86IGRvIHlvdSBuZWVkIHRvIGFmZmluZSBwaz9cclxuICAgICAgICBhZ2dyZWdhdGVQSy5hZmZpbmUoKVxyXG5cclxuICAgICAgICBjb25zdCBoID0gRy5oYXNoVG9Qb2ludE9uQ3VydmUobSk7XHJcbiAgICAgICAgbGV0IEd0XzIgPSBlKGgsIGFnZ3JlZ2F0ZVBLKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiBHdF8xLmVxdWFscyhHdF8yKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxufSJdfQ==