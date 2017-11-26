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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CcEdyb3VwLmpzIl0sIm5hbWVzIjpbImNyeXB0byIsIkJwR3JvdXAiLCJjdHgiLCJvIiwiQklHIiwicmNvcHkiLCJST01fQ1VSVkUiLCJDVVJWRV9PcmRlciIsIm9yZCIsImcxIiwiRUNQIiwieCIsInkiLCJDVVJWRV9HeCIsIkNVUlZFX0d5Iiwic2V0eHkiLCJnMiIsIkVDUDIiLCJxeCIsIkZQMiIsInF5IiwiQ1VSVkVfUHhhIiwiQ1VSVkVfUHhiIiwiYnNldCIsIkNVUlZFX1B5YSIsIkNVUlZFX1B5YiIsIlJBVyIsInJuZyIsIlJBTkQiLCJjbGVhbiIsInJhbmRvbUJ5dGVzIiwic2VlZCIsImxlbmd0aCIsInBhaXIiLCJiaW5kIiwiUEFJUiIsImZleHAiLCJhdGUiLCJtIiwibWVzc2FnZUJ5dGVzIiwiSCIsIkhBU0gyNTYiLCJwcm9jZXNzX2FycmF5IiwiaGFzaCIsIlIiLCJoYXNoTWVzc2FnZSIsImZyb21CeXRlcyIsIlciLCJzaGEiLCJNT0RCWVRFUyIsImkiLCJtYXBpdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O3FqQkFBQTs7Ozs7QUFLQTs7OztBQUNBOztBQUNBOztJQUFZQSxNOzs7Ozs7OztJQUVTQyxPO0FBQ2pCLHVCQUFjO0FBQUE7O0FBQ1YsYUFBS0MsR0FBTCxHQUFXLGtCQUFRLE9BQVIsQ0FBWDs7QUFFQTtBQUNBLFlBQUlDLElBQUksSUFBSSxLQUFLRCxHQUFMLENBQVNFLEdBQWIsQ0FBaUIsQ0FBakIsQ0FBUjtBQUNBRCxVQUFFRSxLQUFGLENBQVEsS0FBS0gsR0FBTCxDQUFTSSxTQUFULENBQW1CQyxXQUEzQjtBQUNBLGFBQUtDLEdBQUwsR0FBV0wsQ0FBWDs7QUFFQTtBQUNBLFlBQUlNLEtBQUssSUFBSSxLQUFLUCxHQUFMLENBQVNRLEdBQWIsRUFBVDtBQUNBLFlBQUlDLElBQUksSUFBSSxLQUFLVCxHQUFMLENBQVNFLEdBQWIsQ0FBaUIsQ0FBakIsQ0FBUjtBQUNBLFlBQUlRLElBQUksSUFBSSxLQUFLVixHQUFMLENBQVNF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QVQsQ0FBYTZDLFFBQWpDLEVBQTJDQyxHQUEzQztBQUFnREgsa0JBQUVHLENBQUYsSUFBT04sRUFBRU0sQ0FBRixDQUFQO0FBQWhELGFBREosTUFFSztBQUNELHFCQUFLLElBQUlBLEtBQUksQ0FBYixFQUFnQkEsS0FBSUYsR0FBcEIsRUFBeUJFLElBQXpCO0FBQThCSCxzQkFBRUcsRUFBRixJQUFPTixFQUFFTSxFQUFGLENBQVA7QUFBOUIsaUJBQ0EsS0FBSyxJQUFJQSxNQUFJRixHQUFiLEVBQWtCRSxNQUFJLEtBQUtoRCxHQUFMLENBQVNFLEdBQVQsQ0FBYTZDLFFBQW5DLEVBQTZDQyxLQUE3QztBQUFrREgsc0JBQUVHLEdBQUYsSUFBTyxDQUFQO0FBQWxEO0FBQ0g7QUFDRCxtQkFBTyxLQUFLaEQsR0FBTCxDQUFTUSxHQUFULENBQWF5QyxLQUFiLENBQW1CSixDQUFuQixDQUFQO0FBQ0g7Ozs0QkFoRFk7QUFDVCxtQkFBTyxLQUFLcEIsR0FBWjtBQUNIOzs7NEJBRVc7QUFDUixtQkFBTyxLQUFLbkIsR0FBWjtBQUNIOzs7NEJBRVU7QUFDUCxtQkFBTyxLQUFLQyxFQUFaO0FBQ0g7Ozs0QkFFVTtBQUNQLG1CQUFPLEtBQUtPLEVBQVo7QUFDSDs7Ozs7O2tCQXRFZ0JmLE87QUF5R3BCIiwiZmlsZSI6IkJwR3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gICAgVE9ETzpcclxuICAgIC0gXCJwcm9wZXJcIiBpbnZlc3RpZ2F0ZSBSTkdcclxuICovXHJcblxyXG5pbXBvcnQgQ1RYIGZyb20gXCIuL2xpYi9NaWxhZ3JvLUNyeXB0by1MaWJyYXJ5L2N0eFwiXHJcbmltcG9ydCB7c3RyaW5nVG9CeXRlc30gZnJvbSBcIi4vYXV4aWxpYXJ5XCJcclxuaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gXCJjcnlwdG9cIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnBHcm91cCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmN0eCA9IG5ldyBDVFgoXCJCTjI1NFwiKTtcclxuXHJcbiAgICAgICAgLy8gc2V0IG9yZGVyIG9mIHRoZSBncm91cHNcclxuICAgICAgICBsZXQgbyA9IG5ldyB0aGlzLmN0eC5CSUcoMCk7XHJcbiAgICAgICAgby5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfT3JkZXIpO1xyXG4gICAgICAgIHRoaXMub3JkID0gbztcclxuXHJcbiAgICAgICAgLy8gU2V0IHVwIGluc3RhbmNlIG9mIGcxXHJcbiAgICAgICAgbGV0IGcxID0gbmV3IHRoaXMuY3R4LkVDUCgpO1xyXG4gICAgICAgIGxldCB4ID0gbmV3IHRoaXMuY3R4LkJJRygwKTtcclxuICAgICAgICBsZXQgeSA9IG5ldyB0aGlzLmN0eC5CSUcoMCk7XHJcblxyXG4gICAgICAgIC8vIFNldCBnZW5lcmF0b3Igb2YgZzFcclxuICAgICAgICB4LnJjb3B5KHRoaXMuY3R4LlJPTV9DVVJWRS5DVVJWRV9HeCk7XHJcbiAgICAgICAgeS5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfR3kpO1xyXG4gICAgICAgIGcxLnNldHh5KHgsIHkpO1xyXG5cclxuICAgICAgICB0aGlzLmcxID0gZzE7XHJcblxyXG4gICAgICAgIC8vIFNldCB1cCBpbnN0YW5jZSBvZiBnMlxyXG4gICAgICAgIGxldCBnMiA9IG5ldyB0aGlzLmN0eC5FQ1AyKCk7XHJcbiAgICAgICAgbGV0IHF4ID0gbmV3IHRoaXMuY3R4LkZQMigwKTtcclxuICAgICAgICBsZXQgcXkgPSBuZXcgdGhpcy5jdHguRlAyKDApO1xyXG5cclxuICAgICAgICAvLyBTZXQgZ2VuZXJhdG9yIG9mIGcyXHJcbiAgICAgICAgeC5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfUHhhKTtcclxuICAgICAgICB5LnJjb3B5KHRoaXMuY3R4LlJPTV9DVVJWRS5DVVJWRV9QeGIpO1xyXG4gICAgICAgIHF4LmJzZXQoeCwgeSk7XHJcbiAgICAgICAgeC5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfUHlhKTtcclxuICAgICAgICB5LnJjb3B5KHRoaXMuY3R4LlJPTV9DVVJWRS5DVVJWRV9QeWIpO1xyXG4gICAgICAgIHF5LmJzZXQoeCwgeSk7XHJcbiAgICAgICAgZzIuc2V0eHkocXgsIHF5KTtcclxuXHJcbiAgICAgICAgdGhpcy5nMiA9IGcyO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAgICBDdXJyZW50bHkgdGhlIFJORyBnZW5lcmF0b3IgaXMgc2VlZGVkIHdpdGggY29uc3RhbnQgc2VlZDtcclxuICAgICAgICAgICAgVE9ETzogSW52ZXN0aWdhdGUgXCJwcm9wZXJcIiBlbnRyb3B5IHNvdXJjZXNcclxuICAgICAgICAgICAgVE9ETzogRXZlbiB0aG91Z2ggZXhhbXBsZXMgdXNlZCB8c3wgPSAxMDAsIGNvbnNpZGVyIGxvbmdlciBzZWVkcz9cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgUkFXID0gW107XHJcbiAgICAgICAgbGV0IHJuZyA9IG5ldyB0aGlzLmN0eC5SQU5EKCk7XHJcbiAgICAgICAgcm5nLmNsZWFuKCk7XHJcbiAgICAgICAgUkFXID0gY3J5cHRvLnJhbmRvbUJ5dGVzKDEyOCk7XHJcbiAgICAgICAgcm5nLnNlZWQoUkFXLmxlbmd0aCwgUkFXKTtcclxuICAgICAgICAvLyBvbGQgXCJzZWVkXCJcclxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSBSQVdbaV0gPSBpO1xyXG4gICAgICAgIC8vIHJuZy5zZWVkKDEwMCwgUkFXKTtcclxuICAgICAgICB0aGlzLnJuZyA9IHJuZztcclxuXHJcbiAgICAgICAgdGhpcy5wYWlyID0gdGhpcy5wYWlyLmJpbmQodGhpcylcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0IHJuZ0dlbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ybmc7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG9yZGVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9yZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZ2VuMSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nMTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZ2VuMigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nMjtcclxuICAgIH1cclxuXHJcbiAgICBwYWlyKGcxLCBnMikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN0eC5QQUlSLmZleHAodGhpcy5jdHguUEFJUi5hdGUoZzIsIGcxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzaE1lc3NhZ2UobSkge1xyXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VCeXRlcyA9IHN0cmluZ1RvQnl0ZXMobSk7XHJcbiAgICAgICAgY29uc3QgSCA9IG5ldyB0aGlzLmN0eC5IQVNIMjU2KCk7XHJcbiAgICAgICAgSC5wcm9jZXNzX2FycmF5KG1lc3NhZ2VCeXRlcyk7XHJcbiAgICAgICAgcmV0dXJuIEguaGFzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc2hUb0JJRyhtKSB7XHJcbiAgICAgICAgY29uc3QgUiA9IHRoaXMuaGFzaE1lc3NhZ2UobSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4LkJJRy5mcm9tQnl0ZXMoUik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaW1wbGVtZW50YXRpb24gcGFydGlhbGx5IHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21pbGFncm8tY3J5cHRvL21pbGFncm8tY3J5cHRvLWpzL2Jsb2IvZGV2ZWxvcC9zcmMvbm9kZS9tcGluLmpzI0wxMjVcclxuICAgIGhhc2hUb1BvaW50T25DdXJ2ZShtKSB7XHJcbiAgICAgICAgbGV0IFIgPSB0aGlzLmhhc2hNZXNzYWdlKG0pO1xyXG5cclxuICAgICAgICBpZiAoUi5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xyXG4gICAgICAgIGxldCBXID0gW107XHJcblxyXG4gICAgICAgIC8vIG5lZWRzIHRvIGJlIGFkanVzdGVkIGlmIGRpZmZlcmVudCBjdXJ2ZSB3YXMgdG8gYmUgY2hvc2VuXHJcbiAgICAgICAgY29uc3Qgc2hhID0gMzI7XHJcbiAgICAgICAgaWYgKHNoYSA+PSB0aGlzLmN0eC5CSUcuTU9EQllURVMpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jdHguQklHLk1PREJZVEVTOyBpKyspIFdbaV0gPSBSW2ldO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoYTsgaSsrKSBXW2ldID0gUltpXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHNoYTsgaSA8IHRoaXMuY3R4LkJJRy5NT0RCWVRFUzsgaSsrKSBXW2ldID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4LkVDUC5tYXBpdChXKTtcclxuICAgIH1cclxufTtcclxuIl19