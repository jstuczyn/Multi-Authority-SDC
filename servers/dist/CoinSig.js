'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // A slightly modified Pointcheval-Sanders Short Randomizable Signatures scheme
// to allow for larger number of signed messages

var _BpGroup = require('./BpGroup');

var _BpGroup2 = _interopRequireDefault(_BpGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CoinSig = function () {
  function CoinSig() {
    _classCallCheck(this, CoinSig);
  }

  _createClass(CoinSig, null, [{
    key: 'setup',
    value: function setup() {
      return;
    }
  }, {
    key: 'keygen',
    value: function keygen(params) {
      return;
    }
  }, {
    key: 'sign',
    value: function sign(params, sk, coin) {
      return;
    }
  }, {
    key: 'verify',
    value: function verify(params, pk, coin, sig) {
      return;
    }
  }, {
    key: 'randomize',
    value: function randomize(params, sig) {
      return;
    }
  }, {
    key: 'aggregateSignatures',
    value: function aggregateSignatures(params, signatures) {
      return;
    }
  }, {
    key: 'verifyAggregation',
    value: function verifyAggregation(params, pks, coin, aggregateSignature) {
      return;
    }
  }]);

  return CoinSig;
}();

exports.default = CoinSig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db2luU2lnLmpzIl0sIm5hbWVzIjpbIkNvaW5TaWciLCJwYXJhbXMiLCJzayIsImNvaW4iLCJwayIsInNpZyIsInNpZ25hdHVyZXMiLCJwa3MiLCJhZ2dyZWdhdGVTaWduYXR1cmUiXSwibWFwcGluZ3MiOiI7Ozs7OztxakJBQUE7QUFDQTs7QUFFQTs7Ozs7Ozs7SUFFcUJBLE87Ozs7Ozs7NEJBQ0o7QUFDYjtBQUNEOzs7MkJBRWFDLE0sRUFBUTtBQUNwQjtBQUNEOzs7eUJBRVdBLE0sRUFBUUMsRSxFQUFJQyxJLEVBQU07QUFDNUI7QUFDRDs7OzJCQUVhRixNLEVBQVFHLEUsRUFBSUQsSSxFQUFNRSxHLEVBQUs7QUFDbkM7QUFDRDs7OzhCQUVnQkosTSxFQUFRSSxHLEVBQUs7QUFDNUI7QUFDRDs7O3dDQUUwQkosTSxFQUFRSyxVLEVBQVk7QUFDN0M7QUFDRDs7O3NDQUV3QkwsTSxFQUFRTSxHLEVBQUtKLEksRUFBTUssa0IsRUFBb0I7QUFDOUQ7QUFDRDs7Ozs7O2tCQTNCa0JSLE8iLCJmaWxlIjoiQ29pblNpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEEgc2xpZ2h0bHkgbW9kaWZpZWQgUG9pbnRjaGV2YWwtU2FuZGVycyBTaG9ydCBSYW5kb21pemFibGUgU2lnbmF0dXJlcyBzY2hlbWVcbi8vIHRvIGFsbG93IGZvciBsYXJnZXIgbnVtYmVyIG9mIHNpZ25lZCBtZXNzYWdlc1xuXG5pbXBvcnQgQnBHcm91cCBmcm9tICcuL0JwR3JvdXAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2luU2lnIHtcbiAgc3RhdGljIHNldHVwKCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN0YXRpYyBrZXlnZW4ocGFyYW1zKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGljIHNpZ24ocGFyYW1zLCBzaywgY29pbikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN0YXRpYyB2ZXJpZnkocGFyYW1zLCBwaywgY29pbiwgc2lnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGljIHJhbmRvbWl6ZShwYXJhbXMsIHNpZykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN0YXRpYyBhZ2dyZWdhdGVTaWduYXR1cmVzKHBhcmFtcywgc2lnbmF0dXJlcykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN0YXRpYyB2ZXJpZnlBZ2dyZWdhdGlvbihwYXJhbXMsIHBrcywgY29pbiwgYWdncmVnYXRlU2lnbmF0dXJlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG4iXX0=