'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _mocha = require('mocha');

var _chai = require('chai');

var _CoinSig = require('../CoinSig');

var _CoinSig2 = _interopRequireDefault(_CoinSig);

var _BpGroup = require('../BpGroup');

var _BpGroup2 = _interopRequireDefault(_BpGroup);

var _Coin = require('../Coin');

var _Coin2 = _interopRequireDefault(_Coin);

var _auxiliary = require('../auxiliary');

var _BLSSig = require('../BLSSig');

var _BLSSig2 = _interopRequireDefault(_BLSSig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('CoinSig Scheme', function () {
  (0, _mocha.describe)('Setup', function () {
    var params = _CoinSig2.default.setup();

    var _params = _slicedToArray(params, 5),
        G = _params[0],
        o = _params[1],
        g1 = _params[2],
        g2 = _params[3],
        e = _params[4];

    (0, _mocha.it)('Returns BpGroup Object', function () {
      _chai.assert.isNotNull(G);
      _chai.assert.isTrue(G instanceof _BpGroup2.default);
    });

    (0, _mocha.it)('Returns Group Order', function () {
      _chai.assert.isNotNull(o);
      _chai.assert.isTrue(o instanceof G.ctx.BIG);
    });

    (0, _mocha.it)('Returns Gen1', function () {
      _chai.assert.isNotNull(g1);
      _chai.assert.isTrue(g1 instanceof G.ctx.ECP);
    });

    (0, _mocha.it)('Returns Gen2', function () {
      _chai.assert.isNotNull(g2);
      _chai.assert.isTrue(g2 instanceof G.ctx.ECP2);
    });

    (0, _mocha.it)('Returns Pair function', function () {
      _chai.assert.isNotNull(e);
      _chai.assert.isTrue(e instanceof Function);
    });
  });

  (0, _mocha.describe)('Keygen', function () {
    var params = _CoinSig2.default.setup();

    var _params2 = _slicedToArray(params, 5),
        G = _params2[0],
        o = _params2[1],
        g1 = _params2[2],
        g2 = _params2[3],
        e = _params2[4];

    var _CoinSig$keygen = _CoinSig2.default.keygen(params),
        _CoinSig$keygen2 = _slicedToArray(_CoinSig$keygen, 2),
        sk = _CoinSig$keygen2[0],
        pk = _CoinSig$keygen2[1];

    var _sk = _slicedToArray(sk, 5),
        x0 = _sk[0],
        x1 = _sk[1],
        x2 = _sk[2],
        x3 = _sk[3],
        x4 = _sk[4];

    var _pk = _slicedToArray(pk, 6),
        g = _pk[0],
        X0 = _pk[1],
        X1 = _pk[2],
        X2 = _pk[3],
        X3 = _pk[4],
        X4 = _pk[5];

    (0, _mocha.it)('Returns Secret Key (x0, x1, x2, x3, x4)', function () {
      _chai.assert.isTrue(x0 instanceof G.ctx.BIG);
      _chai.assert.isTrue(x1 instanceof G.ctx.BIG);
      _chai.assert.isTrue(x2 instanceof G.ctx.BIG);
      _chai.assert.isTrue(x3 instanceof G.ctx.BIG);
      _chai.assert.isTrue(x4 instanceof G.ctx.BIG);
    });

    (0, _mocha.describe)('Returns Valid Private Key (g, X0, X1, X2, X3, X4)', function () {
      (0, _mocha.it)('g = g2', function () {
        _chai.assert.isTrue(g2.equals(g));
      });

      (0, _mocha.it)('X0 = g2*x0', function () {
        _chai.assert.isTrue(X0.equals(G.ctx.PAIR.G2mul(g2, x0)));
      });

      (0, _mocha.it)('X1 = g2*x1', function () {
        _chai.assert.isTrue(X1.equals(G.ctx.PAIR.G2mul(g2, x1)));
      });

      (0, _mocha.it)('X2 = g2*x2', function () {
        _chai.assert.isTrue(X2.equals(G.ctx.PAIR.G2mul(g2, x2)));
      });

      (0, _mocha.it)('X3 = g2*x3', function () {
        _chai.assert.isTrue(X3.equals(G.ctx.PAIR.G2mul(g2, x3)));
      });

      (0, _mocha.it)('X4 = g2*x4', function () {
        _chai.assert.isTrue(X4.equals(G.ctx.PAIR.G2mul(g2, x4)));
      });
    });

    // h, sig = (x0 + x1*a1 + x2*a2 + ...) * h
    (0, _mocha.describe)('Sign', function () {
      (0, _mocha.it)('For signature(sig1, sig2), sig2 = (x0 + x1*a1 + x2*a2 + ...) * sig1', function () {
        var params = _CoinSig2.default.setup();

        var _params3 = _slicedToArray(params, 5),
            G = _params3[0],
            o = _params3[1],
            g1 = _params3[2],
            g2 = _params3[3],
            e = _params3[4];

        var _CoinSig$keygen3 = _CoinSig2.default.keygen(params),
            _CoinSig$keygen4 = _slicedToArray(_CoinSig$keygen3, 2),
            sk = _CoinSig$keygen4[0],
            pk = _CoinSig$keygen4[1];

        var _sk2 = _slicedToArray(sk, 5),
            x0 = _sk2[0],
            x1 = _sk2[1],
            x2 = _sk2[2],
            x3 = _sk2[3],
            x4 = _sk2[4];

        var coin_params = _BLSSig2.default.setup();

        var _BLSSig$keygen = _BLSSig2.default.keygen(coin_params),
            _BLSSig$keygen2 = _slicedToArray(_BLSSig$keygen, 2),
            coin_sk = _BLSSig$keygen2[0],
            coin_pk = _BLSSig$keygen2[1];

        var dummyCoin = (0, _auxiliary.getCoin)(coin_pk, 42);

        var signature = _CoinSig2.default.sign(params, sk, dummyCoin);

        var _signature = _slicedToArray(signature, 2),
            sig1 = _signature[0],
            sig2 = _signature[1];

        var a1 = G.hashToBIG(dummyCoin.value);
        var a2 = G.hashToBIG(dummyCoin.ttl);
        var a3 = G.hashG2ElemToBIG(dummyCoin.v);
        var a4 = G.hashG2ElemToBIG(dummyCoin.id);

        var a1_cpy = new G.ctx.BIG(a1);
        a1_cpy.mod(o);
        var a2_cpy = new G.ctx.BIG(a2);
        a2_cpy.mod(o);
        var a3_cpy = new G.ctx.BIG(a3);
        a3_cpy.mod(o);
        var a4_cpy = new G.ctx.BIG(a4);
        a4_cpy.mod(o);

        var t1 = G.ctx.BIG.mul(x1, a1_cpy);
        var t2 = G.ctx.BIG.mul(x2, a2_cpy);
        var t3 = G.ctx.BIG.mul(x3, a3_cpy);
        var t4 = G.ctx.BIG.mul(x4, a4_cpy);

        var x0DBIG = new G.ctx.DBIG(0);
        for (var i = 0; i < G.ctx.BIG.NLEN; i++) {
          x0DBIG.w[i] = x0.w[i];
        }

        x0DBIG.add(t1);
        x0DBIG.add(t2);
        x0DBIG.add(t3);
        x0DBIG.add(t4);

        var K = x0DBIG.mod(o);

        var sig_test = G.ctx.PAIR.G1mul(sig1, K);
        _chai.assert.isTrue(sig2.equals(sig_test));
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L0NvaW5TaWcudGVzdC5qcyJdLCJuYW1lcyI6WyJwYXJhbXMiLCJzZXR1cCIsIkciLCJvIiwiZzEiLCJnMiIsImUiLCJpc05vdE51bGwiLCJpc1RydWUiLCJjdHgiLCJCSUciLCJFQ1AiLCJFQ1AyIiwiRnVuY3Rpb24iLCJrZXlnZW4iLCJzayIsInBrIiwieDAiLCJ4MSIsIngyIiwieDMiLCJ4NCIsImciLCJYMCIsIlgxIiwiWDIiLCJYMyIsIlg0IiwiZXF1YWxzIiwiUEFJUiIsIkcybXVsIiwiY29pbl9wYXJhbXMiLCJjb2luX3NrIiwiY29pbl9wayIsImR1bW15Q29pbiIsInNpZ25hdHVyZSIsInNpZ24iLCJzaWcxIiwic2lnMiIsImExIiwiaGFzaFRvQklHIiwidmFsdWUiLCJhMiIsInR0bCIsImEzIiwiaGFzaEcyRWxlbVRvQklHIiwidiIsImE0IiwiaWQiLCJhMV9jcHkiLCJtb2QiLCJhMl9jcHkiLCJhM19jcHkiLCJhNF9jcHkiLCJ0MSIsIm11bCIsInQyIiwidDMiLCJ0NCIsIngwREJJRyIsIkRCSUciLCJpIiwiTkxFTiIsInciLCJhZGQiLCJLIiwic2lnX3Rlc3QiLCJHMW11bCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFFQSxxQkFBUyxnQkFBVCxFQUEyQixZQUFNO0FBQy9CLHVCQUFTLE9BQVQsRUFBa0IsWUFBTTtBQUN0QixRQUFNQSxTQUFTLGtCQUFRQyxLQUFSLEVBQWY7O0FBRHNCLGlDQUVJRCxNQUZKO0FBQUEsUUFFZkUsQ0FGZTtBQUFBLFFBRVpDLENBRlk7QUFBQSxRQUVUQyxFQUZTO0FBQUEsUUFFTEMsRUFGSztBQUFBLFFBRURDLENBRkM7O0FBSXRCLG1CQUFHLHdCQUFILEVBQTZCLFlBQU07QUFDakMsbUJBQU9DLFNBQVAsQ0FBaUJMLENBQWpCO0FBQ0EsbUJBQU9NLE1BQVAsQ0FBY04sOEJBQWQ7QUFDRCxLQUhEOztB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QUt2RCxFQUFFTyxHQUFGLENBQU1DLEdBQU4sQ0FBVTZDLEdBQVYsQ0FBY25DLEVBQWQsRUFBa0JnQyxNQUFsQixDQUFYO0FBQ0EsWUFBTU0sS0FBS3hELEVBQUVPLEdBQUYsQ0FBTUMsR0FBTixDQUFVNkMsR0FBVixDQUFjbEMsRUFBZCxFQUFrQmdDLE1BQWxCLENBQVg7O0FBRUEsWUFBTU0sU0FBUyxJQUFJekQsRUFBRU8sR0FBRixDQUFNbUQsSUFBVixDQUFlLENBQWYsQ0FBZjtBQUNBLGFBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJM0QsRUFBRU8sR0FBRixDQUFNQyxHQUFOLENBQVVvRCxJQUE5QixFQUFvQ0QsR0FBcEMsRUFBeUM7QUFDdkNGLGlCQUFPSSxDQUFQLENBQVNGLENBQVQsSUFBYzVDLEdBQUc4QyxDQUFILENBQUtGLENBQUwsQ0FBZDtBQUNEOztBQUVERixlQUFPSyxHQUFQLENBQVdWLEVBQVg7QUFDQUssZUFBT0ssR0FBUCxDQUFXUixFQUFYO0FBQ0FHLGVBQU9LLEdBQVAsQ0FBV1AsRUFBWDtBQUNBRSxlQUFPSyxHQUFQLENBQVdOLEVBQVg7O0FBRUEsWUFBTU8sSUFBSU4sT0FBT1QsR0FBUCxDQUFXL0MsQ0FBWCxDQUFWOztBQUVBLFlBQU0rRCxXQUFXaEUsRUFBRU8sR0FBRixDQUFNb0IsSUFBTixDQUFXc0MsS0FBWCxDQUFpQjlCLElBQWpCLEVBQXVCNEIsQ0FBdkIsQ0FBakI7QUFDQSxxQkFBT3pELE1BQVAsQ0FBYzhCLEtBQUtWLE1BQUwsQ0FBWXNDLFFBQVosQ0FBZDtBQUNELE9BOUNEO0FBK0NELEtBaEREO0FBaURELEdBNUZEO0FBNkZELENBNUhEIiwiZmlsZSI6IkNvaW5TaWcudGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlc2NyaWJlLCBpdCwgeGl0IH0gZnJvbSAnbW9jaGEnO1xuaW1wb3J0IHsgZXhwZWN0LCBhc3NlcnQgfSBmcm9tICdjaGFpJztcbmltcG9ydCBDb2luU2lnIGZyb20gJy4uL0NvaW5TaWcnO1xuaW1wb3J0IEJwR3JvdXAgZnJvbSAnLi4vQnBHcm91cCc7XG5pbXBvcnQgQ29pbiBmcm9tICcuLi9Db2luJztcbmltcG9ydCB7IGdldENvaW4gfSBmcm9tICcuLi9hdXhpbGlhcnknO1xuaW1wb3J0IEJMU1NpZyBmcm9tICcuLi9CTFNTaWcnO1xuXG5kZXNjcmliZSgnQ29pblNpZyBTY2hlbWUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdTZXR1cCcsICgpID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSBDb2luU2lnLnNldHVwKCk7XG4gICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG5cbiAgICBpdCgnUmV0dXJucyBCcEdyb3VwIE9iamVjdCcsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc05vdE51bGwoRyk7XG4gICAgICBhc3NlcnQuaXNUcnVlKEcgaW5zdGFuY2VvZiAoQnBHcm91cCkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ1JldHVybnMgR3JvdXAgT3JkZXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKG8pO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShvIGluc3RhbmNlb2YgKEcuY3R4LkJJRykpO1xuICAgIH0pO1xuXG4gICAgaXQoJ1JldHVybnMgR2VuMScsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc05vdE51bGwoZzEpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShnMSBpbnN0YW5jZW9mIChHLmN0eC5FQ1ApKTtcbiAgICB9KTtcblxuICAgIGl0KCdSZXR1cm5zIEdlbjInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKGcyKTtcbiAgICAgIGFzc2VydC5pc1RydWUoZzIgaW5zdGFuY2VvZiAoRy5jdHguRUNQMikpO1xuICAgIH0pO1xuXG4gICAgaXQoJ1JldHVybnMgUGFpciBmdW5jdGlvbicsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc05vdE51bGwoZSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKGUgaW5zdGFuY2VvZiAoRnVuY3Rpb24pKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0tleWdlbicsICgpID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSBDb2luU2lnLnNldHVwKCk7XG4gICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG4gICAgY29uc3QgW3NrLCBwa10gPSBDb2luU2lnLmtleWdlbihwYXJhbXMpO1xuXG4gICAgY29uc3QgW3gwLCB4MSwgeDIsIHgzLCB4NF0gPSBzaztcbiAgICBjb25zdCBbZywgWDAsIFgxLCBYMiwgWDMsIFg0XSA9IHBrO1xuXG4gICAgaXQoJ1JldHVybnMgU2VjcmV0IEtleSAoeDAsIHgxLCB4MiwgeDMsIHg0KScsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1RydWUoeDAgaW5zdGFuY2VvZiAoRy5jdHguQklHKSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHgxIGluc3RhbmNlb2YgKEcuY3R4LkJJRykpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZSh4MiBpbnN0YW5jZW9mIChHLmN0eC5CSUcpKTtcbiAgICAgIGFzc2VydC5pc1RydWUoeDMgaW5zdGFuY2VvZiAoRy5jdHguQklHKSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHg0IGluc3RhbmNlb2YgKEcuY3R4LkJJRykpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1JldHVybnMgVmFsaWQgUHJpdmF0ZSBLZXkgKGcsIFgwLCBYMSwgWDIsIFgzLCBYNCknLCAoKSA9PiB7XG4gICAgICBpdCgnZyA9IGcyJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGcyLmVxdWFscyhnKSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ1gwID0gZzIqeDAnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc1RydWUoWDAuZXF1YWxzKEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgwKSkpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdYMSA9IGcyKngxJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuaXNUcnVlKFgxLmVxdWFscyhHLmN0eC5QQUlSLkcybXVsKGcyLCB4MSkpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnWDIgPSBnMip4MicsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShYMi5lcXVhbHMoRy5jdHguUEFJUi5HMm11bChnMiwgeDIpKSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ1gzID0gZzIqeDMnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc1RydWUoWDMuZXF1YWxzKEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgzKSkpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdYNCA9IGcyKng0JywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuaXNUcnVlKFg0LmVxdWFscyhHLmN0eC5QQUlSLkcybXVsKGcyLCB4NCkpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gaCwgc2lnID0gKHgwICsgeDEqYTEgKyB4MiphMiArIC4uLikgKiBoXG4gICAgZGVzY3JpYmUoJ1NpZ24nLCAoKSA9PiB7XG4gICAgICBpdCgnRm9yIHNpZ25hdHVyZShzaWcxLCBzaWcyKSwgc2lnMiA9ICh4MCArIHgxKmExICsgeDIqYTIgKyAuLi4pICogc2lnMScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gQ29pblNpZy5zZXR1cCgpO1xuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcbiAgICAgICAgY29uc3QgW3NrLCBwa10gPSBDb2luU2lnLmtleWdlbihwYXJhbXMpO1xuICAgICAgICBjb25zdCBbeDAsIHgxLCB4MiwgeDMsIHg0XSA9IHNrO1xuXG4gICAgICAgIGNvbnN0IGNvaW5fcGFyYW1zID0gQkxTU2lnLnNldHVwKCk7XG4gICAgICAgIGNvbnN0IFtjb2luX3NrLCBjb2luX3BrXSA9IEJMU1NpZy5rZXlnZW4oY29pbl9wYXJhbXMpO1xuICAgICAgICBjb25zdCBkdW1teUNvaW4gPSBnZXRDb2luKGNvaW5fcGssIDQyKTtcblxuICAgICAgICBjb25zdCBzaWduYXR1cmUgPSBDb2luU2lnLnNpZ24ocGFyYW1zLCBzaywgZHVtbXlDb2luKTtcbiAgICAgICAgY29uc3QgW3NpZzEsIHNpZzJdID0gc2lnbmF0dXJlO1xuXG4gICAgICAgIGNvbnN0IGExID0gRy5oYXNoVG9CSUcoZHVtbXlDb2luLnZhbHVlKTtcbiAgICAgICAgY29uc3QgYTIgPSBHLmhhc2hUb0JJRyhkdW1teUNvaW4udHRsKTtcbiAgICAgICAgY29uc3QgYTMgPSBHLmhhc2hHMkVsZW1Ub0JJRyhkdW1teUNvaW4udik7XG4gICAgICAgIGNvbnN0IGE0ID0gRy5oYXNoRzJFbGVtVG9CSUcoZHVtbXlDb2luLmlkKTtcblxuICAgICAgICBjb25zdCBhMV9jcHkgPSBuZXcgRy5jdHguQklHKGExKTtcbiAgICAgICAgYTFfY3B5Lm1vZChvKTtcbiAgICAgICAgY29uc3QgYTJfY3B5ID0gbmV3IEcuY3R4LkJJRyhhMik7XG4gICAgICAgIGEyX2NweS5tb2Qobyk7XG4gICAgICAgIGNvbnN0IGEzX2NweSA9IG5ldyBHLmN0eC5CSUcoYTMpO1xuICAgICAgICBhM19jcHkubW9kKG8pO1xuICAgICAgICBjb25zdCBhNF9jcHkgPSBuZXcgRy5jdHguQklHKGE0KTtcbiAgICAgICAgYTRfY3B5Lm1vZChvKTtcblxuICAgICAgICBjb25zdCB0MSA9IEcuY3R4LkJJRy5tdWwoeDEsIGExX2NweSk7XG4gICAgICAgIGNvbnN0IHQyID0gRy5jdHguQklHLm11bCh4MiwgYTJfY3B5KTtcbiAgICAgICAgY29uc3QgdDMgPSBHLmN0eC5CSUcubXVsKHgzLCBhM19jcHkpO1xuICAgICAgICBjb25zdCB0NCA9IEcuY3R4LkJJRy5tdWwoeDQsIGE0X2NweSk7XG5cbiAgICAgICAgY29uc3QgeDBEQklHID0gbmV3IEcuY3R4LkRCSUcoMCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgRy5jdHguQklHLk5MRU47IGkrKykge1xuICAgICAgICAgIHgwREJJRy53W2ldID0geDAud1tpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHgwREJJRy5hZGQodDEpO1xuICAgICAgICB4MERCSUcuYWRkKHQyKTtcbiAgICAgICAgeDBEQklHLmFkZCh0Myk7XG4gICAgICAgIHgwREJJRy5hZGQodDQpO1xuXG4gICAgICAgIGNvbnN0IEsgPSB4MERCSUcubW9kKG8pO1xuXG4gICAgICAgIGNvbnN0IHNpZ190ZXN0ID0gRy5jdHguUEFJUi5HMW11bChzaWcxLCBLKTtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShzaWcyLmVxdWFscyhzaWdfdGVzdCkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=