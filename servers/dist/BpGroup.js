'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         TODO:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         - "proper" investigate RNG
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _crypto = require('crypto');

var crypto = _interopRequireWildcard(_crypto);

var _ctx = require('../../servers/src/lib/Milagro-Crypto-Library/ctx');

var _ctx2 = _interopRequireDefault(_ctx);

var _auxiliary = require('./auxiliary');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BpGroup = function () {
  function BpGroup() {
    _classCallCheck(this, BpGroup);

    this.ctx = new _ctx2.default('BN254');

    // set order of the groups
    var o = new this.ctx.BIG(0);
    o.rcopy(this.ctx.ROM_CURVE.CURVE_Order);
    this.ord = o;

    // Set up instance of g1
    var g1 = new this.ctx.ECP();
    var x = new this.ctx.BIG(0);
    var y = new this.ctx.BIG(0);

    // Set generator of g1
    x.rcopy(this.ctx.ROM_CURVE.CURVE_Gx);
    y.rcopy(this.ctx.ROM_CURVE.CURVE_Gy);
    g1.setxy(x, y);

    this.g1 = g1;

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

    /*
        Currently the RNG generator is seeded with constant seed;
        TODO: Investigate "proper" entropy sources
        TODO: Even though examples used |s| = 100, consider longer seeds?
     */
    var RAW = [];
    var rng = new this.ctx.RAND();
    rng.clean();
    RAW = crypto.randomBytes(128);
    rng.seed(RAW.length, RAW);
    // old "seed"
    // for (let i = 0; i < 100; i++) RAW[i] = i;
    // rng.seed(100, RAW);
    this.rng = rng;
    this.pair = this.pair.bind(this);
  }

  _createClass(BpGroup, [{
    key: 'pair',
    value: function pair(g1, g2) {
      return this.ctx.PAIR.fexp(this.ctx.PAIR.ate(g2, g1));
    }
  }, {
    key: 'hashMessage',
    value: function hashMessage(m) {
      var messageBytes = (0, _auxiliary.stringToBytes)(m);
      var H = new this.ctx.HASH256();
      H.process_array(messageBytes);
      return H.hash();
    }
  }, {
    key: 'hashToBIG',
    value: function hashToBIG(m) {
      var R = this.hashMessage(m);
      return this.ctx.BIG.fromBytes(R);
    }

    // implementation partially taken from https://github.com/milagro-crypto/milagro-crypto-js/blob/develop/src/node/mpin.js#L125

  }, {
    key: 'hashToPointOnCurve',
    value: function hashToPointOnCurve(m) {
      var R = this.hashMessage(m);

      if (R.length === 0) return null;
      var W = [];

      // needs to be adjusted if different curve was to be chosen
      var sha = 32;
      if (sha >= this.ctx.BIG.MODBYTES) {
        for (var i = 0; i < this.ctx.BIG.MODBYTES; i++) {
          W[i] = R[i];
        }
      } else {
        for (var _i = 0; _i < sha; _i++) {
          W[_i] = R[_i];
        }for (var _i2 = sha; _i2 < this.ctx.BIG.MODBYTES; _i2++) {
          W[_i2] = 0;
        }
      }
      return this.ctx.ECP.mapit(W);
    }
  }, {
    key: 'rngGen',
    get: function get() {
      return this.rng;
    }
  }, {
    key: 'order',
    get: function get() {
      return this.ord;
    }
  }, {
    key: 'gen1',
    get: function get() {
      return this.g1;
    }
  }, {
    key: 'gen2',
    get: function get() {
      return this.g2;
    }
  }]);

  return BpGroup;
}();

