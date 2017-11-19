"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BpGroup = require("./BpGroup");

var _BpGroup2 = _interopRequireDefault(_BpGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PSSig = function () {
    function PSSig() {
        _classCallCheck(this, PSSig);
    }

    _createClass(PSSig, null, [{
        key: "setup",
        value: function setup() {
            var G = new _BpGroup2.default();

            var g1 = G.gen1;
            var g2 = G.gen2;
            var e = G.pair;
            var o = G.order;

            return [G, o, g1, g2, e];
        }
    }, {
        key: "keygen",
        value: function keygen(params) {
            var _params = _slicedToArray(params, 5),
                G = _params[0],
                o = _params[1],
                g1 = _params[2],
                g2 = _params[3],
                e = _params[4];

            // Target values:


            var x = G.ctx.BIG.randomnum(G.order, G.rngGen);
            var y = G.ctx.BIG.randomnum(G.order, G.rngGen);

            var sk = [x, y];
            var pk = [g2, G.ctx.PAIR.G2mul(g2, x), G.ctx.PAIR.G2mul(g2, y)];

            return [sk, pk];
        }

        // sig = (x+y*m) * h

    }, {
        key: "sign",
        value: function sign(params, sk, m) {
            var isMessageHashed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var _params2 = _slicedToArray(params, 5),
                G = _params2[0],
                o = _params2[1],
                g1 = _params2[2],
                g2 = _params2[3],
                e = _params2[4];

            var _sk = _slicedToArray(sk, 2),
                x = _sk[0],
                y = _sk[1];

            if (!isMessageHashed) {
                m = PSSig.hashMessage(G, m);
            }

            var rand = G.ctx.BIG.randomnum(o, G.rngGen);
            var h = G.ctx.PAIR.G1mul(g1, rand);

            // mcpy = m mod p
            var mcpy = new G.ctx.BIG(m);
            mcpy.mod(o);

            // t1 = y * (m mod p)
            var t1 = G.ctx.BIG.mul(y, mcpy);

            // DBIG constructor does not allow to pass it a BIG value hence we copy all word values manually
            var xDBIG = new G.ctx.DBIG(0);
            for (var i = 0; i < G.ctx.BIG.NLEN; i++) {
                xDBIG.w[i] = x.w[i];
            }

            // t1 = x + y * (m mod p)
            t1.add(xDBIG);

            // K = (x + y * (m mod p)) mod p
            var K = t1.mod(o);

            // sig = K * h
            var sig = G.ctx.PAIR.G1mul(h, K);

            return [h, sig];
        }

        // static aggregate
        //

        //  e(sig1, X + m * Y) == e(sig2, g)

    }, {
        key: "verify",
        value: function verify(params, pk, m, sig) {
            var isMessageHashed = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

            var _params3 = _slicedToArray(params, 5),
                G = _params3[0],
                o = _params3[1],
                g1 = _params3[2],
                g2 = _params3[3],
                e = _params3[4];

            var _pk = _slicedToArray(pk, 3),
                g = _pk[0],
                X = _pk[1],
                Y = _pk[2];

            var _sig = _slicedToArray(sig, 2),
                sig1 = _sig[0],
                sig2 = _sig[1];

            if (!isMessageHashed) {
                m = PSSig.hashMessage(G, m);
            }

            var G2_tmp1 = G.ctx.PAIR.G2mul(Y, m);
            G2_tmp1.add(X);
            G2_tmp1.affine();

            var Gt_1 = e(sig1, G2_tmp1);
            var Gt_2 = e(sig2, g);

            return !sig.INF && Gt_1.equals(Gt_2);
        }
    }, {
        key: "randomize",
        value: function randomize(params, sig) {
            var _params4 = _slicedToArray(params, 5),
                G = _params4[0],
                o = _params4[1],
                g1 = _params4[2],
                g2 = _params4[3],
                e = _params4[4];

            var _sig2 = _slicedToArray(sig, 2),
                sig1 = _sig2[0],
                sig2 = _sig2[1];

            var t = G.ctx.BIG.randomnum(G.order, G.rngGen);

            return [G.ctx.PAIR.G1mul(sig1, t), G.ctx.PAIR.G1mul(sig2, t)];
        }
    }, {
        key: "hashMessage",
        value: function hashMessage(G, m) {
            var messageBytes = PSSig.stringToBytes(m);
            var H = new G.ctx.HASH256(); // proof of concept only because it will be replaced by hashing to point on curve; make hash context attribute of class
            H.process_array(messageBytes);
            var R = H.hash();
            var hashedMessage = G.ctx.BIG.fromBytes(R);
            return hashedMessage;
        }
    }, {
        key: "stringToBytes",
        value: function stringToBytes(s) {
            var b = [];
            for (var i = 0; i < s.length; i++) {
                b.push(s.charCodeAt(i));
            }return b;
        }
    }]);

    return PSSig;
}();

exports.default = PSSig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QU1NpZy5qcyJdLCJuYW1lcyI6WyJQU1NpZyIsIkciLCJnMSIsImdlbjEiLCJnMiIsImdlbjIiLCJlIiwicGFpciIsIm8iLCJvcmRlciIsInBhcmFtcyIsIngiLCJjdHgiLCJCSUciLCJyYW5kb21udW0iLCJybmdHZW4iLCJ5Iiwic2siLCJwayIsIlBBSVIiLCJHMm11bCIsIm0iLCJpc01lc3NhZ2VIYXNoZWQiLCJoYXNoTWVzc2FnZSIsInJhbmQiLCJoIiwiRzFtdWwiLCJtY3B5IiwibW9kIiwidDEiLCJtdWwiLCJ4REJJRyIsIkRCSUciLCJpIiwiTkxFTiIsInciLCJhZGQiLCJLIiwic2lnIiwiZyIsIlgiLCJZIiwic2lnMSIsInNpZzIiLCJHMl90bXAxIiwiYWZmaW5lIiwiR3RfMSIsIkd0XzIiLCJJTkYiLCJlcXVhbHMiLCJ0IiwibWVzc2FnZUJ5dGVzIiwic3RyaW5nVG9CeXRlcyIsIkgiLCJIQVNIMjU2IiwicHJvY2Vzc19hcnJheSIsIlIiLCJoYXNoIiwiaGFzaGVkTWVzc2FnZSIsImZyb21CeXRlcyIsInMiLCJiIiwibGVuZ3RoIiwicHVzaCIsImNoYXJDb2RlQXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7SUFFcUJBLEs7Ozs7Ozs7Z0NBRUY7QUFDWCxnQkFBTUMsSUFBSSx1QkFBVjs7QUFFQSxnQkFBTUMsS0FBS0QsRUFBRUUsSUFBYjtBQUNBLGdCQUFNQyxLQUFLSCxFQUFFSSxJQUFiO0FBQ0EsZ0JBQU1DLElBQUlMLEVBQUVNLElBQVo7QUFDQSxnQkFBTUMsSUFBSVAsRUFBRVEsS0FBWjs7QUFFQSxtQkFBTyxDQUFDUixDQUFELEVBQUlPLENBQUosRUFBT04sRUFBUCxFQUFXRSxFQUFYLEVBQWVFLENBQWYsQ0FBUDtBQUNIOzs7K0JBRWFJLE0sRUFBUTtBQUFBLHlDQUNRQSxNQURSO0FBQUEsZ0JBQ1hULENBRFc7QUFBQSxnQkFDUk8sQ0FEUTtBQUFBLGdCQUNMTixFQURLO0FBQUEsZ0JBQ0RFLEVBREM7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V08sS0FBWCxDQUFpQmdCLElBQWpCLEVBQXVCUSxDQUF2QixDQUFELEVBQTRCakQsRUFBRVcsR0FBRixDQUFNTyxJQUFOLENBQVdPLEtBQVgsQ0FBaUJpQixJQUFqQixFQUF1Qk8sQ0FBdkIsQ0FBNUIsQ0FBUDtBQUNIOzs7b0NBRWtCakQsQyxFQUFHb0IsQyxFQUFHO0FBQ3JCLGdCQUFNOEIsZUFBZW5ELE1BQU1vRCxhQUFOLENBQW9CL0IsQ0FBcEIsQ0FBckI7QUFDQSxnQkFBTWdDLElBQUksSUFBSXBELEVBQUVXLEdBQUYsQ0FBTTBDLE9BQVYsRUFBVixDQUZxQixDQUVVO0FBQy9CRCxjQUFFRSxhQUFGLENBQWdCSixZQUFoQjtBQUNBLGdCQUFNSyxJQUFJSCxFQUFFSSxJQUFGLEVBQVY7QUFDQSxnQkFBTUMsZ0JBQWdCekQsRUFBRVcsR0FBRixDQUFNQyxHQUFOLENBQVU4QyxTQUFWLENBQW9CSCxDQUFwQixDQUF0QjtBQUNBLG1CQUFPRSxhQUFQO0FBQ0g7OztzQ0FHb0JFLEMsRUFBRztBQUNwQixnQkFBSUMsSUFBSSxFQUFSO0FBQ0EsaUJBQUssSUFBSTVCLElBQUksQ0FBYixFQUFnQkEsSUFBSTJCLEVBQUVFLE1BQXRCLEVBQThCN0IsR0FBOUI7QUFDSTRCLGtCQUFFRSxJQUFGLENBQU9ILEVBQUVJLFVBQUYsQ0FBYS9CLENBQWIsQ0FBUDtBQURKLGFBRUEsT0FBTzRCLENBQVA7QUFDSDs7Ozs7O2tCQTdHZ0I3RCxLIiwiZmlsZSI6IlBTU2lnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJwR3JvdXAgZnJvbSBcIi4vQnBHcm91cFwiXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQU1NpZyB7XHJcblxyXG4gICAgc3RhdGljIHNldHVwKCkge1xyXG4gICAgICAgIGNvbnN0IEcgPSBuZXcgQnBHcm91cCgpO1xyXG5cclxuICAgICAgICBjb25zdCBnMSA9IEcuZ2VuMTtcclxuICAgICAgICBjb25zdCBnMiA9IEcuZ2VuMjtcclxuICAgICAgICBjb25zdCBlID0gRy5wYWlyO1xyXG4gICAgICAgIGNvbnN0IG8gPSBHLm9yZGVyO1xyXG5cclxuICAgICAgICByZXR1cm4gW0csIG8sIGcxLCBnMiwgZV1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMga2V5Z2VuKHBhcmFtcykge1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgICAgICAvLyBUYXJnZXQgdmFsdWVzOlxyXG4gICAgICAgIGNvbnN0IHggPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcclxuICAgICAgICBjb25zdCB5ID0gRy5jdHguQklHLnJhbmRvbW51bShHLm9yZGVyLCBHLnJuZ0dlbik7XHJcblxyXG4gICAgICAgIGNvbnN0IHNrID0gW3gsIHldO1xyXG4gICAgICAgIGNvbnN0IHBrID0gW2cyLCBHLmN0eC5QQUlSLkcybXVsKGcyLCB4KSwgRy5jdHguUEFJUi5HMm11bChnMiwgeSldO1xyXG5cclxuICAgICAgICByZXR1cm4gW3NrLCBwa11cclxuICAgIH1cclxuXHJcbiAgICAvLyBzaWcgPSAoeCt5Km0pICogaFxyXG4gICAgc3RhdGljIHNpZ24ocGFyYW1zLCBzaywgbSwgaXNNZXNzYWdlSGFzaGVkID0gZmFsc2UpIHtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBbeCwgeV0gPSBzaztcclxuXHJcbiAgICAgICAgaWYoIWlzTWVzc2FnZUhhc2hlZCkge1xyXG4gICAgICAgICAgICBtID0gUFNTaWcuaGFzaE1lc3NhZ2UoRywgbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByYW5kID0gRy5jdHguQklHLnJhbmRvbW51bShvLCBHLnJuZ0dlbik7XHJcbiAgICAgICAgY29uc3QgaCA9IEcuY3R4LlBBSVIuRzFtdWwoZzEsIHJhbmQpO1xyXG5cclxuICAgICAgICAvLyBtY3B5ID0gbSBtb2QgcFxyXG4gICAgICAgIGNvbnN0IG1jcHkgPSBuZXcgRy5jdHguQklHKG0pO1xyXG4gICAgICAgIG1jcHkubW9kKG8pO1xyXG5cclxuICAgICAgICAvLyB0MSA9IHkgKiAobSBtb2QgcClcclxuICAgICAgICBjb25zdCB0MSA9IEcuY3R4LkJJRy5tdWwoeSxtY3B5KTtcclxuXHJcbiAgICAgICAgLy8gREJJRyBjb25zdHJ1Y3RvciBkb2VzIG5vdCBhbGxvdyB0byBwYXNzIGl0IGEgQklHIHZhbHVlIGhlbmNlIHdlIGNvcHkgYWxsIHdvcmQgdmFsdWVzIG1hbnVhbGx5XHJcbiAgICAgICAgY29uc3QgeERCSUcgPSAgbmV3IEcuY3R4LkRCSUcoMCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBHLmN0eC5CSUcuTkxFTjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHhEQklHLndbaV0gPSB4LndbaV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0MSA9IHggKyB5ICogKG0gbW9kIHApXHJcbiAgICAgICAgdDEuYWRkKHhEQklHKTtcclxuXHJcbiAgICAgICAgLy8gSyA9ICh4ICsgeSAqIChtIG1vZCBwKSkgbW9kIHBcclxuICAgICAgICBjb25zdCBLID0gdDEubW9kKG8pO1xyXG5cclxuICAgICAgICAvLyBzaWcgPSBLICogaFxyXG4gICAgICAgIGNvbnN0IHNpZyA9IEcuY3R4LlBBSVIuRzFtdWwoaCwgSyk7XHJcblxyXG4gICAgICAgIHJldHVybiBbaCwgc2lnXVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHN0YXRpYyBhZ2dyZWdhdGVcclxuICAgIC8vXHJcblxyXG4gICAgLy8gIGUoc2lnMSwgWCArIG0gKiBZKSA9PSBlKHNpZzIsIGcpXHJcbiAgICBzdGF0aWMgdmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZywgaXNNZXNzYWdlSGFzaGVkID0gZmFsc2UpIHtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBbZywgWCwgWV0gPSBwaztcclxuICAgICAgICBjb25zdCBbc2lnMSwgc2lnMl0gPSBzaWc7XHJcblxyXG4gICAgICAgIGlmKCFpc01lc3NhZ2VIYXNoZWQpIHtcclxuICAgICAgICAgICAgbSA9IFBTU2lnLmhhc2hNZXNzYWdlKEcsIG0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgRzJfdG1wMSA9IEcuY3R4LlBBSVIuRzJtdWwoWSwgbSk7XHJcbiAgICAgICAgRzJfdG1wMS5hZGQoWCk7XHJcbiAgICAgICAgRzJfdG1wMS5hZmZpbmUoKTtcclxuXHJcbiAgICAgICAgY29uc3QgR3RfMSA9IGUoc2lnMSwgRzJfdG1wMSk7XHJcbiAgICAgICAgY29uc3QgR3RfMiA9IGUoc2lnMiwgZyk7XHJcblxyXG4gICAgICAgIHJldHVybiAhc2lnLklORiAmJiBHdF8xLmVxdWFscyhHdF8yKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmFuZG9taXplKHBhcmFtcywgc2lnKSB7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3NpZzEsIHNpZzJdID0gc2lnO1xyXG4gICAgICAgIGNvbnN0IHQgPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtHLmN0eC5QQUlSLkcxbXVsKHNpZzEsIHQpLCBHLmN0eC5QQUlSLkcxbXVsKHNpZzIsIHQpXVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBoYXNoTWVzc2FnZShHLCBtKSB7XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZUJ5dGVzID0gUFNTaWcuc3RyaW5nVG9CeXRlcyhtKTtcclxuICAgICAgICBjb25zdCBIID0gbmV3IEcuY3R4LkhBU0gyNTYoKTsgLy8gcHJvb2Ygb2YgY29uY2VwdCBvbmx5IGJlY2F1c2UgaXQgd2lsbCBiZSByZXBsYWNlZCBieSBoYXNoaW5nIHRvIHBvaW50IG9uIGN1cnZlOyBtYWtlIGhhc2ggY29udGV4dCBhdHRyaWJ1dGUgb2YgY2xhc3NcclxuICAgICAgICBILnByb2Nlc3NfYXJyYXkobWVzc2FnZUJ5dGVzKTtcclxuICAgICAgICBjb25zdCBSID0gSC5oYXNoKCk7XHJcbiAgICAgICAgY29uc3QgaGFzaGVkTWVzc2FnZSA9IEcuY3R4LkJJRy5mcm9tQnl0ZXMoUik7XHJcbiAgICAgICAgcmV0dXJuIGhhc2hlZE1lc3NhZ2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHN0YXRpYyBzdHJpbmdUb0J5dGVzKHMpIHtcclxuICAgICAgICBsZXQgYiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgYi5wdXNoKHMuY2hhckNvZGVBdChpKSk7XHJcbiAgICAgICAgcmV0dXJuIGI7XHJcbiAgICB9XHJcbn1cclxuIl19