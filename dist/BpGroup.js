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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CcEdyb3VwLmpzIl0sIm5hbWVzIjpbIkJwR3JvdXAiLCJjdHgiLCJvIiwiQklHIiwicmNvcHkiLCJST01fQ1VSVkUiLCJDVVJWRV9PcmRlciIsIm9yZCIsImcxIiwiRUNQIiwieCIsInkiLCJDVVJWRV9HeCIsIkNVUlZFX0d5Iiwic2V0eHkiLCJnMiIsIkVDUDIiLCJxeCIsIkZQMiIsInF5IiwiQ1VSVkVfUHhhIiwiQ1VSVkVfUHhiIiwiYnNldCIsIkNVUlZFX1B5YSIsIkNVUlZFX1B5YiIsIlJBVyIsInJuZyIsIlJBTkQiLCJjbGVhbiIsImkiLCJzZWVkIiwicGFpciIsImJpbmQiLCJQQUlSIiwiZmV4cCIsImF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O3FqQkFBQTs7Ozs7QUFLQTs7Ozs7Ozs7SUFHcUJBLE87QUFDakIsdUJBQWM7QUFBQTs7QUFDVixhQUFLQyxHQUFMLEdBQVcsa0JBQVEsT0FBUixDQUFYOztBQUVBO0FBQ0EsWUFBSUMsSUFBSSxJQUFJLEtBQUtELEdBQUwsQ0FBU0UsR0FBYixDQUFpQixDQUFqQixDQUFSO0FBQ0FELFVBQUVFLEtBQUYsQ0FBUSxLQUFLSCxHQUFMLENBQVNJLFNBQVQsQ0FBbUJDLFdBQTNCO0FBQ0EsYUFBS0MsR0FBTCxHQUFXTCxDQUFYOztBQUVBO0FBQ0EsWUFBSU0sS0FBSyxJQUFJLEtBQUtQLEdBQUwsQ0FBU1EsR0FBYixFQUFUO0FBQ0EsWUFBSUMsSUFBSSxJQUFJLEtBQUtULEdBQUwsQ0FBU0UsR0FBYixDQUFpQixDQUFqQixDQUFSO0FBQ0EsWUFBSVEsSUFBSSxJQUFJLEtBQUtWLEdBQUwsQ0FBU0UsR0FBYixDQUFpQixDQUFqQixDQUFSOztBQUVBO0FBQ0FPLFVBQUVOLEtBQUYsQ0FBUSxLQUFLSCxHQUFMLENBQVNJLFNBQVQsQ0FBbUJPLFFBQTNCO0FBQ0FELFVBQUVQLEtBQUYsQ0FBUSxLQUFLSCxHQUFMLENBQVNJLFNBQVQsQ0FBbUJRLFFBQTNCO0FBQ0FMLFdBQUdNLEtBQUgsQ0FBU0osQ0FBVCxFQUFZQyxDQUFaOztBQUVBLGFBQUtILEVBQUwsR0FBVUEsRUFBVjs7QUFFQTtBQUNBLFlBQUlPLEtBQUssSUFBSSxLQUFLZCxHQUFMLENBQVNlLElBQWIsRUFBVDtBQUNBLFlBQUlDLEtBQUssSUFBSSxLQUFLaEIsR0FBTCxDQUFTaUIsR0FBYixDQUFpQixDQUFqQixDQUFUO0FBQ0EsWUFBSUMsS0FBSyxJQUFJLEtBQUtsQixHQUFMLENBQVNpQixHQUFiLENBQWlCLENBQWpCLENBQVQ7O0FBRUE7QUFDQVIsVUFBRU4sS0FBRixDQUFRLEtBQUtILEdBQUwsQ0FBU0ksU0FBVCxDQUFtQmUsU0FBM0I7QUFDQVQsVUFBRVAsS0FBRixDQUFRLEtBQUtILEdBQUwsQ0FBU0ksU0FBVCxDQUFtQmdCLFNBQTNCO0FBQ0FKLFdBQUdLLElBQUgsQ0FBUVosQ0FBUixFQUFXQyxDQUFYO0FBQ0FELFVBQUVOLEtBQUYsQ0FBUSxLQUFLSCxHQUFMLENBQVNJLFNBQVQsQ0FBbUJrQixTQUEzQjtBQUNBWixVQUFFUCxLQUFGLENBQVEsS0FBS0gsR0FBTCxDQUFTSSxTQUFULENBQW1CbUIsU0FBM0I7QUFDQUwsV0FBR0csSUFBSCxDQUFRWixDQUFSLEVBQVdDLENBQVg7QUFDQUksV0FBR0QsS0FBSCxDQUFTRyxFQUFULEVBQWFFLEVBQWI7O0FBRUEsYUFBS0osRUFBTCxHQUFVQSxFQUFWOztBQUVBOzs7OztBQUtBLFlBQUlVLE1BQU0sRUFBVjtBQUNBLFlBQUlDLE1BQU0sSUFBSSxLQUFLekIsR0FBTCxDQUFTMEIsSUFBYixFQUFWO0FBQ0FELFlBQUlFLEtBQUo7QUFDQSxhQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSSxHQUFwQixFQUF5QkEsR0FBekI7QUFBOEJKLGdCQUFJSSxDQUFKLElBQVNBLENBQVQ7QUFBOUIsU0FDQUgsSUFBSUksSUFBSixDQUFTLEdBQVQsRUFBY0wsR0FBZDtBQUNBLGFBQUtDLEdBQUwsR0FBV0EsR0FBWDs7QUFFQSxhQUFLSyxJQUFMLEdBQVksS0FBS0EsSUFBTCxDQUFVQyxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0g7Ozs7NkJBbUJJeEIsRSxFQUFJTyxFLEVBQUk7QUFDVCxtQkFBTyxLQUFLZCxHQUFMLENBQVNnQyxJQUFULENBQWNDLElBQWQsQ0FBbUIsS0FBS2pDLEdBQUwsQ0FBU2dDLElBQVQsQ0FBY0UsR0FBZCxDQUFrQnBCLEVBQWxCLEVBQXNCUCxFQUF0QixDQUFuQixDQUFQO0FBQ0g7Ozs0QkFsQlk7QUFDVCxtQkFBTyxLQUFLa0IsR0FBWjtBQUNIOzs7NEJBRVc7QUFDUixtQkFBTyxLQUFLbkIsR0FBWjtBQUNIOzs7NEJBRVU7QUFDUCxtQkFBTyxLQUFLQyxFQUFaO0FBQ0g7Ozs0QkFFVTtBQUNQLG1CQUFPLEtBQUtPLEVBQVo7QUFDSDs7Ozs7O2tCQW5FZ0JmLE87QUF3RXBCIiwiZmlsZSI6IkJwR3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gICAgVE9ETzpcclxuICAgIC0gXCJwcm9wZXJcIiBpbnZlc3RpZ2F0ZSBSTkdcclxuICovXHJcblxyXG5pbXBvcnQgQ1RYIGZyb20gXCIuL2xpYi9NaWxhZ3JvLUNyeXB0by1MaWJyYXJ5L2N0eFwiXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnBHcm91cCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmN0eCA9IG5ldyBDVFgoXCJCTjI1NFwiKTtcclxuXHJcbiAgICAgICAgLy8gc2V0IG9yZGVyIG9mIHRoZSBncm91cHNcclxuICAgICAgICBsZXQgbyA9IG5ldyB0aGlzLmN0eC5CSUcoMCk7XHJcbiAgICAgICAgby5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfT3JkZXIpO1xyXG4gICAgICAgIHRoaXMub3JkID0gbztcclxuXHJcbiAgICAgICAgLy8gU2V0IHVwIGluc3RhbmNlIG9mIGcxXHJcbiAgICAgICAgbGV0IGcxID0gbmV3IHRoaXMuY3R4LkVDUCgpO1xyXG4gICAgICAgIGxldCB4ID0gbmV3IHRoaXMuY3R4LkJJRygwKTtcclxuICAgICAgICBsZXQgeSA9IG5ldyB0aGlzLmN0eC5CSUcoMCk7XHJcblxyXG4gICAgICAgIC8vIFNldCBnZW5lcmF0b3Igb2YgZzFcclxuICAgICAgICB4LnJjb3B5KHRoaXMuY3R4LlJPTV9DVVJWRS5DVVJWRV9HeCk7XHJcbiAgICAgICAgeS5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfR3kpO1xyXG4gICAgICAgIGcxLnNldHh5KHgsIHkpO1xyXG5cclxuICAgICAgICB0aGlzLmcxID0gZzE7XHJcblxyXG4gICAgICAgIC8vIFNldCB1cCBpbnN0YW5jZSBvZiBnMlxyXG4gICAgICAgIGxldCBnMiA9IG5ldyB0aGlzLmN0eC5FQ1AyKCk7XHJcbiAgICAgICAgbGV0IHF4ID0gbmV3IHRoaXMuY3R4LkZQMigwKTtcclxuICAgICAgICBsZXQgcXkgPSBuZXcgdGhpcy5jdHguRlAyKDApO1xyXG5cclxuICAgICAgICAvLyBTZXQgZ2VuZXJhdG9yIG9mIGcyXHJcbiAgICAgICAgeC5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfUHhhKTtcclxuICAgICAgICB5LnJjb3B5KHRoaXMuY3R4LlJPTV9DVVJWRS5DVVJWRV9QeGIpO1xyXG4gICAgICAgIHF4LmJzZXQoeCwgeSk7XHJcbiAgICAgICAgeC5yY29weSh0aGlzLmN0eC5ST01fQ1VSVkUuQ1VSVkVfUHlhKTtcclxuICAgICAgICB5LnJjb3B5KHRoaXMuY3R4LlJPTV9DVVJWRS5DVVJWRV9QeWIpO1xyXG4gICAgICAgIHF5LmJzZXQoeCwgeSk7XHJcbiAgICAgICAgZzIuc2V0eHkocXgsIHF5KTtcclxuXHJcbiAgICAgICAgdGhpcy5nMiA9IGcyO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAgICBDdXJyZW50bHkgdGhlIFJORyBnZW5lcmF0b3IgaXMgc2VlZGVkIHdpdGggY29uc3RhbnQgc2VlZDtcclxuICAgICAgICAgICAgVE9ETzogSW52ZXN0aWdhdGUgXCJwcm9wZXJcIiBlbnRyb3B5IHNvdXJjZXNcclxuICAgICAgICAgICAgVE9ETzogRXZlbiB0aG91Z2ggZXhhbXBsZXMgdXNlZCB8c3wgPSAxMDAsIGNvbnNpZGVyIGxvbmdlciBzZWVkcz9cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgUkFXID0gW107XHJcbiAgICAgICAgbGV0IHJuZyA9IG5ldyB0aGlzLmN0eC5SQU5EKCk7XHJcbiAgICAgICAgcm5nLmNsZWFuKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykgUkFXW2ldID0gaTtcclxuICAgICAgICBybmcuc2VlZCgxMDAsIFJBVyk7XHJcbiAgICAgICAgdGhpcy5ybmcgPSBybmc7XHJcblxyXG4gICAgICAgIHRoaXMucGFpciA9IHRoaXMucGFpci5iaW5kKHRoaXMpXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldCBybmdHZW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm5nO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBvcmRlcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGdlbjEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZzE7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGdlbjIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZzI7XHJcbiAgICB9XHJcblxyXG4gICAgcGFpcihnMSwgZzIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdHguUEFJUi5mZXhwKHRoaXMuY3R4LlBBSVIuYXRlKGcyLCBnMSkpO1xyXG4gICAgfTtcclxufTtcclxuIl19