exports.default = BpGroup;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CcEdyb3VwLmpzIl0sIm5hbWVzIjpbImNyeXB0byIsIkJwR3JvdXAiLCJjdHgiLCJvIiwiQklHIiwicmNvcHkiLCJST01fQ1VSVkUiLCJDVVJWRV9PcmRlciIsIm9yZCIsImcxIiwiRUNQIiwieCIsInkiLCJDVVJWRV9HeCIsIkNVUlZFX0d5Iiwic2V0eHkiLCJnMiIsIkVDUDIiLCJxeCIsIkZQMiIsInF5IiwiQ1VSVkVfUHhhIiwiQ1VSVkVfUHhiIiwiYnNldCIsIkNVUlZFX1B5YSIsIkNVUlZFX1B5YiIsIlJBVyIsInJuZyIsIlJBTkQiLCJjbGVhbiIsInJhbmRvbUJ5dGVzIiwic2VlZCIsImxlbmd0aCIsInBhaXIiLCJiaW5kIiwiUEFJUiIsImZleHAiLCJhdGUiLCJtIiwibWVzc2FnZUJ5dGVzIiwiSCIsIkhBU0gyNTYiLCJwcm9jZXNzX2FycmF5IiwiaGFzaCIsIlIiLCJoYXNoTWVzc2FnZSIsImZyb21CeXRlcyIsIlciLCJzaGEiLCJNT0RCWVRFUyIsImkiLCJtYXBpdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O3FqQkFBQTs7Ozs7QUFLQTs7SUFBWUEsTTs7QUFDWjs7OztBQUNBOzs7Ozs7OztJQUVxQkMsTztBQUNuQixxQkFBYztBQUFBOztBQUNaLFNBQUtDLEdBQUwsR0FBVyxrQkFBUSxPQUFSLENBQVg7O0FBRUE7QUFDQSxRQUFNQyxJQUFJLElBQUksS0FBS0QsR0FBTCxDQUFTRSxHQUFiLENBQWlCLENBQWpCLENBQVY7QUFDQUQsTUFBRUUsS0FBRixDQUFRLEtBQUtILEdBQUwsQ0FBU0ksU0FBVCxDQUFtQkMsV0FBM0I7QUFDQSxTQUFLQyxHQUFMLEdBQVdMLENBQVg7O0FBRUE7QUFDQSxRQUFNTSxLQUFLLElBQUksS0FBS1AsR0FBTCxDQUFTUSxHQUFiLEVBQVg7QUFDQSxRQUFNQyxJQUFJLElBQUksS0FBS1QsR0FBTCxDQUFTRSxHQUFiLENBQWlCLENBQWpCLENBQVY7QUFDQSxRQUFNUSxJQUFJLElBQUksS0FBS1YsR0FBTCxDQUFT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QUFhNkMsUUFBakMsRUFBMkNDLEdBQTNDO0FBQWdESCxZQUFFRyxDQUFGLElBQU9OLEVBQUVNLENBQUYsQ0FBUDtBQUFoRDtBQUNELE9BRkQsTUFFTztBQUNMLGFBQUssSUFBSUEsS0FBSSxDQUFiLEVBQWdCQSxLQUFJRixHQUFwQixFQUF5QkUsSUFBekI7QUFBOEJILFlBQUVHLEVBQUYsSUFBT04sRUFBRU0sRUFBRixDQUFQO0FBQTlCLFNBQ0EsS0FBSyxJQUFJQSxNQUFJRixHQUFiLEVBQWtCRSxNQUFJLEtBQUtoRCxHQUFMLENBQVNFLEdBQVQsQ0FBYTZDLFFBQW5DLEVBQTZDQyxLQUE3QztBQUFrREgsWUFBRUcsR0FBRixJQUFPLENBQVA7QUFBbEQ7QUFDRDtBQUNELGFBQU8sS0FBS2hELEdBQUwsQ0FBU1EsR0FBVCxDQUFheUMsS0FBYixDQUFtQkosQ0FBbkIsQ0FBUDtBQUNEOzs7d0JBaERZO0FBQ1gsYUFBTyxLQUFLcEIsR0FBWjtBQUNEOzs7d0JBRVc7QUFDVixhQUFPLEtBQUtuQixHQUFaO0FBQ0Q7Ozt3QkFFVTtBQUNULGFBQU8sS0FBS0MsRUFBWjtBQUNEOzs7d0JBRVU7QUFDVCxhQUFPLEtBQUtPLEVBQVo7QUFDRDs7Ozs7O2tCQXBFa0JmLE8iLCJmaWxlIjoiQnBHcm91cC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gICAgVE9ETzpcbiAgICAtIFwicHJvcGVyXCIgaW52ZXN0aWdhdGUgUk5HXG4gKi9cblxuaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgQ1RYIGZyb20gJy4uLy4uL3NlcnZlcnMvc3JjL2xpYi9NaWxhZ3JvLUNyeXB0by1MaWJyYXJ5L2N0eCc7XG5pbXBvcnQgeyBzdHJpbmdUb0J5dGVzIH0gZnJvbSAnLi9hdXhpbGlhcnknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcEdyb3VwIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jdHggPSBuZXcgQ1RYKCdCTjI1NCcpO1xuXG4gICAgLy8gc2V0IG9yZGVyIG9mIHRoZSBncm91cHNcbiAgICBjb25zdCBvID0gbmV3IHRoaXMuY3R4LkJJRygwKTtcbiAgICBvLnJjb3B5KHRoaXMuY3R4LlJPTV9DVVJWRS5DVVJWRV9PcmRlcik7XG4gICAgdGhpcy5vcmQgPSBvO1xuXG4gICAgLy8gU2V0IHVwIGluc3RhbmNlIG9mIGcxXG4gICAgY29uc3QgZzEgPSBuZXcgdGhpcy5jdHguRUNQKCk7XG4gICAgY29uc3QgeCA9IG5ldyB0aGlzLmN0eC5CSUcoMCk7XG4gICAgY29uc3QgeSA9IG5ldyB0aGlzLmN0eC5CSUcoMCk7XG5cbiAgICAvLyBTZXQgZ2VuZXJhdG9yIG9mIGcxXG4gICAgeC5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfR3gpO1xuICAgIHkucmNvcHkodGhpcy5jdHguUk9NX0NVUlZFLkNVUlZFX0d5KTtcbiAgICBnMS5zZXR4eSh4LCB5KTtcblxuICAgIHRoaXMuZzEgPSBnMTtcblxuICAgIC8vIFNldCB1cCBpbnN0YW5jZSBvZiBnMlxuICAgIGNvbnN0IGcyID0gbmV3IHRoaXMuY3R4LkVDUDIoKTtcbiAgICBjb25zdCBxeCA9IG5ldyB0aGlzLmN0eC5GUDIoMCk7XG4gICAgY29uc3QgcXkgPSBuZXcgdGhpcy5jdHguRlAyKDApO1xuXG4gICAgLy8gU2V0IGdlbmVyYXRvciBvZiBnMlxuICAgIHgucmNvcHkodGhpcy5jdHguUk9NX0NVUlZFLkNVUlZFX1B4YSk7XG4gICAgeS5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfUHhiKTtcbiAgICBxeC5ic2V0KHgsIHkpO1xuICAgIHgucmNvcHkodGhpcy5jdHguUk9NX0NVUlZFLkNVUlZFX1B5YSk7XG4gICAgeS5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfUHliKTtcbiAgICBxeS5ic2V0KHgsIHkpO1xuICAgIGcyLnNldHh5KHF4LCBxeSk7XG5cbiAgICB0aGlzLmcyID0gZzI7XG5cbiAgICAvKlxuICAgICAgICBDdXJyZW50bHkgdGhlIFJORyBnZW5lcmF0b3IgaXMgc2VlZGVkIHdpdGggY29uc3RhbnQgc2VlZDtcbiAgICAgICAgVE9ETzogSW52ZXN0aWdhdGUgXCJwcm9wZXJcIiBlbnRyb3B5IHNvdXJjZXNcbiAgICAgICAgVE9ETzogRXZlbiB0aG91Z2ggZXhhbXBsZXMgdXNlZCB8c3wgPSAxMDAsIGNvbnNpZGVyIGxvbmdlciBzZWVkcz9cbiAgICAgKi9cbiAgICBsZXQgUkFXID0gW107XG4gICAgY29uc3Qgcm5nID0gbmV3IHRoaXMuY3R4LlJBTkQoKTtcbiAgICBybmcuY2xlYW4oKTtcbiAgICBSQVcgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoMTI4KTtcbiAgICBybmcuc2VlZChSQVcubGVuZ3RoLCBSQVcpO1xuICAgIC8vIG9sZCBcInNlZWRcIlxuICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIFJBV1tpXSA9IGk7XG4gICAgLy8gcm5nLnNlZWQoMTAwLCBSQVcpO1xuICAgIHRoaXMucm5nID0gcm5nO1xuICAgIHRoaXMucGFpciA9IHRoaXMucGFpci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0IHJuZ0dlbigpIHtcbiAgICByZXR1cm4gdGhpcy5ybmc7XG4gIH1cblxuICBnZXQgb3JkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMub3JkO1xuICB9XG5cbiAgZ2V0IGdlbjEoKSB7XG4gICAgcmV0dXJuIHRoaXMuZzE7XG4gIH1cblxuICBnZXQgZ2VuMigpIHtcbiAgICByZXR1cm4gdGhpcy5nMjtcbiAgfVxuXG4gIHBhaXIoZzEsIGcyKSB7XG4gICAgcmV0dXJuIHRoaXMuY3R4LlBBSVIuZmV4cCh0aGlzLmN0eC5QQUlSLmF0ZShnMiwgZzEpKTtcbiAgfVxuXG4gIGhhc2hNZXNzYWdlKG0pIHtcbiAgICBjb25zdCBtZXNzYWdlQnl0ZXMgPSBzdHJpbmdUb0J5dGVzKG0pO1xuICAgIGNvbnN0IEggPSBuZXcgdGhpcy5jdHguSEFTSDI1NigpO1xuICAgIEgucHJvY2Vzc19hcnJheShtZXNzYWdlQnl0ZXMpO1xuICAgIHJldHVybiBILmhhc2goKTtcbiAgfVxuXG4gIGhhc2hUb0JJRyhtKSB7XG4gICAgY29uc3QgUiA9IHRoaXMuaGFzaE1lc3NhZ2UobSk7XG4gICAgcmV0dXJuIHRoaXMuY3R4LkJJRy5mcm9tQnl0ZXMoUik7XG4gIH1cblxuICAvLyBpbXBsZW1lbnRhdGlvbiBwYXJ0aWFsbHkgdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWlsYWdyby1jcnlwdG8vbWlsYWdyby1jcnlwdG8tanMvYmxvYi9kZXZlbG9wL3NyYy9ub2RlL21waW4uanMjTDEyNVxuICBoYXNoVG9Qb2ludE9uQ3VydmUobSkge1xuICAgIGNvbnN0IFIgPSB0aGlzLmhhc2hNZXNzYWdlKG0pO1xuXG4gICAgaWYgKFIubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBXID0gW107XG5cbiAgICAvLyBuZWVkcyB0byBiZSBhZGp1c3RlZCBpZiBkaWZmZXJlbnQgY3VydmUgd2FzIHRvIGJlIGNob3NlblxuICAgIGNvbnN0IHNoYSA9IDMyO1xuICAgIGlmIChzaGEgPj0gdGhpcy5jdHguQklHLk1PREJZVEVTKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY3R4LkJJRy5NT0RCWVRFUzsgaSsrKSBXW2ldID0gUltpXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGE7IGkrKykgV1tpXSA9IFJbaV07XG4gICAgICBmb3IgKGxldCBpID0gc2hhOyBpIDwgdGhpcy5jdHguQklHLk1PREJZVEVTOyBpKyspIFdbaV0gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jdHguRUNQLm1hcGl0KFcpO1xuICB9XG59XG4iXX0=