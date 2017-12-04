'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _PSSig = require('./PSSig');

var _PSSig2 = _interopRequireDefault(_PSSig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var bodyParser = require('body-parser');


var hostname = '127.0.0.1';
var port = void 0;

if (process.argv.length < 3) {
    throw "No port number provided";
}

port = parseInt(process.argv[2]);

var app = express();
var router = express.Router();
var params = void 0;
var pk = void 0;
var sk = void 0;
var pk_bytes = void 0;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(require("body-parser").json());

// no longer used; we just get pk directly
// router.route('/')
//     .get((req, res) => {
//         console.log("Got isAlive 'GET' request");
//         res.json({isAlive: true});
//     });

router.route('/sign').post(function (req, res) {
    console.log("Got sign 'POST' request");
    var message = req.body.message;
    console.log("Got message: ", message);

    var _PSSig$sign = _PSSig2.default.sign(params, sk, message),
        _PSSig$sign2 = _slicedToArray(_PSSig$sign, 2),
        h = _PSSig$sign2[0],
        sig = _PSSig$sign2[1];

    var sig_t = [];
    var h_t = [];
    sig.toBytes(sig_t);
    h.toBytes(h_t);

    console.log("sig:", h.toString(), sig.toString());
    res.json({ signature: [h_t, sig_t] });
});

router.route('/pk').get(function (req, res) {
    console.log("Got PK 'GET' request");
    res.json({
        "message": {
            "g": pk_bytes[0],
            "X": pk_bytes[1],
            "Y": pk_bytes[2]
        }
    });
});

// prefix all routes
app.use("/testapi", router);

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

    console.log("g:", g.toString());
    console.log("X", X.toString());
    console.log("Y", Y.toString());
});

