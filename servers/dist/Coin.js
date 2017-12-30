'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('./config');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MIN_TTL_H = 12;

var Coin = function () {
  function Coin(v, ide, value) {
    var ttl = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;
    var id = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    _classCallCheck(this, Coin);

    // this.ctx = new CTX('BN254');
    this.ctx = _config.ctx;
    // does it matter if id is g1^id or g2^id ?

    var x = new this.ctx.BIG(0);
    var y = new this.ctx.BIG(0);

    // Set up instance of g2
    var g2 = new this.ctx.ECP2();
    var qx = new this.ctx.FP2(0);
    var qy = new this.ctx.FP2(0);

    // Set generator of g2
    x.rcopy(this.ctx.ROM_CURVE.CURVE_Pxa);
    y.rcopy(this.ctx.ROM_CURVE.CURVE_Pxb);
    qx.bset(x, y);
    x.rcopy(this.ctx.ROM_CURVE.CURVE_Pya);
    y.rcopy(this.ctx.ROM_CURVE.CURVE_Pyb);
    qy.bset(x, y);
    g2.setxy(qx, qy);

    this.g2 = g2;

    this.v = v;
    this.value = value;

    if (id === null) {
      this.id = this.ctx.PAIR.G2mul(this.g2, ide);
    } else {
      this.id = id;
    }

    if (ttl > 0) {
      this.ttl = ttl;
    } else {
      this.ttl = Coin.getTimeToLive();
    }
  }

  // alias for v


  _createClass(Coin, [{
    key: 'getSimplifiedCoin',
    value: function getSimplifiedCoin() {
      var bytesId = [];
      var bytesV = [];
      this.id.toBytes(bytesId);
      this.v.toBytes(bytesV);
      return {
        bytesV: bytesV,
        value: this.value,
        ttl: this.ttl,
        bytesId: bytesId
      };
    }
  }, {
    key: 'publicKey',
    get: function get() {
      return this.v;
    }

    // alias for ttl

  }, {
    key: 'timeToLive',
    get: function get() {
      return this.ttl;
    }
  }], [{
    key: 'fromSimplifiedCoin',
    value: function fromSimplifiedCoin(simplifiedCoin) {
      var bytesV = simplifiedCoin.bytesV,
          value = simplifiedCoin.value,
          ttl = simplifiedCoin.ttl,
          bytesId = simplifiedCoin.bytesId;


      var v = _config.ctx.ECP2.fromBytes(bytesV); // ECP2?
      var id = _config.ctx.ECP2.fromBytes(bytesId);
      return new Coin(v, null, value, ttl, id);
    }
  }, {
    key: 'getHourTimeDifference',
    value: function getHourTimeDifference(date1, date2) {
      var difference = (date1.getTime() - date2.getTime()) / (1000 * 60 * 60);
      return Math.abs(Math.round(difference));
    }
  }, {
    key: 'getTimeToLive',
    value: function getTimeToLive() {
      var currentTime = new Date();
      var endOfDayTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 23, 59, 59, 999);

      var timeToLive = void 0;
      var hoursUntilEndOfDay = Coin.getHourTimeDifference(currentTime, endOfDayTime);
      // if it's less than MIN hours until end of day, set TTL to end of day plus 24h
      if (hoursUntilEndOfDay < MIN_TTL_H) {
        timeToLive = endOfDayTime.getTime() + 1 + 1000 * 60 * 60 * 24;
      } else {
        timeToLive = endOfDayTime.getTime() + 1; // otherwise just set it to end of day
      }

      return timeToLive;
    }
  }]);

  return Coin;
}();

