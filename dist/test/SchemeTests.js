"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _PSSig = require("../PSSig");

var _PSSig2 = _interopRequireDefault(_PSSig);

var _BpGroup = require("../BpGroup");

var _BpGroup2 = _interopRequireDefault(_BpGroup);

var _mocha = require("mocha");

var mocha = _interopRequireWildcard(_mocha);

var _chai = require("chai");

var chai = _interopRequireWildcard(_chai);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(s) {
    var b = [];
    for (var i = 0; i < s.length; i++) {
        b.push(s.charCodeAt(i));
    }return b;
}

describe("Pointcheval-Sanders Short Randomizable Signatures scheme", function () {
    describe("Setup", function () {
        var params = _PSSig2.default.setup();

        var _params = _slicedToArray(params, 5),
            G = _params[0],
            o = _params[1],
            g1 = _params[2],
            g2 = _params[3],
            e = _params[4];

        it("Returns BpGroup Object", function () {
            chai.assert.isNotNull(G);
            chai.assert.isTrue(G instanceof _BpGroup2.default);
        });

        it("Returns Group Order", function () {
            chai.assert.isNotNull(o);
            chai.assert.isTrue(o instanceof G.ctx.BIG);
        });

        it("Returns Gen1", function () {
            chai.assert.isNotNull(g1);
            chai.assert.isTrue(g1 instanceof G.ctx.ECP);
        });

        it("Returns Gen2", function () {
            chai.assert.isNotNull(g2);
            chai.assert.isTrue(g2 instanceof G.ctx.ECP2);
        });

        it("Returns Pair function", function () {
            chai.assert.isNotNull(e);
            chai.assert.isTrue(e instanceof Function);
        });
    });

    describe("Keygen", function () {
        var params = _PSSig2.default.setup();

        var _params2 = _slicedToArray(params, 5),
            G = _params2[0],
            o = _params2[1],
            g1 = _params2[2],
            g2 = _params2[3],
            e = _params2[4];

        var _PSSig$keygen = _PSSig2.default.keygen(params),
            _PSSig$keygen2 = _slicedToArray(_PSSig$keygen, 2),
            sk = _PSSig$keygen2[0],
            pk = _PSSig$keygen2[1];

        var _sk = _slicedToArray(sk, 2),
            x = _sk[0],
            y = _sk[1];

        var _pk = _slicedToArray(pk, 3),
            g = _pk[0],
            X = _pk[1],
            Y = _pk[2];

        it("Returns Secret Key (x,y)", function () {
            chai.assert.isTrue(x instanceof G.ctx.BIG);
            chai.assert.isTrue(y instanceof G.ctx.BIG);
        });

        //        const pk = [g2, g2.mul(x), g2.mul(y)];

        describe("Returns Valid Private Key (g,X,Y)", function () {
            it("g = g2", function () {
                chai.assert.isTrue(g2.equals(g));
            });

            it("X = g2*x", function () {
                chai.assert.isTrue(X.equals(g2.mul(x)));
            });

            it("Y = g2*y", function () {
                chai.assert.isTrue(Y.equals(g2.mul(y)));
            });
        });
    });

    // h, sig = (x+y*m) * h
    describe("Sign", function () {
        var params = _PSSig2.default.setup();

        var _params3 = _slicedToArray(params, 5),
            G = _params3[0],
            o = _params3[1],
            g1 = _params3[2],
            g2 = _params3[3],
            e = _params3[4];

        var _PSSig$keygen3 = _PSSig2.default.keygen(params),
            _PSSig$keygen4 = _slicedToArray(_PSSig$keygen3, 2),
            sk = _PSSig$keygen4[0],
            pk = _PSSig$keygen4[1];

        var _sk2 = _slicedToArray(sk, 2),
            x = _sk2[0],
            y = _sk2[1];

        var testMessage = "Hello World!";
        var messageBytes = stringToBytes(testMessage);
        var H = new G.ctx.HASH256();
        H.process_array(messageBytes);
        var R = H.hash();
        var m = G.ctx.BIG.fromBytes(R);

        var signature = _PSSig2.default.sign(params, sk, m);

        var _signature = _slicedToArray(signature, 2),
            sig1 = _signature[0],
            sig2 = _signature[1];

        // only works for y <= 513...


        it("For signature(sig1, sig2), sig2 = (x+y*m) * sig1", function () {
            // BIG TODO: smul vs mul... both have disadvantages, neither is working (will be shown in verify)
            var t1 = G.ctx.BIG.smul(y, m);
            var x_cp = new G.ctx.BIG(x);
            var t2 = x_cp.add(t1);

            var sig_test = sig1.mul(t2);
            chai.assert.isTrue(sig2.equals(sig_test));
        });
    });

    describe("Verify", function () {
        describe("With Y <= 513", function () {
            var params = _PSSig2.default.setup();

            var _params4 = _slicedToArray(params, 5),
                G = _params4[0],
                o = _params4[1],
                g1 = _params4[2],
                g2 = _params4[3],
                e = _params4[4];

            // keygen needs to be done "manually"


            var x = G.ctx.BIG.randomnum(G.order, G.rngGen);
            var y = new G.ctx.BIG(513);

            var sk = [x, y];
            var pk = [g2, g2.mul(x), g2.mul(y)];

            var testMessage = "Hello World!";
            var messageBytes = stringToBytes(testMessage);
            var H = new G.ctx.HASH256();
            H.process_array(messageBytes);
            var R = H.hash();
            var m = G.ctx.BIG.fromBytes(R);

            var sig = _PSSig2.default.sign(params, sk, m);

            it("Successful verification for original message", function () {
                chai.assert.isTrue(_PSSig2.default.verify(params, pk, m, sig));
            });

            it("Failed verification for another message", function () {
                var messageBytes2 = stringToBytes("Other Hello World!");
                var H2 = new G.ctx.HASH256();
                H2.process_array(messageBytes2);
                var R2 = H2.hash();
                var m2 = G.ctx.BIG.fromBytes(R2);

                chai.assert.isNotTrue(_PSSig2.default.verify(params, pk, m2, sig));
            });
        });

        describe("With 'proper' random", function () {
            var params = _PSSig2.default.setup();

            var _params5 = _slicedToArray(params, 5),
                G = _params5[0],
                o = _params5[1],
                g1 = _params5[2],
                g2 = _params5[3],
                e = _params5[4];

            var _PSSig$keygen5 = _PSSig2.default.keygen(params),
                _PSSig$keygen6 = _slicedToArray(_PSSig$keygen5, 2),
                sk = _PSSig$keygen6[0],
                pk = _PSSig$keygen6[1];

            var _sk3 = _slicedToArray(sk, 2),
                x = _sk3[0],
                y = _sk3[1];

            var testMessage = "Hello World!";
            var messageBytes = stringToBytes(testMessage);
            var H = new G.ctx.HASH256();
            H.process_array(messageBytes);
            var R = H.hash();
            var m = G.ctx.BIG.fromBytes(R);

            var sig = _PSSig2.default.sign(params, sk, m);

            it("Successful verification for original message", function () {
                chai.assert.isTrue(_PSSig2.default.verify(params, pk, m, sig));
            });

            it("Failed verification for another message", function () {
                var messageBytes2 = stringToBytes("Other Hello World!");
                var H2 = new G.ctx.HASH256();
                H2.process_array(messageBytes2);
                var R2 = H2.hash();
                var m2 = G.ctx.BIG.fromBytes(R2);

                chai.assert.isNotTrue(_PSSig2.default.verify(params, pk, m2, sig));
            });
        });
    });

    describe("Randomize", function () {
        var params = _PSSig2.default.setup();

        var _params6 = _slicedToArray(params, 5),
            G = _params6[0],
            o = _params6[1],
            g1 = _params6[2],
            g2 = _params6[3],
            e = _params6[4];

        var _PSSig$keygen7 = _PSSig2.default.keygen(params),
            _PSSig$keygen8 = _slicedToArray(_PSSig$keygen7, 2),
            sk = _PSSig$keygen8[0],
            pk = _PSSig$keygen8[1];

        var _sk4 = _slicedToArray(sk, 2),
            x = _sk4[0],
            y = _sk4[1];

        var testMessage = "Hello World!";
        var messageBytes = stringToBytes(testMessage);
        var H = new G.ctx.HASH256();
        H.process_array(messageBytes);
        var R = H.hash();
        var m = G.ctx.BIG.fromBytes(R);

        var sig = _PSSig2.default.sign(params, sk, m);
        sig = _PSSig2.default.randomize(params, sig);

        it("Successful verification for original message with randomized signature", function () {
            chai.assert.isTrue(_PSSig2.default.verify(params, pk, m, sig));
        });

        it("Failed verification for another message with randomized signature", function () {
            var messageBytes2 = stringToBytes("Other Hello World!");
            var H2 = new G.ctx.HASH256();
            H2.process_array(messageBytes2);
            var R2 = H2.hash();
            var m2 = G.ctx.BIG.fromBytes(R2);

            chai.assert.isNotTrue(_PSSig2.default.verify(params, pk, m2, sig));
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L1NjaGVtZVRlc3RzLmpzIl0sIm5hbWVzIjpbIm1vY2hhIiwiY2hhaSIsInN0cmluZ1RvQnl0ZXMiLCJzIiwiYiIsImkiLCJsZW5ndGgiLCJwdXNoIiwiY2hhckNvZGVBdCIsImRlc2NyaWJlIiwicGFyYW1zIiwic2V0dXAiLCJHIiwibyIsImcxIiwiZzIiLCJlIiwiaXQiLCJhc3NlcnQiLCJpc05vdE51bGwiLCJpc1RydWUiLCJjdHgiLCJCSUciLCJFQ1AiLCJFQ1AyIiwiRnVuY3Rpb24iLCJrZXlnZW4iLCJzayIsInBrIiwieCIsInkiLCJnIiwiWCIsIlkiLCJlcXVhbHMiLCJtdWwiLCJ0ZXN0TWVzc2FnZSIsIm1lc3NhZ2VCeXRlcyIsIkgiLCJIQVNIMjU2IiwicHJvY2Vzc19hcnJheSIsIlIiLCJoYXNoIiwibSIsImZyb21CeXRlcyIsInNpZ25hdHVyZSIsInNpZ24iLCJzaWcxIiwic2lnMiIsInQxIiwic211bCIsInhfY3AiLCJ0MiIsImFkZCIsInNpZ190ZXN0IiwicmFuZG9tbnVtIiwib3JkZXIiLCJybmdHZW4iLCJzaWciLCJ2ZXJpZnkiLCJtZXNzYWdlQnl0ZXMyIiwiSDIiLCJSMiIsIm0yIiwiaXNOb3RUcnVlIiwicmFuZG9taXplIl0sIm1hcHBpbmdzIjoiOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztJQUFZQSxLOztBQUNaOztJQUFZQyxJOzs7Ozs7QUFFWixTQUFTQyxhQUFULENBQXVCQyxDQUF2QixFQUEwQjtBQUN0QixRQUFJQyxJQUFJLEVBQVI7QUFDQSxTQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsRUFBRUcsTUFBdEIsRUFBOEJELEdBQTlCO0FBQ0lELFVBQUVHLElBQUYsQ0FBT0osRUFBRUssVUFBRixDQUFhSCxDQUFiLENBQVA7QUFESixLQUVBLE9BQU9ELENBQVA7QUFDSDs7QUFFREssU0FBUywwREFBVCxFQUFxRSxZQUFNO0FBQ3ZFQSxhQUFTLE9BQVQsRUFBa0IsWUFBTTtBQUNwQixZQUFNQyxTQUFTLGdCQUFNQyxLQUFOLEVBQWY7O0FBRG9CLHFDQUVNRCxNQUZOO0FBQUEsWUFFYkUsQ0FGYTtBQUFBLFlBRVZDLENBRlU7QUFBQSxZQUVQQyxFQUZPO0FBQUEsWUFFSEMsRUFGRztBQUFBLFlBRUNDLENBRkQ7O0FBSXBCQyxXQUFHLHdCQUFILEVBQTZCLFlBQU07QUFDL0JoQixpQkFBS2lCLE1BQUwsQ0FBWUMsU0FBWixDQUFzQlAsQ0FBdEI7QUFDQVgsaUJBQUtpQixNQUFMLENBQVlFLE1BQVosQ0FBbUJSLDhCQUFuQjtBQUNILFNBSEQ7O0FBS0FLLFdBQUcscUJBQUgsRUFBMEIsWUFBTTtBQUM1QmhCLGlCQUFLaUIsTUFBTCxDQUFZQyxTQUFaLENBQXNCTixDQUF0QjtBQUNBWixpQkFBS2lCLE1BQUwsQ0FBWUUsTUFBWixDQUFtQlAsYUFBYUQsRUFBRVMsR0FBRixDQUFNQyxHQUF0QztBQUNILFNBSEQ7O0FBS0FMLFdBQUcsY0FBSCxFQUFtQixZQUFNO0FBQ3JCaEIsaUJBQUtpQixNQUFMLENBQVlDLFNBQVosQ0FBc0JMLEVBQXRCO0FBQ0FiLGlCQUFLaUIsTUFBTCxDQUFZRSxNQUFaLENBQW1CTixjQUFjRixFQUFFUyxHQUFGLENBQU1FLEdBQXZDO0FBQ0gsU0FIRDs7QUFLQU4sV0FBRyxjQUFILEVBQW1CLFlBQU07QUFDckJoQixpQkFBS2lCLE1BQUwsQ0FBWUMsU0FBWixDQUFzQkosRUFBdEI7QUFDQWQsaUJBQUtpQixNQUFMLENBQVlFLE1BQVosQ0FBbUJMLGNBQWNILEVBQUVTLEdBQUYsQ0FBTUcsSUFBdkM7QUFDSCxTQUhEOztBQUtBUCxXQUFHLHVCQUFILEVBQTRCLFlBQU07QUFDOUJoQixpQkFBS2lCLE1BQUwsQ0FBWUMsU0FBWixDQUFzQkgsQ0FBdEI7QUFDQWYsaUJBQUtpQixNQUFMLENBQVlFLE1BQVosQ0FBbUJKLGFBQWFTLFFBQWhDO0FBQ0gsU0FIRDtBQUlILEtBNUJEOztBQThCQWhCLGFBQVMsUUFBVCxFQUFtQixZQUFNO0FBQ3JCLFlBQU1DLFNBQVMsZ0JBQU1DLEtBQU4sRUFBZjs7QUFEcUIsc0NBRUtELE1BRkw7QUFBQSxZQUVkRSxDQUZjO0FBQUEsWUFFWEMsQ0FGVztBQUFBLFlBRVJDLEVBRlE7QUFBQSxZQUVKQyxFQUZJO0FBQUEsWUFFQUMsQ0FGQTs7QUFBQSw0QkFHSixnQkFBTVUsTUFBTixDQUFhaEIsTUFBYixDQUhJO0FBQUE7QUFBQSxZQUdkaUIsRUFIYztBQUFBLFlBR1ZDLEVBSFU7O0FBQUEsaUNBS05ELEVBTE07QUFBQSxZQUtkRSxDQUxjO0FBQUEsWUFLWEMsQ0FMVzs7QUFBQSxpQ0FNTEYsRUFOSztBQUFBLFlBTWhCRyxDQU5nQjtBQUFBLFlBTWJDLENBTmE7QUFBQSxZQU1WQyxDQU5VOztBQVFyQmhCLFdBQUcsMEJBQUgsRUFBK0IsWUFBTTtBQUNqQ2hCLGlCQUFLaUIsTUFBTCxDQUFZRSxNQUFaLENBQW1CUyxhQUFhakIsRUFBRVMsR0FBRixDQUFNQyxHQUF0QztBQUNBckIsaUJBQUtpQixNQUFMLENBQVlFLE1BQVosQ0FBbUJVLGFBQWFsQixFQUFFUyxHQUFGLENBQU1DLEdBQXRDO0FBQ0gsU0FIRDs7QUFLQTs7QUFFQWIsaUJBQVMsbUNBQVQsRUFBOEMsWUFBTTtBQUNoRFEsZUFBRyxRQUFILEVBQWEsWUFBTTtBQUNmaEIscUJBQUtpQixNQUFMLENBQVlFLE1BQVosQ0FBbUJMLEdBQUdtQixNQUFILENBQVVILENBQVYsQ0FBbkI7QUFDSCxhQUZEOztBQUlBZCxlQUFHLFVBQUgsRUFBZSxZQUFNO0FBQ2pCaEIscUJBQUtpQixNQUFMLENBQVlFLE1BQVosQ0FBbUJZLEVBQUVFLE1BQUYsQ0FBU25CLEdBQUdvQixHQUFILENBQU9OLENBQVAsQ0FBVCxDQUFuQjtBQUNILGFBRkQ7O0FBSUFaLGVBQUcsVUFBSCxFQUFlLFlBQU07QUFDakJoQixxQkFBS2lCLE1BQUwsQ0FBWUUsTUFBWixDQUFtQmEsRUFBRUMsTUFBRixDQUFTbkIsR0FBR29CLEdBQUgsQ0FBT0wsQ0FBUCxDQUFULENBQW5CO0FBQ0gsYUFGRDtBQUlILFNBYkQ7QUFjSCxLQTdCRDs7QUErQkE7QUFDQXJCLGFBQVMsTUFBVCxFQUFpQixZQUFNO0FBQ25CLFlBQU1DLFNBQVMsZ0JBQU1DLEtBQU4sRUFBZjs7QUFEbUIsc0NBRU9ELE1BRlA7QUFBQSxZQUVaRSxDQUZZO0FBQUEsWUFFVEMsQ0FGUztBQUFBLFlBRU5DLEVBRk07QUFBQSxZQUVGQyxFQUZFO0FBQUEsWUFFRUMsQ0FGRjs7QUFBQSw2QkFHRixnQkFBTVUsTUFBTixDQUFhaEIsTUFBYixDQUhFO0FBQUE7QUFBQSxZQUdaaUIsRUFIWTtBQUFBLFlBR1JDLEVBSFE7O0FBQUEsa0NBSUpELEVBSkk7QUFBQSxZQUlaRSxDQUpZO0FBQUEsWUFJVEMsQ0FKUzs7QUFNbkIsWUFBTU0sY0FBYyxjQUFwQjtBQUNBLFlBQU1DLGVBQWVuQyxjQUFja0MsV0FBZCxDQUFyQjtBQUNBLFlBQU1FLElBQUksSUFBSTFCLEVBQUVTLEdBQUYsQ0FBTWtCLE9BQVYsRUFBVjtBQUNBRCxVQUFFRSxhQUFGLENBQWdCSCxZQUFoQjtBQUNBLFlBQU1JLElBQUlILEVBQUVJLElBQUYsRUFBVjtBQUNBLFlBQU1DLElBQUkvQixFQUFFUyxHQUFGLENBQU1DLEdBQU4sQ0FBVXNCLFNBQVYsQ0FBb0JILENBQXBCLENBQVY7O0FBRUEsWUFBTUksWUFBWSxnQkFBTUMsSUFBTixDQUFXcEMsTUFBWCxFQUFtQmlCLEVBQW5CLEVBQXVCZ0IsQ0FBdkIsQ0FBbEI7O0FBYm1CLHdDQWNFRSxTQWRGO0FBQUEsWUFjWkUsSUFkWTtBQUFBLFlBY05DLElBZE07O0FBaUJuQjs7O0FBQ0EvQixXQUFHLGtEQUFILEVBQXVELFlBQU07QUFDekQ7QUFDQSxnQkFBTWdDLEtBQUtyQyxFQUFFUyxHQUFGLENBQU1DLEdBQU4sQ0FBVTRCLElBQVYsQ0FBZXBCLENBQWYsRUFBaUJhLENBQWpCLENBQVg7QUFDQSxnQkFBTVEsT0FBTyxJQUFJdkMsRUFBRVMsR0FBRixDQUFNQyxHQUFWLENBQWNPLENBQWQsQ0FBYjtBQUNBLGdCQUFNdUIsS0FBS0QsS0FBS0UsR0FBTCxDQUFTSixFQUFULENBQVg7O0FBRUEsZ0JBQUlLLFdBQVdQLEtBQUtaLEdBQUwsQ0FBU2lCLEVBQVQsQ0FBZjtBQUNBbkQsaUJBQUtpQixNQUFMLENBQVlFLE1BQVosQ0FBbUI0QixLQUFLZCxNQUFMLENBQVlvQixRQUFaLENBQW5CO0FBQ0gsU0FSRDtBQVNILEtBM0JEOztBQThCQTdDLGFBQVMsUUFBVCxFQUFtQixZQUFNO0FBQ3JCQSxpQkFBUyxlQUFULEVBQTBCLFlBQU07QUFDNUIsZ0JBQU1DLFNBQVMsZ0JBQU1DLEtBQU4sRUFBZjs7QUFENEIsMENBRUZELE1BRkU7QUFBQSxnQkFFckJFLENBRnFCO0FBQUEsZ0JBRWxCQyxDQUZrQjtBQUFBLGdCQUVmQyxFQUZlO0FBQUEsZ0JBRVhDLEVBRlc7QUFBQSxnQkFFUEMsQ0FGTzs7QUFJNUI7OztBQUNBLGdCQUFNYSxJQUFJakIsRUFBRVMsR0FBRixDQUFNQyxHQUFOLENBQVVpQyxTQUFWLENBQW9CM0MsRUFBRTRDLEtBQXRCLEVBQTZCNUMsRUFBRTZDLE1BQS9CLENBQVY7QUFDQSxnQkFBTTNCLElBQUksSUFBSWxCLEVBQUVTLEdBQUYsQ0FBTUMsR0FBVixDQUFjLEdBQWQsQ0FBVjs7QUFFQSxnQkFBTUssS0FBSyxDQUFDRSxDQUFELEVBQUlDLENBQUosQ0FBWDtBQUNBLGdCQUFNRixLQUFLLENBQUNiLEVBQUQsRUFBS0EsR0FBR29CLEdBQUgsQ0FBT04sQ0FBUCxDQUFMLEVBQWdCZCxHQUFHb0IsR0FBSCxDQUFPTCxDQUFQLENBQWhCLENBQVg7O0FBRUEsZ0JBQU1NLGNBQWMsY0FBcEI7QUFDQSxnQkFBTUMsZUFBZW5DLGNBQWNrQyxXQUFkLENBQXJCO0FBQ0EsZ0JBQU1FLElBQUksSUFBSTFCLEVBQUVTLEdBQUYsQ0FBTWtCLE9BQVYsRUFBVjtBQUNBRCxjQUFFRSxhQUFGLENBQWdCSCxZQUFoQjtBQUNBLGdCQUFNSSxJQUFJSCxFQUFFSSxJQUFGLEVBQVY7QUFDQSxnQkFBTUMsSUFBSS9CLEVBQUVTLEdBQUYsQ0FBTUMsR0FBTixDQUFVc0IsU0FBVixDQUFvQkgsQ0FBcEIsQ0FBVjs7QUFFQSxnQkFBTWlCLE1BQU0sZ0JBQU1aLElBQU4sQ0FBV3BDLE1BQVgsRUFBbUJpQixFQUFuQixFQUF1QmdCLENBQXZCLENBQVo7O0FBRUExQixlQUFHLDhDQUFILEVBQW1ELFlBQU07QUFDckRoQixxQkFBS2lCLE1BQUwsQ0FBWUUsTUFBWixDQUFtQixnQkFBTXVDLE1BQU4sQ0FBYWpELE1BQWIsRUFBcUJrQixFQUFyQixFQUF5QmUsQ0FBekIsRUFBNEJlLEdBQTVCLENBQW5CO0FBQ0gsYUFGRDs7QUFJQXpDLGVBQUcseUNBQUgsRUFBOEMsWUFBTTtBQUNoRCxvQkFBSTJDLGdCQUFnQjFELGNBQWMsb0JBQWQsQ0FBcEI7QUFDQSxvQkFBSTJELEtBQUssSUFBSWpELEVBQUVTLEdBQUYsQ0FBTWtCLE9BQVYsRUFBVDtBQUNBc0IsbUJBQUdyQixhQUFILENBQWlCb0IsYUFBakI7QUFDQSxvQkFBSUUsS0FBS0QsR0FBR25CLElBQUgsRUFBVDtBQUNBLG9CQUFJcUIsS0FBS25ELEVBQUVTLEdBQUYsQ0FBTUMsR0FBTixDQUFVc0IsU0FBVixDQUFvQmtCLEVBQXBCLENBQVQ7O0FBRUE3RCxxQkFBS2lCLE1BQUwsQ0FBWThDLFNBQVosQ0FBc0IsZ0JBQU1MLE1BQU4sQ0FBYWpELE1BQWIsRUFBcUJrQixFQUFyQixFQUF5Qm1DLEVBQXpCLEVBQTZCTCxHQUE3QixDQUF0QjtBQUNILGFBUkQ7QUFVSCxTQWxDRDs7QUFvQ0FqRCxpQkFBUyxzQkFBVCxFQUFpQyxZQUFNO0FBQ25DLGdCQUFNQyxTQUFTLGdCQUFNQyxLQUFOLEVBQWY7O0FBRG1DLDBDQUVURCxNQUZTO0FBQUEsZ0JBRTVCRSxDQUY0QjtBQUFBLGdCQUV6QkMsQ0FGeUI7QUFBQSxnQkFFdEJDLEVBRnNCO0FBQUEsZ0JBRWxCQyxFQUZrQjtBQUFBLGdCQUVkQyxDQUZjOztBQUFBLGlDQUdsQixnQkFBTVUsTUFBTixDQUFhaEIsTUFBYixDQUhrQjtBQUFBO0FBQUEsZ0JBRzVCaUIsRUFINEI7QUFBQSxnQkFHeEJDLEVBSHdCOztBQUFBLHNDQUlwQkQsRUFKb0I7QUFBQSxnQkFJNUJFLENBSjRCO0FBQUEsZ0JBSXpCQyxDQUp5Qjs7QUFNbkMsZ0JBQU1NLGNBQWMsY0FBcEI7QUFDQSxnQkFBTUMsZUFBZW5DLGNBQWNrQyxXQUFkLENBQXJCO0FBQ0EsZ0JBQU1FLElBQUksSUFBSTFCLEVBQUVTLEdBQUYsQ0FBTWtCLE9BQVYsRUFBVjtBQUNBRCxjQUFFRSxhQUFGLENBQWdCSCxZQUFoQjtBQUNBLGdCQUFNSSxJQUFJSCxFQUFFSSxJQUFGLEVBQVY7QUFDQSxnQkFBTUMsSUFBSS9CLEVBQUVTLEdBQUYsQ0FBTUMsR0FBTixDQUFVc0IsU0FBVixDQUFvQkgsQ0FBcEIsQ0FBVjs7QUFFQSxnQkFBTWlCLE1BQU0sZ0JBQU1aLElBQU4sQ0FBV3BDLE1BQVgsRUFBbUJpQixFQUFuQixFQUF1QmdCLENBQXZCLENBQVo7O0FBRUExQixlQUFHLDhDQUFILEVBQW1ELFlBQU07QUFDckRoQixxQkFBS2lCLE1BQUwsQ0FBWUUsTUFBWixDQUFtQixnQkFBTXVDLE1BQU4sQ0FBYWpELE1BQWIsRUFBcUJrQixFQUFyQixFQUF5QmUsQ0FBekIsRUFBNEJlLEdBQTVCLENBQW5CO0FBQ0gsYUFGRDs7QUFJQXpDLGVBQUcseUNBQUgsRUFBOEMsWUFBTTtBQUNoRCxvQkFBSTJDLGdCQUFnQjFELGNBQWMsb0JBQWQsQ0FBcEI7QUFDQSxvQkFBSTJELEtBQUssSUFBSWpELEVBQUVTLEdBQUYsQ0FBTWtCLE9BQVYsRUFBVDtBQUNBc0IsbUJBQUdyQixhQUFILENBQWlCb0IsYUFBakI7QUFDQSxvQkFBSUUsS0FBS0QsR0FBR25CLElBQUgsRUFBVDtBQUNBLG9CQUFJcUIsS0FBS25ELEVBQUVTLEdBQUYsQ0FBTUMsR0FBTixDQUFVc0IsU0FBVixDQUFvQmtCLEVBQXBCLENBQVQ7O0FBRUE3RCxxQkFBS2lCLE1BQUwsQ0FBWThDLFNBQVosQ0FBc0IsZ0JBQU1MLE1BQU4sQ0FBYWpELE1BQWIsRUFBcUJrQixFQUFyQixFQUF5Qm1DLEVBQXpCLEVBQTZCTCxHQUE3QixDQUF0QjtBQUNILGFBUkQ7QUFTSCxTQTVCRDtBQTZCSCxLQWxFRDs7QUFxRUFqRCxhQUFTLFdBQVQsRUFBc0IsWUFBTTtBQUN4QixZQUFNQyxTQUFTLGdCQUFNQyxLQUFOLEVBQWY7O0FBRHdCLHNDQUVFRCxNQUZGO0FBQUEsWUFFakJFLENBRmlCO0FBQUEsWUFFZEMsQ0FGYztBQUFBLFlBRVhDLEVBRlc7QUFBQSxZQUVQQyxFQUZPO0FBQUEsWUFFSEMsQ0FGRzs7QUFBQSw2QkFHUCxnQkFBTVUsTUFBTixDQUFhaEIsTUFBYixDQUhPO0FBQUE7QUFBQSxZQUdqQmlCLEVBSGlCO0FBQUEsWUFHYkMsRUFIYTs7QUFBQSxrQ0FJVEQsRUFKUztBQUFBLFlBSWpCRSxDQUppQjtBQUFBLFlBSWRDLENBSmM7O0FBTXhCLFlBQU1NLGNBQWMsY0FBcEI7QUFDQSxZQUFNQyxlQUFlbkMsY0FBY2tDLFdBQWQsQ0FBckI7QUFDQSxZQUFNRSxJQUFJLElBQUkxQixFQUFFUyxHQUFGLENBQU1rQixPQUFWLEVBQVY7QUFDQUQsVUFBRUUsYUFBRixDQUFnQkgsWUFBaEI7QUFDQSxZQUFNSSxJQUFJSCxFQUFFSSxJQUFGLEVBQVY7QUFDQSxZQUFNQyxJQUFJL0IsRUFBRVMsR0FBRixDQUFNQyxHQUFOLENBQVVzQixTQUFWLENBQW9CSCxDQUFwQixDQUFWOztBQUVBLFlBQUlpQixNQUFNLGdCQUFNWixJQUFOLENBQVdwQyxNQUFYLEVBQW1CaUIsRUFBbkIsRUFBdUJnQixDQUF2QixDQUFWO0FBQ0FlLGNBQU0sZ0JBQU1PLFNBQU4sQ0FBZ0J2RCxNQUFoQixFQUF3QmdELEdBQXhCLENBQU47O0FBRUF6QyxXQUFHLHdFQUFILEVBQTZFLFlBQU07QUFDL0VoQixpQkFBS2lCLE1BQUwsQ0FBWUUsTUFBWixDQUFtQixnQkFBTXVDLE1BQU4sQ0FBYWpELE1BQWIsRUFBcUJrQixFQUFyQixFQUF5QmUsQ0FBekIsRUFBNEJlLEdBQTVCLENBQW5CO0FBQ0gsU0FGRDs7QUFJQXpDLFdBQUcsbUVBQUgsRUFBd0UsWUFBTTtBQUMxRSxnQkFBSTJDLGdCQUFnQjFELGNBQWMsb0JBQWQsQ0FBcEI7QUFDQSxnQkFBSTJELEtBQUssSUFBSWpELEVBQUVTLEdBQUYsQ0FBTWtCLE9BQVYsRUFBVDtBQUNBc0IsZUFBR3JCLGFBQUgsQ0FBaUJvQixhQUFqQjtBQUNBLGdCQUFJRSxLQUFLRCxHQUFHbkIsSUFBSCxFQUFUO0FBQ0EsZ0JBQUlxQixLQUFLbkQsRUFBRVMsR0FBRixDQUFNQyxHQUFOLENBQVVzQixTQUFWLENBQW9Ca0IsRUFBcEIsQ0FBVDs7QUFFQTdELGlCQUFLaUIsTUFBTCxDQUFZOEMsU0FBWixDQUFzQixnQkFBTUwsTUFBTixDQUFhakQsTUFBYixFQUFxQmtCLEVBQXJCLEVBQXlCbUMsRUFBekIsRUFBNkJMLEdBQTdCLENBQXRCO0FBQ0gsU0FSRDtBQVNILEtBN0JEO0FBOEJILENBaE1EIiwiZmlsZSI6IlNjaGVtZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCBQU1NpZyBmcm9tIFwiLi4vUFNTaWdcIjtcclxuaW1wb3J0IEJwR3JvdXAgZnJvbSBcIi4uL0JwR3JvdXBcIjtcclxuXHJcbmltcG9ydCAqIGFzIG1vY2hhIGZyb20gXCJtb2NoYVwiO1xyXG5pbXBvcnQgKiBhcyBjaGFpIGZyb20gJ2NoYWknO1xyXG5cclxuZnVuY3Rpb24gc3RyaW5nVG9CeXRlcyhzKSB7XHJcbiAgICBsZXQgYiA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGIucHVzaChzLmNoYXJDb2RlQXQoaSkpO1xyXG4gICAgcmV0dXJuIGI7XHJcbn1cclxuXHJcbmRlc2NyaWJlKFwiUG9pbnRjaGV2YWwtU2FuZGVycyBTaG9ydCBSYW5kb21pemFibGUgU2lnbmF0dXJlcyBzY2hlbWVcIiwgKCkgPT4ge1xyXG4gICAgZGVzY3JpYmUoXCJTZXR1cFwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEJwR3JvdXAgT2JqZWN0XCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKEcpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoRyBpbnN0YW5jZW9mKEJwR3JvdXApKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEdyb3VwIE9yZGVyXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKG8pO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUobyBpbnN0YW5jZW9mKEcuY3R4LkJJRykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcIlJldHVybnMgR2VuMVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90TnVsbChnMSk7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShnMSBpbnN0YW5jZW9mKEcuY3R4LkVDUCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcIlJldHVybnMgR2VuMlwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90TnVsbChnMik7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShnMiBpbnN0YW5jZW9mKEcuY3R4LkVDUDIpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIFBhaXIgZnVuY3Rpb25cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZSk7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShlIGluc3RhbmNlb2YoRnVuY3Rpb24pKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKFwiS2V5Z2VuXCIsICgpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xyXG4gICAgICAgIGxldCBbZywgWCwgWV0gPSBwaztcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIFNlY3JldCBLZXkgKHgseSlcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoeCBpbnN0YW5jZW9mKEcuY3R4LkJJRykpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoeSBpbnN0YW5jZW9mKEcuY3R4LkJJRykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgICAgICAgY29uc3QgcGsgPSBbZzIsIGcyLm11bCh4KSwgZzIubXVsKHkpXTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoXCJSZXR1cm5zIFZhbGlkIFByaXZhdGUgS2V5IChnLFgsWSlcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdChcImcgPSBnMlwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZzIuZXF1YWxzKGcpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIlggPSBnMip4XCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShYLmVxdWFscyhnMi5tdWwoeCkpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIlkgPSBnMip5XCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShZLmVxdWFscyhnMi5tdWwoeSkpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBoLCBzaWcgPSAoeCt5Km0pICogaFxyXG4gICAgZGVzY3JpYmUoXCJTaWduXCIsICgpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gc2s7XHJcblxyXG4gICAgICAgIGNvbnN0IHRlc3RNZXNzYWdlID0gXCJIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICBjb25zdCBtZXNzYWdlQnl0ZXMgPSBzdHJpbmdUb0J5dGVzKHRlc3RNZXNzYWdlKTtcclxuICAgICAgICBjb25zdCBIID0gbmV3IEcuY3R4LkhBU0gyNTYoKTtcclxuICAgICAgICBILnByb2Nlc3NfYXJyYXkobWVzc2FnZUJ5dGVzKTtcclxuICAgICAgICBjb25zdCBSID0gSC5oYXNoKCk7XHJcbiAgICAgICAgY29uc3QgbSA9IEcuY3R4LkJJRy5mcm9tQnl0ZXMoUik7XHJcblxyXG4gICAgICAgIGNvbnN0IHNpZ25hdHVyZSA9IFBTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XHJcbiAgICAgICAgY29uc3QgW3NpZzEsIHNpZzJdID0gc2lnbmF0dXJlO1xyXG5cclxuXHJcbiAgICAgICAgLy8gb25seSB3b3JrcyBmb3IgeSA8PSA1MTMuLi5cclxuICAgICAgICBpdChcIkZvciBzaWduYXR1cmUoc2lnMSwgc2lnMiksIHNpZzIgPSAoeCt5Km0pICogc2lnMVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIEJJRyBUT0RPOiBzbXVsIHZzIG11bC4uLiBib3RoIGhhdmUgZGlzYWR2YW50YWdlcywgbmVpdGhlciBpcyB3b3JraW5nICh3aWxsIGJlIHNob3duIGluIHZlcmlmeSlcclxuICAgICAgICAgICAgY29uc3QgdDEgPSBHLmN0eC5CSUcuc211bCh5LG0pO1xyXG4gICAgICAgICAgICBjb25zdCB4X2NwID0gbmV3IEcuY3R4LkJJRyh4KTtcclxuICAgICAgICAgICAgY29uc3QgdDIgPSB4X2NwLmFkZCh0MSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2lnX3Rlc3QgPSBzaWcxLm11bCh0Mik7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShzaWcyLmVxdWFscyhzaWdfdGVzdCkpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZGVzY3JpYmUoXCJWZXJpZnlcIiwgKCkgPT4ge1xyXG4gICAgICAgIGRlc2NyaWJlKFwiV2l0aCBZIDw9IDUxM1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgICAgICAgICAgLy8ga2V5Z2VuIG5lZWRzIHRvIGJlIGRvbmUgXCJtYW51YWxseVwiXHJcbiAgICAgICAgICAgIGNvbnN0IHggPSBHLmN0eC5CSUcucmFuZG9tbnVtKEcub3JkZXIsIEcucm5nR2VuKTtcclxuICAgICAgICAgICAgY29uc3QgeSA9IG5ldyBHLmN0eC5CSUcoNTEzKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNrID0gW3gsIHldO1xyXG4gICAgICAgICAgICBjb25zdCBwayA9IFtnMiwgZzIubXVsKHgpLCBnMi5tdWwoeSldO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdGVzdE1lc3NhZ2UgPSBcIkhlbGxvIFdvcmxkIVwiO1xyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlQnl0ZXMgPSBzdHJpbmdUb0J5dGVzKHRlc3RNZXNzYWdlKTtcclxuICAgICAgICAgICAgY29uc3QgSCA9IG5ldyBHLmN0eC5IQVNIMjU2KCk7XHJcbiAgICAgICAgICAgIEgucHJvY2Vzc19hcnJheShtZXNzYWdlQnl0ZXMpO1xyXG4gICAgICAgICAgICBjb25zdCBSID0gSC5oYXNoKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG0gPSBHLmN0eC5CSUcuZnJvbUJ5dGVzKFIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2lnID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiU3VjY2Vzc2Z1bCB2ZXJpZmljYXRpb24gZm9yIG9yaWdpbmFsIG1lc3NhZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKFBTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtLCBzaWcpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIkZhaWxlZCB2ZXJpZmljYXRpb24gZm9yIGFub3RoZXIgbWVzc2FnZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZUJ5dGVzMiA9IHN0cmluZ1RvQnl0ZXMoXCJPdGhlciBIZWxsbyBXb3JsZCFcIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgSDIgPSBuZXcgRy5jdHguSEFTSDI1NigpO1xyXG4gICAgICAgICAgICAgICAgSDIucHJvY2Vzc19hcnJheShtZXNzYWdlQnl0ZXMyKTtcclxuICAgICAgICAgICAgICAgIGxldCBSMiA9IEgyLmhhc2goKTtcclxuICAgICAgICAgICAgICAgIGxldCBtMiA9IEcuY3R4LkJJRy5mcm9tQnl0ZXMoUjIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90VHJ1ZShQU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbTIsIHNpZykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKFwiV2l0aCAncHJvcGVyJyByYW5kb21cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICAgICAgY29uc3QgW3NrLCBwa10gPSBQU1NpZy5rZXlnZW4ocGFyYW1zKTtcclxuICAgICAgICAgICAgY29uc3QgW3gsIHldID0gc2s7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0ZXN0TWVzc2FnZSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VCeXRlcyA9IHN0cmluZ1RvQnl0ZXModGVzdE1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBjb25zdCBIID0gbmV3IEcuY3R4LkhBU0gyNTYoKTtcclxuICAgICAgICAgICAgSC5wcm9jZXNzX2FycmF5KG1lc3NhZ2VCeXRlcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IFIgPSBILmhhc2goKTtcclxuICAgICAgICAgICAgY29uc3QgbSA9IEcuY3R4LkJJRy5mcm9tQnl0ZXMoUik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzaWcgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJTdWNjZXNzZnVsIHZlcmlmaWNhdGlvbiBmb3Igb3JpZ2luYWwgbWVzc2FnZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiRmFpbGVkIHZlcmlmaWNhdGlvbiBmb3IgYW5vdGhlciBtZXNzYWdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlQnl0ZXMyID0gc3RyaW5nVG9CeXRlcyhcIk90aGVyIEhlbGxvIFdvcmxkIVwiKTtcclxuICAgICAgICAgICAgICAgIGxldCBIMiA9IG5ldyBHLmN0eC5IQVNIMjU2KCk7XHJcbiAgICAgICAgICAgICAgICBIMi5wcm9jZXNzX2FycmF5KG1lc3NhZ2VCeXRlczIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IFIyID0gSDIuaGFzaCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG0yID0gRy5jdHguQklHLmZyb21CeXRlcyhSMik7XHJcblxyXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3RUcnVlKFBTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtMiwgc2lnKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGRlc2NyaWJlKFwiUmFuZG9taXplXCIsICgpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gc2s7XHJcblxyXG4gICAgICAgIGNvbnN0IHRlc3RNZXNzYWdlID0gXCJIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICBjb25zdCBtZXNzYWdlQnl0ZXMgPSBzdHJpbmdUb0J5dGVzKHRlc3RNZXNzYWdlKTtcclxuICAgICAgICBjb25zdCBIID0gbmV3IEcuY3R4LkhBU0gyNTYoKTtcclxuICAgICAgICBILnByb2Nlc3NfYXJyYXkobWVzc2FnZUJ5dGVzKTtcclxuICAgICAgICBjb25zdCBSID0gSC5oYXNoKCk7XHJcbiAgICAgICAgY29uc3QgbSA9IEcuY3R4LkJJRy5mcm9tQnl0ZXMoUik7XHJcblxyXG4gICAgICAgIGxldCBzaWcgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG4gICAgICAgIHNpZyA9IFBTU2lnLnJhbmRvbWl6ZShwYXJhbXMsIHNpZyk7XHJcblxyXG4gICAgICAgIGl0KFwiU3VjY2Vzc2Z1bCB2ZXJpZmljYXRpb24gZm9yIG9yaWdpbmFsIG1lc3NhZ2Ugd2l0aCByYW5kb21pemVkIHNpZ25hdHVyZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShQU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbSwgc2lnKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiRmFpbGVkIHZlcmlmaWNhdGlvbiBmb3IgYW5vdGhlciBtZXNzYWdlIHdpdGggcmFuZG9taXplZCBzaWduYXR1cmVcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbWVzc2FnZUJ5dGVzMiA9IHN0cmluZ1RvQnl0ZXMoXCJPdGhlciBIZWxsbyBXb3JsZCFcIik7XHJcbiAgICAgICAgICAgIGxldCBIMiA9IG5ldyBHLmN0eC5IQVNIMjU2KCk7XHJcbiAgICAgICAgICAgIEgyLnByb2Nlc3NfYXJyYXkobWVzc2FnZUJ5dGVzMik7XHJcbiAgICAgICAgICAgIGxldCBSMiA9IEgyLmhhc2goKTtcclxuICAgICAgICAgICAgbGV0IG0yID0gRy5jdHguQklHLmZyb21CeXRlcyhSMik7XHJcblxyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdFRydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0yLCBzaWcpKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiXX0=