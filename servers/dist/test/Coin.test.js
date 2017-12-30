'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // identical tests to what is present on clientside to ensure consistency

var _chai = require('chai');

var _mocha = require('mocha');

var _crypto = require('crypto');

var crypto = _interopRequireWildcard(_crypto);

var _Coin = require('../Coin');

var _Coin2 = _interopRequireDefault(_Coin);

var _config = require('../config');

var _BLSSig = require('../BLSSig');

var _BLSSig2 = _interopRequireDefault(_BLSSig);

var _auxiliary = require('../auxiliary');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(0, _mocha.describe)('Coin object', function () {
  var coinValue = void 0;
  var v = void 0;
  var coin = void 0;
  var ide = void 0;
  var g2 = void 0;
  (0, _mocha.before)(function () {
    coinValue = 42;
    v = { Dummy: 'object' };

    var x = new _config.ctx.BIG(0);
    var y = new _config.ctx.BIG(0);
    // Set up instance of g2
    g2 = new _config.ctx.ECP2();
    var qx = new _config.ctx.FP2(0);
    var qy = new _config.ctx.FP2(0);

    // Set generator of g2
    x.rcopy(_config.ctx.ROM_CURVE.CURVE_Pxa);
    y.rcopy(_config.ctx.ROM_CURVE.CURVE_Pxb);
    qx.bset(x, y);
    x.rcopy(_config.ctx.ROM_CURVE.CURVE_Pya);
    y.rcopy(_config.ctx.ROM_CURVE.CURVE_Pyb);
    qy.bset(x, y);
    g2.setxy(qx, qy);

    var RAW = crypto.randomBytes(128);

    var rng = new _config.ctx.RAND();
    rng.clean();
    rng.seed(RAW.length, RAW);
    var groupOrder = new _config.ctx.BIG(0);
    groupOrder.rcopy(_config.ctx.ROM_CURVE.CURVE_Order);

    ide = _config.ctx.BIG.randomnum(groupOrder, rng);

    coin = new _Coin2.default(v, ide, coinValue);
  });

  (0, _mocha.describe)('Construction', function () {
    (0, _mocha.it)('Coin id equals to g2 to power of the random exponent', function () {
      _chai.assert.isTrue(coin.id.equals(_config.ctx.PAIR.G2mul(g2, ide)));
    });

    (0, _mocha.it)('Time to live generation', function () {
      // TODO: FIGURE OUT HOW TO PROPERLY TEST IT
    });
  });

  (0, _mocha.it)('The alias for getting public key works correctly', function () {
    (0, _chai.expect)(coin.publicKey).to.equal(coin.v);
  });

  (0, _mocha.it)('The alias for getting time to live works correctly', function () {
    (0, _chai.expect)(coin.timeToLive).to.equal(coin.ttl);
  });

  // assumes previous tests would have detected errors so normal key generation could be used
  (0, _mocha.describe)('Coin Object Simplification', function () {
    var properCoin = void 0;
    (0, _mocha.before)(function () {
      var properCoinValue = 42;
      var params = _BLSSig2.default.setup();

      var _BLSSig$keygen = _BLSSig2.default.keygen(params),
          _BLSSig$keygen2 = _slicedToArray(_BLSSig$keygen, 2),
          sk = _BLSSig$keygen2[0],
          pk = _BLSSig$keygen2[1];

      properCoin = (0, _auxiliary.getCoin)(pk, properCoinValue);
    });

    (0, _mocha.it)('Can simplify a coin', function () {
      var simplifiedCoin = properCoin.getSimplifiedCoin();
      (0, _chai.expect)(simplifiedCoin).to.have.property('bytesV').that.is.an('array');
      (0, _chai.expect)(simplifiedCoin).to.have.property('value').that.is.an('number');
      (0, _chai.expect)(simplifiedCoin).to.have.property('ttl').that.is.an('number');
      (0, _chai.expect)(simplifiedCoin).to.have.property('bytesId').that.is.an('array');
    });

    (0, _mocha.it)('Can re-create Coin', function () {
      var v_old = properCoin.v;
      var value_old = properCoin.value;
      var ttl_old = properCoin.ttl;
      var id_old = properCoin.id;

      var simplifiedCoin = properCoin.getSimplifiedCoin();
      var recreatedCoin = _Coin2.default.fromSimplifiedCoin(simplifiedCoin);

      var v_new = recreatedCoin.v;
      var value_new = recreatedCoin.value;
      var ttl_new = recreatedCoin.ttl;
      var id_new = recreatedCoin.id;

      _chai.assert.isTrue(v_old.equals(v_new));
      _chai.assert.isTrue(value_old === value_new);
      _chai.assert.isTrue(ttl_old === ttl_new);
      _chai.assert.isTrue(id_old.equals(id_new));
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L0NvaW4udGVzdC5qcyJdLCJuYW1lcyI6WyJjcnlwdG8iLCJjb2luVmFsdWUiLCJ2IiwiY29pbiIsImlkZSIsImcyIiwiRHVtbXkiLCJ4IiwiQklHIiwieSIsIkVDUDIiLCJxeCIsIkZQMiIsInF5IiwicmNvcHkiLCJST01fQ1VSVkUiLCJDVVJWRV9QeGEiLCJDVVJWRV9QeGIiLCJic2V0IiwiQ1VSVkVfUHlhIiwiQ1VSVkVfUHliIiwic2V0eHkiLCJSQVciLCJyYW5kb21CeXRlcyIsInJuZyIsIlJBTkQiLCJjbGVhbiIsInNlZWQiLCJsZW5ndGgiLCJncm91cE9yZGVyIiwiQ1VSVkVfT3JkZXIiLCJyYW5kb21udW0iLCJpc1RydWUiLCJpZCIsImVxdWFscyIsIlBBSVIiLCJHMm11bCIsInB1YmxpY0tleSIsInRvIiwiZXF1YWwiLCJ0aW1lVG9MaXZlIiwidHRsIiwicHJvcGVyQ29pbiIsInByb3BlckNvaW5WYWx1ZSIsInBhcmFtcyIsInNldHVwIiwia2V5Z2VuIiwic2siLCJwayIsInNpbXBsaWZpZWRDb2luIiwiZ2V0U2ltcGxpZmllZENvaW4iLCJoYXZlIiwicHJvcGVydHkiLCJ0aGF0IiwiaXMiLCJhbiIsInZfb2xkIiwidmFsdWVfb2xkIiwidmFsdWUiLCJ0dGxfb2xkIiwiaWRfb2xkIiwicmVjcmVhdGVkQ29pbiIsImZyb21TaW1wbGlmaWVkQ29pbiIsInZfbmV3IiwidmFsdWVfbmV3IiwidHRsX25ldyIsImlkX25ldyJdLCJtYXBwaW5ncyI6Ijs7eXBCQUFBOztBQUVBOztBQUNBOztBQUNBOztJQUFZQSxNOztBQUNaOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEscUJBQVMsYUFBVCxFQUF3QixZQUFNO0FBQzVCLE1BQUlDLGtCQUFKO0FBQ0EsTUFBSUMsVUFBSjtBQUNBLE1BQUlDLGFBQUo7QUFDQSxNQUFJQyxZQUFKO0FBQ0EsTUFBSUMsV0FBSjtBQUNBLHFCQUFPLFlBQU07QUFDWEosZ0JBQVksRUFBWjtB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akMsTUFBUCxDQUFjNEIsT0FBTzFCLE1BQVAsQ0FBY2dDLE1BQWQsQ0FBZDtBQUNELEtBbEJEO0FBbUJELEdBcENEO0FBcUNELENBL0ZEIiwiZmlsZSI6IkNvaW4udGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGlkZW50aWNhbCB0ZXN0cyB0byB3aGF0IGlzIHByZXNlbnQgb24gY2xpZW50c2lkZSB0byBlbnN1cmUgY29uc2lzdGVuY3lcblxuaW1wb3J0IHsgZXhwZWN0LCBhc3NlcnQgfSBmcm9tICdjaGFpJztcbmltcG9ydCB7IGJlZm9yZSwgZGVzY3JpYmUsIGl0LCB4aXQgfSBmcm9tICdtb2NoYSc7XG5pbXBvcnQgKiBhcyBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCBDb2luIGZyb20gJy4uL0NvaW4nO1xuaW1wb3J0IHsgY3R4IH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCBCTFNTaWcgZnJvbSAnLi4vQkxTU2lnJztcbmltcG9ydCB7IGdldENvaW4gfSBmcm9tICcuLi9hdXhpbGlhcnknO1xuXG5kZXNjcmliZSgnQ29pbiBvYmplY3QnLCAoKSA9PiB7XG4gIGxldCBjb2luVmFsdWU7XG4gIGxldCB2O1xuICBsZXQgY29pbjtcbiAgbGV0IGlkZTtcbiAgbGV0IGcyO1xuICBiZWZvcmUoKCkgPT4ge1xuICAgIGNvaW5WYWx1ZSA9IDQyO1xuICAgIHYgPSB7IER1bW15OiAnb2JqZWN0JyB9O1xuXG4gICAgY29uc3QgeCA9IG5ldyBjdHguQklHKDApO1xuICAgIGNvbnN0IHkgPSBuZXcgY3R4LkJJRygwKTtcbiAgICAvLyBTZXQgdXAgaW5zdGFuY2Ugb2YgZzJcbiAgICBnMiA9IG5ldyBjdHguRUNQMigpO1xuICAgIGNvbnN0IHF4ID0gbmV3IGN0eC5GUDIoMCk7XG4gICAgY29uc3QgcXkgPSBuZXcgY3R4LkZQMigwKTtcblxuICAgIC8vIFNldCBnZW5lcmF0b3Igb2YgZzJcbiAgICB4LnJjb3B5KGN0eC5ST01fQ1VSVkUuQ1VSVkVfUHhhKTtcbiAgICB5LnJjb3B5KGN0eC5ST01fQ1VSVkUuQ1VSVkVfUHhiKTtcbiAgICBxeC5ic2V0KHgsIHkpO1xuICAgIHgucmNvcHkoY3R4LlJPTV9DVVJWRS5DVVJWRV9QeWEpO1xuICAgIHkucmNvcHkoY3R4LlJPTV9DVVJWRS5DVVJWRV9QeWIpO1xuICAgIHF5LmJzZXQoeCwgeSk7XG4gICAgZzIuc2V0eHkocXgsIHF5KTtcblxuICAgIGNvbnN0IFJBVyA9IGNyeXB0by5yYW5kb21CeXRlcygxMjgpO1xuXG4gICAgY29uc3Qgcm5nID0gbmV3IGN0eC5SQU5EKCk7XG4gICAgcm5nLmNsZWFuKCk7XG4gICAgcm5nLnNlZWQoUkFXLmxlbmd0aCwgUkFXKTtcbiAgICBjb25zdCBncm91cE9yZGVyID0gbmV3IGN0eC5CSUcoMCk7XG4gICAgZ3JvdXBPcmRlci5yY29weShjdHguUk9NX0NVUlZFLkNVUlZFX09yZGVyKTtcblxuICAgIGlkZSA9IGN0eC5CSUcucmFuZG9tbnVtKGdyb3VwT3JkZXIsIHJuZyk7XG5cbiAgICBjb2luID0gbmV3IENvaW4odiwgaWRlLCBjb2luVmFsdWUpO1xuICB9KTtcblxuICBkZXNjcmliZSgnQ29uc3RydWN0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdDb2luIGlkIGVxdWFscyB0byBnMiB0byBwb3dlciBvZiB0aGUgcmFuZG9tIGV4cG9uZW50JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShjb2luLmlkLmVxdWFscyhjdHguUEFJUi5HMm11bChnMiwgaWRlKSkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ1RpbWUgdG8gbGl2ZSBnZW5lcmF0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gVE9ETzogRklHVVJFIE9VVCBIT1cgVE8gUFJPUEVSTFkgVEVTVCBJVFxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnVGhlIGFsaWFzIGZvciBnZXR0aW5nIHB1YmxpYyBrZXkgd29ya3MgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIGV4cGVjdChjb2luLnB1YmxpY0tleSkudG8uZXF1YWwoY29pbi52KTtcbiAgfSk7XG5cbiAgaXQoJ1RoZSBhbGlhcyBmb3IgZ2V0dGluZyB0aW1lIHRvIGxpdmUgd29ya3MgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIGV4cGVjdChjb2luLnRpbWVUb0xpdmUpLnRvLmVxdWFsKGNvaW4udHRsKTtcbiAgfSk7XG5cbiAgLy8gYXNzdW1lcyBwcmV2aW91cyB0ZXN0cyB3b3VsZCBoYXZlIGRldGVjdGVkIGVycm9ycyBzbyBub3JtYWwga2V5IGdlbmVyYXRpb24gY291bGQgYmUgdXNlZFxuICBkZXNjcmliZSgnQ29pbiBPYmplY3QgU2ltcGxpZmljYXRpb24nLCAoKSA9PiB7XG4gICAgbGV0IHByb3BlckNvaW47XG4gICAgYmVmb3JlKCgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BlckNvaW5WYWx1ZSA9IDQyO1xuICAgICAgY29uc3QgcGFyYW1zID0gQkxTU2lnLnNldHVwKCk7XG4gICAgICBjb25zdCBbc2ssIHBrXSA9IEJMU1NpZy5rZXlnZW4ocGFyYW1zKTtcbiAgICAgIHByb3BlckNvaW4gPSBnZXRDb2luKHBrLCBwcm9wZXJDb2luVmFsdWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ0NhbiBzaW1wbGlmeSBhIGNvaW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzaW1wbGlmaWVkQ29pbiA9IHByb3BlckNvaW4uZ2V0U2ltcGxpZmllZENvaW4oKTtcbiAgICAgIGV4cGVjdChzaW1wbGlmaWVkQ29pbikudG8uaGF2ZS5wcm9wZXJ0eSgnYnl0ZXNWJykudGhhdC5pcy5hbignYXJyYXknKTtcbiAgICAgIGV4cGVjdChzaW1wbGlmaWVkQ29pbikudG8uaGF2ZS5wcm9wZXJ0eSgndmFsdWUnKS50aGF0LmlzLmFuKCdudW1iZXInKTtcbiAgICAgIGV4cGVjdChzaW1wbGlmaWVkQ29pbikudG8uaGF2ZS5wcm9wZXJ0eSgndHRsJykudGhhdC5pcy5hbignbnVtYmVyJyk7XG4gICAgICBleHBlY3Qoc2ltcGxpZmllZENvaW4pLnRvLmhhdmUucHJvcGVydHkoJ2J5dGVzSWQnKS50aGF0LmlzLmFuKCdhcnJheScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ0NhbiByZS1jcmVhdGUgQ29pbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHZfb2xkID0gcHJvcGVyQ29pbi52O1xuICAgICAgY29uc3QgdmFsdWVfb2xkID0gcHJvcGVyQ29pbi52YWx1ZTtcbiAgICAgIGNvbnN0IHR0bF9vbGQgPSBwcm9wZXJDb2luLnR0bDtcbiAgICAgIGNvbnN0IGlkX29sZCA9IHByb3BlckNvaW4uaWQ7XG5cbiAgICAgIGNvbnN0IHNpbXBsaWZpZWRDb2luID0gcHJvcGVyQ29pbi5nZXRTaW1wbGlmaWVkQ29pbigpO1xuICAgICAgY29uc3QgcmVjcmVhdGVkQ29pbiA9IENvaW4uZnJvbVNpbXBsaWZpZWRDb2luKHNpbXBsaWZpZWRDb2luKTtcblxuICAgICAgY29uc3Qgdl9uZXcgPSByZWNyZWF0ZWRDb2luLnY7XG4gICAgICBjb25zdCB2YWx1ZV9uZXcgPSByZWNyZWF0ZWRDb2luLnZhbHVlO1xuICAgICAgY29uc3QgdHRsX25ldyA9IHJlY3JlYXRlZENvaW4udHRsO1xuICAgICAgY29uc3QgaWRfbmV3ID0gcmVjcmVhdGVkQ29pbi5pZDtcblxuICAgICAgYXNzZXJ0LmlzVHJ1ZSh2X29sZC5lcXVhbHModl9uZXcpKTtcbiAgICAgIGFzc2VydC5pc1RydWUodmFsdWVfb2xkID09PSB2YWx1ZV9uZXcpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZSh0dGxfb2xkID09PSB0dGxfbmV3KTtcbiAgICAgIGFzc2VydC5pc1RydWUoaWRfb2xkLmVxdWFscyhpZF9uZXcpKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==