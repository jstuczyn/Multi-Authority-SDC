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

    res.json({ signature: sig });
});

router.route('/pk').get(function (req, res) {
    console.log("Got PK 'GET' request");
    console.log(pk_bytes);
    // res.json({message: pk_string});
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

    // it is mutating object so copy is required


    var g2_t = [];
    var X_t = [];
    var Y_t = [];

    g.toBytes(g2_t);
    X.toBytes(X_t);
    Y.toBytes(Y_t);

    console.log(g2_t);

    pk_bytes = [g2_t, X_t, Y_t];
});

console.log('Server Started at: http://' + hostname + ':' + port + '/');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiZXhwcmVzcyIsInJlcXVpcmUiLCJib2R5UGFyc2VyIiwiaG9zdG5hbWUiLCJwb3J0IiwiYXBwIiwicm91dGVyIiwiUm91dGVyIiwicGFyYW1zIiwicGsiLCJzayIsInBrX2J5dGVzIiwidXNlIiwicmVxIiwicmVzIiwibmV4dCIsImhlYWRlciIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImpzb24iLCJyb3V0ZSIsInBvc3QiLCJjb25zb2xlIiwibG9nIiwibWVzc2FnZSIsImJvZHkiLCJzaWduIiwiaCIsInNpZyIsInNpZ25hdHVyZSIsImdldCIsImxpc3RlbiIsInNldHVwIiwiRyIsIm8iLCJnMSIsImcyIiwiZSIsImtleWdlbiIsInNrX2dlbiIsInBrX2dlbiIsImciLCJYIiwiWSIsImcyX3QiLCJYX3QiLCJZX3QiLCJ0b0J5dGVzIl0sIm1hcHBpbmdzIjoiOzs7O0FBRUE7Ozs7OztBQUZBLElBQU1BLFVBQVVDLFFBQVEsU0FBUixDQUFoQjtBQUNBLElBQU1DLGFBQWFELFFBQVEsYUFBUixDQUFuQjs7O0FBR0EsSUFBTUUsV0FBVyxXQUFqQjtBQUNBLElBQU1DLE9BQU8sSUFBYjtBQUNBLElBQU1DLE1BQU1MLFNBQVo7QUFDQSxJQUFNTSxTQUFTTixRQUFRTyxNQUFSLEVBQWY7QUFDQSxJQUFJQyxlQUFKO0FBQ0EsSUFBSUMsV0FBSjtBQUNBLElBQUlDLFdBQUo7QUFDQSxJQUFJQyxpQkFBSjs7QUFJQU4sSUFBSU8sR0FBSixDQUFRLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQ3hCRCxRQUFJRSxNQUFKLENBQVcsNkJBQVgsRUFBMEMsR0FBMUM7QUFDQTtBQUNBRixRQUFJRSxNQUFKLENBQVcsOEJBQVgsRUFBMkMsZ0RBQTNDO0FBQ0FEO0FBQ0gsQ0FMRDs7QUFPQVYsSUFBSU8sR0FBSixDQUFRVixXQUFXZSxVQUFYLENBQXNCLEVBQUVDLFVBQVUsSUFBWixFQUF0QixDQUFSO0FBQ0FiLElBQUlPLEdBQUosQ0FBUVYsV0FBV2lCLElBQVgsRUFBUjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFiLE9BQU9jLEtBQVAsQ0FBYSxPQUFiLEVBQ0tDLElBREwsQ0FDVSxVQUFDUixHQUFELEVBQU1DLEdBQU4sRUFBYztBQUNoQlEsWUFBUUMsR0FBUixDQUFZLHlCQUFaO0FBQ0EsUUFBTUMsVUFBVVgsSUFBSVksSUFBSixDQUFTRCxPQUF6QjtBQUNBRixZQUFRQyxHQUFSLENBQVksZUFBWixFQUE2QkMsT0FBN0I7O0FBSGdCLHNCQUtDLGdCQUFNRSxJQUFOLENBQVdsQixNQUFYLEVBQW1CRSxFQUFuQixFQUF1QmMsT0FBdkIsQ0FMRDtBQUFBO0FBQUEsUUFLVEcsQ0FMUztBQUFBLFFBS05DLEdBTE07O0FBTWhCZCxRQUFJSyxJQUFKLENBQVMsRUFBRVUsV0FBV0QsR0FBYixFQUFUO0FBQ0gsQ0FSTDs7QUFVQXRCLE9BQU9jLEtBQVAsQ0FBYSxLQUFiLEVBQ0tVLEdBREwsQ0FDUyxVQUFDakIsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDZlEsWUFBUUMsR0FBUixDQUFZLHNCQUFaO0FBQ0FELFlBQVFDLEdBQVIsQ0FBWVosUUFBWjtBQUNBO0FBQ0gsQ0FMTDs7QUFTQTtBQUNBTixJQUFJTyxHQUFKLENBQVEsVUFBUixFQUFvQk4sTUFBcEI7O0FBSUFELElBQUkwQixNQUFKLENBQVczQixJQUFYLEVBQWlCRCxRQUFqQixFQUEyQixZQUFNO0FBQzdCSyxhQUFTLGdCQUFNd0IsS0FBTixFQUFUOztBQUQ2QixrQkFFSHhCLE1BRkc7QUFBQTtBQUFBLFFBRXRCeUIsQ0FGc0I7QUFBQSxRQUVuQkMsQ0FGbUI7QUFBQSxRQUVoQkMsRUFGZ0I7QUFBQSxRQUVaQyxFQUZZO0FBQUEsUUFFUkMsQ0FGUTs7QUFBQSx3QkFJSixnQkFBTUMsTUFBTixDQUFhOUIsTUFBYixDQUpJO0FBQUE7QUFBQSxRQUl0QitCLE1BSnNCO0FBQUEsUUFJZEMsTUFKYzs7QUFLN0I5QixTQUFLNkIsTUFBTDtBQUNBOUIsU0FBSytCLE1BQUw7O0FBTjZCLGlDQU9YQSxNQVBXO0FBQUEsUUFPdEJDLENBUHNCO0FBQUEsUUFPbkJDLENBUG1CO0FBQUEsUUFPaEJDLENBUGdCOztBQVM3Qjs7O0FBQ0EsUUFBSUMsT0FBTyxFQUFYO0FBQ0EsUUFBSUMsTUFBTSxFQUFWO0FBQ0EsUUFBSUMsTUFBTSxFQUFWOztBQUVBTCxNQUFFTSxPQUFGLENBQVVILElBQVY7QUFDQUYsTUFBRUssT0FBRixDQUFVRixHQUFWO0FBQ0FGLE1BQUVJLE9BQUYsQ0FBVUQsR0FBVjs7QUFFQXhCLFlBQVFDLEdBQVIsQ0FBWXFCLElBQVo7O0FBRUFqQyxlQUFXLENBQUNpQyxJQUFELEVBQU9DLEdBQVAsRUFBWUMsR0FBWixDQUFYO0FBQ0gsQ0FyQkQ7O0FBeUJBeEIsUUFBUUMsR0FBUixnQ0FBeUNwQixRQUF6QyxTQUFxREMsSUFBckQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcclxuY29uc3QgYm9keVBhcnNlciA9IHJlcXVpcmUoJ2JvZHktcGFyc2VyJyk7XHJcbmltcG9ydCBQU1NpZyBmcm9tIFwiLi9QU1NpZ1wiO1xyXG5cclxuY29uc3QgaG9zdG5hbWUgPSAnMTI3LjAuMC4xJztcclxuY29uc3QgcG9ydCA9IDMwMDA7XHJcbmNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcclxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxubGV0IHBhcmFtcztcclxubGV0IHBrO1xyXG5sZXQgc2s7XHJcbmxldCBwa19ieXRlcztcclxuXHJcblxyXG5cclxuYXBwLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcclxuICAgIHJlcy5oZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XHJcbiAgICAvLyByZXMuaGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJywgJ0dFVCwgUE9TVCcpO1xyXG4gICAgcmVzLmhlYWRlcihcIkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcIiwgXCJPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0XCIpO1xyXG4gICAgbmV4dCgpO1xyXG59KTtcclxuXHJcbmFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IHRydWUgfSkpO1xyXG5hcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKTtcclxuXHJcbi8vIGFwcC51c2UocmVxdWlyZShcImJvZHktcGFyc2VyXCIpLmpzb24oKSk7XHJcblxyXG4vLyBubyBsb25nZXIgdXNlZDsgd2UganVzdCBnZXQgcGsgZGlyZWN0bHlcclxuLy8gcm91dGVyLnJvdXRlKCcvJylcclxuLy8gICAgIC5nZXQoKHJlcSwgcmVzKSA9PiB7XHJcbi8vICAgICAgICAgY29uc29sZS5sb2coXCJHb3QgaXNBbGl2ZSAnR0VUJyByZXF1ZXN0XCIpO1xyXG4vLyAgICAgICAgIHJlcy5qc29uKHtpc0FsaXZlOiB0cnVlfSk7XHJcbi8vICAgICB9KTtcclxuXHJcbnJvdXRlci5yb3V0ZSgnL3NpZ24nKVxyXG4gICAgLnBvc3QoKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJHb3Qgc2lnbiAnUE9TVCcgcmVxdWVzdFwiKTtcclxuICAgICAgICBjb25zdCBtZXNzYWdlID0gcmVxLmJvZHkubWVzc2FnZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBtZXNzYWdlOiBcIiwgbWVzc2FnZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IFtoLCBzaWddID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtZXNzYWdlKTtcclxuICAgICAgICByZXMuanNvbih7IHNpZ25hdHVyZTogc2lnfSk7XHJcbiAgICB9KTtcclxuXHJcbnJvdXRlci5yb3V0ZSgnL3BrJylcclxuICAgIC5nZXQoKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJHb3QgUEsgJ0dFVCcgcmVxdWVzdFwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhwa19ieXRlcylcclxuICAgICAgICAvLyByZXMuanNvbih7bWVzc2FnZTogcGtfc3RyaW5nfSk7XHJcbiAgICB9KTtcclxuXHJcblxyXG5cclxuLy8gcHJlZml4IGFsbCByb3V0ZXNcclxuYXBwLnVzZShcIi90ZXN0YXBpXCIsIHJvdXRlcik7XHJcblxyXG5cclxuXHJcbmFwcC5saXN0ZW4ocG9ydCwgaG9zdG5hbWUsICgpID0+IHtcclxuICAgIHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XHJcbiAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuXHJcbiAgICBjb25zdCBbc2tfZ2VuLCBwa19nZW5dID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICBzayA9IHNrX2dlbjtcclxuICAgIHBrID0gcGtfZ2VuO1xyXG4gICAgY29uc3QgW2csIFgsIFldID0gcGtfZ2VuO1xyXG5cclxuICAgIC8vIGl0IGlzIG11dGF0aW5nIG9iamVjdCBzbyBjb3B5IGlzIHJlcXVpcmVkXHJcbiAgICBsZXQgZzJfdCA9IFtdO1xyXG4gICAgbGV0IFhfdCA9IFtdO1xyXG4gICAgbGV0IFlfdCA9IFtdO1xyXG5cclxuICAgIGcudG9CeXRlcyhnMl90KTtcclxuICAgIFgudG9CeXRlcyhYX3QpO1xyXG4gICAgWS50b0J5dGVzKFlfdCk7XHJcblxyXG4gICAgY29uc29sZS5sb2coZzJfdClcclxuXHJcbiAgICBwa19ieXRlcyA9IFtnMl90LCBYX3QsIFlfdF07XHJcbn0pO1xyXG5cclxuXHJcblxyXG5jb25zb2xlLmxvZyhgU2VydmVyIFN0YXJ0ZWQgYXQ6IGh0dHA6Ly8ke2hvc3RuYW1lfToke3BvcnR9L2ApO1xyXG4iXX0=