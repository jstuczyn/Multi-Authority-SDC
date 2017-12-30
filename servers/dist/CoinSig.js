'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // A slightly modified Pointcheval-Sanders Short Randomizable Signatures scheme
// to allow for larger number of signed messages

var _BpGroup = require('./BpGroup');

var _BpGroup2 = _interopRequireDefault(_BpGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CoinSig = function () {
  function CoinSig() {
    _classCallCheck(this, CoinSig);
  }

  _createClass(CoinSig, null, [{
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

      var x1 = G.ctx.BIG.randomnum(G.order, G.rngGen);
      var x2 = G.ctx.BIG.randomnum(G.order, G.rngGen);
      var x3 = G.ctx.BIG.randomnum(G.order, G.rngGen);
      var x4 = G.ctx.BIG.randomnum(G.order, G.rngGen);

      var X1 = G.ctx.PAIR.G2mul(g2, x1);
      var X2 = G.ctx.PAIR.G2mul(g2, x2);
      var X3 = G.ctx.PAIR.G2mul(g2, x3);
      var X4 = G.ctx.PAIR.G2mul(g2, x4);

      var sk = [x1, x2, x3, x4];
      var pk = [g2, X1, X2, X3, X4];

      return [sk, pk];
    }
  }, {
    key: 'sign',
    value: function sign(params, sk, coin) {
      return;
    }
  }, {
    key: 'verify',
    value: function verify(params, pk, coin, sig) {
      return;
    }
  }, {
    key: 'randomize',
    value: function randomize(params, sig) {
      return;
    }
  }, {
    key: 'aggregateSignatures',
    value: function aggregateSignatures(params, signatures) {
      return;
    }
  }, {
    key: 'verifyAggregation',
    value: function verifyAggregation(params, pks, coin, aggregateSignature) {
      return;
    }
  }]);

  return CoinSig;
}();

