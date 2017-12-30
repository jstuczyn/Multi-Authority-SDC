'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _mocha = require('mocha');

var _chai = require('chai');

var chai = _interopRequireWildcard(_chai);

var _BLSSig = require('../BLSSig');

var _BLSSig2 = _interopRequireDefault(_BLSSig);

var _BpGroup = require('../BpGroup');

var _BpGroup2 = _interopRequireDefault(_BpGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(0, _mocha.describe)('Boneh–Lynn–Shacham-based Signature scheme', function () {
  (0, _mocha.describe)('Setup', function () {
    var params = _BLSSig2.default.setup();

    var _params = _slicedToArray(params, 5),
        G = _params[0],
        o = _params[1],
        g1 = _params[2],
        g2 = _params[3],
        e = _params[4];

    (0, _mocha.it)('Returns BpGroup Object', function () {
      chai.assert.isNotNull(G);
      chai.assert.isTrue(G instanceof _BpGroup2.default);
    });

    (0, _mocha.it)('Returns Group Order', function () {
      chai.assert.isNotNull(o);
      chai.assert.isTrue(o instanceof G.ctx.BIG);
    });

    (0, _mocha.it)('Returns Gen1', function () {
      chai.assert.isNotNull(g1);
      chai.assert.isTrue(g1 instanceof G.ctx.ECP);
    });

    (0, _mocha.it)('Returns Gen2', function () {
      chai.assert.isNotNull(g2);
      chai.assert.isTrue(g2 instanceof G.ctx.ECP2);
    });

    (0, _mocha.it)('Returns Pair function', function () {
      chai.assert.isNotNull(e);
      chai.assert.isTrue(e instanceof Function);
    });
  });

  (0, _mocha.describe)('Keygen', function () {
    var params = _BLSSig2.default.setup();

    var _params2 = _slicedToArray(params, 5),
        G = _params2[0],
        o = _params2[1],
        g1 = _params2[2],
        g2 = _params2[3],
        e = _params2[4];

    var _BLSSig$keygen = _BLSSig2.default.keygen(params),
        _BLSSig$keygen2 = _slicedToArray(_BLSSig$keygen, 2),
        sk = _BLSSig$keygen2[0],
        pk = _BLSSig$keygen2[1];

    (0, _mocha.it)('Returns Secret Key x', function () {
      chai.assert.isTrue(sk instanceof G.ctx.BIG);
    });

    (0, _mocha.it)('Returns Valid Private Key v = x * g2', function () {
      chai.assert.isTrue(pk.equals(G.ctx.PAIR.G2mul(g2, sk)));
    });
  });

  // sig = sk * H(m)
  (0, _mocha.describe)('Sign', function () {
    var params = _BLSSig2.default.setup();

    var _params3 = _slicedToArray(params, 5),
        G = _params3[0],
        o = _params3[1],
        g1 = _params3[2],
        g2 = _params3[3],
        e = _params3[4];

    var _BLSSig$keygen3 = _BLSSig2.default.keygen(params),
        _BLSSig$keygen4 = _slicedToArray(_BLSSig$keygen3, 2),
        sk = _BLSSig$keygen4[0],
        pk = _BLSSig$keygen4[1];

    var m = 'Hello World!';

    var signature = _BLSSig2.default.sign(params, sk, m);

    (0, _mocha.it)('signature = sk * H(m)', function () {
      var h = G.hashToPointOnCurve(m);

      var sig_test = G.ctx.PAIR.G1mul(h, sk);
      chai.assert.isTrue(signature.equals(sig_test));
    });
  });

  // e(sig, g2) = e(h, pk)
  (0, _mocha.describe)('Verify', function () {
    var params = _BLSSig2.default.setup();

    var _params4 = _slicedToArray(params, 5),
        G = _params4[0],
        o = _params4[1],
        g1 = _params4[2],
        g2 = _params4[3],
        e = _params4[4];

    var _BLSSig$keygen5 = _BLSSig2.default.keygen(params),
        _BLSSig$keygen6 = _slicedToArray(_BLSSig$keygen5, 2),
        sk = _BLSSig$keygen6[0],
        pk = _BLSSig$keygen6[1];

    var m = 'Hello World!';
    var sig = _BLSSig2.default.sign(params, sk, m);

    (0, _mocha.it)('Successful verification for original message', function () {
      chai.assert.isTrue(_BLSSig2.default.verify(params, pk, m, sig));
    });

    (0, _mocha.it)('Failed verification for another message', function () {
      var m2 = 'Other Hello World!';
      chai.assert.isNotTrue(_BLSSig2.default.verify(params, pk, m2, sig));
    });
  });

  (0, _mocha.describe)('Aggregate', function () {
    (0, _mocha.it)('Aggregation(sig1) = sig1', function () {
      var params = _BLSSig2.default.setup();

      var _params5 = _slicedToArray(params, 5),
          G = _params5[0],
          o = _params5[1],
          g1 = _params5[2],
          g2 = _params5[3],
          e = _params5[4];

      var _BLSSig$keygen7 = _BLSSig2.default.keygen(params),
          _BLSSig$keygen8 = _slicedToArray(_BLSSig$keygen7, 2),
          sk = _BLSSig$keygen8[0],
          pk = _BLSSig$keygen8[1];

      var m = 'Hello World!';
      var sig = _BLSSig2.default.sign(params, sk, m);
      var aggregateSignature = _BLSSig2.default.aggregateSignatures(params, [sig]);

      chai.assert.isTrue(sig.equals(aggregateSignature));
    });
  });

  (0, _mocha.describe)('Aggregate Verification', function () {
    (0, _mocha.it)('Works for single signature', function () {
      var params = _BLSSig2.default.setup();

      var _params6 = _slicedToArray(params, 5),
          G = _params6[0],
          o = _params6[1],
          g1 = _params6[2],
          g2 = _params6[3],
          e = _params6[4];

      var _BLSSig$keygen9 = _BLSSig2.default.keygen(params),
          _BLSSig$keygen10 = _slicedToArray(_BLSSig$keygen9, 2),
          sk = _BLSSig$keygen10[0],
          pk = _BLSSig$keygen10[1];

      var m = 'Hello World!';
      var sig = _BLSSig2.default.sign(params, sk, m);
      var aggregateSignature = _BLSSig2.default.aggregateSignatures(params, [sig]);

      chai.assert.isTrue(_BLSSig2.default.verifyAggregation(params, [pk], m, aggregateSignature));
    });

    (0, _mocha.it)('Works for three distinct signatures', function () {
      var params = _BLSSig2.default.setup();

      var _params7 = _slicedToArray(params, 5),
          G = _params7[0],
          o = _params7[1],
          g1 = _params7[2],
          g2 = _params7[3],
          e = _params7[4];

      var messagesToSign = 3;
      var pks = [];
      var signatures = [];

      var m = 'Hello World!';

      for (var i = 0; i < messagesToSign; i++) {
        var _BLSSig$keygen11 = _BLSSig2.default.keygen(params),
            _BLSSig$keygen12 = _slicedToArray(_BLSSig$keygen11, 2),
            sk = _BLSSig$keygen12[0],
            pk = _BLSSig$keygen12[1];

        pks.push(pk);
        var signature = _BLSSig2.default.sign(params, sk, m);
        signatures.push(signature);
      }

      var aggregateSignature = _BLSSig2.default.aggregateSignatures(params, signatures);

      chai.assert.isTrue(_BLSSig2.default.verifyAggregation(params, pks, m, aggregateSignature));
    });

    (0, _mocha.it)("Doesn't work when one of three signatures is on different message", function () {
      var params = _BLSSig2.default.setup();

      var _params8 = _slicedToArray(params, 5),
          G = _params8[0],
          o = _params8[1],
          g1 = _params8[2],
          g2 = _params8[3],
          e = _params8[4];

      var messagesToSign = 2;
      var pks = [];
      var signatures = [];

      var m = 'Hello World!';

      for (var i = 0; i < messagesToSign; i++) {
        var _BLSSig$keygen13 = _BLSSig2.default.keygen(params),
            _BLSSig$keygen14 = _slicedToArray(_BLSSig$keygen13, 2),
            sk = _BLSSig$keygen14[0],
            pk = _BLSSig$keygen14[1];

        pks.push(pk);
        var signature = _BLSSig2.default.sign(params, sk, m);
        signatures.push(signature);
      }

      var m2 = 'Malicious Hello World';

      var _BLSSig$keygen15 = _BLSSig2.default.keygen(params),
          _BLSSig$keygen16 = _slicedToArray(_BLSSig$keygen15, 2),
          skm = _BLSSig$keygen16[0],
          pkm = _BLSSig$keygen16[1];

      pks.push(pkm);
      var maliciousSignature = _BLSSig2.default.sign(params, skm, m2);
      signatures.push(maliciousSignature);

      var aggregateSignature = _BLSSig2.default.aggregateSignatures(params, signatures);

      chai.assert.isNotTrue(_BLSSig2.default.verifyAggregation(params, pks, m, aggregateSignature));
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L0JMU1NpZy50ZXN0LmpzIl0sIm5hbWVzIjpbImNoYWkiLCJwYXJhbXMiLCJzZXR1cCIsIkciLCJvIiwiZzEiLCJnMiIsImUiLCJhc3NlcnQiLCJpc05vdE51bGwiLCJpc1RydWUiLCJjdHgiLCJCSUciLCJFQ1AiLCJFQ1AyIiwiRnVuY3Rpb24iLCJrZXlnZW4iLCJzayIsInBrIiwiZXF1YWxzIiwiUEFJUiIsIkcybXVsIiwibSIsInNpZ25hdHVyZSIsInNpZ24iLCJoIiwiaGFzaFRvUG9pbnRPbkN1cnZlIiwic2lnX3Rlc3QiLCJHMW11bCIsInNpZyIsInZlcmlmeSIsIm0yIiwiaXNOb3RUcnVlIiwiYWdncmVnYXRlU2lnbmF0dXJlIiwiYWdncmVnYXRlU2lnbmF0dXJlcyIsInZlcmlmeUFnZ3JlZ2F0aW9uIiwibWVzc2FnZXNUb1NpZ24iLCJwa3MiLCJzaWduYXR1cmVzIiwiaSIsInB1c2giLCJza20iLCJwa20iLCJtYWxpY2lvdXNTaWduYXR1cmUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7QUFDQTs7SUFBWUEsSTs7QUFDWjs7OztBQUNBOzs7Ozs7OztBQUVBLHFCQUFTLDJDQUFULEVBQXNELFlBQU07QUFDMUQsdUJBQVMsT0FBVCxFQUFrQixZQUFNO0FBQ3RCLFFBQU1DLFNBQVMsaUJBQU9DLEtBQVAsRUFBZjs7QUFEc0IsaUNBRUlELE1BRko7QUFBQSxRQUVmRSxDQUZlO0FBQUEsUUFFWkMsQ0FGWTtBQUFBLFFBRVRDLEVBRlM7QUFBQSxRQUVMQyxFQUZLO0FBQUEsUUFFREMsQ0FGQzs7QUFJdEIsbUJBQUcsd0JBQUgsRUFBNkIsWUFBTTtBQUNqQ1AsV0FBS1EsTUFBTCxDQUFZQyxTQUFaLENBQXNCTixDQUF0QjtBQUNBSCxXQUFLUSxNQUFMLENBQVlFLE1BQVosQ0FBbUJQLDhCQUFuQjtBQUNELEtBSEQ7O0FBS0EsbUJBQUcscUJBQUgsRUFBMEIsWUFBTTtBQUM5QkgsV0FBS1EsTUFBTCxDQUFZQyxTQUFaLENBQXNCTCxD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QztBQUFBLCtCQUN0QixpQkFBT3ZCLE1BQVAsQ0FBY2YsTUFBZCxDQURzQjtBQUFBO0FBQUEsWUFDaENnQixFQURnQztBQUFBLFlBQzVCQyxFQUQ0Qjs7QUFFdkNtQixZQUFJRyxJQUFKLENBQVN0QixFQUFUO0FBQ0EsWUFBTUssWUFBWSxpQkFBT0MsSUFBUCxDQUFZdkIsTUFBWixFQUFvQmdCLEVBQXBCLEVBQXdCSyxDQUF4QixDQUFsQjtBQUNBZ0IsbUJBQVdFLElBQVgsQ0FBZ0JqQixTQUFoQjtBQUNEOztBQUVELFVBQU1RLEtBQUssdUJBQVg7O0FBakI0RSw2QkFrQnpELGlCQUFPZixNQUFQLENBQWNmLE1BQWQsQ0FsQnlEO0FBQUE7QUFBQSxVQWtCckV3QyxHQWxCcUU7QUFBQSxVQWtCaEVDLEdBbEJnRTs7QUFtQjVFTCxVQUFJRyxJQUFKLENBQVNFLEdBQVQ7QUFDQSxVQUFNQyxxQkFBcUIsaUJBQU9uQixJQUFQLENBQVl2QixNQUFaLEVBQW9Cd0MsR0FBcEIsRUFBeUJWLEVBQXpCLENBQTNCO0FBQ0FPLGlCQUFXRSxJQUFYLENBQWdCRyxrQkFBaEI7O0FBRUEsVUFBTVYscUJBQXFCLGlCQUFPQyxtQkFBUCxDQUEyQmpDLE1BQTNCLEVBQW1DcUMsVUFBbkMsQ0FBM0I7O0FBRUF0QyxXQUFLUSxNQUFMLENBQVl3QixTQUFaLENBQXNCLGlCQUFPRyxpQkFBUCxDQUF5QmxDLE1BQXpCLEVBQWlDb0MsR0FBakMsRUFBc0NmLENBQXRDLEVBQXlDVyxrQkFBekMsQ0FBdEI7QUFDRCxLQTFCRDtBQTJCRCxHQTlERDtBQStERCxDQWhLRCIsImZpbGUiOiJCTFNTaWcudGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlc2NyaWJlLCBpdCwgeGl0IH0gZnJvbSAnbW9jaGEnO1xuaW1wb3J0ICogYXMgY2hhaSBmcm9tICdjaGFpJztcbmltcG9ydCBCTFNTaWcgZnJvbSAnLi4vQkxTU2lnJztcbmltcG9ydCBCcEdyb3VwIGZyb20gJy4uL0JwR3JvdXAnO1xuXG5kZXNjcmliZSgnQm9uZWjigJNMeW5u4oCTU2hhY2hhbS1iYXNlZCBTaWduYXR1cmUgc2NoZW1lJywgKCkgPT4ge1xuICBkZXNjcmliZSgnU2V0dXAnLCAoKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gQkxTU2lnLnNldHVwKCk7XG4gICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG5cbiAgICBpdCgnUmV0dXJucyBCcEdyb3VwIE9iamVjdCcsICgpID0+IHtcbiAgICAgIGNoYWkuYXNzZXJ0LmlzTm90TnVsbChHKTtcbiAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShHIGluc3RhbmNlb2YgKEJwR3JvdXApKTtcbiAgICB9KTtcblxuICAgIGl0KCdSZXR1cm5zIEdyb3VwIE9yZGVyJywgKCkgPT4ge1xuICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKG8pO1xuICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKG8gaW5zdGFuY2VvZiAoRy5jdHguQklHKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnUmV0dXJucyBHZW4xJywgKCkgPT4ge1xuICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKGcxKTtcbiAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShnMSBpbnN0YW5jZW9mIChHLmN0eC5FQ1ApKTtcbiAgICB9KTtcblxuICAgIGl0KCdSZXR1cm5zIEdlbjInLCAoKSA9PiB7XG4gICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZzIpO1xuICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKGcyIGluc3RhbmNlb2YgKEcuY3R4LkVDUDIpKTtcbiAgICB9KTtcblxuICAgIGl0KCdSZXR1cm5zIFBhaXIgZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZSk7XG4gICAgICBjaGFpLmFzc2VydC5pc1RydWUoZSBpbnN0YW5jZW9mIChGdW5jdGlvbikpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnS2V5Z2VuJywgKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IEJMU1NpZy5zZXR1cCgpO1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgIGNvbnN0IFtzaywgcGtdID0gQkxTU2lnLmtleWdlbihwYXJhbXMpO1xuXG5cbiAgICBpdCgnUmV0dXJucyBTZWNyZXQgS2V5IHgnLCAoKSA9PiB7XG4gICAgICBjaGFpLmFzc2VydC5pc1RydWUoc2sgaW5zdGFuY2VvZiAoRy5jdHguQklHKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnUmV0dXJucyBWYWxpZCBQcml2YXRlIEtleSB2ID0geCAqIGcyJywgKCkgPT4ge1xuICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHBrLmVxdWFscyhHLmN0eC5QQUlSLkcybXVsKGcyLCBzaykpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gc2lnID0gc2sgKiBIKG0pXG4gIGRlc2NyaWJlKCdTaWduJywgKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IEJMU1NpZy5zZXR1cCgpO1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgIGNvbnN0IFtzaywgcGtdID0gQkxTU2lnLmtleWdlbihwYXJhbXMpO1xuXG4gICAgY29uc3QgbSA9ICdIZWxsbyBXb3JsZCEnO1xuXG4gICAgY29uc3Qgc2lnbmF0dXJlID0gQkxTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XG5cbiAgICBpdCgnc2lnbmF0dXJlID0gc2sgKiBIKG0pJywgKCkgPT4ge1xuICAgICAgY29uc3QgaCA9IEcuaGFzaFRvUG9pbnRPbkN1cnZlKG0pO1xuXG4gICAgICBjb25zdCBzaWdfdGVzdCA9IEcuY3R4LlBBSVIuRzFtdWwoaCwgc2spO1xuICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHNpZ25hdHVyZS5lcXVhbHMoc2lnX3Rlc3QpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gZShzaWcsIGcyKSA9IGUoaCwgcGspXG4gIGRlc2NyaWJlKCdWZXJpZnknLCAoKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gQkxTU2lnLnNldHVwKCk7XG4gICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG4gICAgY29uc3QgW3NrLCBwa10gPSBCTFNTaWcua2V5Z2VuKHBhcmFtcyk7XG5cbiAgICBjb25zdCBtID0gJ0hlbGxvIFdvcmxkISc7XG4gICAgY29uc3Qgc2lnID0gQkxTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XG5cbiAgICBpdCgnU3VjY2Vzc2Z1bCB2ZXJpZmljYXRpb24gZm9yIG9yaWdpbmFsIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICBjaGFpLmFzc2VydC5pc1RydWUoQkxTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtLCBzaWcpKTtcbiAgICB9KTtcblxuICAgIGl0KCdGYWlsZWQgdmVyaWZpY2F0aW9uIGZvciBhbm90aGVyIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtMiA9ICdPdGhlciBIZWxsbyBXb3JsZCEnO1xuICAgICAgY2hhaS5hc3NlcnQuaXNOb3RUcnVlKEJMU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbTIsIHNpZykpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnQWdncmVnYXRlJywgKCkgPT4ge1xuICAgIGl0KCdBZ2dyZWdhdGlvbihzaWcxKSA9IHNpZzEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwYXJhbXMgPSBCTFNTaWcuc2V0dXAoKTtcbiAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgICAgY29uc3QgW3NrLCBwa10gPSBCTFNTaWcua2V5Z2VuKHBhcmFtcyk7XG5cbiAgICAgIGNvbnN0IG0gPSAnSGVsbG8gV29ybGQhJztcbiAgICAgIGNvbnN0IHNpZyA9IEJMU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xuICAgICAgY29uc3QgYWdncmVnYXRlU2lnbmF0dXJlID0gQkxTU2lnLmFnZ3JlZ2F0ZVNpZ25hdHVyZXMocGFyYW1zLCBbc2lnXSk7XG5cbiAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShzaWcuZXF1YWxzKGFnZ3JlZ2F0ZVNpZ25hdHVyZSkpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnQWdncmVnYXRlIFZlcmlmaWNhdGlvbicsICgpID0+IHtcbiAgICBpdCgnV29ya3MgZm9yIHNpbmdsZSBzaWduYXR1cmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwYXJhbXMgPSBCTFNTaWcuc2V0dXAoKTtcbiAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgICAgY29uc3QgW3NrLCBwa10gPSBCTFNTaWcua2V5Z2VuKHBhcmFtcyk7XG5cbiAgICAgIGNvbnN0IG0gPSAnSGVsbG8gV29ybGQhJztcbiAgICAgIGNvbnN0IHNpZyA9IEJMU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xuICAgICAgY29uc3QgYWdncmVnYXRlU2lnbmF0dXJlID0gQkxTU2lnLmFnZ3JlZ2F0ZVNpZ25hdHVyZXMocGFyYW1zLCBbc2lnXSk7XG5cbiAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShCTFNTaWcudmVyaWZ5QWdncmVnYXRpb24ocGFyYW1zLCBbcGtdLCBtLCBhZ2dyZWdhdGVTaWduYXR1cmUpKTtcbiAgICB9KTtcblxuICAgIGl0KCdXb3JrcyBmb3IgdGhyZWUgZGlzdGluY3Qgc2lnbmF0dXJlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IEJMU1NpZy5zZXR1cCgpO1xuICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VzVG9TaWduID0gMztcbiAgICAgIGNvbnN0IHBrcyA9IFtdO1xuICAgICAgY29uc3Qgc2lnbmF0dXJlcyA9IFtdO1xuXG4gICAgICBjb25zdCBtID0gJ0hlbGxvIFdvcmxkISc7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVzc2FnZXNUb1NpZ247IGkrKykge1xuICAgICAgICBjb25zdCBbc2ssIHBrXSA9IEJMU1NpZy5rZXlnZW4ocGFyYW1zKTtcbiAgICAgICAgcGtzLnB1c2gocGspO1xuICAgICAgICBjb25zdCBzaWduYXR1cmUgPSBCTFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcbiAgICAgICAgc2lnbmF0dXJlcy5wdXNoKHNpZ25hdHVyZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFnZ3JlZ2F0ZVNpZ25hdHVyZSA9IEJMU1NpZy5hZ2dyZWdhdGVTaWduYXR1cmVzKHBhcmFtcywgc2lnbmF0dXJlcyk7XG5cbiAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShCTFNTaWcudmVyaWZ5QWdncmVnYXRpb24ocGFyYW1zLCBwa3MsIG0sIGFnZ3JlZ2F0ZVNpZ25hdHVyZSkpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJEb2Vzbid0IHdvcmsgd2hlbiBvbmUgb2YgdGhyZWUgc2lnbmF0dXJlcyBpcyBvbiBkaWZmZXJlbnQgbWVzc2FnZVwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBwYXJhbXMgPSBCTFNTaWcuc2V0dXAoKTtcbiAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuXG4gICAgICBjb25zdCBtZXNzYWdlc1RvU2lnbiA9IDI7XG4gICAgICBjb25zdCBwa3MgPSBbXTtcbiAgICAgIGNvbnN0IHNpZ25hdHVyZXMgPSBbXTtcblxuICAgICAgY29uc3QgbSA9ICdIZWxsbyBXb3JsZCEnO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc3NhZ2VzVG9TaWduOyBpKyspIHtcbiAgICAgICAgY29uc3QgW3NrLCBwa10gPSBCTFNTaWcua2V5Z2VuKHBhcmFtcyk7XG4gICAgICAgIHBrcy5wdXNoKHBrKTtcbiAgICAgICAgY29uc3Qgc2lnbmF0dXJlID0gQkxTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XG4gICAgICAgIHNpZ25hdHVyZXMucHVzaChzaWduYXR1cmUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtMiA9ICdNYWxpY2lvdXMgSGVsbG8gV29ybGQnO1xuICAgICAgY29uc3QgW3NrbSwgcGttXSA9IEJMU1NpZy5rZXlnZW4ocGFyYW1zKTtcbiAgICAgIHBrcy5wdXNoKHBrbSk7XG4gICAgICBjb25zdCBtYWxpY2lvdXNTaWduYXR1cmUgPSBCTFNTaWcuc2lnbihwYXJhbXMsIHNrbSwgbTIpO1xuICAgICAgc2lnbmF0dXJlcy5wdXNoKG1hbGljaW91c1NpZ25hdHVyZSk7XG5cbiAgICAgIGNvbnN0IGFnZ3JlZ2F0ZVNpZ25hdHVyZSA9IEJMU1NpZy5hZ2dyZWdhdGVTaWduYXR1cmVzKHBhcmFtcywgc2lnbmF0dXJlcyk7XG5cbiAgICAgIGNoYWkuYXNzZXJ0LmlzTm90VHJ1ZShCTFNTaWcudmVyaWZ5QWdncmVnYXRpb24ocGFyYW1zLCBwa3MsIG0sIGFnZ3JlZ2F0ZVNpZ25hdHVyZSkpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19