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


        it("For signature(sig1, sig2), sig2 = ((x+y*(m mod p)) mod p) * sig1", function () {

            var mcpy = new G.ctx.BIG(m);
            mcpy.mod(o);

            var t1 = G.ctx.BIG.mul(y, mcpy);

            var xDBIG = new G.ctx.DBIG(0);
            for (var i = 0; i < G.ctx.BIG.NLEN; i++) {
                xDBIG.w[i] = x.w[i];
            }
            t1.add(xDBIG);
            var K = t1.mod(o);

            var sig_test = G.ctx.PAIR.G1mul(sig1, K);
            chai.assert.isTrue(sig2.equals(sig_test));
        });
    });

    describe("Verify", function () {
        describe("With sk = (42, 513)", function () {
            var params = _PSSig2.default.setup();

            var _params4 = _slicedToArray(params, 5),
                G = _params4[0],
                o = _params4[1],
                g1 = _params4[2],
                g2 = _params4[3],
                e = _params4[4];

            // keygen needs to be done "manually"


            var x = new G.ctx.BIG(42);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L1NjaGVtZVRlc3RzLmpzIl0sIm5hbWVzIjpbIm1vY2hhIiwiY2hhaSIsInN0cmluZ1RvQnl0ZXMiLCJzIiwiYiIsImkiLCJsZW5ndGgiLCJwdXNoIiwiY2hhckNvZGVBdCIsImRlc2NyaWJlIiwicGFyYW1zIiwic2V0dXAiLCJHIiwibyIsImcxIiwiZzIiLCJlIiwiaXQiLCJhc3NlcnQiLCJpc05vdE51bGwiLCJpc1RydWUiLCJjdHgiLCJCSUciLCJFQ1AiLCJFQ1AyIiwiRnVuY3Rpb24iLCJrZXlnZW4iLCJzayIsInBrIiwieCIsInkiLCJnIiwiWCIsIlkiLCJlcXVhbHMiLCJtdWwiLCJ0ZXN0TWVzc2FnZSIsIm1lc3NhZ2VCeXRlcyIsIkgiLCJIQVNIMjU2IiwicHJvY2Vzc19hcnJheSIsIlIiLCJoYXNoIiwibSIsImZyb21CeXRlcyIsInNpZ25hdHVyZSIsInNpZ24iLCJzaWcxIiwic2lnMiIsIm1jcHkiLCJtb2QiLCJ0MSIsInhEQklHIiwiREJJRyIsIk5MRU4iLCJ3IiwiYWRkIiwiSyIsInNpZ190ZXN0IiwiUEFJUiIsIkcxbXVsIiwic2lnIiwidmVyaWZ5IiwibWVzc2FnZUJ5dGVzMiIsIkgyIiwiUjIiLCJtMiIsImlzTm90VHJ1ZSIsInJhbmRvbWl6ZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7SUFBWUEsSzs7QUFDWjs7SUFBWUMsSTs7Ozs7O0FBRVosU0FBU0MsYUFBVCxDQUF1QkMsQ0FBdkIsRUFBMEI7QUFDdEIsUUFBSUMsSUFBSSxFQUFSO0FBQ0EsU0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlGLEVBQUVHLE1BQXRCLEVBQThCRCxHQUE5QjtBQUNJRCxVQUFFRyxJQUFGLENBQU9KLEVBQUVLLFVBQUYsQ0FBYUgsQ0FBYixDQUFQO0FBREosS0FFQSxPQUFPRCxDQUFQO0FBQ0g7O0FBRURLLFNBQVMsMERBQVQsRUFBcUUsWUFBTTtBQUN2RUEsYUFBUyxPQUFULEVBQWtCLFlB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LE1BQU0sZ0JBQU1mLElBQU4sQ0FBV3BDLE1BQVgsRUFBbUJpQixFQUFuQixFQUF1QmdCLENBQXZCLENBQVY7QUFDQWtCLGNBQU0sZ0JBQU1PLFNBQU4sQ0FBZ0IxRCxNQUFoQixFQUF3Qm1ELEdBQXhCLENBQU47O0FBRUE1QyxXQUFHLHdFQUFILEVBQTZFLFlBQU07QUFDL0VoQixpQkFBS2lCLE1BQUwsQ0FBWUUsTUFBWixDQUFtQixnQkFBTTBDLE1BQU4sQ0FBYXBELE1BQWIsRUFBcUJrQixFQUFyQixFQUF5QmUsQ0FBekIsRUFBNEJrQixHQUE1QixDQUFuQjtBQUNILFNBRkQ7O0FBSUE1QyxXQUFHLG1FQUFILEVBQXdFLFlBQU07QUFDMUUsZ0JBQUk4QyxnQkFBZ0I3RCxjQUFjLG9CQUFkLENBQXBCO0FBQ0EsZ0JBQUk4RCxLQUFLLElBQUlwRCxFQUFFUyxHQUFGLENBQU1rQixPQUFWLEVBQVQ7QUFDQXlCLGVBQUd4QixhQUFILENBQWlCdUIsYUFBakI7QUFDQSxnQkFBSUUsS0FBS0QsR0FBR3RCLElBQUgsRUFBVDtBQUNBLGdCQUFJd0IsS0FBS3RELEVBQUVTLEdBQUYsQ0FBTUMsR0FBTixDQUFVc0IsU0FBVixDQUFvQnFCLEVBQXBCLENBQVQ7O0FBRUFoRSxpQkFBS2lCLE1BQUwsQ0FBWWlELFNBQVosQ0FBc0IsZ0JBQU1MLE1BQU4sQ0FBYXBELE1BQWIsRUFBcUJrQixFQUFyQixFQUF5QnNDLEVBQXpCLEVBQTZCTCxHQUE3QixDQUF0QjtBQUNILFNBUkQ7QUFTSCxLQTdCRDtBQThCSCxDQXhNRCIsImZpbGUiOiJTY2hlbWVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgUFNTaWcgZnJvbSBcIi4uL1BTU2lnXCI7XHJcbmltcG9ydCBCcEdyb3VwIGZyb20gXCIuLi9CcEdyb3VwXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBtb2NoYSBmcm9tIFwibW9jaGFcIjtcclxuaW1wb3J0ICogYXMgY2hhaSBmcm9tICdjaGFpJztcclxuXHJcbmZ1bmN0aW9uIHN0cmluZ1RvQnl0ZXMocykge1xyXG4gICAgbGV0IGIgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKylcclxuICAgICAgICBiLnB1c2gocy5jaGFyQ29kZUF0KGkpKTtcclxuICAgIHJldHVybiBiO1xyXG59XHJcblxyXG5kZXNjcmliZShcIlBvaW50Y2hldmFsLVNhbmRlcnMgU2hvcnQgUmFuZG9taXphYmxlIFNpZ25hdHVyZXMgc2NoZW1lXCIsICgpID0+IHtcclxuICAgIGRlc2NyaWJlKFwiU2V0dXBcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBCcEdyb3VwIE9iamVjdFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90TnVsbChHKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKEcgaW5zdGFuY2VvZihCcEdyb3VwKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBHcm91cCBPcmRlclwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90TnVsbChvKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKG8gaW5zdGFuY2VvZihHLmN0eC5CSUcpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEdlbjFcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZzEpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZzEgaW5zdGFuY2VvZihHLmN0eC5FQ1ApKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEdlbjJcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZzIpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZzIgaW5zdGFuY2VvZihHLmN0eC5FQ1AyKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBQYWlyIGZ1bmN0aW9uXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKGUpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZSBpbnN0YW5jZW9mKEZ1bmN0aW9uKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZShcIktleWdlblwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xyXG5cclxuICAgICAgICBjb25zdCBbeCwgeV0gPSBzaztcclxuICAgICAgICBsZXQgW2csIFgsIFldID0gcGs7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBTZWNyZXQgS2V5ICh4LHkpXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHggaW5zdGFuY2VvZihHLmN0eC5CSUcpKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHkgaW5zdGFuY2VvZihHLmN0eC5CSUcpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gICAgICAgIGNvbnN0IHBrID0gW2cyLCBnMi5tdWwoeCksIGcyLm11bCh5KV07XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKFwiUmV0dXJucyBWYWxpZCBQcml2YXRlIEtleSAoZyxYLFkpXCIsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoXCJnID0gZzJcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKGcyLmVxdWFscyhnKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJYID0gZzIqeFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoWC5lcXVhbHMoZzIubXVsKHgpKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJZID0gZzIqeVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoWS5lcXVhbHMoZzIubXVsKHkpKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gaCwgc2lnID0gKHgreSptKSAqIGhcclxuICAgIGRlc2NyaWJlKFwiU2lnblwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xyXG4gICAgICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXN0TWVzc2FnZSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZUJ5dGVzID0gc3RyaW5nVG9CeXRlcyh0ZXN0TWVzc2FnZSk7XHJcbiAgICAgICAgY29uc3QgSCA9IG5ldyBHLmN0eC5IQVNIMjU2KCk7XHJcbiAgICAgICAgSC5wcm9jZXNzX2FycmF5KG1lc3NhZ2VCeXRlcyk7XHJcbiAgICAgICAgY29uc3QgUiA9IEguaGFzaCgpO1xyXG4gICAgICAgIGNvbnN0IG0gPSBHLmN0eC5CSUcuZnJvbUJ5dGVzKFIpO1xyXG5cclxuICAgICAgICBjb25zdCBzaWduYXR1cmUgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG4gICAgICAgIGNvbnN0IFtzaWcxLCBzaWcyXSA9IHNpZ25hdHVyZTtcclxuXHJcblxyXG4gICAgICAgIC8vIG9ubHkgd29ya3MgZm9yIHkgPD0gNTEzLi4uXHJcbiAgICAgICAgaXQoXCJGb3Igc2lnbmF0dXJlKHNpZzEsIHNpZzIpLCBzaWcyID0gKCh4K3kqKG0gbW9kIHApKSBtb2QgcCkgKiBzaWcxXCIsICgpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1jcHkgPSBuZXcgRy5jdHguQklHKG0pO1xyXG4gICAgICAgICAgICBtY3B5Lm1vZChvKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHQxID0gRy5jdHguQklHLm11bCh5LG1jcHkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgeERCSUcgPSAgbmV3IEcuY3R4LkRCSUcoMCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgRy5jdHguQklHLk5MRU47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgeERCSUcud1tpXSA9IHgud1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0MS5hZGQoeERCSUcpO1xyXG4gICAgICAgICAgICBjb25zdCBLID0gdDEubW9kKG8pO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2lnX3Rlc3QgPSBHLmN0eC5QQUlSLkcxbXVsKHNpZzEsIEspO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoc2lnMi5lcXVhbHMoc2lnX3Rlc3QpKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGRlc2NyaWJlKFwiVmVyaWZ5XCIsICgpID0+IHtcclxuICAgICAgICBkZXNjcmliZShcIldpdGggc2sgPSAoNDIsIDUxMylcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuXHJcbiAgICAgICAgICAgIC8vIGtleWdlbiBuZWVkcyB0byBiZSBkb25lIFwibWFudWFsbHlcIlxyXG4gICAgICAgICAgICBjb25zdCB4ID0gbmV3IEcuY3R4LkJJRyg0Mik7XHJcbiAgICAgICAgICAgIGNvbnN0IHkgPSBuZXcgRy5jdHguQklHKDUxMyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzayA9IFt4LCB5XTtcclxuICAgICAgICAgICAgY29uc3QgcGsgPSBbZzIsIGcyLm11bCh4KSwgZzIubXVsKHkpXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRlc3RNZXNzYWdlID0gXCJIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZUJ5dGVzID0gc3RyaW5nVG9CeXRlcyh0ZXN0TWVzc2FnZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IEggPSBuZXcgRy5jdHguSEFTSDI1NigpO1xyXG4gICAgICAgICAgICBILnByb2Nlc3NfYXJyYXkobWVzc2FnZUJ5dGVzKTtcclxuICAgICAgICAgICAgY29uc3QgUiA9IEguaGFzaCgpO1xyXG4gICAgICAgICAgICBjb25zdCBtID0gRy5jdHguQklHLmZyb21CeXRlcyhSKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNpZyA9IFBTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIlN1Y2Nlc3NmdWwgdmVyaWZpY2F0aW9uIGZvciBvcmlnaW5hbCBtZXNzYWdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShQU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbSwgc2lnKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJGYWlsZWQgdmVyaWZpY2F0aW9uIGZvciBhbm90aGVyIG1lc3NhZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2VCeXRlczIgPSBzdHJpbmdUb0J5dGVzKFwiT3RoZXIgSGVsbG8gV29ybGQhXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IEgyID0gbmV3IEcuY3R4LkhBU0gyNTYoKTtcclxuICAgICAgICAgICAgICAgIEgyLnByb2Nlc3NfYXJyYXkobWVzc2FnZUJ5dGVzMik7XHJcbiAgICAgICAgICAgICAgICBsZXQgUjIgPSBIMi5oYXNoKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbTIgPSBHLmN0eC5CSUcuZnJvbUJ5dGVzKFIyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdFRydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0yLCBzaWcpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZShcIldpdGggJ3Byb3BlcicgcmFuZG9tXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdGVzdE1lc3NhZ2UgPSBcIkhlbGxvIFdvcmxkIVwiO1xyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlQnl0ZXMgPSBzdHJpbmdUb0J5dGVzKHRlc3RNZXNzYWdlKTtcclxuICAgICAgICAgICAgY29uc3QgSCA9IG5ldyBHLmN0eC5IQVNIMjU2KCk7XHJcbiAgICAgICAgICAgIEgucHJvY2Vzc19hcnJheShtZXNzYWdlQnl0ZXMpO1xyXG4gICAgICAgICAgICBjb25zdCBSID0gSC5oYXNoKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG0gPSBHLmN0eC5CSUcuZnJvbUJ5dGVzKFIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2lnID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiU3VjY2Vzc2Z1bCB2ZXJpZmljYXRpb24gZm9yIG9yaWdpbmFsIG1lc3NhZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKFBTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtLCBzaWcpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIkZhaWxlZCB2ZXJpZmljYXRpb24gZm9yIGFub3RoZXIgbWVzc2FnZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZUJ5dGVzMiA9IHN0cmluZ1RvQnl0ZXMoXCJPdGhlciBIZWxsbyBXb3JsZCFcIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgSDIgPSBuZXcgRy5jdHguSEFTSDI1NigpO1xyXG4gICAgICAgICAgICAgICAgSDIucHJvY2Vzc19hcnJheShtZXNzYWdlQnl0ZXMyKTtcclxuICAgICAgICAgICAgICAgIGxldCBSMiA9IEgyLmhhc2goKTtcclxuICAgICAgICAgICAgICAgIGxldCBtMiA9IEcuY3R4LkJJRy5mcm9tQnl0ZXMoUjIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90VHJ1ZShQU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbTIsIHNpZykpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBkZXNjcmliZShcIlJhbmRvbWl6ZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xyXG4gICAgICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXN0TWVzc2FnZSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZUJ5dGVzID0gc3RyaW5nVG9CeXRlcyh0ZXN0TWVzc2FnZSk7XHJcbiAgICAgICAgY29uc3QgSCA9IG5ldyBHLmN0eC5IQVNIMjU2KCk7XHJcbiAgICAgICAgSC5wcm9jZXNzX2FycmF5KG1lc3NhZ2VCeXRlcyk7XHJcbiAgICAgICAgY29uc3QgUiA9IEguaGFzaCgpO1xyXG4gICAgICAgIGNvbnN0IG0gPSBHLmN0eC5CSUcuZnJvbUJ5dGVzKFIpO1xyXG5cclxuICAgICAgICBsZXQgc2lnID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcclxuICAgICAgICBzaWcgPSBQU1NpZy5yYW5kb21pemUocGFyYW1zLCBzaWcpO1xyXG5cclxuICAgICAgICBpdChcIlN1Y2Nlc3NmdWwgdmVyaWZpY2F0aW9uIGZvciBvcmlnaW5hbCBtZXNzYWdlIHdpdGggcmFuZG9taXplZCBzaWduYXR1cmVcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcIkZhaWxlZCB2ZXJpZmljYXRpb24gZm9yIGFub3RoZXIgbWVzc2FnZSB3aXRoIHJhbmRvbWl6ZWQgc2lnbmF0dXJlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG1lc3NhZ2VCeXRlczIgPSBzdHJpbmdUb0J5dGVzKFwiT3RoZXIgSGVsbG8gV29ybGQhXCIpO1xyXG4gICAgICAgICAgICBsZXQgSDIgPSBuZXcgRy5jdHguSEFTSDI1NigpO1xyXG4gICAgICAgICAgICBIMi5wcm9jZXNzX2FycmF5KG1lc3NhZ2VCeXRlczIpO1xyXG4gICAgICAgICAgICBsZXQgUjIgPSBIMi5oYXNoKCk7XHJcbiAgICAgICAgICAgIGxldCBtMiA9IEcuY3R4LkJJRy5mcm9tQnl0ZXMoUjIpO1xyXG5cclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3RUcnVlKFBTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtMiwgc2lnKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7Il19