console.log('Server Started at: http://' + hostname + ':' + port + '/');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiZXhwcmVzcyIsInJlcXVpcmUiLCJib2R5UGFyc2VyIiwiaG9zdG5hbWUiLCJwb3J0IiwicHJvY2VzcyIsImFyZ3YiLCJsZW5ndGgiLCJwYXJzZUludCIsImFwcCIsInJvdXRlciIsIlJvdXRlciIsInBhcmFtcyIsInBrIiwic2siLCJwa19ieXRlcyIsInVzZSIsInJlcSIsInJlcyIsIm5leHQiLCJoZWFkZXIiLCJ1cmxlbmNvZGVkIiwiZXh0ZW5kZWQiLCJqc29uIiwicm91dGUiLCJwb3N0IiwiY29uc29sZSIsImxvZyIsIm1lc3NhZ2UiLCJib2R5Iiwic2lnbiIsImgiLCJzaWciLCJzaWdfdCIsImhfdCIsInRvQnl0ZXMiLCJ0b1N0cmluZyIsInNpZ25hdHVyZSIsImdldCIsImxpc3RlbiIsInNldHVwIiwiRyIsIm8iLCJnMSIsImcyIiwiZSIsImtleWdlbiIsInNrX2dlbiIsInBrX2dlbiIsImciLCJYIiwiWSIsImcyX3QiLCJYX3QiLCJZX3QiXSwibWFwcGluZ3MiOiI7Ozs7QUFFQTs7Ozs7O0FBRkEsSUFBTUEsVUFBVUMsUUFBUSxTQUFSLENBQWhCO0FBQ0EsSUFBTUMsYUFBYUQsUUFBUSxhQUFSLENBQW5COzs7QUFHQSxJQUFNRSxXQUFXLFdBQWpCO0FBQ0EsSUFBSUMsYUFBSjs7QUFFQSxJQUFJQyxRQUFRQyxJQUFSLENBQWFDLE1BQWIsR0FBc0IsQ0FBMUIsRUFBNkI7QUFDekIsVUFBTSx5QkFBTjtBQUNIOztBQUVESCxPQUFPSSxTQUFTSCxRQUFRQyxJQUFSLENBQWEsQ0FBYixDQUFULENBQVA7O0FBRUEsSUFBTUcsTUFBTVQsU0FBWjtBQUNBLElBQU1VLFNBQVNWLFFBQVFXLE1BQVIsRUFBZjtBQUNBLElBQUlDLGVBQUo7QUFDQSxJQUFJQyxXQUFKO0FBQ0EsSUFBSUMsV0FBSjtBQUNBLElBQUlDLGlCQUFKOztBQU1BTixJQUFJTyxHQUFKLENBQVEsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVgsRUFBb0I7QUFDeEJELFFBQUlFLE1BQUosQ0FBVyw2QkFBWCxFQUEwQyxHQUExQztBQUNBO0FBQ0FGLFFBQUlFLE1BQUosQ0FBVyw4QkFBWCxFQUEyQyxnREFBM0M7QUFDQUQ7QUFDSCxDQUxEOztBQU9BVixJQUFJTyxHQUFKLENBQVFkLFdBQVdtQixVQUFYLENBQXNCLEVBQUVDLFVBQVUsSUFBWixFQUF0QixDQUFSO0FBQ0FiLElBQUlPLEdBQUosQ0FBUWQsV0FBV3FCLElBQVgsRUFBUjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFiLE9BQU9jLEtBQVAsQ0FBYSxPQUFiLEVBQ0tDLElBREwsQ0FDVSxVQUFDUixHQUFELEVBQU1DLEdBQU4sRUFBYztBQUNoQlEsWUFBUUMsR0FBUixDQUFZLHlCQUFaO0FBQ0EsUUFBTUMsVUFBVVgsSUFBSVksSUFBSixDQUFTRCxPQUF6QjtBQUNBRixZQUFRQyxHQUFSLENBQVksZUFBWixFQUE2QkMsT0FBN0I7O0FBSGdCLHNCQUtDLGdCQUFNRSxJQUFOLENBQVdsQixNQUFYLEVBQW1CRSxFQUFuQixFQUF1QmMsT0FBdkIsQ0FMRDtBQUFBO0FBQUEsUUFLVEcsQ0FMUztBQUFBLFFBS05DLEdBTE07O0FBTWhCLFFBQUlDLFFBQVEsRUFBWjtBQUNBLFFBQUlDLE1BQU0sRUFBVjtBQUNBRixRQUFJRyxPQUFKLENBQVlGLEtBQVo7QUFDQUYsTUFBRUksT0FBRixDQUFVRCxHQUFWOztBQUVBUixZQUFRQyxHQUFSLENBQVksTUFBWixFQUFvQkksRUFBRUssUUFBRixFQUFwQixFQUFrQ0osSUFBSUksUUFBSixFQUFsQztBQUNBbEIsUUFBSUssSUFBSixDQUFTLEVBQUVjLFdBQVcsQ0FBQ0gsR0FBRCxFQUFNRCxLQUFOLENBQWIsRUFBVDtBQUNILENBZEw7O0FBZ0JBdkIsT0FBT2MsS0FBUCxDQUFhLEtBQWIsRUFDS2MsR0FETCxDQUNTLFVBQUNyQixHQUFELEVBQU1DLEdBQU4sRUFBYztBQUNmUSxZQUFRQyxHQUFSLENBQVksc0JBQVo7QUFDQVQsUUFBSUssSUFBSixDQUFTO0FBQ0wsbUJBQVc7QUFDUCxpQkFBS1IsU0FBUyxDQUFULENBREU7QUFFUCxpQkFBS0EsU0FBUyxDQUFULENBRkU7QUFHUCxpQkFBS0EsU0FBUyxDQUFUO0FBSEU7QUFETixLQUFUO0FBT0gsQ0FWTDs7QUFjQTtBQUNBTixJQUFJTyxHQUFKLENBQVEsVUFBUixFQUFvQk4sTUFBcEI7O0FBSUFELElBQUk4QixNQUFKLENBQVduQyxJQUFYLEVBQWlCRCxRQUFqQixFQUEyQixZQUFNO0FBQzdCUyxhQUFTLGdCQUFNNEIsS0FBTixFQUFUOztBQUQ2QixrQkFFSDVCLE1BRkc7QUFBQTtBQUFBLFFBRXRCNkIsQ0FGc0I7QUFBQSxRQUVuQkMsQ0FGbUI7QUFBQSxRQUVoQkMsRUFGZ0I7QUFBQSxRQUVaQyxFQUZZO0FBQUEsUUFFUkMsQ0FGUTs7QUFBQSx3QkFJSixnQkFBTUMsTUFBTixDQUFhbEMsTUFBYixDQUpJO0FBQUE7QUFBQSxRQUl0Qm1DLE1BSnNCO0FBQUEsUUFJZEMsTUFKYzs7QUFLN0JsQyxTQUFLaUMsTUFBTDtBQUNBbEMsU0FBS21DLE1BQUw7O0FBTjZCLGlDQU9YQSxNQVBXO0FBQUEsUUFPdEJDLENBUHNCO0FBQUEsUUFPbkJDLENBUG1CO0FBQUEsUUFPaEJDLENBUGdCOztBQVM3QixRQUFJQyxPQUFPLEVBQVg7QUFDQSxRQUFJQyxNQUFNLEVBQVY7QUFDQSxRQUFJQyxNQUFNLEVBQVY7O0FBRUFMLE1BQUVkLE9BQUYsQ0FBVWlCLElBQVY7QUFDQUYsTUFBRWYsT0FBRixDQUFVa0IsR0FBVjtBQUNBRixNQUFFaEIsT0FBRixDQUFVbUIsR0FBVjs7QUFHQXZDLGVBQVcsQ0FBQ3FDLElBQUQsRUFBT0MsR0FBUCxFQUFZQyxHQUFaLENBQVg7O0FBRUE1QixZQUFRQyxHQUFSLENBQVksSUFBWixFQUFrQnNCLEVBQUViLFFBQUYsRUFBbEI7QUFDQVYsWUFBUUMsR0FBUixDQUFZLEdBQVosRUFBaUJ1QixFQUFFZCxRQUFGLEVBQWpCO0FBQ0FWLFlBQVFDLEdBQVIsQ0FBWSxHQUFaLEVBQWlCd0IsRUFBRWYsUUFBRixFQUFqQjtBQUNILENBdkJEOztBQTJCQVYsUUFBUUMsR0FBUixnQ0FBeUN4QixRQUF6QyxTQUFxREMsSUFBckQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcclxuY29uc3QgYm9keVBhcnNlciA9IHJlcXVpcmUoJ2JvZHktcGFyc2VyJyk7XHJcbmltcG9ydCBQU1NpZyBmcm9tIFwiLi9QU1NpZ1wiO1xyXG5cclxuY29uc3QgaG9zdG5hbWUgPSAnMTI3LjAuMC4xJztcclxubGV0IHBvcnQ7XHJcblxyXG5pZiAocHJvY2Vzcy5hcmd2Lmxlbmd0aCA8IDMpIHtcclxuICAgIHRocm93KFwiTm8gcG9ydCBudW1iZXIgcHJvdmlkZWRcIik7XHJcbn1cclxuXHJcbnBvcnQgPSBwYXJzZUludChwcm9jZXNzLmFyZ3ZbMl0pO1xyXG5cclxuY29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5sZXQgcGFyYW1zO1xyXG5sZXQgcGs7XHJcbmxldCBzaztcclxubGV0IHBrX2J5dGVzO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbmFwcC51c2UoKHJlcSwgcmVzLCBuZXh0KSA9PiB7XHJcbiAgICByZXMuaGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCAnKicpO1xyXG4gICAgLy8gcmVzLmhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQsIFBPU1QnKTtcclxuICAgIHJlcy5oZWFkZXIoXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXCIsIFwiT3JpZ2luLCBYLVJlcXVlc3RlZC1XaXRoLCBDb250ZW50LVR5cGUsIEFjY2VwdFwiKTtcclxuICAgIG5leHQoKTtcclxufSk7XHJcblxyXG5hcHAudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiB0cnVlIH0pKTtcclxuYXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSk7XHJcblxyXG4vLyBhcHAudXNlKHJlcXVpcmUoXCJib2R5LXBhcnNlclwiKS5qc29uKCkpO1xyXG5cclxuLy8gbm8gbG9uZ2VyIHVzZWQ7IHdlIGp1c3QgZ2V0IHBrIGRpcmVjdGx5XHJcbi8vIHJvdXRlci5yb3V0ZSgnLycpXHJcbi8vICAgICAuZ2V0KChyZXEsIHJlcykgPT4ge1xyXG4vLyAgICAgICAgIGNvbnNvbGUubG9nKFwiR290IGlzQWxpdmUgJ0dFVCcgcmVxdWVzdFwiKTtcclxuLy8gICAgICAgICByZXMuanNvbih7aXNBbGl2ZTogdHJ1ZX0pO1xyXG4vLyAgICAgfSk7XHJcblxyXG5yb3V0ZXIucm91dGUoJy9zaWduJylcclxuICAgIC5wb3N0KChyZXEsIHJlcykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiR290IHNpZ24gJ1BPU1QnIHJlcXVlc3RcIik7XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHJlcS5ib2R5Lm1lc3NhZ2U7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJHb3QgbWVzc2FnZTogXCIsIG1lc3NhZ2UpO1xyXG5cclxuICAgICAgICBjb25zdCBbaCwgc2lnXSA9IFBTU2lnLnNpZ24ocGFyYW1zLCBzaywgbWVzc2FnZSk7XHJcbiAgICAgICAgbGV0IHNpZ190ID0gW107XHJcbiAgICAgICAgbGV0IGhfdCA9IFtdO1xyXG4gICAgICAgIHNpZy50b0J5dGVzKHNpZ190KTtcclxuICAgICAgICBoLnRvQnl0ZXMoaF90KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJzaWc6XCIsIGgudG9TdHJpbmcoKSwgc2lnLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHJlcy5qc29uKHsgc2lnbmF0dXJlOiBbaF90LCBzaWdfdF19KTtcclxuICAgIH0pO1xyXG5cclxucm91dGVyLnJvdXRlKCcvcGsnKVxyXG4gICAgLmdldCgocmVxLCByZXMpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBQSyAnR0VUJyByZXF1ZXN0XCIpO1xyXG4gICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgXCJtZXNzYWdlXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiZ1wiOiBwa19ieXRlc1swXSxcclxuICAgICAgICAgICAgICAgIFwiWFwiOiBwa19ieXRlc1sxXSxcclxuICAgICAgICAgICAgICAgIFwiWVwiOiBwa19ieXRlc1syXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG4vLyBwcmVmaXggYWxsIHJvdXRlc1xyXG5hcHAudXNlKFwiL3Rlc3RhcGlcIiwgcm91dGVyKTtcclxuXHJcblxyXG5cclxuYXBwLmxpc3Rlbihwb3J0LCBob3N0bmFtZSwgKCkgPT4ge1xyXG4gICAgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgIGNvbnN0IFtza19nZW4sIHBrX2dlbl0gPSBQU1NpZy5rZXlnZW4ocGFyYW1zKTtcclxuICAgIHNrID0gc2tfZ2VuO1xyXG4gICAgcGsgPSBwa19nZW47XHJcbiAgICBjb25zdCBbZywgWCwgWV0gPSBwa19nZW47XHJcblxyXG4gICAgbGV0IGcyX3QgPSBbXTtcclxuICAgIGxldCBYX3QgPSBbXTtcclxuICAgIGxldCBZX3QgPSBbXTtcclxuXHJcbiAgICBnLnRvQnl0ZXMoZzJfdCk7XHJcbiAgICBYLnRvQnl0ZXMoWF90KTtcclxuICAgIFkudG9CeXRlcyhZX3QpO1xyXG5cclxuXHJcbiAgICBwa19ieXRlcyA9IFtnMl90LCBYX3QsIFlfdF07XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJnOlwiLCBnLnRvU3RyaW5nKCkpO1xyXG4gICAgY29uc29sZS5sb2coXCJYXCIsIFgudG9TdHJpbmcoKSk7XHJcbiAgICBjb25zb2xlLmxvZyhcIllcIiwgWS50b1N0cmluZygpKTtcclxufSk7XHJcblxyXG5cclxuXHJcbmNvbnNvbGUubG9nKGBTZXJ2ZXIgU3RhcnRlZCBhdDogaHR0cDovLyR7aG9zdG5hbWV9OiR7cG9ydH0vYCk7XHJcbiJdfQ==