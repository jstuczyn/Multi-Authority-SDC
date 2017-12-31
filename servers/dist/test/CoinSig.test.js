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
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L0NvaW5TaWcudGVzdC5qcyJdLCJuYW1lcyI6WyJwYXJhbXMiLCJzZXR1cCIsIkciLCJvIiwiZzEiLCJnMiIsImUiLCJpc05vdE51bGwiLCJpc1RydWUiLCJjdHgiLCJCSUciLCJFQ1AiLCJFQ1AyIiwiRnVuY3Rpb24iLCJrZXlnZW4iLCJzayIsInBrIiwieDAiLCJ4MSIsIngyIiwieDMiLCJ4NCIsImciLCJYMCIsIlgxIiwiWDIiLCJYMyIsIlg0IiwiZXF1YWxzIiwiUEFJUiIsIkcybXVsIiwiY29pbl9wYXJhbXMiLCJjb2luX3NrIiwiY29pbl9wayIsImR1bW15Q29pbiIsInNpZ25hdHVyZSIsInNpZ24iLCJzaWcxIiwic2lnMiIsImExIiwidmFsdWUiLCJub3JtIiwiYTIiLCJoYXNoVG9CSUciLCJ0dGwiLCJ0b1N0cmluZyIsImEzIiwiaGFzaEcyRWxlbVRvQklHIiwidiIsImE0IiwiaWQiLCJhMV9jcHkiLCJtb2QiLCJhMl9jcHkiLCJhM19jcHkiLCJhNF9jcHkiLCJ0MSIsIm11bCIsInQyIiwidDMiLCJ0NCIsIngwREJJRyIsIkRCSUciLCJpIiwiTkxFTiIsInciLCJhZGQiLCJLIiwic2lnX3Rlc3QiLCJHMW11bCIsInRlc3RDb2luIiwic2lnIiwiY29weSIsInZlcmlmeSIsImlzTm90VHJ1ZSIsIkRhdGUiLCJnZXRUaW1lIiwibmV3Q29pbklkZSIsIm5ld19jb2luX3NrIiwibmV3X2NvaW5fcGsiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEscUJBQVMsZ0JBQVQsRUFBMkIsWUFBTTtBQUMvQix1QkFBUyxPQUFULEVBQWtCLFlBQU07QUFDdEIsUUFBTUEsU0FBUyxrQkFBUUMsS0FBUixFQUFmOztBQURzQixpQ0FFSUQsTUFGSjtBQUFBLFFBRWZFLENBRmU7QUFBQSxRQUVaQyxDQUZZO0FBQUEsUUFFVEMsRUFGUztBQUFBLFFBRUxDLEVB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LFdBRDJEO0FBQUEsWUFDOUNDLFdBRDhDOztBQUVsRVQsaUJBQVN0QixDQUFULEdBQWErQixXQUFiO0FBQ0EscUJBQU9MLFNBQVAsQ0FBaUIsa0JBQVFELE1BQVIsQ0FBZXpFLE1BQWYsRUFBdUJnQixFQUF2QixFQUEyQnNELFFBQTNCLEVBQXFDQyxHQUFyQyxDQUFqQjtBQUNELE9BSkQ7QUFLRCxLQXpERDtBQTBERCxHQXhKRDtBQXlKRCxDQXhMRCIsImZpbGUiOiJDb2luU2lnLnRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBiZWZvcmUsIGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBpdCwgeGl0IH0gZnJvbSAnbW9jaGEnO1xuaW1wb3J0IHsgZXhwZWN0LCBhc3NlcnQgfSBmcm9tICdjaGFpJztcbmltcG9ydCBDb2luU2lnIGZyb20gJy4uL0NvaW5TaWcnO1xuaW1wb3J0IEJwR3JvdXAgZnJvbSAnLi4vQnBHcm91cCc7XG5pbXBvcnQgQ29pbiBmcm9tICcuLi9Db2luJztcbmltcG9ydCB7IGdldENvaW4sIGdldFJhbmRvbUNvaW5JZCB9IGZyb20gJy4uL2F1eGlsaWFyeSc7XG5pbXBvcnQgQkxTU2lnIGZyb20gJy4uL0JMU1NpZyc7XG5cbmRlc2NyaWJlKCdDb2luU2lnIFNjaGVtZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ1NldHVwJywgKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IENvaW5TaWcuc2V0dXAoKTtcbiAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcblxuICAgIGl0KCdSZXR1cm5zIEJwR3JvdXAgT2JqZWN0JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzTm90TnVsbChHKTtcbiAgICAgIGFzc2VydC5pc1RydWUoRyBpbnN0YW5jZW9mIChCcEdyb3VwKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnUmV0dXJucyBHcm91cCBPcmRlcicsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc05vdE51bGwobyk7XG4gICAgICBhc3NlcnQuaXNUcnVlKG8gaW5zdGFuY2VvZiAoRy5jdHguQklHKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnUmV0dXJucyBHZW4xJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzTm90TnVsbChnMSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKGcxIGluc3RhbmNlb2YgKEcuY3R4LkVDUCkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ1JldHVybnMgR2VuMicsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc05vdE51bGwoZzIpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShnMiBpbnN0YW5jZW9mIChHLmN0eC5FQ1AyKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnUmV0dXJucyBQYWlyIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzTm90TnVsbChlKTtcbiAgICAgIGFzc2VydC5pc1RydWUoZSBpbnN0YW5jZW9mIChGdW5jdGlvbikpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnS2V5Z2VuJywgKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IENvaW5TaWcuc2V0dXAoKTtcbiAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcbiAgICBjb25zdCBbc2ssIHBrXSA9IENvaW5TaWcua2V5Z2VuKHBhcmFtcyk7XG5cbiAgICBjb25zdCBbeDAsIHgxLCB4MiwgeDMsIHg0XSA9IHNrO1xuICAgIGNvbnN0IFtnLCBYMCwgWDEsIFgyLCBYMywgWDRdID0gcGs7XG5cbiAgICBpdCgnUmV0dXJucyBTZWNyZXQgS2V5ICh4MCwgeDEsIHgyLCB4MywgeDQpJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZSh4MCBpbnN0YW5jZW9mIChHLmN0eC5CSUcpKTtcbiAgICAgIGFzc2VydC5pc1RydWUoeDEgaW5zdGFuY2VvZiAoRy5jdHguQklHKSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHgyIGluc3RhbmNlb2YgKEcuY3R4LkJJRykpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZSh4MyBpbnN0YW5jZW9mIChHLmN0eC5CSUcpKTtcbiAgICAgIGFzc2VydC5pc1RydWUoeDQgaW5zdGFuY2VvZiAoRy5jdHguQklHKSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnUmV0dXJucyBWYWxpZCBQcml2YXRlIEtleSAoZywgWDAsIFgxLCBYMiwgWDMsIFg0KScsICgpID0+IHtcbiAgICAgIGl0KCdnID0gZzInLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc1RydWUoZzIuZXF1YWxzKGcpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnWDAgPSBnMip4MCcsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShYMC5lcXVhbHMoRy5jdHguUEFJUi5HMm11bChnMiwgeDApKSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ1gxID0gZzIqeDEnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc1RydWUoWDEuZXF1YWxzKEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgxKSkpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdYMiA9IGcyKngyJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuaXNUcnVlKFgyLmVxdWFscyhHLmN0eC5QQUlSLkcybXVsKGcyLCB4MikpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnWDMgPSBnMip4MycsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShYMy5lcXVhbHMoRy5jdHguUEFJUi5HMm11bChnMiwgeDMpKSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ1g0ID0gZzIqeDQnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc1RydWUoWDQuZXF1YWxzKEcuY3R4LlBBSVIuRzJtdWwoZzIsIHg0KSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBoLCBzaWcgPSAoeDAgKyB4MSphMSArIHgyKmEyICsgLi4uKSAqIGhcbiAgICBkZXNjcmliZSgnU2lnbicsICgpID0+IHtcbiAgICAgIGl0KCdGb3Igc2lnbmF0dXJlKHNpZzEsIHNpZzIpLCBzaWcyID0gKHgwICsgeDEqYTEgKyB4MiphMiArIC4uLikgKiBzaWcxJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBDb2luU2lnLnNldHVwKCk7XG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgICAgICBjb25zdCBbc2ssIHBrXSA9IENvaW5TaWcua2V5Z2VuKHBhcmFtcyk7XG4gICAgICAgIGNvbnN0IFt4MCwgeDEsIHgyLCB4MywgeDRdID0gc2s7XG5cbiAgICAgICAgY29uc3QgY29pbl9wYXJhbXMgPSBCTFNTaWcuc2V0dXAoKTtcbiAgICAgICAgY29uc3QgW2NvaW5fc2ssIGNvaW5fcGtdID0gQkxTU2lnLmtleWdlbihjb2luX3BhcmFtcyk7XG4gICAgICAgIGNvbnN0IGR1bW15Q29pbiA9IGdldENvaW4oY29pbl9waywgNDIpO1xuXG4gICAgICAgIGNvbnN0IHNpZ25hdHVyZSA9IENvaW5TaWcuc2lnbihwYXJhbXMsIHNrLCBkdW1teUNvaW4pO1xuICAgICAgICBjb25zdCBbc2lnMSwgc2lnMl0gPSBzaWduYXR1cmU7XG5cbiAgICAgICAgY29uc3QgYTEgPSBuZXcgRy5jdHguQklHKGR1bW15Q29pbi52YWx1ZSk7XG4gICAgICAgIGExLm5vcm0oKTtcbiAgICAgICAgY29uc3QgYTIgPSBHLmhhc2hUb0JJRyhkdW1teUNvaW4udHRsLnRvU3RyaW5nKCkpO1xuICAgICAgICBjb25zdCBhMyA9IEcuaGFzaEcyRWxlbVRvQklHKGR1bW15Q29pbi52KTtcbiAgICAgICAgY29uc3QgYTQgPSBHLmhhc2hHMkVsZW1Ub0JJRyhkdW1teUNvaW4uaWQpO1xuXG4gICAgICAgIGNvbnN0IGExX2NweSA9IG5ldyBHLmN0eC5CSUcoYTEpO1xuICAgICAgICBhMV9jcHkubW9kKG8pO1xuICAgICAgICBjb25zdCBhMl9jcHkgPSBuZXcgRy5jdHguQklHKGEyKTtcbiAgICAgICAgYTJfY3B5Lm1vZChvKTtcbiAgICAgICAgY29uc3QgYTNfY3B5ID0gbmV3IEcuY3R4LkJJRyhhMyk7XG4gICAgICAgIGEzX2NweS5tb2Qobyk7XG4gICAgICAgIGNvbnN0IGE0X2NweSA9IG5ldyBHLmN0eC5CSUcoYTQpO1xuICAgICAgICBhNF9jcHkubW9kKG8pO1xuXG4gICAgICAgIGNvbnN0IHQxID0gRy5jdHguQklHLm11bCh4MSwgYTFfY3B5KTtcbiAgICAgICAgY29uc3QgdDIgPSBHLmN0eC5CSUcubXVsKHgyLCBhMl9jcHkpO1xuICAgICAgICBjb25zdCB0MyA9IEcuY3R4LkJJRy5tdWwoeDMsIGEzX2NweSk7XG4gICAgICAgIGNvbnN0IHQ0ID0gRy5jdHguQklHLm11bCh4NCwgYTRfY3B5KTtcblxuICAgICAgICBjb25zdCB4MERCSUcgPSBuZXcgRy5jdHguREJJRygwKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBHLmN0eC5CSUcuTkxFTjsgaSsrKSB7XG4gICAgICAgICAgeDBEQklHLndbaV0gPSB4MC53W2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgeDBEQklHLmFkZCh0MSk7XG4gICAgICAgIHgwREJJRy5hZGQodDIpO1xuICAgICAgICB4MERCSUcuYWRkKHQzKTtcbiAgICAgICAgeDBEQklHLmFkZCh0NCk7XG5cbiAgICAgICAgY29uc3QgSyA9IHgwREJJRy5tb2Qobyk7XG5cbiAgICAgICAgY29uc3Qgc2lnX3Rlc3QgPSBHLmN0eC5QQUlSLkcxbXVsKHNpZzEsIEspO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKHNpZzIuZXF1YWxzKHNpZ190ZXN0KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdWZXJpZnknLCAoKSA9PiB7XG4gICAgICBsZXQgcGFyYW1zO1xuICAgICAgbGV0IHNrO1xuICAgICAgbGV0IHBrO1xuICAgICAgbGV0IGR1bW15Q29pbjtcbiAgICAgIGxldCB0ZXN0Q29pbjtcbiAgICAgIGxldCBzaWc7XG4gICAgICBsZXQgY29pbl9wYXJhbXM7XG4gICAgICBiZWZvcmUoKCkgPT4ge1xuICAgICAgICBwYXJhbXMgPSBDb2luU2lnLnNldHVwKCk7XG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgICAgICBbc2ssIHBrXSA9IENvaW5TaWcua2V5Z2VuKHBhcmFtcyk7XG5cbiAgICAgICAgY29pbl9wYXJhbXMgPSBCTFNTaWcuc2V0dXAoKTtcbiAgICAgICAgY29uc3QgW2NvaW5fc2ssIGNvaW5fcGtdID0gQkxTU2lnLmtleWdlbihjb2luX3BhcmFtcyk7XG4gICAgICAgIGR1bW15Q29pbiA9IGdldENvaW4oY29pbl9waywgNDIpO1xuICAgICAgICB0ZXN0Q29pbiA9IGdldENvaW4oY29pbl9waywgNDIpOyAvLyB0byBtYWtlIGl0IGluc3RhbmNlIG9mIHNhbWUgY2xhc3NcblxuICAgICAgICBzaWcgPSBDb2luU2lnLnNpZ24ocGFyYW1zLCBzaywgZHVtbXlDb2luKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyAncmVzZXRzJyB0aGUgdGVzdCBjb2luXG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgdGVzdENvaW4udHRsID0gZHVtbXlDb2luLnR0bDtcbiAgICAgICAgdGVzdENvaW4uaWQgPSBuZXcgRy5jdHguRUNQMigpO1xuICAgICAgICB0ZXN0Q29pbi5pZC5jb3B5KGR1bW15Q29pbi5pZCk7XG4gICAgICAgIHRlc3RDb2luLnZhbHVlID0gZHVtbXlDb2luLnZhbHVlO1xuICAgICAgICB0ZXN0Q29pbi52ID0gbmV3IEcuY3R4LkVDUDIoKTtcbiAgICAgICAgdGVzdENvaW4udi5jb3B5KGR1bW15Q29pbi52KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnU3VjY2Vzc2Z1bCB2ZXJpZmljYXRpb24gb2Ygb3JpZ2luYWwgY29pbicsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShDb2luU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBkdW1teUNvaW4sIHNpZykpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdGYWlsZWQgdmVyaWZpY2F0aW9uIGZvciBjb2luIHdpdGggZGlmZmVyZW50IHZhbHVlJywgKCkgPT4ge1xuICAgICAgICB0ZXN0Q29pbi52YWx1ZSA9IDI1NjtcbiAgICAgICAgYXNzZXJ0LmlzTm90VHJ1ZShDb2luU2lnLnZlcmlmeShwYXJhbXMsIHBrLCB0ZXN0Q29pbiwgc2lnKSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ0ZhaWxlZCB2ZXJpZmljYXRpb24gZm9yIGNvaW4gd2l0aCBkaWZmZXJlbnQgdHRsJywgKCkgPT4ge1xuICAgICAgICAvLyB0dGwgb2YgYWN0dWFsIGNvaW4gd2lsbCBuZXZlciBiZSBlcXVhbCB0byB0aGF0XG4gICAgICAgIHRlc3RDb2luLnZhbHVlID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxMjM0NTY3ODtcbiAgICAgICAgYXNzZXJ0LmlzTm90VHJ1ZShDb2luU2lnLnZlcmlmeShwYXJhbXMsIHBrLCB0ZXN0Q29pbiwgc2lnKSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ0ZhaWxlZCB2ZXJpZmljYXRpb24gZm9yIGNvaW4gd2l0aCBkaWZmZXJlbnQgaWQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0NvaW5JZGUgPSBnZXRSYW5kb21Db2luSWQoKTtcbiAgICAgICAgdGVzdENvaW4uaWQgPSBHLmN0eC5QQUlSLkcybXVsKGcyLCBuZXdDb2luSWRlKTtcbiAgICAgICAgYXNzZXJ0LmlzTm90VHJ1ZShDb2luU2lnLnZlcmlmeShwYXJhbXMsIHBrLCB0ZXN0Q29pbiwgc2lnKSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ0ZhaWxlZCB2ZXJpZmljYXRpb24gZm9yIGNvaW4gd2l0aCBkaWZmZXJlbnQgcHJpdmF0ZSBrZXknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IFtuZXdfY29pbl9zaywgbmV3X2NvaW5fcGtdID0gQkxTU2lnLmtleWdlbihjb2luX3BhcmFtcyk7XG4gICAgICAgIHRlc3RDb2luLnYgPSBuZXdfY29pbl9waztcbiAgICAgICAgYXNzZXJ0LmlzTm90VHJ1ZShDb2luU2lnLnZlcmlmeShwYXJhbXMsIHBrLCB0ZXN0Q29pbiwgc2lnKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==