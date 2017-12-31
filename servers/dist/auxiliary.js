'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCoin = exports.getRandomCoinId = exports.stringToBytes = undefined;

var _crypto = require('crypto');

var crypto = _interopRequireWildcard(_crypto);

var _Coin = require('./Coin');

var _Coin2 = _interopRequireDefault(_Coin);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var stringToBytes = exports.stringToBytes = function stringToBytes(s) {
  var b = [];
  for (var i = 0; i < s.length; i++) {
    b.push(s.charCodeAt(i));
  }
  return b;
}; // set of auxiliary functions that don't belong to any existing class/module

var getRandomCoinId = exports.getRandomCoinId = function getRandomCoinId() {
  var RAW = crypto.randomBytes(128);

  var rng = new _config.ctx.RAND();
  rng.clean();
  rng.seed(RAW.length, RAW);
  var groupOrder = new _config.ctx.BIG(0);
  groupOrder.rcopy(_config.ctx.ROM_CURVE.CURVE_Order);

  return _config.ctx.BIG.randomnum(groupOrder, rng);
};

var getCoin = exports.getCoin = function getCoin(pk, value) {
  return new _Coin2.default(pk, getRandomCoinId(), value);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXhpbGlhcnkuanMiXSwibmFtZXMiOlsiY3J5cHRvIiwic3RyaW5nVG9CeXRlcyIsInMiLCJiIiwiaSIsImxlbmd0aCIsInB1c2giLCJjaGFyQ29kZUF0IiwiZ2V0UmFuZG9tQ29pbklkIiwiUkFXIiwicmFuZG9tQnl0ZXMiLCJybmciLCJSQU5EIiwiY2xlYW4iLCJzZWVkIiwiZ3JvdXBPcmRlciIsIkJJRyIsInJjb3B5IiwiUk9NX0NVUlZFIiwiQ1VSVkVfT3JkZXIiLCJyYW5kb21udW0iLCJnZXRDb2luIiwicGsiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztJQUFZQSxNOztBQUNaOzs7O0FBQ0E7Ozs7OztBQUVPLElBQU1DLHdDQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ0MsQ0FBRCxFQUFPO0FBQ2xDLE1BQU1DLElBQUksRUFBVjtBQUNBLE9BQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixFQUFFRyxNQUF0QixFQUE4QkQsR0FBOUIsRUFBbUM7QUFDakNELE1BQUVHLElBQUYsQ0FBT0osRUFBRUssVUFBRixDQUFhSCxDQUFiLENBQVA7QUFDRDtBQUNELFNBQU9ELENBQVA7QUFDRCxDQU5NLEMsQ0FOUDs7QUFjTyxJQUFNSyw0Q0FBa0IsU0FBbEJBLGVBQWtCLEdBQU07QUFDbkMsTUFBTUMsTUFBTVQsT0FBT1UsV0FBUCxDQUFtQixHQUFuQixDQUFaOztBQUVBLE1BQU1DLE1BQU0sSUFBSSxZQUFJQyxJQUFSLEVBQVo7QUFDQUQsTUFBSUUsS0FBSjtBQUNBRixNQUFJRyxJQUFKLENBQVNMLElBQUlKLE1BQWIsRUFBcUJJLEdBQXJCO0FBQ0EsTUFBTU0sYUFBYSxJQUFJLFlBQUlDLEdBQVIsQ0FBWSxDQUFaLENBQW5CO0FBQ0FELGFBQVdFLEtBQVgsQ0FBaUIsWUFBSUMsU0FBSixDQUFjQyxXQUEvQjs7QUFFQSxTQUFPLFlBQUlILEdBQUosQ0FBUUksU0FBUixDQUFrQkwsVUFBbEIsRUFBOEJKLEdBQTlCLENBQVA7QUFDRCxDQVZNOztBQVlBLElBQU1VLDRCQUFVLFNBQVZBLE9BQVUsQ0FBQ0MsRUFBRCxFQUFLQyxLQUFMO0FBQUEsU0FBZSxtQkFBU0QsRUFBVCxFQUFhZCxpQkFBYixFQUFnQ2UsS0FBaEMsQ0FBZjtBQUFBLENBQWhCIiwiZmlsZSI6ImF1eGlsaWFyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHNldCBvZiBhdXhpbGlhcnkgZnVuY3Rpb25zIHRoYXQgZG9uJ3QgYmVsb25nIHRvIGFueSBleGlzdGluZyBjbGFzcy9tb2R1bGVcblxuaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgQ29pbiBmcm9tICcuL0NvaW4nO1xuaW1wb3J0IHsgY3R4IH0gZnJvbSAnLi9jb25maWcnO1xuXG5leHBvcnQgY29uc3Qgc3RyaW5nVG9CeXRlcyA9IChzKSA9PiB7XG4gIGNvbnN0IGIgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgYi5wdXNoKHMuY2hhckNvZGVBdChpKSk7XG4gIH1cbiAgcmV0dXJuIGI7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0UmFuZG9tQ29pbklkID0gKCkgPT4ge1xuICBjb25zdCBSQVcgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoMTI4KTtcblxuICBjb25zdCBybmcgPSBuZXcgY3R4LlJBTkQoKTtcbiAgcm5nLmNsZWFuKCk7XG4gIHJuZy5zZWVkKFJBVy5sZW5ndGgsIFJBVyk7XG4gIGNvbnN0IGdyb3VwT3JkZXIgPSBuZXcgY3R4LkJJRygwKTtcbiAgZ3JvdXBPcmRlci5yY29weShjdHguUk9NX0NVUlZFLkNVUlZFX09yZGVyKTtcblxuICByZXR1cm4gY3R4LkJJRy5yYW5kb21udW0oZ3JvdXBPcmRlciwgcm5nKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRDb2luID0gKHBrLCB2YWx1ZSkgPT4gbmV3IENvaW4ocGssIGdldFJhbmRvbUNvaW5JZCgpLCB2YWx1ZSk7XG4iXX0=