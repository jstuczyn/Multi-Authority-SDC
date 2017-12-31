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

      var a1 = new G.ctx.BIG(coin.value);
      a1.norm();
      var a2 = G.hashToBIG(coin.ttl.toString());
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

    //  e(sig1, X0 + a1 * X1 + ...) == e(sig2, g)

  }, {
    key: 'verify',
    value: function verify(params, pk, coin, sig) {
      var _params3 = _slicedToArray(params, 5),
          G = _params3[0],
          o = _params3[1],
          g1 = _params3[2],
          g2 = _params3[3],
          e = _params3[4];

      var _pk = _slicedToArray(pk, 6),
          g = _pk[0],
          X0 = _pk[1],
          X1 = _pk[2],
          X2 = _pk[3],
          X3 = _pk[4],
          X4 = _pk[5];

      var _sig = _slicedToArray(sig, 2),
          sig1 = _sig[0],
          sig2 = _sig[1];

      var a1 = new G.ctx.BIG(coin.value);
      a1.norm();
      var a2 = G.hashToBIG(coin.ttl.toString());
      var a3 = G.hashG2ElemToBIG(coin.v);
      var a4 = G.hashG2ElemToBIG(coin.id);

      var G2_tmp1 = G.ctx.PAIR.G2mul(X1, a1);
      var G2_tmp2 = G.ctx.PAIR.G2mul(X2, a2);
      var G2_tmp3 = G.ctx.PAIR.G2mul(X3, a3);
      var G2_tmp4 = G.ctx.PAIR.G2mul(X4, a4);

      // so that the original key wouldn't be mutated
      var X0_cpy = new G.ctx.ECP2();

      X0_cpy.copy(X0);
      X0_cpy.add(G2_tmp1);
      X0_cpy.add(G2_tmp2);
      X0_cpy.add(G2_tmp3);
      X0_cpy.add(G2_tmp4);

      X0_cpy.affine();

      var Gt_1 = e(sig1, X0_cpy);
      var Gt_2 = e(sig2, g);

      return !sig2.INF && Gt_1.equals(Gt_2);
    }
  }, {
    key: 'randomize',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db2luU2lnLmpzIl0sIm5hbWVzIjpbIkNvaW5TaWciLCJHIiwiZzEiLCJnZW4xIiwiZzIiLCJnZW4yIiwiZSIsInBhaXIiLCJvIiwib3JkZXIiLCJwYXJhbXMiLCJ4MCIsImN0eCIsIkJJRyIsInJhbmRvbW51bSIsInJuZ0dlbiIsIngxIiwieDIiLCJ4MyIsIng0IiwiWDAiLCJQQUlSIiwiRzJtdWwiLCJYMSIsIlgyIiwiWDMiLCJYNCIsInNrIiwicGsiLCJjb2luIiwicmFuZCIsImgiLCJHMW11bCIsImExIiwidmFsdWUiLCJub3JtIiwiYTIiLCJoYXNoVG9CSUciLCJ0dGwiLCJ0b1N0cmluZyIsImEzIiwiaGFzaEcyRWxlbVRvQklHIiwidiIsImE0IiwiaWQiLCJhMV9jcHkiLCJtb2QiLCJhMl9jcHkiLCJhM19jcHkiLCJhNF9jcHkiLCJ0MSIsIm11bCIsInQyIiwidDMiLCJ0NCIsIngwREJJRyIsIkRCSUciLCJpIiwiTkxFTiIsInciLCJhZGQiLCJLIiwic2lnIiwiZyIsInNpZzEiLCJzaWcyIiwiRzJfdG1wMSIsIkcyX3RtcDIiLCJHMl90bXAzIiwiRzJfdG1wNCIsIlgwX2NweSIsIkVDUDIiLCJjb3B5IiwiYWZmaW5lIiwiR3RfMSIsIkd0XzIiLCJJTkYiLCJlcXVhbHMiLCJ0Iiwic2lnbmF0dXJlcyIsInBrcyIsImFnZ3JlZ2F0ZVNpZ25hdHVyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7cWpCQUFBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0lBRXFCQSxPOzs7Ozs7OzRCQUNKO0FBQ2IsVUFBTUMsSUFBSSx1QkFBVjs7QUFFQSxVQUFNQyxLQUFLRCxFQUFFRSxJQUFiO0FBQ0EsVUFBTUMsS0FBS0gsRUFBRUksSUFBYjtBQUNBLFVBQU1DLElBQUlMLEVBQUVNLElBQVo7QUFDQSxVQUFNQyxJQUFJUCxFQUFFUSxLQUFaOztBQUVBLGFBQU8sQ0FBQ1IsQ0FBRCxFQUFJTyxDQUFKLEVBQU9OLEVBQVAsRUFBV0UsRUFBWCxFQUFlRSxDQUFmLENBQVA7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LEVBQUs7QUFBQSxvQ0FDRnBELE1BREU7QUFBQSxVQUNyQlQsQ0FEcUI7QUFBQSxVQUNsQk8sQ0FEa0I7QUFBQSxVQUNmTixFQURlO0FBQUEsVUFDWEUsRUFEVztBQUFBLFVBQ1BFLENBRE87O0FBQUEsaUNBRVB3RCxHQUZPO0FBQUEsVUFFckJFLElBRnFCO0FBQUEsVUFFZkMsSUFGZTs7QUFHNUIsVUFBTWEsSUFBSTdFLEVBQUVXLEdBQUYsQ0FBTUMsR0FBTixDQUFVQyxTQUFWLENBQW9CYixFQUFFUSxLQUF0QixFQUE2QlIsRUFBRWMsTUFBL0IsQ0FBVjs7QUFFQSxhQUFPLENBQUNkLEVBQUVXLEdBQUYsQ0FBTVMsSUFBTixDQUFXVyxLQUFYLENBQWlCZ0MsSUFBakIsRUFBdUJjLENBQXZCLENBQUQsRUFBNEI3RSxFQUFFVyxHQUFGLENBQU1TLElBQU4sQ0FBV1csS0FBWCxDQUFpQmlDLElBQWpCLEVBQXVCYSxDQUF2QixDQUE1QixDQUFQO0FBQ0Q7Ozt3Q0FFMEJwRSxNLEVBQVFxRSxVLEVBQVk7QUFDN0M7QUFDRDs7O3NDQUV3QnJFLE0sRUFBUXNFLEcsRUFBS25ELEksRUFBTW9ELGtCLEVBQW9CO0FBQzlEO0FBQ0Q7Ozs7OztrQkF4SWtCakYsTyIsImZpbGUiOiJDb2luU2lnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQSBzbGlnaHRseSBtb2RpZmllZCBQb2ludGNoZXZhbC1TYW5kZXJzIFNob3J0IFJhbmRvbWl6YWJsZSBTaWduYXR1cmVzIHNjaGVtZVxuLy8gdG8gYWxsb3cgZm9yIGxhcmdlciBudW1iZXIgb2Ygc2lnbmVkIG1lc3NhZ2VzXG5cbmltcG9ydCBCcEdyb3VwIGZyb20gJy4vQnBHcm91cCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvaW5TaWcge1xuICBzdGF0aWMgc2V0dXAoKSB7XG4gICAgY29uc3QgRyA9IG5ldyBCcEdyb3VwKCk7XG5cbiAgICBjb25zdCBnMSA9IEcuZ2VuMTtcbiAgICBjb25zdCBnMiA9IEcuZ2VuMjtcbiAgICBjb25zdCBlID0gRy5wYWlyO1xuICAgIGNvbnN0IG8gPSBHLm9yZGVyO1xuXG4gICAgcmV0dXJuIFtHLCBvLCBnMSwgZzIsIGVdO1xuICB9XG5cbiAgc3RhdGljIGtleWdlbihwYXJhbXMpIHtcbiAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcblxuICAgIGNvbnN0IHgwID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XG4gICAgY29uc3QgeDEgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcbiAgICBjb25zdCB4MiA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xuICAgIGNvbnN0IHgzID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XG4gICAgY29uc3QgeDQgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcblxuICAgIGNvbnN0IFgwID0gRy5jdHguUEFJUi5HMm11bChnMiwgeDApO1xuICAgIGNvbnN0IFgxID0gRy5jdHguUEFJUi5HMm11bChnMiwgeDEpO1xuICAgIGNvbnN0IFgyID0gRy5jdHguUEFJUi5HMm11bChnMiwgeDIpO1xuICAgIGNvbnN0IFgzID0gRy5jdHguUEFJUi5HMm11bChnMiwgeDMpO1xuICAgIGNvbnN0IFg0ID0gRy5jdHguUEFJUi5HMm11bChnMiwgeDQpO1xuXG4gICAgY29uc3Qgc2sgPSBbeDAsIHgxLCB4MiwgeDMsIHg0XTtcbiAgICBjb25zdCBwayA9IFtnMiwgWDAsIFgxLCBYMiwgWDMsIFg0XTtcblxuICAgIHJldHVybiBbc2ssIHBrXTtcbiAgfVxuXG4gIC8vIHNpZyA9ICh4MCArIHgxKmExICsgeDIqYTIgKyB4MyphMyArIHg0KmE0KSAqIGhcbiAgc3RhdGljIHNpZ24ocGFyYW1zLCBzaywgY29pbikge1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgIGNvbnN0IFt4MCwgeDEsIHgyLCB4MywgeDRdID0gc2s7XG5cbiAgICAvLyB0b2RvOiBzaG91bGQgaCBiZSBhIGhhc2ggdG8gRzEgb2Ygc29tZSBhdHRyaWJ1dGU/IGlmIHNvIG9mIHdoaWNoIG9uZT9cbiAgICBjb25zdCByYW5kID0gRy5jdHguQklHLnJhbmRvbW51bShvLCBHLnJuZ0dlbik7XG4gICAgY29uc3QgaCA9IEcuY3R4LlBBSVIuRzFtdWwoZzEsIHJhbmQpO1xuXG4gICAgY29uc3QgYTEgPSBuZXcgRy5jdHguQklHKGNvaW4udmFsdWUpO1xuICAgIGExLm5vcm0oKTtcbiAgICBjb25zdCBhMiA9IEcuaGFzaFRvQklHKGNvaW4udHRsLnRvU3RyaW5nKCkpO1xuICAgIGNvbnN0IGEzID0gRy5oYXNoRzJFbGVtVG9CSUcoY29pbi52KTtcbiAgICBjb25zdCBhNCA9IEcuaGFzaEcyRWxlbVRvQklHKGNvaW4uaWQpO1xuXG4gICAgLy8gY2FsY3VsYXRlIGExIG1vZCBwLCBhMiBtb2QgcCwgZXRjLlxuICAgIGNvbnN0IGExX2NweSA9IG5ldyBHLmN0eC5CSUcoYTEpO1xuICAgIGExX2NweS5tb2Qobyk7XG5cbiAgICBjb25zdCBhMl9jcHkgPSBuZXcgRy5jdHguQklHKGEyKTtcbiAgICBhMl9jcHkubW9kKG8pO1xuXG4gICAgY29uc3QgYTNfY3B5ID0gbmV3IEcuY3R4LkJJRyhhMyk7XG4gICAgYTNfY3B5Lm1vZChvKTtcblxuICAgIGNvbnN0IGE0X2NweSA9IG5ldyBHLmN0eC5CSUcoYTQpO1xuICAgIGE0X2NweS5tb2Qobyk7XG5cbiAgICAvLyBjYWxjdWxhdGUgdDEgPSB4MSAqIChhMSBtb2QgcCksIHQyID0geDIgKiAoYTIgbW9kIHApLCBldGMuXG4gICAgY29uc3QgdDEgPSBHLmN0eC5CSUcubXVsKHgxLCBhMV9jcHkpO1xuICAgIGNvbnN0IHQyID0gRy5jdHguQklHLm11bCh4MiwgYTJfY3B5KTtcbiAgICBjb25zdCB0MyA9IEcuY3R4LkJJRy5tdWwoeDMsIGEzX2NweSk7XG4gICAgY29uc3QgdDQgPSBHLmN0eC5CSUcubXVsKHg0LCBhNF9jcHkpO1xuXG4gICAgLy8gREJJRyBjb25zdHJ1Y3RvciBkb2VzIG5vdCBhbGxvdyB0byBwYXNzIGl0IGEgQklHIHZhbHVlIGhlbmNlIHdlIGNvcHkgYWxsIHdvcmQgdmFsdWVzIG1hbnVhbGx5XG4gICAgY29uc3QgeDBEQklHID0gbmV3IEcuY3R4LkRCSUcoMCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBHLmN0eC5CSUcuTkxFTjsgaSsrKSB7XG4gICAgICB4MERCSUcud1tpXSA9IHgwLndbaV07XG4gICAgfVxuXG4gICAgLy8geDAgKyB0MSArIHQyICsgLi4uXG4gICAgeDBEQklHLmFkZCh0MSk7XG4gICAgeDBEQklHLmFkZCh0Mik7XG4gICAgeDBEQklHLmFkZCh0Myk7XG4gICAgeDBEQklHLmFkZCh0NCk7XG5cbiAgICAvLyBLID0gKHgwICsgeDEqYTEgKyB4MiphMiArIC4uLikgbW9kIHBcbiAgICBjb25zdCBLID0geDBEQklHLm1vZChvKTtcblxuICAgIC8vIHNpZyA9IEsgKiBoXG4gICAgY29uc3Qgc2lnID0gRy5jdHguUEFJUi5HMW11bChoLCBLKTtcblxuICAgIHJldHVybiBbaCwgc2lnXTtcbiAgfVxuXG4gIC8vICBlKHNpZzEsIFgwICsgYTEgKiBYMSArIC4uLikgPT0gZShzaWcyLCBnKVxuICBzdGF0aWMgdmVyaWZ5KHBhcmFtcywgcGssIGNvaW4sIHNpZykge1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgIGNvbnN0IFtnLCBYMCwgWDEsIFgyLCBYMywgWDRdID0gcGs7XG4gICAgY29uc3QgW3NpZzEsIHNpZzJdID0gc2lnO1xuXG4gICAgY29uc3QgYTEgPSBuZXcgRy5jdHguQklHKGNvaW4udmFsdWUpO1xuICAgIGExLm5vcm0oKTtcbiAgICBjb25zdCBhMiA9IEcuaGFzaFRvQklHKGNvaW4udHRsLnRvU3RyaW5nKCkpO1xuICAgIGNvbnN0IGEzID0gRy5oYXNoRzJFbGVtVG9CSUcoY29pbi52KTtcbiAgICBjb25zdCBhNCA9IEcuaGFzaEcyRWxlbVRvQklHKGNvaW4uaWQpO1xuXG4gICAgY29uc3QgRzJfdG1wMSA9IEcuY3R4LlBBSVIuRzJtdWwoWDEsIGExKTtcbiAgICBjb25zdCBHMl90bXAyID0gRy5jdHguUEFJUi5HMm11bChYMiwgYTIpO1xuICAgIGNvbnN0IEcyX3RtcDMgPSBHLmN0eC5QQUlSLkcybXVsKFgzLCBhMyk7XG4gICAgY29uc3QgRzJfdG1wNCA9IEcuY3R4LlBBSVIuRzJtdWwoWDQsIGE0KTtcblxuICAgIC8vIHNvIHRoYXQgdGhlIG9yaWdpbmFsIGtleSB3b3VsZG4ndCBiZSBtdXRhdGVkXG4gICAgY29uc3QgWDBfY3B5ID0gbmV3IEcuY3R4LkVDUDIoKTtcblxuICAgIFgwX2NweS5jb3B5KFgwKTtcbiAgICBYMF9jcHkuYWRkKEcyX3RtcDEpO1xuICAgIFgwX2NweS5hZGQoRzJfdG1wMik7XG4gICAgWDBfY3B5LmFkZChHMl90bXAzKTtcbiAgICBYMF9jcHkuYWRkKEcyX3RtcDQpO1xuXG4gICAgWDBfY3B5LmFmZmluZSgpO1xuXG4gICAgY29uc3QgR3RfMSA9IGUoc2lnMSwgWDBfY3B5KTtcbiAgICBjb25zdCBHdF8yID0gZShzaWcyLCBnKTtcblxuICAgIHJldHVybiAhc2lnMi5JTkYgJiYgR3RfMS5lcXVhbHMoR3RfMik7XG4gIH1cblxuICBzdGF0aWMgcmFuZG9taXplKHBhcmFtcywgc2lnKSB7XG4gICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG4gICAgY29uc3QgW3NpZzEsIHNpZzJdID0gc2lnO1xuICAgIGNvbnN0IHQgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcblxuICAgIHJldHVybiBbRy5jdHguUEFJUi5HMW11bChzaWcxLCB0KSwgRy5jdHguUEFJUi5HMW11bChzaWcyLCB0KV07XG4gIH1cblxuICBzdGF0aWMgYWdncmVnYXRlU2lnbmF0dXJlcyhwYXJhbXMsIHNpZ25hdHVyZXMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0aWMgdmVyaWZ5QWdncmVnYXRpb24ocGFyYW1zLCBwa3MsIGNvaW4sIGFnZ3JlZ2F0ZVNpZ25hdHVyZSkge1xuICAgIHJldHVybjtcbiAgfVxufVxuIl19