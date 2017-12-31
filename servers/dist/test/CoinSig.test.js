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

        var a1 = new G.ctx.BIG(dummyCoin.value);
        a1.norm();
        var a2 = G.hashToBIG(dummyCoin.ttl.toString());
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

    (0, _mocha.describe)('Verify', function () {
      var params = void 0;
      var sk = void 0;
      var pk = void 0;
      var dummyCoin = void 0;
      var testCoin = void 0;
      var sig = void 0;
      var coin_params = void 0;
      (0, _mocha.before)(function () {
        params = _CoinSig2.default.setup();

        var _params4 = params,
            _params5 = _slicedToArray(_params4, 5),
            G = _params5[0],
            o = _params5[1],
            g1 = _params5[2],
            g2 = _params5[3],
            e = _params5[4];

        var _CoinSig$keygen5 = _CoinSig2.default.keygen(params);

        var _CoinSig$keygen6 = _slicedToArray(_CoinSig$keygen5, 2);

        sk = _CoinSig$keygen6[0];
        pk = _CoinSig$keygen6[1];


        coin_params = _BLSSig2.default.setup();

        var _BLSSig$keygen3 = _BLSSig2.default.keygen(coin_params),
            _BLSSig$keygen4 = _slicedToArray(_BLSSig$keygen3, 2),
            coin_sk = _BLSSig$keygen4[0],
            coin_pk = _BLSSig$keygen4[1];

        dummyCoin = (0, _auxiliary.getCoin)(coin_pk, 42);
        testCoin = (0, _auxiliary.getCoin)(coin_pk, 42); // to make it instance of same class

        sig = _CoinSig2.default.sign(params, sk, dummyCoin);
      });

      // 'resets' the test coin
      (0, _mocha.beforeEach)(function () {
        testCoin.ttl = dummyCoin.ttl;
        testCoin.id = new G.ctx.ECP2();
        testCoin.id.copy(dummyCoin.id);
        testCoin.value = dummyCoin.value;
        testCoin.v = new G.ctx.ECP2();
        testCoin.v.copy(dummyCoin.v);
      });

      (0, _mocha.it)('Successful verification of original coin', function () {
        _chai.assert.isTrue(_CoinSig2.default.verify(params, pk, dummyCoin, sig));
      });

      (0, _mocha.it)('Failed verification for coin with different value', function () {
        testCoin.value = 256;
        _chai.assert.isNotTrue(_CoinSig2.default.verify(params, pk, testCoin, sig));
      });

      (0, _mocha.it)('Failed verification for coin with different ttl', function () {
        // ttl of actual coin will never be equal to that
        testCoin.value = new Date().getTime() - 12345678;
        _chai.assert.isNotTrue(_CoinSig2.default.verify(params, pk, testCoin, sig));
      });

      (0, _mocha.it)('Failed verification for coin with different id', function () {
        var newCoinIde = (0, _auxiliary.getRandomCoinId)();
        testCoin.id = G.ctx.PAIR.G2mul(g2, newCoinIde);
        _chai.assert.isNotTrue(_CoinSig2.default.verify(params, pk, testCoin, sig));
      });

      (0, _mocha.it)('Failed verification for coin with different private key', function () {
        var _BLSSig$keygen5 = _BLSSig2.default.keygen(coin_params),
            _BLSSig$keygen6 = _slicedToArray(_BLSSig$keygen5, 2),
            new_coin_sk = _BLSSig$keygen6[0],
            new_coin_pk = _BLSSig$keygen6[1];

        testCoin.v = new_coin_pk;
        _chai.assert.isNotTrue(_CoinSig2.default.verify(params, pk, testCoin, sig));
      });
    });

    (0, _mocha.describe)('Randomize', function () {
      var params = _CoinSig2.default.setup();

      var _params6 = _slicedToArray(params, 5),
          G = _params6[0],
          o = _params6[1],
          g1 = _params6[2],
          g2 = _params6[3],
          e = _params6[4];

      var _CoinSig$keygen7 = _CoinSig2.default.keygen(params),
          _CoinSig$keygen8 = _slicedToArray(_CoinSig$keygen7, 2),
          sk = _CoinSig$keygen8[0],
          pk = _CoinSig$keygen8[1];

      var coin_params = _BLSSig2.default.setup();

      var _BLSSig$keygen7 = _BLSSig2.default.keygen(coin_params),
          _BLSSig$keygen8 = _slicedToArray(_BLSSig$keygen7, 2),
          coin_sk = _BLSSig$keygen8[0],
          coin_pk = _BLSSig$keygen8[1];

      var dummyCoin = (0, _auxiliary.getCoin)(coin_pk, 42);

      var sig = _CoinSig2.default.sign(params, sk, dummyCoin);
      sig = _CoinSig2.default.randomize(params, sig);

      (0, _mocha.it)('Successful verification for original coin with randomized signature', function () {
        _chai.assert.isTrue(_CoinSig2.default.verify(params, pk, dummyCoin, sig));
      });

      (0, _mocha.it)('Failed verification for modified coin with the same randomized signature', function () {
        dummyCoin.value = 43;
        _chai.assert.isNotTrue(_CoinSig2.default.verify(params, pk, dummyCoin, sig));
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L0NvaW5TaWcudGVzdC5qcyJdLCJuYW1lcyI6WyJwYXJhbXMiLCJzZXR1cCIsIkciLCJvIiwiZzEiLCJnMiIsImUiLCJpc05vdE51bGwiLCJpc1RydWUiLCJjdHgiLCJCSUciLCJFQ1AiLCJFQ1AyIiwiRnVuY3Rpb24iLCJrZXlnZW4iLCJzayIsInBrIiwieDAiLCJ4MSIsIngyIiwieDMiLCJ4NCIsImciLCJYMCIsIlgxIiwiWDIiLCJYMyIsIlg0IiwiZXF1YWxzIiwiUEFJUiIsIkcybXVsIiwiY29pbl9wYXJhbXMiLCJjb2luX3NrIiwiY29pbl9wayIsImR1bW15Q29pbiIsInNpZ25hdHVyZSIsInNpZ24iLCJzaWcxIiwic2lnMiIsImExIiwidmFsdWUiLCJub3JtIiwiYTIiLCJoYXNoVG9CSUciLCJ0dGwiLCJ0b1N0cmluZyIsImEzIiwiaGFzaEcyRWxlbVRvQklHIiwidiIsImE0IiwiaWQiLCJhMV9jcHkiLCJtb2QiLCJhMl9jcHkiLCJhM19jcHkiLCJhNF9jcHkiLCJ0MSIsIm11bCIsInQyIiwidDMiLCJ0NCIsIngwREJJRyIsIkRCSUciLCJpIiwiTkxFTiIsInciLCJhZGQiLCJLIiwic2lnX3Rlc3QiLCJHMW11bCIsInRlc3RDb2luIiwic2lnIiwiY29weSIsInZlcmlmeSIsImlzTm90VHJ1ZSIsIkRhdGUiLCJnZXRUaW1lIiwibmV3Q29pbklkZSIsIm5ld19jb2luX3NrIiwibmV3X2NvaW5fcGsiLCJyYW5kb21pemUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEscUJBQVMsZ0JBQVQsRUFBMkIsWUFBTTtBQUMvQix1QkFBUyxPQUFULEVBQWtCLFlBQU07QUFDdEIsUUFBTUEsU0FBUyxrQkFBUUMsS0FBUixFQUFmOztBQURzQixpQ0FFSUQsTUFGSjtBQUFBLFFBRWZFLENBRmU7QUFBQSxRQUVaQyxDQUZZO0FBQUEsUUFFVEMsRUFGUztB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LGtCQUFVTSxLQUFWLEdBQWtCLEVBQWxCO0FBQ0EscUJBQU9rQyxTQUFQLENBQWlCLGtCQUFRRCxNQUFSLENBQWV6RSxNQUFmLEVBQXVCZ0IsRUFBdkIsRUFBMkJrQixTQUEzQixFQUFzQ3FDLEdBQXRDLENBQWpCO0FBQ0QsT0FIRDtBQUlELEtBcEJEO0FBdUJELEdBaExEO0FBaUxELENBaE5EIiwiZmlsZSI6IkNvaW5TaWcudGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJlZm9yZSwgYmVmb3JlRWFjaCwgZGVzY3JpYmUsIGl0LCB4aXQgfSBmcm9tICdtb2NoYSc7XG5pbXBvcnQgeyBleHBlY3QsIGFzc2VydCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0IENvaW5TaWcgZnJvbSAnLi4vQ29pblNpZyc7XG5pbXBvcnQgQnBHcm91cCBmcm9tICcuLi9CcEdyb3VwJztcbmltcG9ydCBDb2luIGZyb20gJy4uL0NvaW4nO1xuaW1wb3J0IHsgZ2V0Q29pbiwgZ2V0UmFuZG9tQ29pbklkIH0gZnJvbSAnLi4vYXV4aWxpYXJ5JztcbmltcG9ydCBCTFNTaWcgZnJvbSAnLi4vQkxTU2lnJztcblxuZGVzY3JpYmUoJ0NvaW5TaWcgU2NoZW1lJywgKCkgPT4ge1xuICBkZXNjcmliZSgnU2V0dXAnLCAoKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gQ29pblNpZy5zZXR1cCgpO1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuXG4gICAgaXQoJ1JldHVybnMgQnBHcm91cCBPYmplY3QnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKEcpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShHIGluc3RhbmNlb2YgKEJwR3JvdXApKTtcbiAgICB9KTtcblxuICAgIGl0KCdSZXR1cm5zIEdyb3VwIE9yZGVyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzTm90TnVsbChvKTtcbiAgICAgIGFzc2VydC5pc1RydWUobyBpbnN0YW5jZW9mIChHLmN0eC5CSUcpKTtcbiAgICB9KTtcblxuICAgIGl0KCdSZXR1cm5zIEdlbjEnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKGcxKTtcbiAgICAgIGFzc2VydC5pc1RydWUoZzEgaW5zdGFuY2VvZiAoRy5jdHguRUNQKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnUmV0dXJucyBHZW4yJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzTm90TnVsbChnMik7XG4gICAgICBhc3NlcnQuaXNUcnVlKGcyIGluc3RhbmNlb2YgKEcuY3R4LkVDUDIpKTtcbiAgICB9KTtcblxuICAgIGl0KCdSZXR1cm5zIFBhaXIgZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKGUpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShlIGluc3RhbmNlb2YgKEZ1bmN0aW9uKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdLZXlnZW4nLCAoKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gQ29pblNpZy5zZXR1cCgpO1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgIGNvbnN0IFtzaywgcGtdID0gQ29pblNpZy5rZXlnZW4ocGFyYW1zKTtcblxuICAgIGNvbnN0IFt4MCwgeDEsIHgyLCB4MywgeDRdID0gc2s7XG4gICAgY29uc3QgW2csIFgwLCBYMSwgWDIsIFgzLCBYNF0gPSBwaztcblxuICAgIGl0KCdSZXR1cm5zIFNlY3JldCBLZXkgKHgwLCB4MSwgeDIsIHgzLCB4NCknLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNUcnVlKHgwIGluc3RhbmNlb2YgKEcuY3R4LkJJRykpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZSh4MSBpbnN0YW5jZW9mIChHLmN0eC5CSUcpKTtcbiAgICAgIGFzc2VydC5pc1RydWUoeDIgaW5zdGFuY2VvZiAoRy5jdHguQklHKSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHgzIGluc3RhbmNlb2YgKEcuY3R4LkJJRykpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZSh4NCBpbnN0YW5jZW9mIChHLmN0eC5CSUcpKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdSZXR1cm5zIFZhbGlkIFByaXZhdGUgS2V5IChnLCBYMCwgWDEsIFgyLCBYMywgWDQpJywgKCkgPT4ge1xuICAgICAgaXQoJ2cgPSBnMicsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShnMi5lcXVhbHMoZykpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdYMCA9IGcyKngwJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuaXNUcnVlKFgwLmVxdWFscyhHLmN0eC5QQUlSLkcybXVsKGcyLCB4MCkpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnWDEgPSBnMip4MScsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShYMS5lcXVhbHMoRy5jdHguUEFJUi5HMm11bChnMiwgeDEpKSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ1gyID0gZzIqeDInLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc1RydWUoWDIuZXF1YWxzKEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgyKSkpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdYMyA9IGcyKngzJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuaXNUcnVlKFgzLmVxdWFscyhHLmN0eC5QQUlSLkcybXVsKGcyLCB4MykpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnWDQgPSBnMip4NCcsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShYNC5lcXVhbHMoRy5jdHguUEFJUi5HMm11bChnMiwgeDQpKSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIGgsIHNpZyA9ICh4MCArIHgxKmExICsgeDIqYTIgKyAuLi4pICogaFxuICAgIGRlc2NyaWJlKCdTaWduJywgKCkgPT4ge1xuICAgICAgaXQoJ0ZvciBzaWduYXR1cmUoc2lnMSwgc2lnMiksIHNpZzIgPSAoeDAgKyB4MSphMSArIHgyKmEyICsgLi4uKSAqIHNpZzEnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IENvaW5TaWcuc2V0dXAoKTtcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG4gICAgICAgIGNvbnN0IFtzaywgcGtdID0gQ29pblNpZy5rZXlnZW4ocGFyYW1zKTtcbiAgICAgICAgY29uc3QgW3gwLCB4MSwgeDIsIHgzLCB4NF0gPSBzaztcblxuICAgICAgICBjb25zdCBjb2luX3BhcmFtcyA9IEJMU1NpZy5zZXR1cCgpO1xuICAgICAgICBjb25zdCBbY29pbl9zaywgY29pbl9wa10gPSBCTFNTaWcua2V5Z2VuKGNvaW5fcGFyYW1zKTtcbiAgICAgICAgY29uc3QgZHVtbXlDb2luID0gZ2V0Q29pbihjb2luX3BrLCA0Mik7XG5cbiAgICAgICAgY29uc3Qgc2lnbmF0dXJlID0gQ29pblNpZy5zaWduKHBhcmFtcywgc2ssIGR1bW15Q29pbik7XG4gICAgICAgIGNvbnN0IFtzaWcxLCBzaWcyXSA9IHNpZ25hdHVyZTtcblxuICAgICAgICBjb25zdCBhMSA9IG5ldyBHLmN0eC5CSUcoZHVtbXlDb2luLnZhbHVlKTtcbiAgICAgICAgYTEubm9ybSgpO1xuICAgICAgICBjb25zdCBhMiA9IEcuaGFzaFRvQklHKGR1bW15Q29pbi50dGwudG9TdHJpbmcoKSk7XG4gICAgICAgIGNvbnN0IGEzID0gRy5oYXNoRzJFbGVtVG9CSUcoZHVtbXlDb2luLnYpO1xuICAgICAgICBjb25zdCBhNCA9IEcuaGFzaEcyRWxlbVRvQklHKGR1bW15Q29pbi5pZCk7XG5cbiAgICAgICAgY29uc3QgYTFfY3B5ID0gbmV3IEcuY3R4LkJJRyhhMSk7XG4gICAgICAgIGExX2NweS5tb2Qobyk7XG4gICAgICAgIGNvbnN0IGEyX2NweSA9IG5ldyBHLmN0eC5CSUcoYTIpO1xuICAgICAgICBhMl9jcHkubW9kKG8pO1xuICAgICAgICBjb25zdCBhM19jcHkgPSBuZXcgRy5jdHguQklHKGEzKTtcbiAgICAgICAgYTNfY3B5Lm1vZChvKTtcbiAgICAgICAgY29uc3QgYTRfY3B5ID0gbmV3IEcuY3R4LkJJRyhhNCk7XG4gICAgICAgIGE0X2NweS5tb2Qobyk7XG5cbiAgICAgICAgY29uc3QgdDEgPSBHLmN0eC5CSUcubXVsKHgxLCBhMV9jcHkpO1xuICAgICAgICBjb25zdCB0MiA9IEcuY3R4LkJJRy5tdWwoeDIsIGEyX2NweSk7XG4gICAgICAgIGNvbnN0IHQzID0gRy5jdHguQklHLm11bCh4MywgYTNfY3B5KTtcbiAgICAgICAgY29uc3QgdDQgPSBHLmN0eC5CSUcubXVsKHg0LCBhNF9jcHkpO1xuXG4gICAgICAgIGNvbnN0IHgwREJJRyA9IG5ldyBHLmN0eC5EQklHKDApO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IEcuY3R4LkJJRy5OTEVOOyBpKyspIHtcbiAgICAgICAgICB4MERCSUcud1tpXSA9IHgwLndbaV07XG4gICAgICAgIH1cblxuICAgICAgICB4MERCSUcuYWRkKHQxKTtcbiAgICAgICAgeDBEQklHLmFkZCh0Mik7XG4gICAgICAgIHgwREJJRy5hZGQodDMpO1xuICAgICAgICB4MERCSUcuYWRkKHQ0KTtcblxuICAgICAgICBjb25zdCBLID0geDBEQklHLm1vZChvKTtcblxuICAgICAgICBjb25zdCBzaWdfdGVzdCA9IEcuY3R4LlBBSVIuRzFtdWwoc2lnMSwgSyk7XG4gICAgICAgIGFzc2VydC5pc1RydWUoc2lnMi5lcXVhbHMoc2lnX3Rlc3QpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1ZlcmlmeScsICgpID0+IHtcbiAgICAgIGxldCBwYXJhbXM7XG4gICAgICBsZXQgc2s7XG4gICAgICBsZXQgcGs7XG4gICAgICBsZXQgZHVtbXlDb2luO1xuICAgICAgbGV0IHRlc3RDb2luO1xuICAgICAgbGV0IHNpZztcbiAgICAgIGxldCBjb2luX3BhcmFtcztcbiAgICAgIGJlZm9yZSgoKSA9PiB7XG4gICAgICAgIHBhcmFtcyA9IENvaW5TaWcuc2V0dXAoKTtcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG4gICAgICAgIFtzaywgcGtdID0gQ29pblNpZy5rZXlnZW4ocGFyYW1zKTtcblxuICAgICAgICBjb2luX3BhcmFtcyA9IEJMU1NpZy5zZXR1cCgpO1xuICAgICAgICBjb25zdCBbY29pbl9zaywgY29pbl9wa10gPSBCTFNTaWcua2V5Z2VuKGNvaW5fcGFyYW1zKTtcbiAgICAgICAgZHVtbXlDb2luID0gZ2V0Q29pbihjb2luX3BrLCA0Mik7XG4gICAgICAgIHRlc3RDb2luID0gZ2V0Q29pbihjb2luX3BrLCA0Mik7IC8vIHRvIG1ha2UgaXQgaW5zdGFuY2Ugb2Ygc2FtZSBjbGFzc1xuXG4gICAgICAgIHNpZyA9IENvaW5TaWcuc2lnbihwYXJhbXMsIHNrLCBkdW1teUNvaW4pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vICdyZXNldHMnIHRoZSB0ZXN0IGNvaW5cbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICB0ZXN0Q29pbi50dGwgPSBkdW1teUNvaW4udHRsO1xuICAgICAgICB0ZXN0Q29pbi5pZCA9IG5ldyBHLmN0eC5FQ1AyKCk7XG4gICAgICAgIHRlc3RDb2luLmlkLmNvcHkoZHVtbXlDb2luLmlkKTtcbiAgICAgICAgdGVzdENvaW4udmFsdWUgPSBkdW1teUNvaW4udmFsdWU7XG4gICAgICAgIHRlc3RDb2luLnYgPSBuZXcgRy5jdHguRUNQMigpO1xuICAgICAgICB0ZXN0Q29pbi52LmNvcHkoZHVtbXlDb2luLnYpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdTdWNjZXNzZnVsIHZlcmlmaWNhdGlvbiBvZiBvcmlnaW5hbCBjb2luJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuaXNUcnVlKENvaW5TaWcudmVyaWZ5KHBhcmFtcywgcGssIGR1bW15Q29pbiwgc2lnKSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ0ZhaWxlZCB2ZXJpZmljYXRpb24gZm9yIGNvaW4gd2l0aCBkaWZmZXJlbnQgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAgIHRlc3RDb2luLnZhbHVlID0gMjU2O1xuICAgICAgICBhc3NlcnQuaXNOb3RUcnVlKENvaW5TaWcudmVyaWZ5KHBhcmFtcywgcGssIHRlc3RDb2luLCBzaWcpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnRmFpbGVkIHZlcmlmaWNhdGlvbiBmb3IgY29pbiB3aXRoIGRpZmZlcmVudCB0dGwnLCAoKSA9PiB7XG4gICAgICAgIC8vIHR0bCBvZiBhY3R1YWwgY29pbiB3aWxsIG5ldmVyIGJlIGVxdWFsIHRvIHRoYXRcbiAgICAgICAgdGVzdENvaW4udmFsdWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDEyMzQ1Njc4O1xuICAgICAgICBhc3NlcnQuaXNOb3RUcnVlKENvaW5TaWcudmVyaWZ5KHBhcmFtcywgcGssIHRlc3RDb2luLCBzaWcpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnRmFpbGVkIHZlcmlmaWNhdGlvbiBmb3IgY29pbiB3aXRoIGRpZmZlcmVudCBpZCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgbmV3Q29pbklkZSA9IGdldFJhbmRvbUNvaW5JZCgpO1xuICAgICAgICB0ZXN0Q29pbi5pZCA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIG5ld0NvaW5JZGUpO1xuICAgICAgICBhc3NlcnQuaXNOb3RUcnVlKENvaW5TaWcudmVyaWZ5KHBhcmFtcywgcGssIHRlc3RDb2luLCBzaWcpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnRmFpbGVkIHZlcmlmaWNhdGlvbiBmb3IgY29pbiB3aXRoIGRpZmZlcmVudCBwcml2YXRlIGtleScsICgpID0+IHtcbiAgICAgICAgY29uc3QgW25ld19jb2luX3NrLCBuZXdfY29pbl9wa10gPSBCTFNTaWcua2V5Z2VuKGNvaW5fcGFyYW1zKTtcbiAgICAgICAgdGVzdENvaW4udiA9IG5ld19jb2luX3BrO1xuICAgICAgICBhc3NlcnQuaXNOb3RUcnVlKENvaW5TaWcudmVyaWZ5KHBhcmFtcywgcGssIHRlc3RDb2luLCBzaWcpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1JhbmRvbWl6ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IENvaW5TaWcuc2V0dXAoKTtcbiAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgICAgY29uc3QgW3NrLCBwa10gPSBDb2luU2lnLmtleWdlbihwYXJhbXMpO1xuXG4gICAgICBjb25zdCBjb2luX3BhcmFtcyA9IEJMU1NpZy5zZXR1cCgpO1xuICAgICAgY29uc3QgW2NvaW5fc2ssIGNvaW5fcGtdID0gQkxTU2lnLmtleWdlbihjb2luX3BhcmFtcyk7XG4gICAgICBjb25zdCBkdW1teUNvaW4gPSBnZXRDb2luKGNvaW5fcGssIDQyKTtcblxuICAgICAgbGV0IHNpZyA9IENvaW5TaWcuc2lnbihwYXJhbXMsIHNrLCBkdW1teUNvaW4pO1xuICAgICAgc2lnID0gQ29pblNpZy5yYW5kb21pemUocGFyYW1zLCBzaWcpO1xuXG4gICAgICBpdCgnU3VjY2Vzc2Z1bCB2ZXJpZmljYXRpb24gZm9yIG9yaWdpbmFsIGNvaW4gd2l0aCByYW5kb21pemVkIHNpZ25hdHVyZScsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShDb2luU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBkdW1teUNvaW4sIHNpZykpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdGYWlsZWQgdmVyaWZpY2F0aW9uIGZvciBtb2RpZmllZCBjb2luIHdpdGggdGhlIHNhbWUgcmFuZG9taXplZCBzaWduYXR1cmUnLCAoKSA9PiB7XG4gICAgICAgIGR1bW15Q29pbi52YWx1ZSA9IDQzO1xuICAgICAgICBhc3NlcnQuaXNOb3RUcnVlKENvaW5TaWcudmVyaWZ5KHBhcmFtcywgcGssIGR1bW15Q29pbiwgc2lnKSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuXG4gIH0pO1xufSk7XG4iXX0=