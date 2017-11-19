"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         TODO:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         - "proper" investigate RNG
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _ctx = require("./lib/Milagro-Crypto-Library/ctx");

var _ctx2 = _interopRequireDefault(_ctx);

var _auxiliary = require("./auxiliary");

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
        for (var i = 0; i < 100; i++) {
            RAW[i] = i;
        }rng.seed(100, RAW);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CcEdyb3VwLmpzIl0sIm5hbWVzIjpbIkJwR3JvdXAiLCJjdHgiLCJvIiwiQklHIiwicmNvcHkiLCJST01fQ1VSVkUiLCJDVVJWRV9PcmRlciIsIm9yZCIsImcxIiwiRUNQIiwieCIsInkiLCJDVVJWRV9HeCIsIkNVUlZFX0d5Iiwic2V0eHkiLCJnMiIsIkVDUDIiLCJxeCIsIkZQMiIsInF5IiwiQ1VSVkVfUHhhIiwiQ1VSVkVfUHhiIiwiYnNldCIsIkNVUlZFX1B5YSIsIkNVUlZFX1B5YiIsIlJBVyIsInJuZyIsIlJBTkQiLCJjbGVhbiIsImkiLCJzZWVkIiwicGFpciIsImJpbmQiLCJQQUlSIiwiZmV4cCIsImF0ZSIsIm0iLCJtZXNzYWdlQnl0ZXMiLCJIIiwiSEFTSDI1NiIsInByb2Nlc3NfYXJyYXkiLCJoYXNoIiwiUiIsImhhc2hNZXNzYWdlIiwiZnJvbUJ5dGVzIiwibGVuZ3RoIiwiVyIsInNoYSIsIk1PREJZVEVTIiwibWFwaXQiXSwibWFwcGluZ3MiOiI7Ozs7OztxakJBQUE7Ozs7O0FBS0E7Ozs7QUFDQTs7Ozs7O0lBRXFCQSxPO0FBQ2pCLHVCQUFjO0FBQUE7O0FBQ1YsYUFBS0MsR0FBTCxHQUFXLGtCQUFRLE9BQVIsQ0FBWDs7QUFFQTtBQUNBLFlBQUlDLElBQUksSUFBSSxLQUFLRCxHQUFMLENBQVNFLEdBQWIsQ0FBaUIsQ0FBakIsQ0FBUjtBQUNBRCxVQUFFRSxLQUFGLENBQVEsS0FBS0gsR0FBTCxDQUFTSSxTQUFULENBQW1CQyxXQUEzQjtBQUNBLGFBQUtDLEdBQUwsR0FBV0wsQ0FBWDs7QUFFQTtBQUNBLFlBQUlNLEtBQUssSUFBSSxLQUFLUCxHQUFMLENBQVNRLEdBQWIsRUFBVDtBQUNBLFlBQUlDLElBQUksSUFBSSxLQUFLVCxHQUFMLENBQVNFLEdBQWIsQ0FBaUIsQ0FBakIsQ0FBUjtBQUNBLFlBQUlRLElBQUksSUFBSSxLQUFLVixHQUFMLENBQVNFLEdBQWIsQ0FBaUIsQ0FBakIsQ0FBUjs7QUFFQTtBQUNBTyxVQUFF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QUFqQyxFQUEyQ25CLEdBQTNDO0FBQWdEaUIsa0JBQUVqQixDQUFGLElBQU9hLEVBQUViLENBQUYsQ0FBUDtBQUFoRCxhQURKLE1BRUs7QUFDRCxxQkFBSyxJQUFJQSxLQUFJLENBQWIsRUFBZ0JBLEtBQUlrQixHQUFwQixFQUF5QmxCLElBQXpCO0FBQThCaUIsc0JBQUVqQixFQUFGLElBQU9hLEVBQUViLEVBQUYsQ0FBUDtBQUE5QixpQkFDQSxLQUFLLElBQUlBLE1BQUlrQixHQUFiLEVBQWtCbEIsTUFBSSxLQUFLNUIsR0FBTCxDQUFTRSxHQUFULENBQWE2QyxRQUFuQyxFQUE2Q25CLEtBQTdDO0FBQWtEaUIsc0JBQUVqQixHQUFGLElBQU8sQ0FBUDtBQUFsRDtBQUNIO0FBQ0QsbUJBQU8sS0FBSzVCLEdBQUwsQ0FBU1EsR0FBVCxDQUFhd0MsS0FBYixDQUFtQkgsQ0FBbkIsQ0FBUDtBQUNIOzs7NEJBaERZO0FBQ1QsbUJBQU8sS0FBS3BCLEdBQVo7QUFDSDs7OzRCQUVXO0FBQ1IsbUJBQU8sS0FBS25CLEdBQVo7QUFDSDs7OzRCQUVVO0FBQ1AsbUJBQU8sS0FBS0MsRUFBWjtBQUNIOzs7NEJBRVU7QUFDUCxtQkFBTyxLQUFLTyxFQUFaO0FBQ0g7Ozs7OztrQkFuRWdCZixPO0FBc0dwQiIsImZpbGUiOiJCcEdyb3VwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICAgIFRPRE86XHJcbiAgICAtIFwicHJvcGVyXCIgaW52ZXN0aWdhdGUgUk5HXHJcbiAqL1xyXG5cclxuaW1wb3J0IENUWCBmcm9tIFwiLi9saWIvTWlsYWdyby1DcnlwdG8tTGlicmFyeS9jdHhcIlxyXG5pbXBvcnQge3N0cmluZ1RvQnl0ZXN9IGZyb20gXCIuL2F1eGlsaWFyeVwiXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcEdyb3VwIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY3R4ID0gbmV3IENUWChcIkJOMjU0XCIpO1xyXG5cclxuICAgICAgICAvLyBzZXQgb3JkZXIgb2YgdGhlIGdyb3Vwc1xyXG4gICAgICAgIGxldCBvID0gbmV3IHRoaXMuY3R4LkJJRygwKTtcclxuICAgICAgICBvLnJjb3B5KHRoaXMuY3R4LlJPTV9DVVJWRS5DVVJWRV9PcmRlcik7XHJcbiAgICAgICAgdGhpcy5vcmQgPSBvO1xyXG5cclxuICAgICAgICAvLyBTZXQgdXAgaW5zdGFuY2Ugb2YgZzFcclxuICAgICAgICBsZXQgZzEgPSBuZXcgdGhpcy5jdHguRUNQKCk7XHJcbiAgICAgICAgbGV0IHggPSBuZXcgdGhpcy5jdHguQklHKDApO1xyXG4gICAgICAgIGxldCB5ID0gbmV3IHRoaXMuY3R4LkJJRygwKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IGdlbmVyYXRvciBvZiBnMVxyXG4gICAgICAgIHgucmNvcHkodGhpcy5jdHguUk9NX0NVUlZFLkNVUlZFX0d4KTtcclxuICAgICAgICB5LnJjb3B5KHRoaXMuY3R4LlJPTV9DVVJWRS5DVVJWRV9HeSk7XHJcbiAgICAgICAgZzEuc2V0eHkoeCwgeSk7XHJcblxyXG4gICAgICAgIHRoaXMuZzEgPSBnMTtcclxuXHJcbiAgICAgICAgLy8gU2V0IHVwIGluc3RhbmNlIG9mIGcyXHJcbiAgICAgICAgbGV0IGcyID0gbmV3IHRoaXMuY3R4LkVDUDIoKTtcclxuICAgICAgICBsZXQgcXggPSBuZXcgdGhpcy5jdHguRlAyKDApO1xyXG4gICAgICAgIGxldCBxeSA9IG5ldyB0aGlzLmN0eC5GUDIoMCk7XHJcblxyXG4gICAgICAgIC8vIFNldCBnZW5lcmF0b3Igb2YgZzJcclxuICAgICAgICB4LnJjb3B5KHRoaXMuY3R4LlJPTV9DVVJWRS5DVVJWRV9QeGEpO1xyXG4gICAgICAgIHkucmNvcHkodGhpcy5jdHguUk9NX0NVUlZFLkNVUlZFX1B4Yik7XHJcbiAgICAgICAgcXguYnNldCh4LCB5KTtcclxuICAgICAgICB4LnJjb3B5KHRoaXMuY3R4LlJPTV9DVVJWRS5DVVJWRV9QeWEpO1xyXG4gICAgICAgIHkucmNvcHkodGhpcy5jdHguUk9NX0NVUlZFLkNVUlZFX1B5Yik7XHJcbiAgICAgICAgcXkuYnNldCh4LCB5KTtcclxuICAgICAgICBnMi5zZXR4eShxeCwgcXkpO1xyXG5cclxuICAgICAgICB0aGlzLmcyID0gZzI7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgIEN1cnJlbnRseSB0aGUgUk5HIGdlbmVyYXRvciBpcyBzZWVkZWQgd2l0aCBjb25zdGFudCBzZWVkO1xyXG4gICAgICAgICAgICBUT0RPOiBJbnZlc3RpZ2F0ZSBcInByb3BlclwiIGVudHJvcHkgc291cmNlc1xyXG4gICAgICAgICAgICBUT0RPOiBFdmVuIHRob3VnaCBleGFtcGxlcyB1c2VkIHxzfCA9IDEwMCwgY29uc2lkZXIgbG9uZ2VyIHNlZWRzP1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBSQVcgPSBbXTtcclxuICAgICAgICBsZXQgcm5nID0gbmV3IHRoaXMuY3R4LlJBTkQoKTtcclxuICAgICAgICBybmcuY2xlYW4oKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSBSQVdbaV0gPSBpO1xyXG4gICAgICAgIHJuZy5zZWVkKDEwMCwgUkFXKTtcclxuICAgICAgICB0aGlzLnJuZyA9IHJuZztcclxuXHJcbiAgICAgICAgdGhpcy5wYWlyID0gdGhpcy5wYWlyLmJpbmQodGhpcylcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0IHJuZ0dlbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ybmc7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG9yZGVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9yZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZ2VuMSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nMTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZ2VuMigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nMjtcclxuICAgIH1cclxuXHJcbiAgICBwYWlyKGcxLCBnMikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN0eC5QQUlSLmZleHAodGhpcy5jdHguUEFJUi5hdGUoZzIsIGcxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzaE1lc3NhZ2UobSkge1xyXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VCeXRlcyA9IHN0cmluZ1RvQnl0ZXMobSk7XHJcbiAgICAgICAgY29uc3QgSCA9IG5ldyB0aGlzLmN0eC5IQVNIMjU2KCk7XHJcbiAgICAgICAgSC5wcm9jZXNzX2FycmF5KG1lc3NhZ2VCeXRlcyk7XHJcbiAgICAgICAgcmV0dXJuIEguaGFzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc2hUb0JJRyhtKSB7XHJcbiAgICAgICAgY29uc3QgUiA9IHRoaXMuaGFzaE1lc3NhZ2UobSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4LkJJRy5mcm9tQnl0ZXMoUik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaW1wbGVtZW50YXRpb24gcGFydGlhbGx5IHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21pbGFncm8tY3J5cHRvL21pbGFncm8tY3J5cHRvLWpzL2Jsb2IvZGV2ZWxvcC9zcmMvbm9kZS9tcGluLmpzI0wxMjVcclxuICAgIGhhc2hUb1BvaW50T25DdXJ2ZShtKSB7XHJcbiAgICAgICAgbGV0IFIgPSB0aGlzLmhhc2hNZXNzYWdlKG0pO1xyXG5cclxuICAgICAgICBpZiAoUi5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xyXG4gICAgICAgIGxldCBXID0gW107XHJcblxyXG4gICAgICAgIC8vIG5lZWRzIHRvIGJlIGFkanVzdGVkIGlmIGRpZmZlcmVudCBjdXJ2ZSB3YXMgdG8gYmUgY2hvc2VuXHJcbiAgICAgICAgY29uc3Qgc2hhID0gMzI7XHJcbiAgICAgICAgaWYgKHNoYSA+PSB0aGlzLmN0eC5CSUcuTU9EQllURVMpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jdHguQklHLk1PREJZVEVTOyBpKyspIFdbaV0gPSBSW2ldO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoYTsgaSsrKSBXW2ldID0gUltpXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHNoYTsgaSA8IHRoaXMuY3R4LkJJRy5NT0RCWVRFUzsgaSsrKSBXW2ldID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4LkVDUC5tYXBpdChXKTtcclxuICAgIH1cclxufTtcclxuIl19