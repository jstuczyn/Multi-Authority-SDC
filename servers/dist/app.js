'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           todo: whole file requires re-write to make it work with 'new' client-side code
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


var _PSSig = require('./PSSig');

var _PSSig2 = _interopRequireDefault(_PSSig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var bodyParser = require('body-parser');

var hostname = '127.0.0.1';

if (process.argv.length < 3) {
  throw new Error('No port number provided');
}

var port = parseInt(process.argv[2], 10);

var app = express();
var router = express.Router();
var params = void 0;
var pk = void 0;
var sk = void 0;
var pk_bytes = void 0;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(require('body-parser').json());

// no longer used; we just get pk directly
// router.route('/')
//     .get((req, res) => {
//         console.log("Got isAlive 'GET' request");
//         res.json({isAlive: true});
//     });

router.route('/sign').post(function (req, res) {
  console.log("Got sign 'POST' request");
  var message = req.body.message;
  console.log('Got message: ', message);

  var _PSSig$sign = _PSSig2.default.sign(params, sk, message),
      _PSSig$sign2 = _slicedToArray(_PSSig$sign, 2),
      h = _PSSig$sign2[0],
      sig = _PSSig$sign2[1];

  var sig_t = [];
  var h_t = [];
  sig.toBytes(sig_t);
  h.toBytes(h_t);

  console.log('sig:', h.toString(), sig.toString());
  res.json({ signature: [h_t, sig_t] });
});

router.route('/pk').get(function (req, res) {
  console.log("Got PK 'GET' request");
  res.json({
    message: {
      g: pk_bytes[0],
      X: pk_bytes[1],
      Y: pk_bytes[2]
    }
  });
});

// prefix all routes
app.use('/testapi', router);

app.listen(port, hostname, function () {
  params = _PSSig2.default.setup();

  var _params = params,
      _params2 = _slicedToArray(_params, 5),
      G = _params2[0],
      o = _params2[1],
      g1 = _params2[2],
      g2 = _params2[3],
      e = _params2[4];

  var _PSSig$keygen = _PSSig2.default.keygen(params),
      _PSSig$keygen2 = _slicedToArray(_PSSig$keygen, 2),
      sk_gen = _PSSig$keygen2[0],
      pk_gen = _PSSig$keygen2[1];

  sk = sk_gen;
  pk = pk_gen;

  var _pk_gen = _slicedToArray(pk_gen, 3),
      g = _pk_gen[0],
      X = _pk_gen[1],
      Y = _pk_gen[2];

  var g2_t = [];
  var X_t = [];
  var Y_t = [];

  g.toBytes(g2_t);
  X.toBytes(X_t);
  Y.toBytes(Y_t);

  pk_bytes = [g2_t, X_t, Y_t];

  console.log('g:', g.toString());
  console.log('X', X.toString());
  console.log('Y', Y.toString());
});

console.log('Server Started at: http://' + hostname + ':' + port + '/');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiZXhwcmVzcyIsInJlcXVpcmUiLCJib2R5UGFyc2VyIiwiaG9zdG5hbWUiLCJwcm9jZXNzIiwiYXJndiIsImxlbmd0aCIsIkVycm9yIiwicG9ydCIsInBhcnNlSW50IiwiYXBwIiwicm91dGVyIiwiUm91dGVyIiwicGFyYW1zIiwicGsiLCJzayIsInBrX2J5dGVzIiwidXNlIiwicmVxIiwicmVzIiwibmV4dCIsImhlYWRlciIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImpzb24iLCJyb3V0ZSIsInBvc3QiLCJjb25zb2xlIiwibG9nIiwibWVzc2FnZSIsImJvZHkiLCJzaWduIiwiaCIsInNpZyIsInNpZ190IiwiaF90IiwidG9CeXRlcyIsInRvU3RyaW5nIiwic2lnbmF0dXJlIiwiZ2V0IiwiZyIsIlgiLCJZIiwibGlzdGVuIiwic2V0dXAiLCJHIiwibyIsImcxIiwiZzIiLCJlIiwia2V5Z2VuIiwic2tfZ2VuIiwicGtfZ2VuIiwiZzJfdCIsIlhfdCIsIllfdCJdLCJtYXBwaW5ncyI6Ijs7eXBCQUFBOzs7OztBQUdBOzs7Ozs7QUFFQSxJQUFNQSxVQUFVQyxRQUFRLFNBQVIsQ0FBaEI7QUFDQSxJQUFNQyxhQUFhRCxRQUFRLGFBQVIsQ0FBbkI7O0FBRUEsSUFBTUUsV0FBVyxXQUFqQjs7QUFFQSxJQUFJQyxRQUFRQyxJQUFSLENBQWFDLE1BQWIsR0FBc0IsQ0FBMUIsRUFBNkI7QUFDM0IsUUFBTSxJQUFJQyxLQUFKLENBQVUseUJBQVYsQ0FBTjtBQUNEOztBQUVELElBQU1DLE9BQU9DLFNBQVNMLFFBQVFDLElBQVIsQ0FBYSxDQUFiLENBQVQsRUFBMEIsRUFBMUIsQ0FBYjs7QUFFQSxJQUFNSyxNQUFNVixTQUFaO0FBQ0EsSUFBTVcsU0FBU1gsUUFBUVksTUFBUixFQUFmO0FBQ0EsSUFBSUMsZUFBSjtBQUNBLElBQUlDLFdBQUo7QUFDQSxJQUFJQyxXQUFKO0FBQ0EsSUFBSUMsaUJBQUo7O0FBR0FOLElBQUlP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WixFQUFpQmEsRUFBRUosUUFBRixFQUFqQjtBQUNBVixVQUFRQyxHQUFSLENBQVksR0FBWixFQUFpQmMsRUFBRUwsUUFBRixFQUFqQjtBQUNELENBdkJEOztBQTBCQVYsUUFBUUMsR0FBUixnQ0FBeUN6QixRQUF6QyxTQUFxREssSUFBckQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAgdG9kbzogd2hvbGUgZmlsZSByZXF1aXJlcyByZS13cml0ZSB0byBtYWtlIGl0IHdvcmsgd2l0aCAnbmV3JyBjbGllbnQtc2lkZSBjb2RlXG4gKi9cbmltcG9ydCBQU1NpZyBmcm9tICcuL1BTU2lnJztcblxuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbmNvbnN0IGJvZHlQYXJzZXIgPSByZXF1aXJlKCdib2R5LXBhcnNlcicpO1xuXG5jb25zdCBob3N0bmFtZSA9ICcxMjcuMC4wLjEnO1xuXG5pZiAocHJvY2Vzcy5hcmd2Lmxlbmd0aCA8IDMpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdObyBwb3J0IG51bWJlciBwcm92aWRlZCcpO1xufVxuXG5jb25zdCBwb3J0ID0gcGFyc2VJbnQocHJvY2Vzcy5hcmd2WzJdLCAxMCk7XG5cbmNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcbmNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5sZXQgcGFyYW1zO1xubGV0IHBrO1xubGV0IHNrO1xubGV0IHBrX2J5dGVzO1xuXG5cbmFwcC51c2UoKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIHJlcy5oZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gIC8vIHJlcy5oZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NUJyk7XG4gIHJlcy5oZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnT3JpZ2luLCBYLVJlcXVlc3RlZC1XaXRoLCBDb250ZW50LVR5cGUsIEFjY2VwdCcpO1xuICBuZXh0KCk7XG59KTtcblxuYXBwLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSk7XG5hcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKTtcblxuLy8gYXBwLnVzZShyZXF1aXJlKCdib2R5LXBhcnNlcicpLmpzb24oKSk7XG5cbi8vIG5vIGxvbmdlciB1c2VkOyB3ZSBqdXN0IGdldCBwayBkaXJlY3RseVxuLy8gcm91dGVyLnJvdXRlKCcvJylcbi8vICAgICAuZ2V0KChyZXEsIHJlcykgPT4ge1xuLy8gICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBpc0FsaXZlICdHRVQnIHJlcXVlc3RcIik7XG4vLyAgICAgICAgIHJlcy5qc29uKHtpc0FsaXZlOiB0cnVlfSk7XG4vLyAgICAgfSk7XG5cbnJvdXRlci5yb3V0ZSgnL3NpZ24nKVxuICAucG9zdCgocmVxLCByZXMpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkdvdCBzaWduICdQT1NUJyByZXF1ZXN0XCIpO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSByZXEuYm9keS5tZXNzYWdlO1xuICAgIGNvbnNvbGUubG9nKCdHb3QgbWVzc2FnZTogJywgbWVzc2FnZSk7XG5cbiAgICBjb25zdCBbaCwgc2lnXSA9IFBTU2lnLnNpZ24ocGFyYW1zLCBzaywgbWVzc2FnZSk7XG4gICAgY29uc3Qgc2lnX3QgPSBbXTtcbiAgICBjb25zdCBoX3QgPSBbXTtcbiAgICBzaWcudG9CeXRlcyhzaWdfdCk7XG4gICAgaC50b0J5dGVzKGhfdCk7XG5cbiAgICBjb25zb2xlLmxvZygnc2lnOicsIGgudG9TdHJpbmcoKSwgc2lnLnRvU3RyaW5nKCkpO1xuICAgIHJlcy5qc29uKHsgc2lnbmF0dXJlOiBbaF90LCBzaWdfdF0gfSk7XG4gIH0pO1xuXG5yb3V0ZXIucm91dGUoJy9waycpXG4gIC5nZXQoKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJHb3QgUEsgJ0dFVCcgcmVxdWVzdFwiKTtcbiAgICByZXMuanNvbih7XG4gICAgICBtZXNzYWdlOiB7XG4gICAgICAgIGc6IHBrX2J5dGVzWzBdLFxuICAgICAgICBYOiBwa19ieXRlc1sxXSxcbiAgICAgICAgWTogcGtfYnl0ZXNbMl0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuXG4vLyBwcmVmaXggYWxsIHJvdXRlc1xuYXBwLnVzZSgnL3Rlc3RhcGknLCByb3V0ZXIpO1xuXG5cbmFwcC5saXN0ZW4ocG9ydCwgaG9zdG5hbWUsICgpID0+IHtcbiAgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcbiAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XG5cbiAgY29uc3QgW3NrX2dlbiwgcGtfZ2VuXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xuICBzayA9IHNrX2dlbjtcbiAgcGsgPSBwa19nZW47XG4gIGNvbnN0IFtnLCBYLCBZXSA9IHBrX2dlbjtcblxuICBjb25zdCBnMl90ID0gW107XG4gIGNvbnN0IFhfdCA9IFtdO1xuICBjb25zdCBZX3QgPSBbXTtcblxuICBnLnRvQnl0ZXMoZzJfdCk7XG4gIFgudG9CeXRlcyhYX3QpO1xuICBZLnRvQnl0ZXMoWV90KTtcblxuXG4gIHBrX2J5dGVzID0gW2cyX3QsIFhfdCwgWV90XTtcblxuICBjb25zb2xlLmxvZygnZzonLCBnLnRvU3RyaW5nKCkpO1xuICBjb25zb2xlLmxvZygnWCcsIFgudG9TdHJpbmcoKSk7XG4gIGNvbnNvbGUubG9nKCdZJywgWS50b1N0cmluZygpKTtcbn0pO1xuXG5cbmNvbnNvbGUubG9nKGBTZXJ2ZXIgU3RhcnRlZCBhdDogaHR0cDovLyR7aG9zdG5hbWV9OiR7cG9ydH0vYCk7XG4iXX0=