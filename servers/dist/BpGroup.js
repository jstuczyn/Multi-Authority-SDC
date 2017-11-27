"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         TODO:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         - "proper" investigate RNG
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _ctx = require("../../servers/src/lib/Milagro-Crypto-Library/ctx");

var _ctx2 = _interopRequireDefault(_ctx);

var _auxiliary = require("./auxiliary");

var _crypto = require("crypto");

var crypto = _interopRequireWildcard(_crypto);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BpGroup = function () {
    function BpGroup() {
        _classCallCheck(this, BpGroup);

        this.ctx = new _ctx2.default("BN254");

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
        key: "pair",
        value: function pair(g1, g2) {
            return this.ctx.PAIR.fexp(this.ctx.PAIR.ate(g2, g1));
        }
    }, {
        key: "hashMessage",
        value: function hashMessage(m) {
            var messageBytes = (0, _auxiliary.stringToBytes)(m);
            var H = new this.ctx.HASH256();
            H.process_array(messageBytes);
            return H.hash();
        }
    }, {
        key: "hashToBIG",
        value: function hashToBIG(m) {
            var R = this.hashMessage(m);
            return this.ctx.BIG.fromBytes(R);
        }

        // implementation partially taken from https://github.com/milagro-crypto/milagro-crypto-js/blob/develop/src/node/mpin.js#L125

    }, {
        key: "hashToPointOnCurve",
        value: function hashToPointOnCurve(m) {
            var R = this.hashMessage(m);

            if (R.length === 0) return null;
            var W = [];

            // needs to be adjusted if different curve was to be chosen
            var sha = 32;
            if (sha >= this.ctx.BIG.MODBYTES) for (var i = 0; i < this.ctx.BIG.MODBYTES; i++) {
                W[i] = R[i];
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
        key: "rngGen",
        get: function get() {
            return this.rng;
        }
    }, {
        key: "order",
        get: function get() {
            return this.ord;
        }
    }, {
        key: "gen1",
        get: function get() {
            return this.g1;
        }
    }, {
        key: "gen2",
        get: function get() {
            return this.g2;
        }
    }]);

    return BpGroup;
}();

