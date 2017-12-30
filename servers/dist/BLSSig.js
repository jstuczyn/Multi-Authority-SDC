'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BpGroup = require('./BpGroup');

var _BpGroup2 = _interopRequireDefault(_BpGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BLSSig = function () {
  function BLSSig() {
    _classCallCheck(this, BLSSig);
  }

  _createClass(BLSSig, null, [{
    key: 'setup',
    value: function setup() {
      var G = new _BpGroup2.default();

      var g1 = G.gen1;
      var g2 = G.gen2;
      var e = G.pair;
      var o = G.order;

      return [G, o, g1, g2, e];
    }
  }, {
    key: 'keygen',
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
    key: 'sign',
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
    key: 'verify',
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
    key: 'aggregateSignatures',
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
        aggregateSignature.add(signatures[i]);
      }
      aggregateSignature.affine();

      return aggregateSignature;
    }
  }, {
    key: 'verifyAggregation',
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
      aggregatePK.affine();

      var h = G.hashToPointOnCurve(m);
      var Gt_2 = e(h, aggregatePK);

      return Gt_1.equals(Gt_2);
    }
  }]);

  return BLSSig;
}();

exports.default = BLSSig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CTFNTaWcuanMiXSwibmFtZXMiOlsiQkxTU2lnIiwiRyIsImcxIiwiZ2VuMSIsImcyIiwiZ2VuMiIsImUiLCJwYWlyIiwibyIsIm9yZGVyIiwicGFyYW1zIiwic2siLCJjdHgiLCJCSUciLCJyYW5kb21udW0iLCJybmdHZW4iLCJwayIsIlBBSVIiLCJHMm11bCIsIm0iLCJoIiwiaGFzaFRvUG9pbnRPbkN1cnZlIiwic2lnIiwiRzFtdWwiLCJHdF8xIiwiR3RfMiIsImVxdWFscyIsInNpZ25hdHVyZXMiLCJhZ2dyZWdhdGVTaWduYXR1cmUiLCJFQ1AiLCJjb3B5IiwiaSIsImxlbmd0aCIsImFkZCIsImFmZmluZSIsInBrcyIsImFnZ3JlZ2F0ZVBLIiwiRUNQMiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztJQUVxQkEsTTs7Ozs7Ozs0QkFDSjtBQUNiLFVBQU1DLElBQUksdUJBQVY7O0FBRUEsVUFBTUMsS0FBS0QsRUFBRUUsSUFBYjtBQUNBLFVBQU1DLEtBQUtILEVBQUVJLElBQWI7QUFDQSxVQUFNQyxJQUFJTCxFQUFFTSxJQUFaO0FBQ0EsVUFBTUMsSUFBSVAsRUFBRVEsS0FBWjs7QUFFQSxhQUFPLENBQUNSLENBQUQsRUFBSU8sQ0FBSixFQUFPTixFQUFQLEVBQVdFLEVBQVgsRUFBZUUsQ0FBZixDQUFQO0FBQ0Q7OzsyQkFFYUksTSxFQUFRO0FBQUEsbUNBQ01BLE1BRE47QUFBQSxVQUNiVCxDQURhO0FBQUEsVUFDVk8sQ0FEVTtBQUFBLFVBQ1BOLEVBRE87QUFBQSxVQUNIRSxFQURHO0FBQUEsVUFDQ0UsQ0FERDs7QUFHcEIsVUFBTUssS0FBS1YsRUFBRVcsR0FBRixDQUFNQyxHQUFOLENBQVVDLFNBQVYsQ0FBb0JiLEVBQUVRLEtBQXRCLEVBQTZCUixFQUFFYyxNQUEvQixDQUFYO0FBQ0EsVUFBTUMsS0FBS2YsRUFBRVcsR0FBRixDQUFNSyxJQUFOLENBQVdDLEtBQVgsQ0FBaUJkLEVBQWpCLEVBQXFCTyxFQUFyQixDQUFYOztBQUVBLGFBQU8sQ0FBQ0EsRUFBRCxFQUFLSyxFQUFMLENBQVA7QUFDRDs7O3lCQUVXTixNLEVBQVFDLEUsRUFBSVEsQyxFQUFHO0FBQUEsb0NBQ0NULE1BREQ7QUFBQSxVQUNsQlQsQ0FEa0I7QUFBQSxVQUNmTyxDQURlO0FBQUEsVUFDWk4sRUFEWTtBQUFBLFVBQ1JFLEVBRFE7QUFBQSxVQUNKRSxDQURJOztBQUd6QixVQUFNYyxJQUFJbkIsRUFBRW9CLGtCQUFGLENBQXFCRixDQUFyQixDQUFWO0FBQ0EsVUFBTUcsTUFBTXJCLEVBQUVXLEdBQUYsQ0FBTUssSUFBTixDQUFXTSxLQUFYLENBQWlCSCxDQUFqQixFQUFvQlQsRUFBcEIsQ0FBWjs7QUFFQSxhQUFPVyxHQUFQLENBTnlCLENBTWI7QUFDYjs7OzJCQUVhWixNLEVBQVFNLEUsRUFBSUcsQyxFQUFHRyxHLEVBQUs7QUFBQSxvQ0FDTlosTUFETTtBQUFBLFVBQ3pCVCxDQUR5QjtBQUFBLFVBQ3RCTyxDQURzQjtBQUFBLFVBQ25CTixFQURtQjtBQUFBLFVBQ2ZFLEVBRGU7QUFBQSxVQUNYRSxDQURXOztBQUVoQyxVQUFNYyxJQUFJbkIsRUFBRW9CLGtCQUFGLENBQXFCRixDQUFyQixDQUFWOztBQUVBLFVBQU1LLE9BQU9sQixFQUFFZ0IsR0FBRixFQUFPbEIsRUFBUCxDQUFiO0FBQ0EsVUFBTXFCLE9BQU9uQixFQUFFYyxDQUFGLEVBQUtKLEVBQUwsQ0FBYjs7QUFFQSxhQUFPUSxLQUFLRSxNQUFMLENBQVlELElBQVosQ0FBUDtBQUNEOzs7d0NBRTBCZixNLEVBQVFpQixVLEVBQVk7QUFBQSxvQ0FDbkJqQixNQURtQjtBQUFBLFVBQ3RDVCxDQURzQztBQUFBLFVBQ25DTyxDQURtQztBQUFBLFVBQ2hDTixFQURnQztBQUFBLFVBQzVCRSxFQUQ0QjtBQUFBLFVBQ3hCRSxDQUR3Qjs7QUFHN0MsVUFBTXNCLHFCQUFxQixJQUFJM0IsRUFBRVcsR0FBRixDQUFNaUIsR0FBVixFQUEzQjtBQUNBRCx5QkFBbUJFLElBQW5CLENBQXdCSCxXQUFXLENBQVgsQ0FBeEI7O0FBRUEsV0FBSyxJQUFJSSxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLFdBQVdLLE1BQS9CLEVBQXVDRCxHQUF2QyxFQUE0QztBQUMxQ0gsMkJBQW1CSyxHQUFuQixDQUF1Qk4sV0FBV0ksQ0FBWCxDQUF2QjtBQUNEO0FBQ0RILHlCQUFtQk0sTUFBbkI7O0FBRUEsYUFBT04sa0JBQVA7QUFDRDs7O3NDQUV3QmxCLE0sRUFBUXlCLEcsRUFBS2hCLEMsRUFBR1Msa0IsRUFBb0I7QUFBQSxvQ0FDakNsQixNQURpQztBQUFBLFVBQ3BEVCxDQURvRDtBQUFBLFVBQ2pETyxDQURpRDtBQUFBLFVBQzlDTixFQUQ4QztBQUFBLFVBQzFDRSxFQUQwQztBQUFBLFVBQ3RDRSxDQURzQzs7QUFHM0QsVUFBTWtCLE9BQU9sQixFQUFFc0Isa0JBQUYsRUFBc0J4QixFQUF0QixDQUFiOztBQUVBLFVBQU1nQyxjQUFjLElBQUluQyxFQUFFVyxHQUFGLENBQU15QixJQUFWLEVBQXBCO0FBQ0FELGtCQUFZTixJQUFaLENBQWlCSyxJQUFJLENBQUosQ0FBakI7O0FBRUEsV0FBSyxJQUFJSixJQUFJLENBQWIsRUFBZ0JBLElBQUlJLElBQUlILE1BQXhCLEVBQWdDRCxHQUFoQyxFQUFxQztBQUNuQ0ssb0JBQVlILEdBQVosQ0FBZ0JFLElBQUlKLENBQUosQ0FBaEI7QUFDRDtBQUNESyxrQkFBWUYsTUFBWjs7QUFHQSxVQUFNZCxJQUFJbkIsRUFBRW9CLGtCQUFGLENBQXFCRixDQUFyQixDQUFWO0FBQ0EsVUFBTU0sT0FBT25CLEVBQUVjLENBQUYsRUFBS2dCLFdBQUwsQ0FBYjs7QUFFQSxhQUFPWixLQUFLRSxNQUFMLENBQVlELElBQVosQ0FBUDtBQUNEOzs7Ozs7a0JBeEVrQnpCLE0iLCJmaWxlIjoiQkxTU2lnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJwR3JvdXAgZnJvbSAnLi9CcEdyb3VwJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQkxTU2lnIHtcbiAgc3RhdGljIHNldHVwKCkge1xuICAgIGNvbnN0IEcgPSBuZXcgQnBHcm91cCgpO1xuXG4gICAgY29uc3QgZzEgPSBHLmdlbjE7XG4gICAgY29uc3QgZzIgPSBHLmdlbjI7XG4gICAgY29uc3QgZSA9IEcucGFpcjtcbiAgICBjb25zdCBvID0gRy5vcmRlcjtcblxuICAgIHJldHVybiBbRywgbywgZzEsIGcyLCBlXTtcbiAgfVxuXG4gIHN0YXRpYyBrZXlnZW4ocGFyYW1zKSB7XG4gICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG5cbiAgICBjb25zdCBzayA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xuICAgIGNvbnN0IHBrID0gRy5jdHguUEFJUi5HMm11bChnMiwgc2spO1xuXG4gICAgcmV0dXJuIFtzaywgcGtdO1xuICB9XG5cbiAgc3RhdGljIHNpZ24ocGFyYW1zLCBzaywgbSkge1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuXG4gICAgY29uc3QgaCA9IEcuaGFzaFRvUG9pbnRPbkN1cnZlKG0pO1xuICAgIGNvbnN0IHNpZyA9IEcuY3R4LlBBSVIuRzFtdWwoaCwgc2spO1xuXG4gICAgcmV0dXJuIHNpZzsgLy8gbm8gbmVlZCB0byByZXR1cm4gaCBhcyBpdCBpcyBjb25zdGFudCBhbmQgZGV0ZXJtaW5pc3RpYyBnaXZlbiBtZXNzYWdlXG4gIH1cblxuICBzdGF0aWMgdmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZykge1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgIGNvbnN0IGggPSBHLmhhc2hUb1BvaW50T25DdXJ2ZShtKTtcblxuICAgIGNvbnN0IEd0XzEgPSBlKHNpZywgZzIpO1xuICAgIGNvbnN0IEd0XzIgPSBlKGgsIHBrKTtcblxuICAgIHJldHVybiBHdF8xLmVxdWFscyhHdF8yKTtcbiAgfVxuXG4gIHN0YXRpYyBhZ2dyZWdhdGVTaWduYXR1cmVzKHBhcmFtcywgc2lnbmF0dXJlcykge1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuXG4gICAgY29uc3QgYWdncmVnYXRlU2lnbmF0dXJlID0gbmV3IEcuY3R4LkVDUCgpO1xuICAgIGFnZ3JlZ2F0ZVNpZ25hdHVyZS5jb3B5KHNpZ25hdHVyZXNbMF0pO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzaWduYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhZ2dyZWdhdGVTaWduYXR1cmUuYWRkKHNpZ25hdHVyZXNbaV0pO1xuICAgIH1cbiAgICBhZ2dyZWdhdGVTaWduYXR1cmUuYWZmaW5lKCk7XG5cbiAgICByZXR1cm4gYWdncmVnYXRlU2lnbmF0dXJlO1xuICB9XG5cbiAgc3RhdGljIHZlcmlmeUFnZ3JlZ2F0aW9uKHBhcmFtcywgcGtzLCBtLCBhZ2dyZWdhdGVTaWduYXR1cmUpIHtcbiAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcblxuICAgIGNvbnN0IEd0XzEgPSBlKGFnZ3JlZ2F0ZVNpZ25hdHVyZSwgZzIpO1xuXG4gICAgY29uc3QgYWdncmVnYXRlUEsgPSBuZXcgRy5jdHguRUNQMigpO1xuICAgIGFnZ3JlZ2F0ZVBLLmNvcHkocGtzWzBdKTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcGtzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhZ2dyZWdhdGVQSy5hZGQocGtzW2ldKTtcbiAgICB9XG4gICAgYWdncmVnYXRlUEsuYWZmaW5lKCk7XG5cblxuICAgIGNvbnN0IGggPSBHLmhhc2hUb1BvaW50T25DdXJ2ZShtKTtcbiAgICBjb25zdCBHdF8yID0gZShoLCBhZ2dyZWdhdGVQSyk7XG5cbiAgICByZXR1cm4gR3RfMS5lcXVhbHMoR3RfMik7XG4gIH1cbn1cbiJdfQ==