exports.default = Coin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db2luLmpzIl0sIm5hbWVzIjpbIk1JTl9UVExfSCIsIkNvaW4iLCJ2IiwiaWRlIiwidmFsdWUiLCJ0dGwiLCJpZCIsImN0eCIsIngiLCJCSUciLCJ5IiwiZzIiLCJFQ1AyIiwicXgiLCJGUDIiLCJxeSIsInJjb3B5IiwiUk9NX0NVUlZFIiwiQ1VSVkVfUHhhIiwiQ1VSVkVfUHhiIiwiYnNldCIsIkNVUlZFX1B5YSIsIkNVUlZFX1B5YiIsInNldHh5IiwiUEFJUiIsIkcybXVsIiwiZ2V0VGltZVRvTGl2ZSIsImJ5dGVzSWQiLCJieXRlc1YiLCJ0b0J5dGVzIiwic2ltcGxpZmllZENvaW4iLCJmcm9tQnl0ZXMiLCJkYXRlMSIsImRhdGUyIiwiZGlmZmVyZW5jZSIsImdldFRpbWUiLCJNYXRoIiwiYWJzIiwicm91bmQiLCJjdXJyZW50VGltZSIsIkRhdGUiLCJlbmRPZkRheVRpbWUiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsInRpbWVUb0xpdmUiLCJob3Vyc1VudGlsRW5kT2ZEYXkiLCJnZXRIb3VyVGltZURpZmZlcmVuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFFQSxJQUFNQSxZQUFZLEVBQWxCOztJQUVxQkMsSTtBQUNuQixnQkFBWUMsQ0FBWixFQUFlQyxHQUFmLEVBQW9CQyxLQUFwQixFQUFnRDtBQUFBLFFBQXJCQyxHQUFxQix1RUFBZixDQUFDLENBQWM7QUFBQSxRQUFYQyxFQUFXLHVFQUFOLElBQU07O0FBQUE7O0FBQzlDO0FBQ0EsU0FBS0MsR0FBTDtBQUNBOztBQUVBLFFBQU1DLElBQUksSUFBSSxLQUFLRCxHQUFMLENBQVNFLEdBQWIsQ0FBaUIsQ0FBakIsQ0FBVjtBQUNBLFFBQU1DLElBQUksSUFBSSxLQUFLSCxHQUFMLENBQVNFLEdBQWIsQ0FBaUIsQ0FBakIsQ0FBVjs7QUFFQTtBQUNBLFFBQU1FLEtBQUssSUFBSSxLQUFLSixHQUFMLENBQVNLLElBQWIsRUFBWDtBQUNBLFFBQU1DLEtB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QSxVQUFNQyxlQUFlLElBQUlELElBQUosQ0FDbkJELFlBQVlHLFdBQVosRUFEbUIsRUFFbkJILFlBQVlJLFFBQVosRUFGbUIsRUFHbkJKLFlBQVlLLE9BQVosRUFIbUIsRUFJbkIsRUFKbUIsRUFJZixFQUplLEVBSVgsRUFKVyxFQUlQLEdBSk8sQ0FBckI7O0FBT0EsVUFBSUMsbUJBQUo7QUFDQSxVQUFNQyxxQkFBcUI3QyxLQUFLOEMscUJBQUwsQ0FBMkJSLFdBQTNCLEVBQXdDRSxZQUF4QyxDQUEzQjtBQUNBO0FBQ0EsVUFBSUsscUJBQXFCOUMsU0FBekIsRUFBb0M7QUFDbEM2QyxxQkFBYUosYUFBYU4sT0FBYixLQUF5QixDQUF6QixHQUE4QixPQUFPLEVBQVAsR0FBWSxFQUFaLEdBQWlCLEVBQTVEO0FBQ0QsT0FGRCxNQUVPO0FBQ0xVLHFCQUFhSixhQUFhTixPQUFiLEtBQXlCLENBQXRDLENBREssQ0FDb0M7QUFDMUM7O0FBRUQsYUFBT1UsVUFBUDtBQUNEOzs7Ozs7a0JBbEdrQjVDLEkiLCJmaWxlIjoiQ29pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGN0eCB9IGZyb20gJy4vY29uZmlnJztcblxuY29uc3QgTUlOX1RUTF9IID0gMTI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvaW4ge1xuICBjb25zdHJ1Y3Rvcih2LCBpZGUsIHZhbHVlLCB0dGwgPSAtMSwgaWQgPSBudWxsKSB7XG4gICAgLy8gdGhpcy5jdHggPSBuZXcgQ1RYKCdCTjI1NCcpO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIC8vIGRvZXMgaXQgbWF0dGVyIGlmIGlkIGlzIGcxXmlkIG9yIGcyXmlkID9cblxuICAgIGNvbnN0IHggPSBuZXcgdGhpcy5jdHguQklHKDApO1xuICAgIGNvbnN0IHkgPSBuZXcgdGhpcy5jdHguQklHKDApO1xuXG4gICAgLy8gU2V0IHVwIGluc3RhbmNlIG9mIGcyXG4gICAgY29uc3QgZzIgPSBuZXcgdGhpcy5jdHguRUNQMigpO1xuICAgIGNvbnN0IHF4ID0gbmV3IHRoaXMuY3R4LkZQMigwKTtcbiAgICBjb25zdCBxeSA9IG5ldyB0aGlzLmN0eC5GUDIoMCk7XG5cbiAgICAvLyBTZXQgZ2VuZXJhdG9yIG9mIGcyXG4gICAgeC5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfUHhhKTtcbiAgICB5LnJjb3B5KHRoaXMuY3R4LlJPTV9DVVJWRS5DVVJWRV9QeGIpO1xuICAgIHF4LmJzZXQoeCwgeSk7XG4gICAgeC5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfUHlhKTtcbiAgICB5LnJjb3B5KHRoaXMuY3R4LlJPTV9DVVJWRS5DVVJWRV9QeWIpO1xuICAgIHF5LmJzZXQoeCwgeSk7XG4gICAgZzIuc2V0eHkocXgsIHF5KTtcblxuICAgIHRoaXMuZzIgPSBnMjtcblxuICAgIHRoaXMudiA9IHY7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgaWYgKGlkID09PSBudWxsKSB7XG4gICAgICB0aGlzLmlkID0gdGhpcy5jdHguUEFJUi5HMm11bCh0aGlzLmcyLCBpZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfVxuXG4gICAgaWYgKHR0bCA+IDApIHtcbiAgICAgIHRoaXMudHRsID0gdHRsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnR0bCA9IENvaW4uZ2V0VGltZVRvTGl2ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFsaWFzIGZvciB2XG4gIGdldCBwdWJsaWNLZXkoKSB7XG4gICAgcmV0dXJuIHRoaXMudjtcbiAgfVxuXG4gIC8vIGFsaWFzIGZvciB0dGxcbiAgZ2V0IHRpbWVUb0xpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMudHRsO1xuICB9XG5cbiAgZ2V0U2ltcGxpZmllZENvaW4oKSB7XG4gICAgY29uc3QgYnl0ZXNJZCA9IFtdO1xuICAgIGNvbnN0IGJ5dGVzViA9IFtdO1xuICAgIHRoaXMuaWQudG9CeXRlcyhieXRlc0lkKTtcbiAgICB0aGlzLnYudG9CeXRlcyhieXRlc1YpO1xuICAgIHJldHVybiB7XG4gICAgICBieXRlc1Y6IGJ5dGVzVixcbiAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgdHRsOiB0aGlzLnR0bCxcbiAgICAgIGJ5dGVzSWQ6IGJ5dGVzSWQsXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tU2ltcGxpZmllZENvaW4oc2ltcGxpZmllZENvaW4pIHtcbiAgICBjb25zdCB7XG4gICAgICBieXRlc1YsIHZhbHVlLCB0dGwsIGJ5dGVzSWQsXG4gICAgfSA9IHNpbXBsaWZpZWRDb2luO1xuXG4gICAgY29uc3QgdiA9IGN0eC5FQ1AyLmZyb21CeXRlcyhieXRlc1YpOyAvLyBFQ1AyP1xuICAgIGNvbnN0IGlkID0gY3R4LkVDUDIuZnJvbUJ5dGVzKGJ5dGVzSWQpO1xuICAgIHJldHVybiBuZXcgQ29pbih2LCBudWxsLCB2YWx1ZSwgdHRsLCBpZCk7XG4gIH1cblxuICBzdGF0aWMgZ2V0SG91clRpbWVEaWZmZXJlbmNlKGRhdGUxLCBkYXRlMikge1xuICAgIGNvbnN0IGRpZmZlcmVuY2UgPSAoZGF0ZTEuZ2V0VGltZSgpIC0gZGF0ZTIuZ2V0VGltZSgpKSAvICgxMDAwICogNjAgKiA2MCk7XG4gICAgcmV0dXJuIE1hdGguYWJzKE1hdGgucm91bmQoZGlmZmVyZW5jZSkpO1xuICB9XG5cbiAgc3RhdGljIGdldFRpbWVUb0xpdmUoKSB7XG4gICAgY29uc3QgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGVuZE9mRGF5VGltZSA9IG5ldyBEYXRlKFxuICAgICAgY3VycmVudFRpbWUuZ2V0RnVsbFllYXIoKSxcbiAgICAgIGN1cnJlbnRUaW1lLmdldE1vbnRoKCksXG4gICAgICBjdXJyZW50VGltZS5nZXREYXRlKCksXG4gICAgICAyMywgNTksIDU5LCA5OTksXG4gICAgKTtcblxuICAgIGxldCB0aW1lVG9MaXZlO1xuICAgIGNvbnN0IGhvdXJzVW50aWxFbmRPZkRheSA9IENvaW4uZ2V0SG91clRpbWVEaWZmZXJlbmNlKGN1cnJlbnRUaW1lLCBlbmRPZkRheVRpbWUpO1xuICAgIC8vIGlmIGl0J3MgbGVzcyB0aGFuIE1JTiBob3VycyB1bnRpbCBlbmQgb2YgZGF5LCBzZXQgVFRMIHRvIGVuZCBvZiBkYXkgcGx1cyAyNGhcbiAgICBpZiAoaG91cnNVbnRpbEVuZE9mRGF5IDwgTUlOX1RUTF9IKSB7XG4gICAgICB0aW1lVG9MaXZlID0gZW5kT2ZEYXlUaW1lLmdldFRpbWUoKSArIDEgKyAoMTAwMCAqIDYwICogNjAgKiAyNCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVUb0xpdmUgPSBlbmRPZkRheVRpbWUuZ2V0VGltZSgpICsgMTsgLy8gb3RoZXJ3aXNlIGp1c3Qgc2V0IGl0IHRvIGVuZCBvZiBkYXlcbiAgICB9XG5cbiAgICByZXR1cm4gdGltZVRvTGl2ZTtcbiAgfVxufVxuIl19