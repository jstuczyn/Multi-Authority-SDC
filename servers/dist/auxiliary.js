'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCoin = undefined;
exports.stringToBytes = stringToBytes;

var _crypto = require('crypto');

var crypto = _interopRequireWildcard(_crypto);

var _Coin = require('./Coin');

var _Coin2 = _interopRequireDefault(_Coin);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function stringToBytes(s) {
  var b = [];
  for (var i = 0; i < s.length; i++) {
    b.push(s.charCodeAt(i));
  }
  return b;
} // set of auxiliary functions that don't belong to any existing class/module

var getRandomCoinId = function getRandomCoinId() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXhpbGlhcnkuanMiXSwibmFtZXMiOlsic3RyaW5nVG9CeXRlcyIsImNyeXB0byIsInMiLCJiIiwiaSIsImxlbmd0aCIsInB1c2giLCJjaGFyQ29kZUF0IiwiZ2V0UmFuZG9tQ29pbklkIiwiUkFXIiwicmFuZG9tQnl0ZXMiLCJybmciLCJSQU5EIiwiY2xlYW4iLCJzZWVkIiwiZ3JvdXBPcmRlciIsIkJJRyIsInJjb3B5IiwiUk9NX0NVUlZFIiwiQ1VSVkVfT3JkZXIiLCJyYW5kb21udW0iLCJnZXRDb2luIiwicGsiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBTWdCQSxhLEdBQUFBLGE7O0FBSmhCOztJQUFZQyxNOztBQUNaOzs7O0FBQ0E7Ozs7OztBQUVPLFNBQVNELGFBQVQsQ0FBdUJFLENBQXZCLEVBQTBCO0FBQy9CLE1BQU1DLElBQUksRUFBVjtBQUNBLE9BQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixFQUFFRyxNQUF0QixFQUE4QkQsR0FBOUIsRUFBbUM7QUFDakNELE1BQUVHLElBQUYsQ0FBT0osRUFBRUssVUFBRixDQUFhSCxDQUFiLENBQVA7QUFDRDtBQUNELFNBQU9ELENBQVA7QUFDRCxDLENBWkQ7O0FBY0EsSUFBTUssa0JBQWtCLFNBQWxCQSxlQUFrQixHQUFNO0FBQzVCLE1BQU1DLE1BQU1SLE9BQU9TLFdBQVAsQ0FBbUIsR0FBbkIsQ0FBWjs7QUFFQSxNQUFNQyxNQUFNLElBQUksWUFBSUMsSUFBUixFQUFaO0FBQ0FELE1BQUlFLEtBQUo7QUFDQUYsTUFBSUcsSUFBSixDQUFTTCxJQUFJSixNQUFiLEVBQXFCSSxHQUFyQjtBQUNBLE1BQU1NLGFBQWEsSUFBSSxZQUFJQyxHQUFSLENBQVksQ0FBWixDQUFuQjtBQUNBRCxhQUFXRSxLQUFYLENBQWlCLFlBQUlDLFNBQUosQ0FBY0MsV0FBL0I7O0FBRUEsU0FBTyxZQUFJSCxHQUFKLENBQVFJLFNBQVIsQ0FBa0JMLFVBQWxCLEVBQThCSixHQUE5QixDQUFQO0FBQ0QsQ0FWRDs7QUFhTyxJQUFNVSw0QkFBVSxTQUFWQSxPQUFVLENBQUNDLEVBQUQsRUFBS0MsS0FBTDtBQUFBLFNBQWUsbUJBQVNELEVBQVQsRUFBYWQsaUJBQWIsRUFBZ0NlLEtBQWhDLENBQWY7QUFBQSxDQUFoQiIsImZpbGUiOiJhdXhpbGlhcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBzZXQgb2YgYXV4aWxpYXJ5IGZ1bmN0aW9ucyB0aGF0IGRvbid0IGJlbG9uZyB0byBhbnkgZXhpc3RpbmcgY2xhc3MvbW9kdWxlXG5cbmltcG9ydCAqIGFzIGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IENvaW4gZnJvbSAnLi9Db2luJztcbmltcG9ydCB7IGN0eCB9IGZyb20gJy4vY29uZmlnJztcblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ1RvQnl0ZXMocykge1xuICBjb25zdCBiID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgIGIucHVzaChzLmNoYXJDb2RlQXQoaSkpO1xuICB9XG4gIHJldHVybiBiO1xufVxuXG5jb25zdCBnZXRSYW5kb21Db2luSWQgPSAoKSA9PiB7XG4gIGNvbnN0IFJBVyA9IGNyeXB0by5yYW5kb21CeXRlcygxMjgpO1xuXG4gIGNvbnN0IHJuZyA9IG5ldyBjdHguUkFORCgpO1xuICBybmcuY2xlYW4oKTtcbiAgcm5nLnNlZWQoUkFXLmxlbmd0aCwgUkFXKTtcbiAgY29uc3QgZ3JvdXBPcmRlciA9IG5ldyBjdHguQklHKDApO1xuICBncm91cE9yZGVyLnJjb3B5KGN0eC5ST01fQ1VSVkUuQ1VSVkVfT3JkZXIpO1xuXG4gIHJldHVybiBjdHguQklHLnJhbmRvbW51bShncm91cE9yZGVyLCBybmcpO1xufTtcblxuXG5leHBvcnQgY29uc3QgZ2V0Q29pbiA9IChwaywgdmFsdWUpID0+IG5ldyBDb2luKHBrLCBnZXRSYW5kb21Db2luSWQoKSwgdmFsdWUpO1xuIl19