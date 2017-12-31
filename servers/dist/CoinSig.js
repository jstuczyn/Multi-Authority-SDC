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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db2luU2lnLmpzIl0sIm5hbWVzIjpbIkNvaW5TaWciLCJHIiwiZzEiLCJnZW4xIiwiZzIiLCJnZW4yIiwiZSIsInBhaXIiLCJvIiwib3JkZXIiLCJwYXJhbXMiLCJ4MCIsImN0eCIsIkJJRyIsInJhbmRvbW51bSIsInJuZ0dlbiIsIngxIiwieDIiLCJ4MyIsIng0IiwiWDAiLCJQQUlSIiwiRzJtdWwiLCJYMSIsIlgyIiwiWDMiLCJYNCIsInNrIiwicGsiLCJjb2luIiwicmFuZCIsImgiLCJHMW11bCIsImExIiwidmFsdWUiLCJub3JtIiwiYTIiLCJoYXNoVG9CSUciLCJ0dGwiLCJ0b1N0cmluZyIsImEzIiwiaGFzaEcyRWxlbVRvQklHIiwidiIsImE0IiwiaWQiLCJhMV9jcHkiLCJtb2QiLCJhMl9jcHkiLCJhM19jcHkiLCJhNF9jcHkiLCJ0MSIsIm11bCIsInQyIiwidDMiLCJ0NCIsIngwREJJRyIsIkRCSUciLCJpIiwiTkxFTiIsInciLCJhZGQiLCJLIiwic2lnIiwiZyIsInNpZzEiLCJzaWcyIiwiRzJfdG1wMSIsIkcyX3RtcDIiLCJHMl90bXAzIiwiRzJfdG1wNCIsIlgwX2NweSIsIkVDUDIiLCJjb3B5IiwiYWZmaW5lIiwiR3RfMSIsIkd0XzIiLCJJTkYiLCJlcXVhbHMiLCJzaWduYXR1cmVzIiwicGtzIiwiYWdncmVnYXRlU2lnbmF0dXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztxakJBQUE7QUFDQTs7QUFFQTs7Ozs7Ozs7SUFFcUJBLE87Ozs7Ozs7NEJBQ0o7QUFDYixVQUFNQyxJQUFJLHVCQUFWOztBQUVBLFVBQU1DLEtBQUtELEVBQUVFLElBQWI7QUFDQSxVQUFNQyxLQUFLSCxFQUFFSSxJQUFiO0FBQ0EsVUFBTUMsSUFBSUwsRUFBRU0sSUFBWjtBQUNBLFVBQU1DLElBQUlQLEVBQUVRLEtBQVo7O0FBRUEsYUFBTyxDQUFDUixDQUFELEVBQUlPLENBQUosRUFBT04sRUFBUCxFQUFXRSxFQUFYLEVBQWVFLENBQWYsQ0FBUDtBQUNE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SztBQUM1QjtBQUNEOzs7d0NBRTBCcEQsTSxFQUFRb0UsVSxFQUFZO0FBQzdDO0FBQ0Q7OztzQ0FFd0JwRSxNLEVBQVFxRSxHLEVBQUtsRCxJLEVBQU1tRCxrQixFQUFvQjtBQUM5RDtBQUNEOzs7Ozs7a0JBcElrQmhGLE8iLCJmaWxlIjoiQ29pblNpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEEgc2xpZ2h0bHkgbW9kaWZpZWQgUG9pbnRjaGV2YWwtU2FuZGVycyBTaG9ydCBSYW5kb21pemFibGUgU2lnbmF0dXJlcyBzY2hlbWVcbi8vIHRvIGFsbG93IGZvciBsYXJnZXIgbnVtYmVyIG9mIHNpZ25lZCBtZXNzYWdlc1xuXG5pbXBvcnQgQnBHcm91cCBmcm9tICcuL0JwR3JvdXAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2luU2lnIHtcbiAgc3RhdGljIHNldHVwKCkge1xuICAgIGNvbnN0IEcgPSBuZXcgQnBHcm91cCgpO1xuXG4gICAgY29uc3QgZzEgPSBHLmdlbjE7XG4gICAgY29uc3QgZzIgPSBHLmdlbjI7XG4gICAgY29uc3QgZSA9IEcucGFpcjtcbiAgICBjb25zdCBvID0gRy5vcmRlcjtcblxuICAgIHJldHVybiBbRywgbywgZzEsIGcyLCBlXTtcbiAgfVxuXG4gIHN0YXRpYyBrZXlnZW4ocGFyYW1zKSB7XG4gICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG5cbiAgICBjb25zdCB4MCA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xuICAgIGNvbnN0IHgxID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XG4gICAgY29uc3QgeDIgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcbiAgICBjb25zdCB4MyA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xuICAgIGNvbnN0IHg0ID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XG5cbiAgICBjb25zdCBYMCA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgwKTtcbiAgICBjb25zdCBYMSA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgxKTtcbiAgICBjb25zdCBYMiA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgyKTtcbiAgICBjb25zdCBYMyA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgzKTtcbiAgICBjb25zdCBYNCA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIHg0KTtcblxuICAgIGNvbnN0IHNrID0gW3gwLCB4MSwgeDIsIHgzLCB4NF07XG4gICAgY29uc3QgcGsgPSBbZzIsIFgwLCBYMSwgWDIsIFgzLCBYNF07XG5cbiAgICByZXR1cm4gW3NrLCBwa107XG4gIH1cblxuICAvLyBzaWcgPSAoeDAgKyB4MSphMSArIHgyKmEyICsgeDMqYTMgKyB4NCphNCkgKiBoXG4gIHN0YXRpYyBzaWduKHBhcmFtcywgc2ssIGNvaW4pIHtcbiAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcbiAgICBjb25zdCBbeDAsIHgxLCB4MiwgeDMsIHg0XSA9IHNrO1xuXG4gICAgLy8gdG9kbzogc2hvdWxkIGggYmUgYSBoYXNoIHRvIEcxIG9mIHNvbWUgYXR0cmlidXRlPyBpZiBzbyBvZiB3aGljaCBvbmU/XG4gICAgY29uc3QgcmFuZCA9IEcuY3R4LkJJRy5yYW5kb21udW0obywgRy5ybmdHZW4pO1xuICAgIGNvbnN0IGggPSBHLmN0eC5QQUlSLkcxbXVsKGcxLCByYW5kKTtcblxuICAgIGNvbnN0IGExID0gbmV3IEcuY3R4LkJJRyhjb2luLnZhbHVlKTtcbiAgICBhMS5ub3JtKCk7XG4gICAgY29uc3QgYTIgPSBHLmhhc2hUb0JJRyhjb2luLnR0bC50b1N0cmluZygpKTtcbiAgICBjb25zdCBhMyA9IEcuaGFzaEcyRWxlbVRvQklHKGNvaW4udik7XG4gICAgY29uc3QgYTQgPSBHLmhhc2hHMkVsZW1Ub0JJRyhjb2luLmlkKTtcblxuICAgIC8vIGNhbGN1bGF0ZSBhMSBtb2QgcCwgYTIgbW9kIHAsIGV0Yy5cbiAgICBjb25zdCBhMV9jcHkgPSBuZXcgRy5jdHguQklHKGExKTtcbiAgICBhMV9jcHkubW9kKG8pO1xuXG4gICAgY29uc3QgYTJfY3B5ID0gbmV3IEcuY3R4LkJJRyhhMik7XG4gICAgYTJfY3B5Lm1vZChvKTtcblxuICAgIGNvbnN0IGEzX2NweSA9IG5ldyBHLmN0eC5CSUcoYTMpO1xuICAgIGEzX2NweS5tb2Qobyk7XG5cbiAgICBjb25zdCBhNF9jcHkgPSBuZXcgRy5jdHguQklHKGE0KTtcbiAgICBhNF9jcHkubW9kKG8pO1xuXG4gICAgLy8gY2FsY3VsYXRlIHQxID0geDEgKiAoYTEgbW9kIHApLCB0MiA9IHgyICogKGEyIG1vZCBwKSwgZXRjLlxuICAgIGNvbnN0IHQxID0gRy5jdHguQklHLm11bCh4MSwgYTFfY3B5KTtcbiAgICBjb25zdCB0MiA9IEcuY3R4LkJJRy5tdWwoeDIsIGEyX2NweSk7XG4gICAgY29uc3QgdDMgPSBHLmN0eC5CSUcubXVsKHgzLCBhM19jcHkpO1xuICAgIGNvbnN0IHQ0ID0gRy5jdHguQklHLm11bCh4NCwgYTRfY3B5KTtcblxuICAgIC8vIERCSUcgY29uc3RydWN0b3IgZG9lcyBub3QgYWxsb3cgdG8gcGFzcyBpdCBhIEJJRyB2YWx1ZSBoZW5jZSB3ZSBjb3B5IGFsbCB3b3JkIHZhbHVlcyBtYW51YWxseVxuICAgIGNvbnN0IHgwREJJRyA9IG5ldyBHLmN0eC5EQklHKDApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgRy5jdHguQklHLk5MRU47IGkrKykge1xuICAgICAgeDBEQklHLndbaV0gPSB4MC53W2ldO1xuICAgIH1cblxuICAgIC8vIHgwICsgdDEgKyB0MiArIC4uLlxuICAgIHgwREJJRy5hZGQodDEpO1xuICAgIHgwREJJRy5hZGQodDIpO1xuICAgIHgwREJJRy5hZGQodDMpO1xuICAgIHgwREJJRy5hZGQodDQpO1xuXG4gICAgLy8gSyA9ICh4MCArIHgxKmExICsgeDIqYTIgKyAuLi4pIG1vZCBwXG4gICAgY29uc3QgSyA9IHgwREJJRy5tb2Qobyk7XG5cbiAgICAvLyBzaWcgPSBLICogaFxuICAgIGNvbnN0IHNpZyA9IEcuY3R4LlBBSVIuRzFtdWwoaCwgSyk7XG5cbiAgICByZXR1cm4gW2gsIHNpZ107XG4gIH1cblxuICAvLyAgZShzaWcxLCBYMCArIGExICogWDEgKyAuLi4pID09IGUoc2lnMiwgZylcbiAgc3RhdGljIHZlcmlmeShwYXJhbXMsIHBrLCBjb2luLCBzaWcpIHtcbiAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcbiAgICBjb25zdCBbZywgWDAsIFgxLCBYMiwgWDMsIFg0XSA9IHBrO1xuICAgIGNvbnN0IFtzaWcxLCBzaWcyXSA9IHNpZztcblxuICAgIGNvbnN0IGExID0gbmV3IEcuY3R4LkJJRyhjb2luLnZhbHVlKTtcbiAgICBhMS5ub3JtKCk7XG4gICAgY29uc3QgYTIgPSBHLmhhc2hUb0JJRyhjb2luLnR0bC50b1N0cmluZygpKTtcbiAgICBjb25zdCBhMyA9IEcuaGFzaEcyRWxlbVRvQklHKGNvaW4udik7XG4gICAgY29uc3QgYTQgPSBHLmhhc2hHMkVsZW1Ub0JJRyhjb2luLmlkKTtcblxuICAgIGNvbnN0IEcyX3RtcDEgPSBHLmN0eC5QQUlSLkcybXVsKFgxLCBhMSk7XG4gICAgY29uc3QgRzJfdG1wMiA9IEcuY3R4LlBBSVIuRzJtdWwoWDIsIGEyKTtcbiAgICBjb25zdCBHMl90bXAzID0gRy5jdHguUEFJUi5HMm11bChYMywgYTMpO1xuICAgIGNvbnN0IEcyX3RtcDQgPSBHLmN0eC5QQUlSLkcybXVsKFg0LCBhNCk7XG5cbiAgICAvLyBzbyB0aGF0IHRoZSBvcmlnaW5hbCBrZXkgd291bGRuJ3QgYmUgbXV0YXRlZFxuICAgIGNvbnN0IFgwX2NweSA9IG5ldyBHLmN0eC5FQ1AyKCk7XG5cbiAgICBYMF9jcHkuY29weShYMCk7XG4gICAgWDBfY3B5LmFkZChHMl90bXAxKTtcbiAgICBYMF9jcHkuYWRkKEcyX3RtcDIpO1xuICAgIFgwX2NweS5hZGQoRzJfdG1wMyk7XG4gICAgWDBfY3B5LmFkZChHMl90bXA0KTtcblxuICAgIFgwX2NweS5hZmZpbmUoKTtcblxuICAgIGNvbnN0IEd0XzEgPSBlKHNpZzEsIFgwX2NweSk7XG4gICAgY29uc3QgR3RfMiA9IGUoc2lnMiwgZyk7XG5cbiAgICByZXR1cm4gIXNpZzIuSU5GICYmIEd0XzEuZXF1YWxzKEd0XzIpO1xuICB9XG5cbiAgc3RhdGljIHJhbmRvbWl6ZShwYXJhbXMsIHNpZykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN0YXRpYyBhZ2dyZWdhdGVTaWduYXR1cmVzKHBhcmFtcywgc2lnbmF0dXJlcykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN0YXRpYyB2ZXJpZnlBZ2dyZWdhdGlvbihwYXJhbXMsIHBrcywgY29pbiwgYWdncmVnYXRlU2lnbmF0dXJlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG4iXX0=