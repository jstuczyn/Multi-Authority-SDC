'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _mocha = require('mocha');

var _chai = require('chai');

var _CoinSig = require('../CoinSig');

var _CoinSig2 = _interopRequireDefault(_CoinSig);

var _BpGroup = require('../BpGroup');

var _BpGroup2 = _interopRequireDefault(_BpGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('CoinSig Scheme', function () {
  (0, _mocha.describe)('Setup', function () {
    var params = _CoinSig2.default.setup();

    var _params = _slicedToArray(params, 5),
        G = _params[0],
        o = _params[1],
        g1 = _params[2],
        g2 = _params[3],
        e = _params[4];

    (0, _mocha.it)('Returns BpGroup Object', function () {
      _chai.assert.isNotNull(G);
      _chai.assert.isTrue(G instanceof _BpGroup2.default);
    });

    (0, _mocha.it)('Returns Group Order', function () {
      _chai.assert.isNotNull(o);
      _chai.assert.isTrue(o instanceof G.ctx.BIG);
    });

    (0, _mocha.it)('Returns Gen1', function () {
      _chai.assert.isNotNull(g1);
      _chai.assert.isTrue(g1 instanceof G.ctx.ECP);
    });

    (0, _mocha.it)('Returns Gen2', function () {
      _chai.assert.isNotNull(g2);
      _chai.assert.isTrue(g2 instanceof G.ctx.ECP2);
    });

    (0, _mocha.it)('Returns Pair function', function () {
      _chai.assert.isNotNull(e);
      _chai.assert.isTrue(e instanceof Function);
    });
  });

  (0, _mocha.describe)('Keygen', function () {
    var params = _CoinSig2.default.setup();

    var _params2 = _slicedToArray(params, 5),
        G = _params2[0],
        o = _params2[1],
        g1 = _params2[2],
        g2 = _params2[3],
        e = _params2[4];

    var _CoinSig$keygen = _CoinSig2.default.keygen(params),
        _CoinSig$keygen2 = _slicedToArray(_CoinSig$keygen, 2),
        sk = _CoinSig$keygen2[0],
        pk = _CoinSig$keygen2[1];

    var _sk = _slicedToArray(sk, 4),
        x1 = _sk[0],
        x2 = _sk[1],
        x3 = _sk[2],
        x4 = _sk[3];

    var _pk = _slicedToArray(pk, 5),
        g = _pk[0],
        X1 = _pk[1],
        X2 = _pk[2],
        X3 = _pk[3],
        X4 = _pk[4];

    (0, _mocha.it)('Returns Secret Key (x1, x2, x3, x4)', function () {
      _chai.assert.isTrue(x1 instanceof G.ctx.BIG);
      _chai.assert.isTrue(x2 instanceof G.ctx.BIG);
      _chai.assert.isTrue(x3 instanceof G.ctx.BIG);
      _chai.assert.isTrue(x4 instanceof G.ctx.BIG);
    });

    (0, _mocha.describe)('Returns Valid Private Key (g, X1, X2, X3, X4)', function () {
      (0, _mocha.it)('g = g2', function () {
        _chai.assert.isTrue(g2.equals(g));
      });

      (0, _mocha.it)('X1 = g2*x1', function () {
        _chai.assert.isTrue(X1.equals(G.ctx.PAIR.G2mul(g2, x1)));
      });

      (0, _mocha.it)('X2 = g2*x2', function () {
        _chai.assert.isTrue(X2.equals(G.ctx.PAIR.G2mul(g2, x2)));
      });

      (0, _mocha.it)('X3 = g2*x3', function () {
        _chai.assert.isTrue(X3.equals(G.ctx.PAIR.G2mul(g2, x3)));
      });

      (0, _mocha.it)('X4 = g2*x4', function () {
        _chai.assert.isTrue(X4.equals(G.ctx.PAIR.G2mul(g2, x4)));
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L0NvaW5TaWcudGVzdC5qcyJdLCJuYW1lcyI6WyJwYXJhbXMiLCJzZXR1cCIsIkciLCJvIiwiZzEiLCJnMiIsImUiLCJpc05vdE51bGwiLCJpc1RydWUiLCJjdHgiLCJCSUciLCJFQ1AiLCJFQ1AyIiwiRnVuY3Rpb24iLCJrZXlnZW4iLCJzayIsInBrIiwieDEiLCJ4MiIsIngzIiwieDQiLCJnIiwiWDEiLCJYMiIsIlgzIiwiWDQiLCJlcXVhbHMiLCJQQUlSIiwiRzJtdWwiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxxQkFBUyxnQkFBVCxFQUEyQixZQUFNO0FBQy9CLHVCQUFTLE9BQVQsRUFBa0IsWUFBTTtBQUN0QixRQUFNQSxTQUFTLGtCQUFRQyxLQUFSLEVBQWY7O0FBRHNCLGlDQUVJRCxNQUZKO0FBQUEsUUFFZkUsQ0FGZTtBQUFBLFFBRVpDLENBRlk7QUFBQSxRQUVUQyxFQUZTO0FBQUEsUUFFTEMsRUFGSztBQUFBLFFBRURDLENBRkM7O0FBSXRCLG1CQUFHLHdCQUFILEVBQTZCLFlBQU07QUFDakMsbUJBQU9DLFNBQVAsQ0FBaUJMLENBQWpCO0FBQ0EsbUJBQU9NLE1BQVAsQ0FBY04sOEJBQWQ7QUFDRCxLQUhEOztBQUtBLG1CQUFHLHFCQUFILEVBQTBCLFlBQU07QUFDOUIsbUJBQU9LLFNBQVAsQ0FBaUJKLENBQWpCO0FBQ0EsbUJBQU9LLE1BQVAsQ0FBY0wsYUFBY0QsRUFBRU8sR0FBRixDQUFNQyxHQUFsQztBQUNELEtBSEQ7O0FBS0EsbUJBQUcsY0FBSCxFQUFtQixZQUFNO0FBQ3ZCLG1CQUFPSCxTQUFQLENBQWlCSCxFQUFqQjtBQUNBLG1CQUFPSSxNQUFQLENBQWNKLGNBQWVGLEVBQUVPLEdBQUYsQ0FBTUUsR0FBbkM7QUFDRCxLQUhEOztBQUtBLG1CQUFHLGNBQUgsRUFBbUIsWUFBTTtBQUN2QixtQkFBT0osU0FBUCxDQUFpQkYsRUFBakI7QUFDQSxtQkFBT0csTUFBUCxDQUFjSCxjQUFlSCxFQUFFTyxHQUFGLENBQU1HLElBQW5DO0FBQ0QsS0FIRDs7QUFLQSxtQkFBRyx1QkFBSCxFQUE0QixZQUFNO0FBQ2hDLG1CQUFPTCxTQUFQLENBQWlCRCxDQUFqQjtBQUNBLG1CQUFPRSxNQUFQLENBQWNGLGFBQWNPLFFBQTVCO0FBQ0QsS0FIRDtBQUlELEdBNUJEOztBQThCQSx1QkFBUyxRQUFULEVBQW1CLFlBQU07QUFDdkIsUUFBTWIsU0FBUyxrQkFBUUMsS0FBUixFQUFmOztBQUR1QixrQ0FFR0QsTUFGSDtBQUFBLFFBRWhCRSxDQUZnQjtBQUFBLFFBRWJDLENBRmE7QUFBQSxRQUVWQyxFQUZVO0FBQUEsUUFFTkMsRUFGTTtBQUFBLFFBRUZDLENBRkU7O0FBQUEsMEJBR04sa0JBQVFRLE1BQVIsQ0FBZWQsTUFBZixDQUhNO0FBQUE7QUFBQSxRQUdoQmUsRUFIZ0I7QUFBQSxRQUdaQyxFQUhZOztBQUFBLDZCQUtFRCxFQUxGO0FBQUEsUUFLaEJFLEVBTGdCO0FBQUEsUUFLWkMsRUFMWTtBQUFBLFFBS1JDLEVBTFE7QUFBQSxRQUtKQyxFQUxJOztBQUFBLDZCQU1LSixFQU5MO0FBQUEsUUFNaEJLLENBTmdCO0FBQUEsUUFNYkMsRUFOYTtBQUFBLFFBTVRDLEVBTlM7QUFBQSxRQU1MQyxFQU5LO0FBQUEsUUFNREMsRUFOQzs7QUFRdkIsbUJBQUcscUNBQUgsRUFBMEMsWUFBTTtBQUM5QyxtQkFBT2pCLE1BQVAsQ0FBY1MsY0FBZWYsRUFBRU8sR0FBRixDQUFNQyxHQUFuQztBQUNBLG1CQUFPRixNQUFQLENBQWNVLGNBQWVoQixFQUFFTyxHQUFGLENBQU1DLEdBQW5DO0FBQ0EsbUJBQU9GLE1BQVAsQ0FBY1csY0FBZWpCLEVBQUVPLEdBQUYsQ0FBTUMsR0FBbkM7QUFDQSxtQkFBT0YsTUFBUCxDQUFjWSxjQUFlbEIsRUFBRU8sR0FBRixDQUFNQyxHQUFuQztBQUNELEtBTEQ7O0FBT0EseUJBQVMsK0NBQVQsRUFBMEQsWUFBTTtBQUM5RCxxQkFBRyxRQUFILEVBQWEsWUFBTTtBQUNqQixxQkFBT0YsTUFBUCxDQUFjSCxHQUFHcUIsTUFBSCxDQUFVTCxDQUFWLENBQWQ7QUFDRCxPQUZEOztBQUlBLHFCQUFHLFlBQUgsRUFBaUIsWUFBTTtBQUNyQixxQkFBT2IsTUFBUCxDQUFjYyxHQUFHSSxNQUFILENBQVV4QixFQUFFTyxHQUFGLENBQU1rQixJQUFOLENBQVdDLEtBQVgsQ0FBaUJ2QixFQUFqQixFQUFxQlksRUFBckIsQ0FBVixDQUFkO0FBQ0QsT0FGRDs7QUFJQSxxQkFBRyxZQUFILEVBQWlCLFlBQU07QUFDckIscUJBQU9ULE1BQVAsQ0FBY2UsR0FBR0csTUFBSCxDQUFVeEIsRUFBRU8sR0FBRixDQUFNa0IsSUFBTixDQUFXQyxLQUFYLENBQWlCdkIsRUFBakIsRUFBcUJhLEVBQXJCLENBQVYsQ0FBZDtBQUNELE9BRkQ7O0FBSUEscUJBQUcsWUFBSCxFQUFpQixZQUFNO0FBQ3JCLHFCQUFPVixNQUFQLENBQWNnQixHQUFHRSxNQUFILENBQVV4QixFQUFFTyxHQUFGLENBQU1rQixJQUFOLENBQVdDLEtBQVgsQ0FBaUJ2QixFQUFqQixFQUFxQmMsRUFBckIsQ0FBVixDQUFkO0FBQ0QsT0FGRDs7QUFJQSxxQkFBRyxZQUFILEVBQWlCLFlBQU07QUFDckIscUJBQU9YLE1BQVAsQ0FBY2lCLEdBQUdDLE1BQUgsQ0FBVXhCLEVBQUVPLEdBQUYsQ0FBTWtCLElBQU4sQ0FBV0MsS0FBWCxDQUFpQnZCLEVBQWpCLEVBQXFCZSxFQUFyQixDQUFWLENBQWQ7QUFDRCxPQUZEO0FBR0QsS0FwQkQ7QUFxQkQsR0FwQ0Q7QUFxQ0QsQ0FwRUQiLCJmaWxlIjoiQ29pblNpZy50ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVzY3JpYmUsIGl0LCB4aXQgfSBmcm9tICdtb2NoYSc7XG5pbXBvcnQgeyBleHBlY3QsIGFzc2VydCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0IENvaW5TaWcgZnJvbSAnLi4vQ29pblNpZyc7XG5pbXBvcnQgQnBHcm91cCBmcm9tICcuLi9CcEdyb3VwJztcblxuZGVzY3JpYmUoJ0NvaW5TaWcgU2NoZW1lJywgKCkgPT4ge1xuICBkZXNjcmliZSgnU2V0dXAnLCAoKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gQ29pblNpZy5zZXR1cCgpO1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuXG4gICAgaXQoJ1JldHVybnMgQnBHcm91cCBPYmplY3QnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKEcpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShHIGluc3RhbmNlb2YgKEJwR3JvdXApKTtcbiAgICB9KTtcblxuICAgIGl0KCdSZXR1cm5zIEdyb3VwIE9yZGVyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzTm90TnVsbChvKTtcbiAgICAgIGFzc2VydC5pc1RydWUobyBpbnN0YW5jZW9mIChHLmN0eC5CSUcpKTtcbiAgICB9KTtcblxuICAgIGl0KCdSZXR1cm5zIEdlbjEnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKGcxKTtcbiAgICAgIGFzc2VydC5pc1RydWUoZzEgaW5zdGFuY2VvZiAoRy5jdHguRUNQKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnUmV0dXJucyBHZW4yJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzTm90TnVsbChnMik7XG4gICAgICBhc3NlcnQuaXNUcnVlKGcyIGluc3RhbmNlb2YgKEcuY3R4LkVDUDIpKTtcbiAgICB9KTtcblxuICAgIGl0KCdSZXR1cm5zIFBhaXIgZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNOb3ROdWxsKGUpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShlIGluc3RhbmNlb2YgKEZ1bmN0aW9uKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdLZXlnZW4nLCAoKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gQ29pblNpZy5zZXR1cCgpO1xuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xuICAgIGNvbnN0IFtzaywgcGtdID0gQ29pblNpZy5rZXlnZW4ocGFyYW1zKTtcblxuICAgIGNvbnN0IFt4MSwgeDIsIHgzLCB4NF0gPSBzaztcbiAgICBjb25zdCBbZywgWDEsIFgyLCBYMywgWDRdID0gcGs7XG5cbiAgICBpdCgnUmV0dXJucyBTZWNyZXQgS2V5ICh4MSwgeDIsIHgzLCB4NCknLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNUcnVlKHgxIGluc3RhbmNlb2YgKEcuY3R4LkJJRykpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZSh4MiBpbnN0YW5jZW9mIChHLmN0eC5CSUcpKTtcbiAgICAgIGFzc2VydC5pc1RydWUoeDMgaW5zdGFuY2VvZiAoRy5jdHguQklHKSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHg0IGluc3RhbmNlb2YgKEcuY3R4LkJJRykpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1JldHVybnMgVmFsaWQgUHJpdmF0ZSBLZXkgKGcsIFgxLCBYMiwgWDMsIFg0KScsICgpID0+IHtcbiAgICAgIGl0KCdnID0gZzInLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc1RydWUoZzIuZXF1YWxzKGcpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnWDEgPSBnMip4MScsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShYMS5lcXVhbHMoRy5jdHguUEFJUi5HMm11bChnMiwgeDEpKSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ1gyID0gZzIqeDInLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc1RydWUoWDIuZXF1YWxzKEcuY3R4LlBBSVIuRzJtdWwoZzIsIHgyKSkpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdYMyA9IGcyKngzJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuaXNUcnVlKFgzLmVxdWFscyhHLmN0eC5QQUlSLkcybXVsKGcyLCB4MykpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnWDQgPSBnMip4NCcsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShYNC5lcXVhbHMoRy5jdHguUEFJUi5HMm11bChnMiwgeDQpKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==