'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _PSSig = require('./PSSig');

var _PSSig2 = _interopRequireDefault(_PSSig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var bodyParser = require('body-parser');


var hostname = '127.0.0.1';
var port = 3000;
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
    sig.toBytes(sig_t);

    console.log("sig:", sig.toString());
    res.json({ signature: sig_t });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiZXhwcmVzcyIsInJlcXVpcmUiLCJib2R5UGFyc2VyIiwiaG9zdG5hbWUiLCJwb3J0IiwiYXBwIiwicm91dGVyIiwiUm91dGVyIiwicGFyYW1zIiwicGsiLCJzayIsInBrX2J5dGVzIiwidXNlIiwicmVxIiwicmVzIiwibmV4dCIsImhlYWRlciIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImpzb24iLCJyb3V0ZSIsInBvc3QiLCJjb25zb2xlIiwibG9nIiwibWVzc2FnZSIsImJvZHkiLCJzaWduIiwiaCIsInNpZyIsInNpZ190IiwidG9CeXRlcyIsInRvU3RyaW5nIiwic2lnbmF0dXJlIiwiZ2V0IiwibGlzdGVuIiwic2V0dXAiLCJHIiwibyIsImcxIiwiZzIiLCJlIiwia2V5Z2VuIiwic2tfZ2VuIiwicGtfZ2VuIiwiZyIsIlgiLCJZIiwiZzJfdCIsIlhfdCIsIllfdCJdLCJtYXBwaW5ncyI6Ijs7OztBQUVBOzs7Ozs7QUFGQSxJQUFNQSxVQUFVQyxRQUFRLFNBQVIsQ0FBaEI7QUFDQSxJQUFNQyxhQUFhRCxRQUFRLGFBQVIsQ0FBbkI7OztBQUdBLElBQU1FLFdBQVcsV0FBakI7QUFDQSxJQUFNQyxPQUFPLElBQWI7QUFDQSxJQUFNQyxNQUFNTCxTQUFaO0FBQ0EsSUFBTU0sU0FBU04sUUFBUU8sTUFBUixFQUFmO0FBQ0EsSUFBSUMsZUFBSjtBQUNBLElBQUlDLFdBQUo7QUFDQSxJQUFJQyxXQUFKO0FBQ0EsSUFBSUMsaUJBQUo7O0FBSUFOLElBQUlPLEdBQUosQ0FBUSxVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWCxFQUFvQjtBQUN4QkQsUUFBSUUsTUFBSixDQUFXLDZCQUFYLEVBQTBDLEdBQTFDO0FBQ0E7QUFDQUYsUUFBSUUsTUFBSixDQUFXLDhCQUFYLEVBQTJDLGdEQUEzQztBQUNBRDtBQUNILENBTEQ7O0FBT0FWLElBQUlPLEdBQUosQ0FBUVYsV0FBV2UsVUFBWCxDQUFzQixFQUFFQyxVQUFVLElBQVosRUFBdEIsQ0FBUjtBQUNBYixJQUFJTyxHQUFKLENBQVFWLFdBQVdpQixJQUFYLEVBQVI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBYixPQUFPYyxLQUFQLENBQWEsT0FBYixFQUNLQyxJQURMLENBQ1UsVUFBQ1IsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDaEJRLFlBQVFDLEdBQVIsQ0FBWSx5QkFBWjtBQUNBLFFBQU1DLFVBQVVYLElBQUlZLElBQUosQ0FBU0QsT0FBekI7QUFDQUYsWUFBUUMsR0FBUixDQUFZLGVBQVosRUFBNkJDLE9BQTdCOztBQUhnQixzQkFLQyxnQkFBTUUsSUFBTixDQUFXbEIsTUFBWCxFQUFtQkUsRUFBbkIsRUFBdUJjLE9BQXZCLENBTEQ7QUFBQTtBQUFBLFFBS1RHLENBTFM7QUFBQSxRQUtOQyxHQUxNOztBQU1oQixRQUFJQyxRQUFRLEVBQVo7QUFDQUQsUUFBSUUsT0FBSixDQUFZRCxLQUFaOztBQUVBUCxZQUFRQyxHQUFSLENBQVksTUFBWixFQUFvQkssSUFBSUcsUUFBSixFQUFwQjtBQUNBakIsUUFBSUssSUFBSixDQUFTLEVBQUVhLFdBQVdILEtBQWIsRUFBVDtBQUNILENBWkw7O0FBY0F2QixPQUFPYyxLQUFQLENBQWEsS0FBYixFQUNLYSxHQURMLENBQ1MsVUFBQ3BCLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ2ZRLFlBQVFDLEdBQVIsQ0FBWSxzQkFBWjtBQUNBVCxRQUFJSyxJQUFKLENBQVM7QUFDTCxtQkFBVztBQUNQLGlCQUFLUixTQUFTLENBQVQsQ0FERTtBQUVQLGlCQUFLQSxTQUFTLENBQVQsQ0FGRTtBQUdQLGlCQUFLQSxTQUFTLENBQVQ7QUFIRTtBQUROLEtBQVQ7QUFPSCxDQVZMOztBQWNBO0FBQ0FOLElBQUlPLEdBQUosQ0FBUSxVQUFSLEVBQW9CTixNQUFwQjs7QUFJQUQsSUFBSTZCLE1BQUosQ0FBVzlCLElBQVgsRUFBaUJELFFBQWpCLEVBQTJCLFlBQU07QUFDN0JLLGFBQVMsZ0JBQU0yQixLQUFOLEVBQVQ7O0FBRDZCLGtCQUVIM0IsTUFGRztBQUFBO0FBQUEsUUFFdEI0QixDQUZzQjtBQUFBLFFBRW5CQyxDQUZtQjtBQUFBLFFBRWhCQyxFQUZnQjtBQUFBLFFBRVpDLEVBRlk7QUFBQSxRQUVSQyxDQUZROztBQUFBLHdCQUlKLGdCQUFNQyxNQUFOLENBQWFqQyxNQUFiLENBSkk7QUFBQTtBQUFBLFFBSXRCa0MsTUFKc0I7QUFBQSxRQUlkQyxNQUpjOztBQUs3QmpDLFNBQUtnQyxNQUFMO0FBQ0FqQyxTQUFLa0MsTUFBTDs7QUFONkIsaUNBT1hBLE1BUFc7QUFBQSxRQU90QkMsQ0FQc0I7QUFBQSxRQU9uQkMsQ0FQbUI7QUFBQSxRQU9oQkMsQ0FQZ0I7O0FBUzdCLFFBQUlDLE9BQU8sRUFBWDtBQUNBLFFBQUlDLE1BQU0sRUFBVjtBQUNBLFFBQUlDLE1BQU0sRUFBVjs7QUFFQUwsTUFBRWQsT0FBRixDQUFVaUIsSUFBVjtBQUNBRixNQUFFZixPQUFGLENBQVVrQixHQUFWO0FBQ0FGLE1BQUVoQixPQUFGLENBQVVtQixHQUFWOztBQUdBdEMsZUFBVyxDQUFDb0MsSUFBRCxFQUFPQyxHQUFQLEVBQVlDLEdBQVosQ0FBWDs7QUFFQTNCLFlBQVFDLEdBQVIsQ0FBWSxJQUFaLEVBQWtCcUIsRUFBRWIsUUFBRixFQUFsQjtBQUNBVCxZQUFRQyxHQUFSLENBQVksR0FBWixFQUFpQnNCLEVBQUVkLFFBQUYsRUFBakI7QUFDQVQsWUFBUUMsR0FBUixDQUFZLEdBQVosRUFBaUJ1QixFQUFFZixRQUFGLEVBQWpCO0FBQ0gsQ0F2QkQ7O0FBMkJBVCxRQUFRQyxHQUFSLGdDQUF5Q3BCLFFBQXpDLFNBQXFEQyxJQUFyRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xyXG5jb25zdCBib2R5UGFyc2VyID0gcmVxdWlyZSgnYm9keS1wYXJzZXInKTtcclxuaW1wb3J0IFBTU2lnIGZyb20gXCIuL1BTU2lnXCI7XHJcblxyXG5jb25zdCBob3N0bmFtZSA9ICcxMjcuMC4wLjEnO1xyXG5jb25zdCBwb3J0ID0gMzAwMDtcclxuY29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5sZXQgcGFyYW1zO1xyXG5sZXQgcGs7XHJcbmxldCBzaztcclxubGV0IHBrX2J5dGVzO1xyXG5cclxuXHJcblxyXG5hcHAudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xyXG4gICAgcmVzLmhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcclxuICAgIC8vIHJlcy5oZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NUJyk7XHJcbiAgICByZXMuaGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiLCBcIk9yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHRcIik7XHJcbiAgICBuZXh0KCk7XHJcbn0pO1xyXG5cclxuYXBwLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSk7XHJcbmFwcC51c2UoYm9keVBhcnNlci5qc29uKCkpO1xyXG5cclxuLy8gYXBwLnVzZShyZXF1aXJlKFwiYm9keS1wYXJzZXJcIikuanNvbigpKTtcclxuXHJcbi8vIG5vIGxvbmdlciB1c2VkOyB3ZSBqdXN0IGdldCBwayBkaXJlY3RseVxyXG4vLyByb3V0ZXIucm91dGUoJy8nKVxyXG4vLyAgICAgLmdldCgocmVxLCByZXMpID0+IHtcclxuLy8gICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBpc0FsaXZlICdHRVQnIHJlcXVlc3RcIik7XHJcbi8vICAgICAgICAgcmVzLmpzb24oe2lzQWxpdmU6IHRydWV9KTtcclxuLy8gICAgIH0pO1xyXG5cclxucm91dGVyLnJvdXRlKCcvc2lnbicpXHJcbiAgICAucG9zdCgocmVxLCByZXMpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBzaWduICdQT1NUJyByZXF1ZXN0XCIpO1xyXG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSByZXEuYm9keS5tZXNzYWdlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiR290IG1lc3NhZ2U6IFwiLCBtZXNzYWdlKTtcclxuXHJcbiAgICAgICAgY29uc3QgW2gsIHNpZ10gPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG1lc3NhZ2UpO1xyXG4gICAgICAgIGxldCBzaWdfdCA9IFtdO1xyXG4gICAgICAgIHNpZy50b0J5dGVzKHNpZ190KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJzaWc6XCIsIHNpZy50b1N0cmluZygpKTtcclxuICAgICAgICByZXMuanNvbih7IHNpZ25hdHVyZTogc2lnX3R9KTtcclxuICAgIH0pO1xyXG5cclxucm91dGVyLnJvdXRlKCcvcGsnKVxyXG4gICAgLmdldCgocmVxLCByZXMpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBQSyAnR0VUJyByZXF1ZXN0XCIpO1xyXG4gICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgXCJtZXNzYWdlXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiZ1wiOiBwa19ieXRlc1swXSxcclxuICAgICAgICAgICAgICAgIFwiWFwiOiBwa19ieXRlc1sxXSxcclxuICAgICAgICAgICAgICAgIFwiWVwiOiBwa19ieXRlc1syXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG4vLyBwcmVmaXggYWxsIHJvdXRlc1xyXG5hcHAudXNlKFwiL3Rlc3RhcGlcIiwgcm91dGVyKTtcclxuXHJcblxyXG5cclxuYXBwLmxpc3Rlbihwb3J0LCBob3N0bmFtZSwgKCkgPT4ge1xyXG4gICAgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgIGNvbnN0IFtza19nZW4sIHBrX2dlbl0gPSBQU1NpZy5rZXlnZW4ocGFyYW1zKTtcclxuICAgIHNrID0gc2tfZ2VuO1xyXG4gICAgcGsgPSBwa19nZW47XHJcbiAgICBjb25zdCBbZywgWCwgWV0gPSBwa19nZW47XHJcblxyXG4gICAgbGV0IGcyX3QgPSBbXTtcclxuICAgIGxldCBYX3QgPSBbXTtcclxuICAgIGxldCBZX3QgPSBbXTtcclxuXHJcbiAgICBnLnRvQnl0ZXMoZzJfdCk7XHJcbiAgICBYLnRvQnl0ZXMoWF90KTtcclxuICAgIFkudG9CeXRlcyhZX3QpO1xyXG5cclxuXHJcbiAgICBwa19ieXRlcyA9IFtnMl90LCBYX3QsIFlfdF07XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJnOlwiLCBnLnRvU3RyaW5nKCkpO1xyXG4gICAgY29uc29sZS5sb2coXCJYXCIsIFgudG9TdHJpbmcoKSk7XHJcbiAgICBjb25zb2xlLmxvZyhcIllcIiwgWS50b1N0cmluZygpKTtcclxufSk7XHJcblxyXG5cclxuXHJcbmNvbnNvbGUubG9nKGBTZXJ2ZXIgU3RhcnRlZCBhdDogaHR0cDovLyR7aG9zdG5hbWV9OiR7cG9ydH0vYCk7XHJcbiJdfQ==