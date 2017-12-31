'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _mocha = require('mocha');

var _chai = require('chai');

var _PSSig = require('../PSSig');

var _PSSig2 = _interopRequireDefault(_PSSig);

var _BpGroup = require('../BpGroup');

var _BpGroup2 = _interopRequireDefault(_BpGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('Pointcheval-Sanders Short Randomizable Signatures scheme', function () {
  (0, _mocha.describe)('Setup', function () {
    var params = _PSSig2.default.setup();

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
    var params = _PSSig2.default.setup();

    var _params2 = _slicedToArray(params, 5),
        G = _params2[0],
        o = _params2[1],
        g1 = _params2[2],
        g2 = _params2[3],
        e = _params2[4];

    var _PSSig$keygen = _PSSig2.default.keygen(params),
        _PSSig$keygen2 = _slicedToArray(_PSSig$keygen, 2),
        sk = _PSSig$keygen2[0],
        pk = _PSSig$keygen2[1];

    var _sk = _slicedToArray(sk, 2),
        x = _sk[0],
        y = _sk[1];

    var _pk = _slicedToArray(pk, 3),
        g = _pk[0],
        X = _pk[1],
        Y = _pk[2];

    (0, _mocha.it)('Returns Secret Key (x,y)', function () {
      _chai.assert.isTrue(x instanceof G.ctx.BIG);
      _chai.assert.isTrue(y instanceof G.ctx.BIG);
    });

    (0, _mocha.describe)('Returns Valid Private Key (g,X,Y)', function () {
      (0, _mocha.it)('g = g2', function () {
        _chai.assert.isTrue(g2.equals(g));
      });

      (0, _mocha.it)('X = g2*x', function () {
        _chai.assert.isTrue(X.equals(G.ctx.PAIR.G2mul(g2, x)));
      });

      (0, _mocha.it)('Y = g2*y', function () {
        _chai.assert.isTrue(Y.equals(G.ctx.PAIR.G2mul(g2, y)));
      });
    });
  });

  // h, sig = (x+y*m) * h
  (0, _mocha.describe)('Sign', function () {
    var params = _PSSig2.default.setup();

    var _params3 = _slicedToArray(params, 5),
        G = _params3[0],
        o = _params3[1],
        g1 = _params3[2],
        g2 = _params3[3],
        e = _params3[4];

    var _PSSig$keygen3 = _PSSig2.default.keygen(params),
        _PSSig$keygen4 = _slicedToArray(_PSSig$keygen3, 2),
        sk = _PSSig$keygen4[0],
        pk = _PSSig$keygen4[1];

    var _sk2 = _slicedToArray(sk, 2),
        x = _sk2[0],
        y = _sk2[1];

    var m = 'Hello World!';

    var signature = _PSSig2.default.sign(params, sk, m);

    var _signature = _slicedToArray(signature, 2),
        sig1 = _signature[0],
        sig2 = _signature[1];

    (0, _mocha.it)('For signature(sig1, sig2), sig2 = ((x+y*(m mod p)) mod p) * sig1', function () {
      m = G.hashToBIG(m);
      var mcpy = new G.ctx.BIG(m);
      mcpy.mod(o);

      var t1 = G.ctx.BIG.mul(y, mcpy);

      var xDBIG = new G.ctx.DBIG(0);
      for (var i = 0; i < G.ctx.BIG.NLEN; i++) {
        xDBIG.w[i] = x.w[i];
      }
      t1.add(xDBIG);
      var K = t1.mod(o);

      var sig_test = G.ctx.PAIR.G1mul(sig1, K);
      _chai.assert.isTrue(sig2.equals(sig_test));
    });
  });

  (0, _mocha.describe)('Verify', function () {
    (0, _mocha.describe)('With sk = (42, 513)', function () {
      var params = _PSSig2.default.setup();

      var _params4 = _slicedToArray(params, 5),
          G = _params4[0],
          o = _params4[1],
          g1 = _params4[2],
          g2 = _params4[3],
          e = _params4[4];

      // keygen needs to be done 'manually'


      var x = new G.ctx.BIG(42);
      var y = new G.ctx.BIG(513);

      var sk = [x, y];
      var pk = [g2, g2.mul(x), g2.mul(y)];

      var m = 'Hello World!';
      var sig = _PSSig2.default.sign(params, sk, m);

      (0, _mocha.it)('Successful verification for original message', function () {
        _chai.assert.isTrue(_PSSig2.default.verify(params, pk, m, sig));
      });

      (0, _mocha.it)('Failed verification for another message', function () {
        var m2 = 'Other Hello World!';
        _chai.assert.isNotTrue(_PSSig2.default.verify(params, pk, m2, sig));
      });
    });

    (0, _mocha.describe)("With 'proper' random", function () {
      var params = _PSSig2.default.setup();

      var _params5 = _slicedToArray(params, 5),
          G = _params5[0],
          o = _params5[1],
          g1 = _params5[2],
          g2 = _params5[3],
          e = _params5[4];

      var _PSSig$keygen5 = _PSSig2.default.keygen(params),
          _PSSig$keygen6 = _slicedToArray(_PSSig$keygen5, 2),
          sk = _PSSig$keygen6[0],
          pk = _PSSig$keygen6[1];

      var _sk3 = _slicedToArray(sk, 2),
          x = _sk3[0],
          y = _sk3[1];

      var m = 'Hello World!';
      var sig = _PSSig2.default.sign(params, sk, m);

      (0, _mocha.it)('Successful verification for original message', function () {
        _chai.assert.isTrue(_PSSig2.default.verify(params, pk, m, sig));
      });

      (0, _mocha.it)('Failed verification for another message', function () {
        var m2 = 'Other Hello World!';
        _chai.assert.isNotTrue(_PSSig2.default.verify(params, pk, m2, sig));
      });
    });
  });

  (0, _mocha.describe)('Randomize', function () {
    var params = _PSSig2.default.setup();

    var _params6 = _slicedToArray(params, 5),
        G = _params6[0],
        o = _params6[1],
        g1 = _params6[2],
        g2 = _params6[3],
        e = _params6[4];

    var _PSSig$keygen7 = _PSSig2.default.keygen(params),
        _PSSig$keygen8 = _slicedToArray(_PSSig$keygen7, 2),
        sk = _PSSig$keygen8[0],
        pk = _PSSig$keygen8[1];

    var _sk4 = _slicedToArray(sk, 2),
        x = _sk4[0],
        y = _sk4[1];

    var m = 'Hello World!';
    var sig = _PSSig2.default.sign(params, sk, m);
    sig = _PSSig2.default.randomize(params, sig);

    (0, _mocha.it)('Successful verification for original message with randomized signature', function () {
      _chai.assert.isTrue(_PSSig2.default.verify(params, pk, m, sig));
    });

    (0, _mocha.it)('Failed verification for another message with randomized signature', function () {
      var m2 = 'Other Hello World!';
      _chai.assert.isNotTrue(_PSSig2.default.verify(params, pk, m2, sig));
    });
  });

  // todo: better test for whether aggregation is correct
  (0, _mocha.describe)('Aggregate', function () {
    (0, _mocha.it)('Aggregation(s1) = s1', function () {
      var params = _PSSig2.default.setup();

      var _params7 = _slicedToArray(params, 5),
          G = _params7[0],
          o = _params7[1],
          g1 = _params7[2],
          g2 = _params7[3],
          e = _params7[4];

      var _PSSig$keygen9 = _PSSig2.default.keygen(params),
          _PSSig$keygen10 = _slicedToArray(_PSSig$keygen9, 2),
          sk = _PSSig$keygen10[0],
          pk = _PSSig$keygen10[1];

      var _sk5 = _slicedToArray(sk, 2),
          x = _sk5[0],
          y = _sk5[1];

      var m = 'Hello World!';
      var signature = _PSSig2.default.sign(params, sk, m);
      var aggregateSig = _PSSig2.default.aggregateSignatures(params, [signature]);

      _chai.assert.isTrue(signature[1].equals(aggregateSig[1]));
    });
  });

  (0, _mocha.describe)('Aggregate Verification', function () {
    (0, _mocha.describe)('Aggregate Verification', function () {
      (0, _mocha.it)('Works for single signature', function () {
        var params = _PSSig2.default.setup();

        var _params8 = _slicedToArray(params, 5),
            G = _params8[0],
            o = _params8[1],
            g1 = _params8[2],
            g2 = _params8[3],
            e = _params8[4];

        var _PSSig$keygen11 = _PSSig2.default.keygen(params),
            _PSSig$keygen12 = _slicedToArray(_PSSig$keygen11, 2),
            sk = _PSSig$keygen12[0],
            pk = _PSSig$keygen12[1];

        var m = 'Hello World!';
        var sig = _PSSig2.default.sign(params, sk, m);
        var aggregateSignature = _PSSig2.default.aggregateSignatures(params, [sig]);

        _chai.assert.isTrue(_PSSig2.default.verifyAggregation(params, [pk], m, aggregateSignature));
      });

      (0, _mocha.it)('Works for three distinct signatures', function () {
        var params = _PSSig2.default.setup();

        var _params9 = _slicedToArray(params, 5),
            G = _params9[0],
            o = _params9[1],
            g1 = _params9[2],
            g2 = _params9[3],
            e = _params9[4];

        var messagesToSign = 3;
        var pks = [];
        var signatures = [];

        var m = 'Hello World!';

        for (var i = 0; i < messagesToSign; i++) {
          var _PSSig$keygen13 = _PSSig2.default.keygen(params),
              _PSSig$keygen14 = _slicedToArray(_PSSig$keygen13, 2),
              sk = _PSSig$keygen14[0],
              pk = _PSSig$keygen14[1];

          pks.push(pk);
          var signature = _PSSig2.default.sign(params, sk, m);
          signatures.push(signature);
        }

        var aggregateSignature = _PSSig2.default.aggregateSignatures(params, signatures);

        _chai.assert.isTrue(_PSSig2.default.verifyAggregation(params, pks, m, aggregateSignature));
      });

      (0, _mocha.it)("Doesn't work when one of three signatures is on different message", function () {
        var params = _PSSig2.default.setup();

        var _params10 = _slicedToArray(params, 5),
            G = _params10[0],
            o = _params10[1],
            g1 = _params10[2],
            g2 = _params10[3],
            e = _params10[4];

        var messagesToSign = 2;
        var pks = [];
        var signatures = [];

        var m = 'Hello World!';

        for (var i = 0; i < messagesToSign; i++) {
          var _PSSig$keygen15 = _PSSig2.default.keygen(params),
              _PSSig$keygen16 = _slicedToArray(_PSSig$keygen15, 2),
              sk = _PSSig$keygen16[0],
              pk = _PSSig$keygen16[1];

          pks.push(pk);
          var signature = _PSSig2.default.sign(params, sk, m);
          signatures.push(signature);
        }

        var m2 = 'Malicious Hello World';

        var _PSSig$keygen17 = _PSSig2.default.keygen(params),
            _PSSig$keygen18 = _slicedToArray(_PSSig$keygen17, 2),
            skm = _PSSig$keygen18[0],
            pkm = _PSSig$keygen18[1];

        pks.push(pkm);
        var maliciousSignature = _PSSig2.default.sign(params, skm, m2);
        signatures.push(maliciousSignature);

        var aggregateSignature = _PSSig2.default.aggregateSignatures(params, signatures);

        _chai.assert.isNotTrue(_PSSig2.default.verifyAggregation(params, pks, m, aggregateSignature));
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L1BTU2lnLnRlc3QuanMiXSwibmFtZXMiOlsicGFyYW1zIiwic2V0dXAiLCJHIiwibyIsImcxIiwiZzIiLCJlIiwiaXNOb3ROdWxsIiwiaXNUcnVlIiwiY3R4IiwiQklHIiwiRUNQIiwiRUNQMiIsIkZ1bmN0aW9uIiwia2V5Z2VuIiwic2siLCJwayIsIngiLCJ5IiwiZyIsIlgiLCJZIiwiZXF1YWxzIiwiUEFJUiIsIkcybXVsIiwibSIsInNpZ25hdHVyZSIsInNpZ24iLCJzaWcxIiwic2lnMiIsImhhc2hUb0JJRyIsIm1jcHkiLCJtb2QiLCJ0MSIsIm11bCIsInhEQklHIiwiREJJRyIsImkiLCJOTEVOIiwidyIsImFkZCIsIksiLCJzaWdfdGVzdCIsIkcxbXVsIiwic2lnIiwidmVyaWZ5IiwibTIiLCJpc05vdFRydWUiLCJyYW5kb21pemUiLCJhZ2dyZWdhdGVTaWciLCJhZ2dyZWdhdGVTaWduYXR1cmVzIiwiYWdncmVnYXRlU2lnbmF0dXJlIiwidmVyaWZ5QWdncmVnYXRpb24iLCJtZXNzYWdlc1RvU2lnbiIsInBrcyIsInNpZ25hdHVyZXMiLCJwdXNoIiwic2ttIiwicGttIiwibWFsaWNpb3VzU2lnbmF0dXJlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEscUJBQVMsMERBQVQsRUFBcUUsWUFBTTtBQUN6RSx1QkFBUyxPQUFULEVBQWtCLFlBQU07QUFDdEIsUUFBTUEsU0FBUyxnQkFBTUMsS0FBTixFQUFmOztBQURzQixpQ0FFSUQsTUFGSjtBQUFBLFFBRWZFLENBRmU7QUFBQSxRQUVaQyxDQUZZO0FBQUEsUUFFVEMsRUFGUztBQUFBLFFBRUxDLEVBRks7QUFBQSxRQUVEQyxDQUZDOztBQUl0QixtQkFBRyx3QkFBSCxFQUE2QixZQUFNO0FBQ2pDLG1CQUFPQyxTQUFQLENBQWlCTCxDQUFqQjtBQUNBLG1CQUFPTSxNQUFQLENBQWNOLDhCQUFkO0FBQ0QsS0FIRDs7QUFLQSxtQkFB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QSxnQ0FDdEIsZ0JBQU12QixNQUFOLENBQWFkLE1BQWIsQ0FEc0I7QUFBQTtBQUFBLGNBQ2hDZSxFQURnQztBQUFBLGNBQzVCQyxFQUQ0Qjs7QUFFdkNzQyxjQUFJRSxJQUFKLENBQVN4QyxFQUFUO0FBQ0EsY0FBTVUsWUFBWSxnQkFBTUMsSUFBTixDQUFXM0IsTUFBWCxFQUFtQmUsRUFBbkIsRUFBdUJVLENBQXZCLENBQWxCO0FBQ0E4QixxQkFBV0MsSUFBWCxDQUFnQjlCLFNBQWhCO0FBQ0Q7O0FBRUQsWUFBTW9CLEtBQUssdUJBQVg7O0FBakI0RSw4QkFrQnpELGdCQUFNaEMsTUFBTixDQUFhZCxNQUFiLENBbEJ5RDtBQUFBO0FBQUEsWUFrQnJFeUQsR0FsQnFFO0FBQUEsWUFrQmhFQyxHQWxCZ0U7O0FBbUI1RUosWUFBSUUsSUFBSixDQUFTRSxHQUFUO0FBQ0EsWUFBTUMscUJBQXFCLGdCQUFNaEMsSUFBTixDQUFXM0IsTUFBWCxFQUFtQnlELEdBQW5CLEVBQXdCWCxFQUF4QixDQUEzQjtBQUNBUyxtQkFBV0MsSUFBWCxDQUFnQkcsa0JBQWhCOztBQUVBLFlBQU1SLHFCQUFxQixnQkFBTUQsbUJBQU4sQ0FBMEJsRCxNQUExQixFQUFrQ3VELFVBQWxDLENBQTNCOztBQUVBLHFCQUFPUixTQUFQLENBQWlCLGdCQUFNSyxpQkFBTixDQUF3QnBELE1BQXhCLEVBQWdDc0QsR0FBaEMsRUFBcUM3QixDQUFyQyxFQUF3QzBCLGtCQUF4QyxDQUFqQjtBQUNELE9BMUJEO0FBMkJELEtBOUREO0FBK0RELEdBaEVEO0FBaUVELENBL09EIiwiZmlsZSI6IlBTU2lnLnRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZXNjcmliZSwgaXQsIHhpdCB9IGZyb20gJ21vY2hhJztcbmltcG9ydCB7IGV4cGVjdCwgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgUFNTaWcgZnJvbSAnLi4vUFNTaWcnO1xuaW1wb3J0IEJwR3JvdXAgZnJvbSAnLi4vQnBHcm91cCc7XG5cbmRlc2NyaWJlKCdQb2ludGNoZXZhbC1TYW5kZXJzIFNob3J0IFJhbmRvbWl6YWJsZSBTaWduYXR1cmVzIHNjaGVtZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ1NldHVwJywgKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XG4gICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG5cbiAgICBpdCgnUmV0dXJucyBCcEdyb3VwIE9iamVjdCcsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc05vdE51bGwoRyk7XG4gICAgICBhc3NlcnQuaXNUcnVlKEcgaW5zdGFuY2VvZiAoQnBHcm91cCkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ1JldHVybnMgR3JvdXAgT3JkZXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKG8pO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShvIGluc3RhbmNlb2YgKEcuY3R4LkJJRykpO1xuICAgIH0pO1xuXG4gICAgaXQoJ1JldHVybnMgR2VuMScsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc05vdE51bGwoZzEpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShnMSBpbnN0YW5jZW9mIChHLmN0eC5FQ1ApKTtcbiAgICB9KTtcblxuICAgIGl0KCdSZXR1cm5zIEdlbjInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKGcyKTtcbiAgICAgIGFzc2VydC5pc1RydWUoZzIgaW5zdGFuY2VvZiAoRy5jdHguRUNQMikpO1xuICAgIH0pO1xuXG4gICAgaXQoJ1JldHVybnMgUGFpciBmdW5jdGlvbicsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc05vdE51bGwoZSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKGUgaW5zdGFuY2VvZiAoRnVuY3Rpb24pKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0tleWdlbicsICgpID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XG5cbiAgICBjb25zdCBbeCwgeV0gPSBzaztcbiAgICBjb25zdCBbZywgWCwgWV0gPSBwaztcblxuICAgIGl0KCdSZXR1cm5zIFNlY3JldCBLZXkgKHgseSknLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNUcnVlKHggaW5zdGFuY2VvZiAoRy5jdHguQklHKSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHkgaW5zdGFuY2VvZiAoRy5jdHguQklHKSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnUmV0dXJucyBWYWxpZCBQcml2YXRlIEtleSAoZyxYLFkpJywgKCkgPT4ge1xuICAgICAgaXQoJ2cgPSBnMicsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShnMi5lcXVhbHMoZykpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdYID0gZzIqeCcsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShYLmVxdWFscyhHLmN0eC5QQUlSLkcybXVsKGcyLCB4KSkpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdZID0gZzIqeScsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShZLmVxdWFscyhHLmN0eC5QQUlSLkcybXVsKGcyLCB5KSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIGgsIHNpZyA9ICh4K3kqbSkgKiBoXG4gIGRlc2NyaWJlKCdTaWduJywgKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XG4gICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG4gICAgY29uc3QgW3NrLCBwa10gPSBQU1NpZy5rZXlnZW4ocGFyYW1zKTtcbiAgICBjb25zdCBbeCwgeV0gPSBzaztcblxuICAgIGxldCBtID0gJ0hlbGxvIFdvcmxkISc7XG5cbiAgICBjb25zdCBzaWduYXR1cmUgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xuICAgIGNvbnN0IFtzaWcxLCBzaWcyXSA9IHNpZ25hdHVyZTtcblxuXG4gICAgaXQoJ0ZvciBzaWduYXR1cmUoc2lnMSwgc2lnMiksIHNpZzIgPSAoKHgreSoobSBtb2QgcCkpIG1vZCBwKSAqIHNpZzEnLCAoKSA9PiB7XG4gICAgICBtID0gRy5oYXNoVG9CSUcobSk7XG4gICAgICBjb25zdCBtY3B5ID0gbmV3IEcuY3R4LkJJRyhtKTtcbiAgICAgIG1jcHkubW9kKG8pO1xuXG4gICAgICBjb25zdCB0MSA9IEcuY3R4LkJJRy5tdWwoeSwgbWNweSk7XG5cbiAgICAgIGNvbnN0IHhEQklHID0gbmV3IEcuY3R4LkRCSUcoMCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IEcuY3R4LkJJRy5OTEVOOyBpKyspIHtcbiAgICAgICAgeERCSUcud1tpXSA9IHgud1tpXTtcbiAgICAgIH1cbiAgICAgIHQxLmFkZCh4REJJRyk7XG4gICAgICBjb25zdCBLID0gdDEubW9kKG8pO1xuXG4gICAgICBjb25zdCBzaWdfdGVzdCA9IEcuY3R4LlBBSVIuRzFtdWwoc2lnMSwgSyk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHNpZzIuZXF1YWxzKHNpZ190ZXN0KSk7XG4gICAgfSk7XG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ1ZlcmlmeScsICgpID0+IHtcbiAgICBkZXNjcmliZSgnV2l0aCBzayA9ICg0MiwgNTEzKScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XG4gICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcblxuICAgICAgLy8ga2V5Z2VuIG5lZWRzIHRvIGJlIGRvbmUgJ21hbnVhbGx5J1xuICAgICAgY29uc3QgeCA9IG5ldyBHLmN0eC5CSUcoNDIpO1xuICAgICAgY29uc3QgeSA9IG5ldyBHLmN0eC5CSUcoNTEzKTtcblxuICAgICAgY29uc3Qgc2sgPSBbeCwgeV07XG4gICAgICBjb25zdCBwayA9IFtnMiwgZzIubXVsKHgpLCBnMi5tdWwoeSldO1xuXG4gICAgICBjb25zdCBtID0gJ0hlbGxvIFdvcmxkISc7XG4gICAgICBjb25zdCBzaWcgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xuXG4gICAgICBpdCgnU3VjY2Vzc2Z1bCB2ZXJpZmljYXRpb24gZm9yIG9yaWdpbmFsIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc1RydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZykpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdGYWlsZWQgdmVyaWZpY2F0aW9uIGZvciBhbm90aGVyIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG0yID0gJ090aGVyIEhlbGxvIFdvcmxkISc7XG4gICAgICAgIGFzc2VydC5pc05vdFRydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0yLCBzaWcpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJXaXRoICdwcm9wZXInIHJhbmRvbVwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xuICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG4gICAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xuICAgICAgY29uc3QgW3gsIHldID0gc2s7XG5cbiAgICAgIGNvbnN0IG0gPSAnSGVsbG8gV29ybGQhJztcbiAgICAgIGNvbnN0IHNpZyA9IFBTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XG5cbiAgICAgIGl0KCdTdWNjZXNzZnVsIHZlcmlmaWNhdGlvbiBmb3Igb3JpZ2luYWwgbWVzc2FnZScsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShQU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbSwgc2lnKSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ0ZhaWxlZCB2ZXJpZmljYXRpb24gZm9yIGFub3RoZXIgbWVzc2FnZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgbTIgPSAnT3RoZXIgSGVsbG8gV29ybGQhJztcbiAgICAgICAgYXNzZXJ0LmlzTm90VHJ1ZShQU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbTIsIHNpZykpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdSYW5kb21pemUnLCAoKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcbiAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcbiAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xuICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xuXG4gICAgY29uc3QgbSA9ICdIZWxsbyBXb3JsZCEnO1xuICAgIGxldCBzaWcgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xuICAgIHNpZyA9IFBTU2lnLnJhbmRvbWl6ZShwYXJhbXMsIHNpZyk7XG5cbiAgICBpdCgnU3VjY2Vzc2Z1bCB2ZXJpZmljYXRpb24gZm9yIG9yaWdpbmFsIG1lc3NhZ2Ugd2l0aCByYW5kb21pemVkIHNpZ25hdHVyZScsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1RydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZykpO1xuICAgIH0pO1xuXG4gICAgaXQoJ0ZhaWxlZCB2ZXJpZmljYXRpb24gZm9yIGFub3RoZXIgbWVzc2FnZSB3aXRoIHJhbmRvbWl6ZWQgc2lnbmF0dXJlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbTIgPSAnT3RoZXIgSGVsbG8gV29ybGQhJztcbiAgICAgIGFzc2VydC5pc05vdFRydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0yLCBzaWcpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gdG9kbzogYmV0dGVyIHRlc3QgZm9yIHdoZXRoZXIgYWdncmVnYXRpb24gaXMgY29ycmVjdFxuICBkZXNjcmliZSgnQWdncmVnYXRlJywgKCkgPT4ge1xuICAgIGl0KCdBZ2dyZWdhdGlvbihzMSkgPSBzMScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XG4gICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcbiAgICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XG4gICAgICBjb25zdCBbeCwgeV0gPSBzaztcblxuICAgICAgY29uc3QgbSA9ICdIZWxsbyBXb3JsZCEnO1xuICAgICAgY29uc3Qgc2lnbmF0dXJlID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcbiAgICAgIGNvbnN0IGFnZ3JlZ2F0ZVNpZyA9IFBTU2lnLmFnZ3JlZ2F0ZVNpZ25hdHVyZXMocGFyYW1zLCBbc2lnbmF0dXJlXSk7XG5cbiAgICAgIGFzc2VydC5pc1RydWUoc2lnbmF0dXJlWzFdLmVxdWFscyhhZ2dyZWdhdGVTaWdbMV0pKTtcbiAgICB9KTtcbiAgfSk7XG5cblxuICBkZXNjcmliZSgnQWdncmVnYXRlIFZlcmlmaWNhdGlvbicsICgpID0+IHtcbiAgICBkZXNjcmliZSgnQWdncmVnYXRlIFZlcmlmaWNhdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdXb3JrcyBmb3Igc2luZ2xlIHNpZ25hdHVyZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG4gICAgICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XG5cbiAgICAgICAgY29uc3QgbSA9ICdIZWxsbyBXb3JsZCEnO1xuICAgICAgICBjb25zdCBzaWcgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xuICAgICAgICBjb25zdCBhZ2dyZWdhdGVTaWduYXR1cmUgPSBQU1NpZy5hZ2dyZWdhdGVTaWduYXR1cmVzKHBhcmFtcywgW3NpZ10pO1xuXG4gICAgICAgIGFzc2VydC5pc1RydWUoUFNTaWcudmVyaWZ5QWdncmVnYXRpb24ocGFyYW1zLCBbcGtdLCBtLCBhZ2dyZWdhdGVTaWduYXR1cmUpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnV29ya3MgZm9yIHRocmVlIGRpc3RpbmN0IHNpZ25hdHVyZXMnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VzVG9TaWduID0gMztcbiAgICAgICAgY29uc3QgcGtzID0gW107XG4gICAgICAgIGNvbnN0IHNpZ25hdHVyZXMgPSBbXTtcblxuICAgICAgICBjb25zdCBtID0gJ0hlbGxvIFdvcmxkISc7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNzYWdlc1RvU2lnbjsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgW3NrLCBwa10gPSBQU1NpZy5rZXlnZW4ocGFyYW1zKTtcbiAgICAgICAgICBwa3MucHVzaChwayk7XG4gICAgICAgICAgY29uc3Qgc2lnbmF0dXJlID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcbiAgICAgICAgICBzaWduYXR1cmVzLnB1c2goc2lnbmF0dXJlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFnZ3JlZ2F0ZVNpZ25hdHVyZSA9IFBTU2lnLmFnZ3JlZ2F0ZVNpZ25hdHVyZXMocGFyYW1zLCBzaWduYXR1cmVzKTtcblxuICAgICAgICBhc3NlcnQuaXNUcnVlKFBTU2lnLnZlcmlmeUFnZ3JlZ2F0aW9uKHBhcmFtcywgcGtzLCBtLCBhZ2dyZWdhdGVTaWduYXR1cmUpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdChcIkRvZXNuJ3Qgd29yayB3aGVuIG9uZSBvZiB0aHJlZSBzaWduYXR1cmVzIGlzIG9uIGRpZmZlcmVudCBtZXNzYWdlXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG5cbiAgICAgICAgY29uc3QgbWVzc2FnZXNUb1NpZ24gPSAyO1xuICAgICAgICBjb25zdCBwa3MgPSBbXTtcbiAgICAgICAgY29uc3Qgc2lnbmF0dXJlcyA9IFtdO1xuXG4gICAgICAgIGNvbnN0IG0gPSAnSGVsbG8gV29ybGQhJztcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc3NhZ2VzVG9TaWduOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xuICAgICAgICAgIHBrcy5wdXNoKHBrKTtcbiAgICAgICAgICBjb25zdCBzaWduYXR1cmUgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xuICAgICAgICAgIHNpZ25hdHVyZXMucHVzaChzaWduYXR1cmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbTIgPSAnTWFsaWNpb3VzIEhlbGxvIFdvcmxkJztcbiAgICAgICAgY29uc3QgW3NrbSwgcGttXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xuICAgICAgICBwa3MucHVzaChwa20pO1xuICAgICAgICBjb25zdCBtYWxpY2lvdXNTaWduYXR1cmUgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ttLCBtMik7XG4gICAgICAgIHNpZ25hdHVyZXMucHVzaChtYWxpY2lvdXNTaWduYXR1cmUpO1xuXG4gICAgICAgIGNvbnN0IGFnZ3JlZ2F0ZVNpZ25hdHVyZSA9IFBTU2lnLmFnZ3JlZ2F0ZVNpZ25hdHVyZXMocGFyYW1zLCBzaWduYXR1cmVzKTtcblxuICAgICAgICBhc3NlcnQuaXNOb3RUcnVlKFBTU2lnLnZlcmlmeUFnZ3JlZ2F0aW9uKHBhcmFtcywgcGtzLCBtLCBhZ2dyZWdhdGVTaWduYXR1cmUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19