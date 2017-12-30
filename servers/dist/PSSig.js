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

var PSSig = function () {
  function PSSig() {
    _classCallCheck(this, PSSig);
  }

  _createClass(PSSig, null, [{
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

      // Target values:


      var x = G.ctx.BIG.randomnum(G.order, G.rngGen);
      var y = G.ctx.BIG.randomnum(G.order, G.rngGen);

      var sk = [x, y];
      var pk = [g2, G.ctx.PAIR.G2mul(g2, x), G.ctx.PAIR.G2mul(g2, y)];

      return [sk, pk];
    }

    // sig = (x+y*m) * h

  }, {
    key: 'sign',
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
    key: 'verify',
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
    key: 'verifyAggregation',
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
        if (i === 0) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QU1NpZy5qcyJdLCJuYW1lcyI6WyJQU1NpZyIsIkciLCJnMSIsImdlbjEiLCJnMiIsImdlbjIiLCJlIiwicGFpciIsIm8iLCJvcmRlciIsInBhcmFtcyIsIngiLCJjdHgiLCJCSUciLCJyYW5kb21udW0iLCJybmdHZW4iLCJ5Iiwic2siLCJwayIsIlBBSVIiLCJHMm11bCIsIm0iLCJpc01lc3NhZ2VIYXNoZWQiLCJoIiwiaGFzaFRvUG9pbnRPbkN1cnZlIiwiaGFzaFRvQklHIiwibWNweSIsIm1vZCIsInQxIiwibXVsIiwieERCSUciLCJEQklHIiwiaSIsIk5MRU4iLCJ3IiwiYWRkIiwiSyIsInNpZyIsIkcxbXVsIiwiZyIsIlgiLCJZIiwic2lnMSIsInNpZzIiLCJHMl90bXAxIiwiYWZmaW5lIiwiR3RfMSIsIkd0XzIiLCJJTkYiLCJlcXVhbHMiLCJ0Iiwic2lnbmF0dXJlcyIsImFnZ3JlZ2F0ZVNpZ25hdHVyZSIsIkVDUCIsImNvcHkiLCJsZW5ndGgiLCJwa3MiLCJhZ2dyZWdhdGVTaWduIiwiYWdncmVnYXRlIiwiRUNQMiIsIkcyX3RtcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztJQUVxQkEsSzs7Ozs7Ozs0QkFDSjtBQUNiLFVBQU1DLElBQUksdUJBQVY7O0FBRUEsVUFBTUMsS0FBS0QsRUFBRUUsSUFBYjtBQUNBLFVBQU1DLEtBQUtILEVBQUVJLElBQWI7QUFDQSxVQUFNQyxJQUFJTCxFQUFFTSxJQUFaO0FBQ0EsVUFBTUMsSUFBSVAsRUFBRVEsS0FBWjs7QUFFQSxhQUFPLENBQUNSLENBQUQsRUFBSU8sQ0FBSixFQUFPTixFQUFQLEVBQVdFLEVBQVgsRUFBZUUsQ0FBZixDQUFQO0FBQ0Q7OzsyQkFFYUksTSxFQUFRO0FBQUEsbUNBQ01BLE1BRE47QUFBQSxVQUNiVCxDQURhO0FBQUEsVUFDVk8sQ0FEVTtBQUFBLFVBQ1BOLEVBRE87QUFBQSxVQUNIRSxFQURHO0FBQUEsVUFDQ0UsQ0FERDs7QUFHcEI7OztBQUNB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QW9CcEIsQ0FBcEIsQ0FBZjtBQUNBdUMsZUFBT3pCLEdBQVAsQ0FBV0ssQ0FBWDtBQUNBb0IsZUFBT2YsTUFBUDtBQUNBLFlBQUliLE1BQU0sQ0FBVixFQUFhO0FBQ1gwQixvQkFBVUosSUFBVixDQUFlTSxNQUFmO0FBQ0QsU0FGRCxNQUVPO0FBQ0xGLG9CQUFVdkIsR0FBVixDQUFjeUIsTUFBZDtBQUNEO0FBQ0Y7QUFDREYsZ0JBQVViLE1BQVY7QUFDQSxVQUFNRSxPQUFPekMsRUFBRWlCLENBQUYsRUFBS21DLFNBQUwsQ0FBYjs7QUFFQSxhQUFPWixLQUFLRyxNQUFMLENBQVlGLElBQVosQ0FBUDtBQUNEOzs7Ozs7a0JBbklrQi9DLEsiLCJmaWxlIjoiUFNTaWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnBHcm91cCBmcm9tICcuL0JwR3JvdXAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQU1NpZyB7XG4gIHN0YXRpYyBzZXR1cCgpIHtcbiAgICBjb25zdCBHID0gbmV3IEJwR3JvdXAoKTtcblxuICAgIGNvbnN0IGcxID0gRy5nZW4xO1xuICAgIGNvbnN0IGcyID0gRy5nZW4yO1xuICAgIGNvbnN0IGUgPSBHLnBhaXI7XG4gICAgY29uc3QgbyA9IEcub3JkZXI7XG5cbiAgICByZXR1cm4gW0csIG8sIGcxLCBnMiwgZV07XG4gIH1cblxuICBzdGF0aWMga2V5Z2VuKHBhcmFtcykge1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuXG4gICAgLy8gVGFyZ2V0IHZhbHVlczpcbiAgICBjb25zdCB4ID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XG4gICAgY29uc3QgeSA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xuXG4gICAgY29uc3Qgc2sgPSBbeCwgeV07XG4gICAgY29uc3QgcGsgPSBbZzIsIEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgpLCBHLmN0eC5QQUlSLkcybXVsKGcyLCB5KV07XG5cbiAgICByZXR1cm4gW3NrLCBwa107XG4gIH1cblxuICAvLyBzaWcgPSAoeCt5Km0pICogaFxuICBzdGF0aWMgc2lnbihwYXJhbXMsIHNrLCBtLCBpc01lc3NhZ2VIYXNoZWQgPSBmYWxzZSkge1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xuXG4gICAgLy8gUkFORE9NIGg6XG4gICAgLy8gY29uc3QgcmFuZCA9IEcuY3R4LkJJRy5yYW5kb21udW0obywgRy5ybmdHZW4pO1xuICAgIC8vIGNvbnN0IGggPSBHLmN0eC5QQUlSLkcxbXVsKGcxLCByYW5kKTtcblxuICAgIC8vIGggYmVpbmcgaGFzaCBvZiBtZXNzYWdlIHRvIHBvaW50IG9uIHRoZSBjdXJ2ZVxuICAgIGNvbnN0IGggPSBHLmhhc2hUb1BvaW50T25DdXJ2ZShtKTtcblxuICAgIGlmICghaXNNZXNzYWdlSGFzaGVkKSB7XG4gICAgICBtID0gRy5oYXNoVG9CSUcobSk7XG4gICAgfVxuXG4gICAgLy8gbWNweSA9IG0gbW9kIHBcbiAgICBjb25zdCBtY3B5ID0gbmV3IEcuY3R4LkJJRyhtKTtcbiAgICBtY3B5Lm1vZChvKTtcblxuICAgIC8vIHQxID0geSAqIChtIG1vZCBwKVxuICAgIGNvbnN0IHQxID0gRy5jdHguQklHLm11bCh5LCBtY3B5KTtcblxuICAgIC8vIERCSUcgY29uc3RydWN0b3IgZG9lcyBub3QgYWxsb3cgdG8gcGFzcyBpdCBhIEJJRyB2YWx1ZSBoZW5jZSB3ZSBjb3B5IGFsbCB3b3JkIHZhbHVlcyBtYW51YWxseVxuICAgIGNvbnN0IHhEQklHID0gbmV3IEcuY3R4LkRCSUcoMCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBHLmN0eC5CSUcuTkxFTjsgaSsrKSB7XG4gICAgICB4REJJRy53W2ldID0geC53W2ldO1xuICAgIH1cblxuICAgIC8vIHQxID0geCArIHkgKiAobSBtb2QgcClcbiAgICB0MS5hZGQoeERCSUcpO1xuXG4gICAgLy8gSyA9ICh4ICsgeSAqIChtIG1vZCBwKSkgbW9kIHBcbiAgICBjb25zdCBLID0gdDEubW9kKG8pO1xuXG4gICAgLy8gc2lnID0gSyAqIGhcbiAgICBjb25zdCBzaWcgPSBHLmN0eC5QQUlSLkcxbXVsKGgsIEspO1xuXG4gICAgcmV0dXJuIFtoLCBzaWddO1xuICB9XG5cbiAgLy8gIGUoc2lnMSwgWCArIG0gKiBZKSA9PSBlKHNpZzIsIGcpXG4gIHN0YXRpYyB2ZXJpZnkocGFyYW1zLCBwaywgbSwgc2lnKSB7XG4gICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG4gICAgY29uc3QgW2csIFgsIFldID0gcGs7XG4gICAgY29uc3QgW3NpZzEsIHNpZzJdID0gc2lnO1xuXG4gICAgbSA9IEcuaGFzaFRvQklHKG0pO1xuXG4gICAgY29uc3QgRzJfdG1wMSA9IEcuY3R4LlBBSVIuRzJtdWwoWSwgbSk7XG4gICAgRzJfdG1wMS5hZGQoWCk7XG4gICAgRzJfdG1wMS5hZmZpbmUoKTtcblxuICAgIGNvbnN0IEd0XzEgPSBlKHNpZzEsIEcyX3RtcDEpO1xuICAgIGNvbnN0IEd0XzIgPSBlKHNpZzIsIGcpO1xuXG4gICAgcmV0dXJuICFzaWcyLklORiAmJiBHdF8xLmVxdWFscyhHdF8yKTtcbiAgfVxuXG4gIHN0YXRpYyByYW5kb21pemUocGFyYW1zLCBzaWcpIHtcbiAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcbiAgICBjb25zdCBbc2lnMSwgc2lnMl0gPSBzaWc7XG4gICAgY29uc3QgdCA9IEcuY3R4LkJJRy5yYW5kb21udW0oRy5vcmRlciwgRy5ybmdHZW4pO1xuXG4gICAgcmV0dXJuIFtHLmN0eC5QQUlSLkcxbXVsKHNpZzEsIHQpLCBHLmN0eC5QQUlSLkcxbXVsKHNpZzIsIHQpXTtcbiAgfVxuXG5cbiAgc3RhdGljIGFnZ3JlZ2F0ZVNpZ25hdHVyZXMocGFyYW1zLCBzaWduYXR1cmVzKSB7XG4gICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG5cbiAgICBjb25zdCBhZ2dyZWdhdGVTaWduYXR1cmUgPSBuZXcgRy5jdHguRUNQKCk7XG4gICAgYWdncmVnYXRlU2lnbmF0dXJlLmNvcHkoc2lnbmF0dXJlc1swXVsxXSk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNpZ25hdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFnZ3JlZ2F0ZVNpZ25hdHVyZS5hZGQoc2lnbmF0dXJlc1tpXVsxXSk7XG4gICAgfVxuXG4gICAgYWdncmVnYXRlU2lnbmF0dXJlLmFmZmluZSgpO1xuICAgIHJldHVybiBbc2lnbmF0dXJlc1swXVswXSwgYWdncmVnYXRlU2lnbmF0dXJlXTsgLy8gc28gcmV0dXJucyBIKG0pLCBTYVxuICB9XG5cbiAgc3RhdGljIHZlcmlmeUFnZ3JlZ2F0aW9uKHBhcmFtcywgcGtzLCBtLCBhZ2dyZWdhdGVTaWduYXR1cmUpIHtcbiAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcbiAgICBjb25zdCBbaCwgYWdncmVnYXRlU2lnbl0gPSBhZ2dyZWdhdGVTaWduYXR1cmU7XG5cbiAgICBjb25zdCBHdF8xID0gZShhZ2dyZWdhdGVTaWduLCBnMik7XG5cbiAgICBtID0gRy5oYXNoVG9CSUcobSk7XG4gICAgY29uc3QgYWdncmVnYXRlID0gbmV3IEcuY3R4LkVDUDIoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGtzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBbZywgWCwgWV0gPSBwa3NbaV07XG4gICAgICBjb25zdCBHMl90bXAgPSBHLmN0eC5QQUlSLkcybXVsKFksIG0pO1xuICAgICAgRzJfdG1wLmFkZChYKTtcbiAgICAgIEcyX3RtcC5hZmZpbmUoKTtcbiAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgIGFnZ3JlZ2F0ZS5jb3B5KEcyX3RtcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZ2dyZWdhdGUuYWRkKEcyX3RtcCk7XG4gICAgICB9XG4gICAgfVxuICAgIGFnZ3JlZ2F0ZS5hZmZpbmUoKTtcbiAgICBjb25zdCBHdF8yID0gZShoLCBhZ2dyZWdhdGUpO1xuXG4gICAgcmV0dXJuIEd0XzEuZXF1YWxzKEd0XzIpO1xuICB9XG59XG4iXX0=