exports.default = BpGroup;
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CcEdyb3VwLmpzIl0sIm5hbWVzIjpbImNyeXB0byIsIkJwR3JvdXAiLCJjdHgiLCJvIiwiQklHIiwicmNvcHkiLCJST01fQ1VSVkUiLCJDVVJWRV9PcmRlciIsIm9yZCIsImcxIiwiRUNQIiwieCIsInkiLCJDVVJWRV9HeCIsIkNVUlZFX0d5Iiwic2V0eHkiLCJnMiIsIkVDUDIiLCJxeCIsIkZQMiIsInF5IiwiQ1VSVkVfUHhhIiwiQ1VSVkVfUHhiIiwiYnNldCIsIkNVUlZFX1B5YSIsIkNVUlZFX1B5YiIsIlJBVyIsInJuZyIsIlJBTkQiLCJjbGVhbiIsInJhbmRvbUJ5dGVzIiwic2VlZCIsImxlbmd0aCIsInBhaXIiLCJiaW5kIiwiUEFJUiIsImZleHAiLCJhdGUiLCJtIiwibWVzc2FnZUJ5dGVzIiwiSCIsIkhBU0gyNTYiLCJwcm9jZXNzX2FycmF5IiwiaGFzaCIsIlIiLCJoYXNoTWVzc2FnZSIsImZyb21CeXRlcyIsIlciLCJzaGEiLCJNT0RCWVRFUyIsImkiLCJtYXBpdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O3FqQkFBQTs7Ozs7QUFLQTs7OztBQUNBOztBQUNBOztJQUFZQSxNOzs7Ozs7OztJQUVTQyxPO0FBQ2pCLHVCQUFjO0FBQUE7O0FBQ1YsYUFBS0MsR0FBTCxHQUFXLGtCQUFRLE9BQVIsQ0FBWDs7QUFFQTtBQUNBLFlBQUlDLElBQUksSUFBSSxLQUFLRCxHQUFMLENBQVNFLEdBQWIsQ0FBaUIsQ0FBakIsQ0FBUjtBQUNBRCxVQUFFRSxLQUFGLENBQVEsS0FBS0gsR0FBTCxDQUFTSSxTQUFULENBQW1CQyxXQUEzQjtBQUNBLGFBQUtDLEdBQUwsR0FBV0wsQ0FBWDs7QUFFQTtBQUNBLFlBQUlNLEtBQUssSUFBSSxLQUFLUCxHQUFMLENBQVNRLEdBQWIsRUFBVDtBQUNBLFlBQUlDLElBQUksSUFBSSxLQUFLVCxHQUFMLENBQVNFLEdBQWIsQ0FBaUIsQ0FBakIsQ0FBUjtBQUNBLFlBQUlRLElBQUksSUFBSSxLQUFLVixHQUFMLENBQVNF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QVQsQ0FBYTZDLFFBQWpDLEVBQTJDQyxHQUEzQztBQUFnREgsa0JBQUVHLENBQUYsSUFBT04sRUFBRU0sQ0FBRixDQUFQO0FBQWhELGFBREosTUFFSztBQUNELHFCQUFLLElBQUlBLEtBQUksQ0FBYixFQUFnQkEsS0FBSUYsR0FBcEIsRUFBeUJFLElBQXpCO0FBQThCSCxzQkFBRUcsRUFBRixJQUFPTixFQUFFTSxFQUFGLENBQVA7QUFBOUIsaUJBQ0EsS0FBSyxJQUFJQSxNQUFJRixHQUFiLEVBQWtCRSxNQUFJLEtBQUtoRCxHQUFMLENBQVNFLEdBQVQsQ0FBYTZDLFFBQW5DLEVBQTZDQyxLQUE3QztBQUFrREgsc0JBQUVHLEdBQUYsSUFBTyxDQUFQO0FBQWxEO0FBQ0g7QUFDRCxtQkFBTyxLQUFLaEQsR0FBTCxDQUFTUSxHQUFULENBQWF5QyxLQUFiLENBQW1CSixDQUFuQixDQUFQO0FBQ0g7Ozs0QkFoRFk7QUFDVCxtQkFBTyxLQUFLcEIsR0FBWjtBQUNIOzs7NEJBRVc7QUFDUixtQkFBTyxLQUFLbkIsR0FBWjtBQUNIOzs7NEJBRVU7QUFDUCxtQkFBTyxLQUFLQyxFQUFaO0FBQ0g7Ozs0QkFFVTtBQUNQLG1CQUFPLEtBQUtPLEVBQVo7QUFDSDs7Ozs7O2tCQXRFZ0JmLE87QUF5R3BCIiwiZmlsZSI6IkJwR3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gICAgVE9ETzpcclxuICAgIC0gXCJwcm9wZXJcIiBpbnZlc3RpZ2F0ZSBSTkdcclxuICovXHJcblxyXG5pbXBvcnQgQ1RYIGZyb20gXCIuLi8uLi9zZXJ2ZXJzL3NyYy9saWIvTWlsYWdyby1DcnlwdG8tTGlicmFyeS9jdHhcIlxyXG5pbXBvcnQge3N0cmluZ1RvQnl0ZXN9IGZyb20gXCIuL2F1eGlsaWFyeVwiXHJcbmltcG9ydCAqIGFzIGNyeXB0byBmcm9tIFwiY3J5cHRvXCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJwR3JvdXAge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jdHggPSBuZXcgQ1RYKFwiQk4yNTRcIik7XHJcblxyXG4gICAgICAgIC8vIHNldCBvcmRlciBvZiB0aGUgZ3JvdXBzXHJcbiAgICAgICAgbGV0IG8gPSBuZXcgdGhpcy5jdHguQklHKDApO1xyXG4gICAgICAgIG8ucmNvcHkodGhpcy5jdHguUk9NX0NVUlZFLkNVUlZFX09yZGVyKTtcclxuICAgICAgICB0aGlzLm9yZCA9IG87XHJcblxyXG4gICAgICAgIC8vIFNldCB1cCBpbnN0YW5jZSBvZiBnMVxyXG4gICAgICAgIGxldCBnMSA9IG5ldyB0aGlzLmN0eC5FQ1AoKTtcclxuICAgICAgICBsZXQgeCA9IG5ldyB0aGlzLmN0eC5CSUcoMCk7XHJcbiAgICAgICAgbGV0IHkgPSBuZXcgdGhpcy5jdHguQklHKDApO1xyXG5cclxuICAgICAgICAvLyBTZXQgZ2VuZXJhdG9yIG9mIGcxXHJcbiAgICAgICAgeC5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfR3gpO1xyXG4gICAgICAgIHkucmNvcHkodGhpcy5jdHguUk9NX0NVUlZFLkNVUlZFX0d5KTtcclxuICAgICAgICBnMS5zZXR4eSh4LCB5KTtcclxuXHJcbiAgICAgICAgdGhpcy5nMSA9IGcxO1xyXG5cclxuICAgICAgICAvLyBTZXQgdXAgaW5zdGFuY2Ugb2YgZzJcclxuICAgICAgICBsZXQgZzIgPSBuZXcgdGhpcy5jdHguRUNQMigpO1xyXG4gICAgICAgIGxldCBxeCA9IG5ldyB0aGlzLmN0eC5GUDIoMCk7XHJcbiAgICAgICAgbGV0IHF5ID0gbmV3IHRoaXMuY3R4LkZQMigwKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IGdlbmVyYXRvciBvZiBnMlxyXG4gICAgICAgIHgucmNvcHkodGhpcy5jdHguUk9NX0NVUlZFLkNVUlZFX1B4YSk7XHJcbiAgICAgICAgeS5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfUHhiKTtcclxuICAgICAgICBxeC5ic2V0KHgsIHkpO1xyXG4gICAgICAgIHgucmNvcHkodGhpcy5jdHguUk9NX0NVUlZFLkNVUlZFX1B5YSk7XHJcbiAgICAgICAgeS5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfUHliKTtcclxuICAgICAgICBxeS5ic2V0KHgsIHkpO1xyXG4gICAgICAgIGcyLnNldHh5KHF4LCBxeSk7XHJcblxyXG4gICAgICAgIHRoaXMuZzIgPSBnMjtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgICAgQ3VycmVudGx5IHRoZSBSTkcgZ2VuZXJhdG9yIGlzIHNlZWRlZCB3aXRoIGNvbnN0YW50IHNlZWQ7XHJcbiAgICAgICAgICAgIFRPRE86IEludmVzdGlnYXRlIFwicHJvcGVyXCIgZW50cm9weSBzb3VyY2VzXHJcbiAgICAgICAgICAgIFRPRE86IEV2ZW4gdGhvdWdoIGV4YW1wbGVzIHVzZWQgfHN8ID0gMTAwLCBjb25zaWRlciBsb25nZXIgc2VlZHM/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IFJBVyA9IFtdO1xyXG4gICAgICAgIGxldCBybmcgPSBuZXcgdGhpcy5jdHguUkFORCgpO1xyXG4gICAgICAgIHJuZy5jbGVhbigpO1xyXG4gICAgICAgIFJBVyA9IGNyeXB0by5yYW5kb21CeXRlcygxMjgpO1xyXG4gICAgICAgIHJuZy5zZWVkKFJBVy5sZW5ndGgsIFJBVyk7XHJcbiAgICAgICAgLy8gb2xkIFwic2VlZFwiXHJcbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykgUkFXW2ldID0gaTtcclxuICAgICAgICAvLyBybmcuc2VlZCgxMDAsIFJBVyk7XHJcbiAgICAgICAgdGhpcy5ybmcgPSBybmc7XHJcblxyXG4gICAgICAgIHRoaXMucGFpciA9IHRoaXMucGFpci5iaW5kKHRoaXMpXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldCBybmdHZW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm5nO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBvcmRlcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGdlbjEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZzE7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGdlbjIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZzI7XHJcbiAgICB9XHJcblxyXG4gICAgcGFpcihnMSwgZzIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdHguUEFJUi5mZXhwKHRoaXMuY3R4LlBBSVIuYXRlKGcyLCBnMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc2hNZXNzYWdlKG0pIHtcclxuICAgICAgICBjb25zdCBtZXNzYWdlQnl0ZXMgPSBzdHJpbmdUb0J5dGVzKG0pO1xyXG4gICAgICAgIGNvbnN0IEggPSBuZXcgdGhpcy5jdHguSEFTSDI1NigpO1xyXG4gICAgICAgIEgucHJvY2Vzc19hcnJheShtZXNzYWdlQnl0ZXMpO1xyXG4gICAgICAgIHJldHVybiBILmhhc2goKTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNoVG9CSUcobSkge1xyXG4gICAgICAgIGNvbnN0IFIgPSB0aGlzLmhhc2hNZXNzYWdlKG0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN0eC5CSUcuZnJvbUJ5dGVzKFIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGltcGxlbWVudGF0aW9uIHBhcnRpYWxseSB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9taWxhZ3JvLWNyeXB0by9taWxhZ3JvLWNyeXB0by1qcy9ibG9iL2RldmVsb3Avc3JjL25vZGUvbXBpbi5qcyNMMTI1XHJcbiAgICBoYXNoVG9Qb2ludE9uQ3VydmUobSkge1xyXG4gICAgICAgIGxldCBSID0gdGhpcy5oYXNoTWVzc2FnZShtKTtcclxuXHJcbiAgICAgICAgaWYgKFIubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBsZXQgVyA9IFtdO1xyXG5cclxuICAgICAgICAvLyBuZWVkcyB0byBiZSBhZGp1c3RlZCBpZiBkaWZmZXJlbnQgY3VydmUgd2FzIHRvIGJlIGNob3NlblxyXG4gICAgICAgIGNvbnN0IHNoYSA9IDMyO1xyXG4gICAgICAgIGlmIChzaGEgPj0gdGhpcy5jdHguQklHLk1PREJZVEVTKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY3R4LkJJRy5NT0RCWVRFUzsgaSsrKSBXW2ldID0gUltpXTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGE7IGkrKykgV1tpXSA9IFJbaV07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBzaGE7IGkgPCB0aGlzLmN0eC5CSUcuTU9EQllURVM7IGkrKykgV1tpXSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmN0eC5FQ1AubWFwaXQoVyk7XHJcbiAgICB9XHJcbn07XHJcbiJdfQ==