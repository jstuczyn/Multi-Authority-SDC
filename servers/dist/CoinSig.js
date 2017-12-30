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

      var x0 = G.ctx.BIG.randomnum(G.order, G.rngGen);
      var x1 = G.ctx.BIG.randomnum(G.order, G.rngGen);
      var x2 = G.ctx.BIG.randomnum(G.order, G.rngGen);
      var x3 = G.ctx.BIG.randomnum(G.order, G.rngGen);
      var x4 = G.ctx.BIG.randomnum(G.order, G.rngGen);

      var X0 = G.ctx.PAIR.G2mul(g2, x0);
      var X1 = G.ctx.PAIR.G2mul(g2, x1);
      var X2 = G.ctx.PAIR.G2mul(g2, x2);
      var X3 = G.ctx.PAIR.G2mul(g2, x3);
      var X4 = G.ctx.PAIR.G2mul(g2, x4);

      var sk = [x0, x1, x2, x3, x4];
      var pk = [g2, X0, X1, X2, X3, X4];

      return [sk, pk];
    }

    // sig = (x0 + x1*a1 + x2*a2 + x3*a3 + x4*a4) * h

  }, {
    key: 'sign',
    value: function sign(params, sk, coin) {
      var _params2 = _slicedToArray(params, 5),
          G = _params2[0],
          o = _params2[1],
          g1 = _params2[2],
          g2 = _params2[3],
          e = _params2[4];

      var _sk = _slicedToArray(sk, 5),
          x0 = _sk[0],
          x1 = _sk[1],
          x2 = _sk[2],
          x3 = _sk[3],
          x4 = _sk[4];

      // todo: should h be a hash to G1 of some attribute? if so of which one?


      var rand = G.ctx.BIG.randomnum(o, G.rngGen);
      var h = G.ctx.PAIR.G1mul(g1, rand);

      var a1 = G.hashToBIG(coin.value);
      var a2 = G.hashToBIG(coin.ttl);
      var a3 = G.hashG2ElemToBIG(coin.v);
      var a4 = G.hashG2ElemToBIG(coin.id);

      // calculate a1 mod p, a2 mod p, etc.
      var a1_cpy = new G.ctx.BIG(a1);
      a1_cpy.mod(o);

      var a2_cpy = new G.ctx.BIG(a2);
      a2_cpy.mod(o);

      var a3_cpy = new G.ctx.BIG(a3);
      a3_cpy.mod(o);

      var a4_cpy = new G.ctx.BIG(a4);
      a4_cpy.mod(o);

      // calculate t1 = x1 * (a1 mod p), t2 = x2 * (a2 mod p), etc.
      var t1 = G.ctx.BIG.mul(x1, a1_cpy);
      var t2 = G.ctx.BIG.mul(x2, a2_cpy);
      var t3 = G.ctx.BIG.mul(x3, a3_cpy);
      var t4 = G.ctx.BIG.mul(x4, a4_cpy);

      // DBIG constructor does not allow to pass it a BIG value hence we copy all word values manually
      var x0DBIG = new G.ctx.DBIG(0);
      for (var i = 0; i < G.ctx.BIG.NLEN; i++) {
        x0DBIG.w[i] = x0.w[i];
      }

      // x0 + t1 + t2 + ...
      x0DBIG.add(t1);
      x0DBIG.add(t2);
      x0DBIG.add(t3);
      x0DBIG.add(t4);

      // K = (x0 + x1*a1 + x2*a2 + ...) mod p
      var K = x0DBIG.mod(o);

      // sig = K * h
      var sig = G.ctx.PAIR.G1mul(h, K);

      return [h, sig];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db2luU2lnLmpzIl0sIm5hbWVzIjpbIkNvaW5TaWciLCJHIiwiZzEiLCJnZW4xIiwiZzIiLCJnZW4yIiwiZSIsInBhaXIiLCJvIiwib3JkZXIiLCJwYXJhbXMiLCJ4MCIsImN0eCIsIkJJRyIsInJhbmRvbW51bSIsInJuZ0dlbiIsIngxIiwieDIiLCJ4MyIsIng0IiwiWDAiLCJQQUlSIiwiRzJtdWwiLCJYMSIsIlgyIiwiWDMiLCJYNCIsInNrIiwicGsiLCJjb2luIiwicmFuZCIsImgiLCJHMW11bCIsImExIiwiaGFzaFRvQklHIiwidmFsdWUiLCJhMiIsInR0bCIsImEzIiwiaGFzaEcyRWxlbVRvQklHIiwidiIsImE0IiwiaWQiLCJhMV9jcHkiLCJtb2QiLCJhMl9jcHkiLCJhM19jcHkiLCJhNF9jcHkiLCJ0MSIsIm11bCIsInQyIiwidDMiLCJ0NCIsIngwREJJRyIsIkRCSUciLCJpIiwiTkxFTiIsInciLCJhZGQiLCJLIiwic2lnIiwic2lnbmF0dXJlcyIsInBrcyIsImFnZ3JlZ2F0ZVNpZ25hdHVyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7cWpCQUFBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0lBRXFCQSxPOzs7Ozs7OzRCQUNKO0FBQ2IsVUFBTUMsSUFBSSx1QkFBVjs7QUFFQSxVQUFNQyxLQUFLRCxFQUFFRSxJQUFiO0FBQ0EsVUFBTUMsS0FBS0gsRUFBRUksSUFBYjtBQUNBLFVBQU1DLElBQUlMLEVBQUVNLElBQVo7QUFDQSxVQUFNQyxJQUFJUCxFQUFFUSxLQUFaOztBQUVBLGFBQU8sQ0FBQ1IsQ0FBRCxFQUFJTyxDQUFKLEVBQU9OLEVBQVAsRUFBV0UsRUFBWCxFQUFlRSxDQUFmLENBQVA7QUFDRDs7OzJCQUVhSSxNLEVBQVE7QUFBQSxtQ0FDTUEsTUFETjtBQUFBLFVBQ2JULENBRGE7QUFBQSxVQUNWTyxDQURVO0FBQUEsVUFDUE4sRUFETztBQUFBLFVBQ0hFLEVBREc7QUFBQSxVQUNDRSxDQUREOztBQUdwQixVQUFNSyxLQUFLVixFQUFF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WDtBQUNBSyxhQUFPSyxHQUFQLENBQVdSLEVBQVg7QUFDQUcsYUFBT0ssR0FBUCxDQUFXUCxFQUFYO0FBQ0FFLGFBQU9LLEdBQVAsQ0FBV04sRUFBWDs7QUFFQTtBQUNBLFVBQU1PLElBQUlOLE9BQU9ULEdBQVAsQ0FBV3BDLENBQVgsQ0FBVjs7QUFFQTtBQUNBLFVBQU1vRCxNQUFNM0QsRUFBRVcsR0FBRixDQUFNUyxJQUFOLENBQVdXLEtBQVgsQ0FBaUJELENBQWpCLEVBQW9CNEIsQ0FBcEIsQ0FBWjs7QUFFQSxhQUFPLENBQUM1QixDQUFELEVBQUk2QixHQUFKLENBQVA7QUFDRDs7OzJCQUVhbEQsTSxFQUFRa0IsRSxFQUFJQyxJLEVBQU0rQixHLEVBQUs7QUFDbkM7QUFDRDs7OzhCQUVnQmxELE0sRUFBUWtELEcsRUFBSztBQUM1QjtBQUNEOzs7d0NBRTBCbEQsTSxFQUFRbUQsVSxFQUFZO0FBQzdDO0FBQ0Q7OztzQ0FFd0JuRCxNLEVBQVFvRCxHLEVBQUtqQyxJLEVBQU1rQyxrQixFQUFvQjtBQUM5RDtBQUNEOzs7Ozs7a0JBckdrQi9ELE8iLCJmaWxlIjoiQ29pblNpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEEgc2xpZ2h0bHkgbW9kaWZpZWQgUG9pbnRjaGV2YWwtU2FuZGVycyBTaG9ydCBSYW5kb21pemFibGUgU2lnbmF0dXJlcyBzY2hlbWVcbi8vIHRvIGFsbG93IGZvciBsYXJnZXIgbnVtYmVyIG9mIHNpZ25lZCBtZXNzYWdlc1xuXG5pbXBvcnQgQnBHcm91cCBmcm9tICcuL0JwR3JvdXAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2luU2lnIHtcbiAgc3RhdGljIHNldHVwKCkge1xuICAgIGNvbnN0IEcgPSBuZXcgQnBHcm91cCgpO1xuXG4gICAgY29uc3QgZzEgPSBHLmdlbjE7XG4gICAgY29uc3QgZzIgPSBHLmdlbjI7XG4gICAgY29uc3QgZSA9IEcucGFpcjtcbiAgICBjb25zdCBvID0gRy5vcmRlcjtcblxuICAgIHJldHVybiBbRywgbywgZzEsIGcyLCBlXTtcbiAgfVxuXG4gIHN0YXRpYyBrZXlnZW4ocGFyYW1zKSB7XG4gICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG5cbiAgICBjb25zdCB4MCA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xuICAgIGNvbnN0IHgxID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XG4gICAgY29uc3QgeDIgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcbiAgICBjb25zdCB4MyA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xuICAgIGNvbnN0IHg0ID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XG5cbiAgICBjb25zdCBYMCA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgwKTtcbiAgICBjb25zdCBYMSA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgxKTtcbiAgICBjb25zdCBYMiA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgyKTtcbiAgICBjb25zdCBYMyA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgzKTtcbiAgICBjb25zdCBYNCA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIHg0KTtcblxuICAgIGNvbnN0IHNrID0gW3gwLCB4MSwgeDIsIHgzLCB4NF07XG4gICAgY29uc3QgcGsgPSBbZzIsIFgwLCBYMSwgWDIsIFgzLCBYNF07XG5cbiAgICByZXR1cm4gW3NrLCBwa107XG4gIH1cblxuICAvLyBzaWcgPSAoeDAgKyB4MSphMSArIHgyKmEyICsgeDMqYTMgKyB4NCphNCkgKiBoXG4gIHN0YXRpYyBzaWduKHBhcmFtcywgc2ssIGNvaW4pIHtcbiAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcbiAgICBjb25zdCBbeDAsIHgxLCB4MiwgeDMsIHg0XSA9IHNrO1xuXG4gICAgLy8gdG9kbzogc2hvdWxkIGggYmUgYSBoYXNoIHRvIEcxIG9mIHNvbWUgYXR0cmlidXRlPyBpZiBzbyBvZiB3aGljaCBvbmU/XG4gICAgY29uc3QgcmFuZCA9IEcuY3R4LkJJRy5yYW5kb21udW0obywgRy5ybmdHZW4pO1xuICAgIGNvbnN0IGggPSBHLmN0eC5QQUlSLkcxbXVsKGcxLCByYW5kKTtcblxuICAgIGNvbnN0IGExID0gRy5oYXNoVG9CSUcoY29pbi52YWx1ZSk7XG4gICAgY29uc3QgYTIgPSBHLmhhc2hUb0JJRyhjb2luLnR0bCk7XG4gICAgY29uc3QgYTMgPSBHLmhhc2hHMkVsZW1Ub0JJRyhjb2luLnYpO1xuICAgIGNvbnN0IGE0ID0gRy5oYXNoRzJFbGVtVG9CSUcoY29pbi5pZCk7XG5cbiAgICAvLyBjYWxjdWxhdGUgYTEgbW9kIHAsIGEyIG1vZCBwLCBldGMuXG4gICAgY29uc3QgYTFfY3B5ID0gbmV3IEcuY3R4LkJJRyhhMSk7XG4gICAgYTFfY3B5Lm1vZChvKTtcblxuICAgIGNvbnN0IGEyX2NweSA9IG5ldyBHLmN0eC5CSUcoYTIpO1xuICAgIGEyX2NweS5tb2Qobyk7XG5cbiAgICBjb25zdCBhM19jcHkgPSBuZXcgRy5jdHguQklHKGEzKTtcbiAgICBhM19jcHkubW9kKG8pO1xuXG4gICAgY29uc3QgYTRfY3B5ID0gbmV3IEcuY3R4LkJJRyhhNCk7XG4gICAgYTRfY3B5Lm1vZChvKTtcblxuICAgIC8vIGNhbGN1bGF0ZSB0MSA9IHgxICogKGExIG1vZCBwKSwgdDIgPSB4MiAqIChhMiBtb2QgcCksIGV0Yy5cbiAgICBjb25zdCB0MSA9IEcuY3R4LkJJRy5tdWwoeDEsIGExX2NweSk7XG4gICAgY29uc3QgdDIgPSBHLmN0eC5CSUcubXVsKHgyLCBhMl9jcHkpO1xuICAgIGNvbnN0IHQzID0gRy5jdHguQklHLm11bCh4MywgYTNfY3B5KTtcbiAgICBjb25zdCB0NCA9IEcuY3R4LkJJRy5tdWwoeDQsIGE0X2NweSk7XG5cbiAgICAvLyBEQklHIGNvbnN0cnVjdG9yIGRvZXMgbm90IGFsbG93IHRvIHBhc3MgaXQgYSBCSUcgdmFsdWUgaGVuY2Ugd2UgY29weSBhbGwgd29yZCB2YWx1ZXMgbWFudWFsbHlcbiAgICBjb25zdCB4MERCSUcgPSBuZXcgRy5jdHguREJJRygwKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IEcuY3R4LkJJRy5OTEVOOyBpKyspIHtcbiAgICAgIHgwREJJRy53W2ldID0geDAud1tpXTtcbiAgICB9XG5cbiAgICAvLyB4MCArIHQxICsgdDIgKyAuLi5cbiAgICB4MERCSUcuYWRkKHQxKTtcbiAgICB4MERCSUcuYWRkKHQyKTtcbiAgICB4MERCSUcuYWRkKHQzKTtcbiAgICB4MERCSUcuYWRkKHQ0KTtcblxuICAgIC8vIEsgPSAoeDAgKyB4MSphMSArIHgyKmEyICsgLi4uKSBtb2QgcFxuICAgIGNvbnN0IEsgPSB4MERCSUcubW9kKG8pO1xuXG4gICAgLy8gc2lnID0gSyAqIGhcbiAgICBjb25zdCBzaWcgPSBHLmN0eC5QQUlSLkcxbXVsKGgsIEspO1xuXG4gICAgcmV0dXJuIFtoLCBzaWddO1xuICB9XG5cbiAgc3RhdGljIHZlcmlmeShwYXJhbXMsIHBrLCBjb2luLCBzaWcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0aWMgcmFuZG9taXplKHBhcmFtcywgc2lnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGljIGFnZ3JlZ2F0ZVNpZ25hdHVyZXMocGFyYW1zLCBzaWduYXR1cmVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGljIHZlcmlmeUFnZ3JlZ2F0aW9uKHBhcmFtcywgcGtzLCBjb2luLCBhZ2dyZWdhdGVTaWduYXR1cmUpIHtcbiAgICByZXR1cm47XG4gIH1cbn1cbiJdfQ==