exports.default = CoinSig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db2luU2lnLmpzIl0sIm5hbWVzIjpbIkNvaW5TaWciLCJHIiwiZzEiLCJnZW4xIiwiZzIiLCJnZW4yIiwiZSIsInBhaXIiLCJvIiwib3JkZXIiLCJwYXJhbXMiLCJ4MSIsImN0eCIsIkJJRyIsInJhbmRvbW51bSIsInJuZ0dlbiIsIngyIiwieDMiLCJ4NCIsIlgxIiwiUEFJUiIsIkcybXVsIiwiWDIiLCJYMyIsIlg0Iiwic2siLCJwayIsImNvaW4iLCJzaWciLCJzaWduYXR1cmVzIiwicGtzIiwiYWdncmVnYXRlU2lnbmF0dXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztxakJBQUE7QUFDQTs7QUFFQTs7Ozs7Ozs7SUFFcUJBLE87Ozs7Ozs7NEJBQ0o7QUFDYixVQUFNQyxJQUFJLHVCQUFWOztBQUVBLFVBQU1DLEtBQUtELEVBQUVFLElBQWI7QUFDQSxVQUFNQyxLQUFLSCxFQUFFSSxJQUFiO0FBQ0EsVUFBTUMsSUFBSUwsRUFBRU0sSUFBWjtBQUNBLFVBQU1DLElBQUlQLEVBQUVRLEtBQVo7O0FBRUEsYUFBTyxDQUFDUixDQUFELEVBQUlPLENBQUosRUFBT04sRUFBUCxFQUFXRSxFQUFYLEVBQWVFLENBQWYsQ0FBUDtBQUNEOzs7MkJBRWFJLE0sRUFBUTtBQUFBLG1DQUNNQSxNQUROO0FBQUEsVUFDYlQsQ0FEYTtBQUFBLFVBQ1ZPLENBRFU7QUFBQSxVQUNQTixFQURPO0FBQUEsVUFDSEUsRUFERztBQUFBLFVBQ0NFLENBREQ7O0FBR3BCLFVBQU1LLEtBQUtWLEVBQUVXLEdBQUYsQ0FBTUMsR0FBTixDQUFVQyxTQUFWLENBQW9CYixFQUFFUSxLQUF0QixFQUE2QlIsRUFBRWMsTUFBL0IsQ0FBWDtBQUNBLFVBQU1DLEtBQUtmLEVBQUVXLEdBQUYsQ0FBTUMsR0FBTixDQUFVQyxTQUFWLENBQW9CYixFQUFFUSxLQUF0QixFQUE2QlIsRUFBRWMsTUFBL0IsQ0FBWDtBQUNBLFVBQU1FLEtBQUtoQixFQUFFVyxHQUFGLENBQU1DLEdBQU4sQ0FBVUMsU0FBVixDQUFvQmIsRUFBRVEsS0FBdEIsRUFBNkJSLEVBQUVjLE1BQS9CLENBQVg7QUFDQSxVQUFNRyxLQUFLakIsRUFBRVcsR0FBRixDQUFNQyxHQUFOLENBQVVDLFNBQVYsQ0FBb0JiLEVBQUVRLEtBQXRCLEVBQTZCUixFQUFFYyxNQUEvQixDQUFYOztBQUVBLFVBQU1JLEtBQUtsQixFQUFFVyxHQUFGLENBQU1RLElBQU4sQ0FBV0MsS0FBWCxDQUFpQmpCLEVBQWpCLEVBQXFCTyxFQUFyQixDQUFYO0FBQ0EsVUFBTVcsS0FBS3JCLEVBQUVXLEdBQUYsQ0FBTVEsSUFBTixDQUFXQyxLQUFYLENBQWlCakIsRUFBakIsRUFBcUJZLEVBQXJCLENBQVg7QUFDQSxVQUFNTyxLQUFLdEIsRUFBRVcsR0FBRixDQUFNUSxJQUFOLENBQVdDLEtBQVgsQ0FBaUJqQixFQUFqQixFQUFxQmEsRUFBckIsQ0FBWDtBQUNBLFVBQU1PLEtBQUt2QixFQUFFVyxHQUFGLENBQU1RLElBQU4sQ0FBV0MsS0FBWCxDQUFpQmpCLEVBQWpCLEVBQXFCYyxFQUFyQixDQUFYOztBQUVBLFVBQU1PLEtBQUssQ0FBQ2QsRUFBRCxFQUFLSyxFQUFMLEVBQVNDLEVBQVQsRUFBYUMsRUFBYixDQUFYO0FBQ0EsVUFBTVEsS0FBSyxDQUFDdEIsRUFBRCxFQUFLZSxFQUFMLEVBQVNHLEVBQVQsRUFBYUMsRUFBYixFQUFpQkMsRUFBakIsQ0FBWDs7QUFFQSxhQUFPLENBQUNDLEVBQUQsRUFBS0MsRUFBTCxDQUFQO0FBQ0Q7Ozt5QkFFV2hCLE0sRUFBUWUsRSxFQUFJRSxJLEVBQU07QUFDNUI7QUFDRDs7OzJCQUVhakIsTSxFQUFRZ0IsRSxFQUFJQyxJLEVBQU1DLEcsRUFBSztBQUNuQztBQUNEOzs7OEJBRWdCbEIsTSxFQUFRa0IsRyxFQUFLO0FBQzVCO0FBQ0Q7Ozt3Q0FFMEJsQixNLEVBQVFtQixVLEVBQVk7QUFDN0M7QUFDRDs7O3NDQUV3Qm5CLE0sRUFBUW9CLEcsRUFBS0gsSSxFQUFNSSxrQixFQUFvQjtBQUM5RDtBQUNEOzs7Ozs7a0JBakRrQi9CLE8iLCJmaWxlIjoiQ29pblNpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEEgc2xpZ2h0bHkgbW9kaWZpZWQgUG9pbnRjaGV2YWwtU2FuZGVycyBTaG9ydCBSYW5kb21pemFibGUgU2lnbmF0dXJlcyBzY2hlbWVcbi8vIHRvIGFsbG93IGZvciBsYXJnZXIgbnVtYmVyIG9mIHNpZ25lZCBtZXNzYWdlc1xuXG5pbXBvcnQgQnBHcm91cCBmcm9tICcuL0JwR3JvdXAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2luU2lnIHtcbiAgc3RhdGljIHNldHVwKCkge1xuICAgIGNvbnN0IEcgPSBuZXcgQnBHcm91cCgpO1xuXG4gICAgY29uc3QgZzEgPSBHLmdlbjE7XG4gICAgY29uc3QgZzIgPSBHLmdlbjI7XG4gICAgY29uc3QgZSA9IEcucGFpcjtcbiAgICBjb25zdCBvID0gRy5vcmRlcjtcblxuICAgIHJldHVybiBbRywgbywgZzEsIGcyLCBlXTtcbiAgfVxuXG4gIHN0YXRpYyBrZXlnZW4ocGFyYW1zKSB7XG4gICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG5cbiAgICBjb25zdCB4MSA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xuICAgIGNvbnN0IHgyID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XG4gICAgY29uc3QgeDMgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcbiAgICBjb25zdCB4NCA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xuXG4gICAgY29uc3QgWDEgPSBHLmN0eC5QQUlSLkcybXVsKGcyLCB4MSk7XG4gICAgY29uc3QgWDIgPSBHLmN0eC5QQUlSLkcybXVsKGcyLCB4Mik7XG4gICAgY29uc3QgWDMgPSBHLmN0eC5QQUlSLkcybXVsKGcyLCB4Myk7XG4gICAgY29uc3QgWDQgPSBHLmN0eC5QQUlSLkcybXVsKGcyLCB4NCk7XG5cbiAgICBjb25zdCBzayA9IFt4MSwgeDIsIHgzLCB4NF07XG4gICAgY29uc3QgcGsgPSBbZzIsIFgxLCBYMiwgWDMsIFg0XTtcblxuICAgIHJldHVybiBbc2ssIHBrXTtcbiAgfVxuXG4gIHN0YXRpYyBzaWduKHBhcmFtcywgc2ssIGNvaW4pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0aWMgdmVyaWZ5KHBhcmFtcywgcGssIGNvaW4sIHNpZykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN0YXRpYyByYW5kb21pemUocGFyYW1zLCBzaWcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0aWMgYWdncmVnYXRlU2lnbmF0dXJlcyhwYXJhbXMsIHNpZ25hdHVyZXMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0aWMgdmVyaWZ5QWdncmVnYXRpb24ocGFyYW1zLCBwa3MsIGNvaW4sIGFnZ3JlZ2F0ZVNpZ25hdHVyZSkge1xuICAgIHJldHVybjtcbiAgfVxufVxuIl19