"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _PSSig = require("../PSSig");

var _PSSig2 = _interopRequireDefault(_PSSig);

var _BpGroup = require("../BpGroup");

var _BpGroup2 = _interopRequireDefault(_BpGroup);

var _mocha = require("mocha");

var _chai = require("chai");

var chai = _interopRequireWildcard(_chai);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)("Pointcheval-Sanders Short Randomizable Signatures scheme", function () {
    (0, _mocha.describe)("Setup", function () {
        var params = _PSSig2.default.setup();

        var _params = _slicedToArray(params, 5),
            G = _params[0],
            o = _params[1],
            g1 = _params[2],
            g2 = _params[3],
            e = _params[4];

        (0, _mocha.it)("Returns BpGroup Object", function () {
            chai.assert.isNotNull(G);
            chai.assert.isTrue(G instanceof _BpGroup2.default);
        });

        (0, _mocha.it)("Returns Group Order", function () {
            chai.assert.isNotNull(o);
            chai.assert.isTrue(o instanceof G.ctx.BIG);
        });

        (0, _mocha.it)("Returns Gen1", function () {
            chai.assert.isNotNull(g1);
            chai.assert.isTrue(g1 instanceof G.ctx.ECP);
        });

        (0, _mocha.it)("Returns Gen2", function () {
            chai.assert.isNotNull(g2);
            chai.assert.isTrue(g2 instanceof G.ctx.ECP2);
        });

        (0, _mocha.it)("Returns Pair function", function () {
            chai.assert.isNotNull(e);
            chai.assert.isTrue(e instanceof Function);
        });
    });

    (0, _mocha.describe)("Keygen", function () {
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

        (0, _mocha.it)("Returns Secret Key (x,y)", function () {
            chai.assert.isTrue(x instanceof G.ctx.BIG);
            chai.assert.isTrue(y instanceof G.ctx.BIG);
        });

        // todo: replace g2.mul with PAIR.G2mul
        (0, _mocha.describe)("Returns Valid Private Key (g,X,Y)", function () {
            (0, _mocha.it)("g = g2", function () {
                chai.assert.isTrue(g2.equals(g));
            });

            (0, _mocha.it)("X = g2*x", function () {
                chai.assert.isTrue(X.equals(g2.mul(x)));
            });

            (0, _mocha.it)("Y = g2*y", function () {
                chai.assert.isTrue(Y.equals(g2.mul(y)));
            });
        });
    });

    // h, sig = (x+y*m) * h
    (0, _mocha.describe)("Sign", function () {
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

        var m = "Hello World!";

        var signature = _PSSig2.default.sign(params, sk, m);

        var _signature = _slicedToArray(signature, 2),
            sig1 = _signature[0],
            sig2 = _signature[1];

        (0, _mocha.it)("For signature(sig1, sig2), sig2 = ((x+y*(m mod p)) mod p) * sig1", function () {
            m = G.hashToBIG(m);
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

    (0, _mocha.describe)("Verify", function () {
        (0, _mocha.describe)("With sk = (42, 513)", function () {
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

            var m = "Hello World!";
            var sig = _PSSig2.default.sign(params, sk, m);

            (0, _mocha.it)("Successful verification for original message", function () {
                chai.assert.isTrue(_PSSig2.default.verify(params, pk, m, sig));
            });

            (0, _mocha.it)("Failed verification for another message", function () {
                var m2 = "Other Hello World!";
                chai.assert.isNotTrue(_PSSig2.default.verify(params, pk, m2, sig));
            });
        });

        (0, _mocha.describe)("With 'proper' random", function () {
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

            var m = "Hello World!";
            var sig = _PSSig2.default.sign(params, sk, m);

            (0, _mocha.it)("Successful verification for original message", function () {
                chai.assert.isTrue(_PSSig2.default.verify(params, pk, m, sig));
            });

            (0, _mocha.it)("Failed verification for another message", function () {
                var m2 = "Other Hello World!";
                chai.assert.isNotTrue(_PSSig2.default.verify(params, pk, m2, sig));
            });
        });
    });

    (0, _mocha.describe)("Randomize", function () {
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

        var m = "Hello World!";
        var sig = _PSSig2.default.sign(params, sk, m);
        sig = _PSSig2.default.randomize(params, sig);

        (0, _mocha.it)("Successful verification for original message with randomized signature", function () {
            chai.assert.isTrue(_PSSig2.default.verify(params, pk, m, sig));
        });

        (0, _mocha.it)("Failed verification for another message with randomized signature", function () {
            var m2 = "Other Hello World!";
            chai.assert.isNotTrue(_PSSig2.default.verify(params, pk, m2, sig));
        });
    });

    // todo: better test for whether aggregation is correct
    (0, _mocha.describe)("Aggregate", function () {
        (0, _mocha.it)("Aggregation(s1) = s1", function () {
            var params = _PSSig2.default.setup();

            var _params7 = _slicedToArray(params, 5),
                G = _params7[0],
                o = _params7[1],
                g1 = _params7[2],
                g2 = _params7[3],
                e = _params7[4];

            var _PSSig$keygen9 = _PSSig2.default.keygen(params),
                _PSSig$keygen10 = _slicedToArray(_PSSig$keygen9, 2),
                sk = _PSSig$keygen10[0],
                pk = _PSSig$keygen10[1];

            var _sk5 = _slicedToArray(sk, 2),
                x = _sk5[0],
                y = _sk5[1];

            var m = "Hello World!";
            var signature = _PSSig2.default.sign(params, sk, m);
            var aggregateSig = _PSSig2.default.aggregateSignatures(params, [signature]);

            chai.assert.isTrue(signature[1].equals(aggregateSig[1]));
        });
    });

    (0, _mocha.describe)("Aggregate Verification", function () {
        (0, _mocha.describe)("Aggregate Verification", function () {
            (0, _mocha.it)("Works for single signature", function () {
                var params = _PSSig2.default.setup();

                var _params8 = _slicedToArray(params, 5),
                    G = _params8[0],
                    o = _params8[1],
                    g1 = _params8[2],
                    g2 = _params8[3],
                    e = _params8[4];

                var _PSSig$keygen11 = _PSSig2.default.keygen(params),
                    _PSSig$keygen12 = _slicedToArray(_PSSig$keygen11, 2),
                    sk = _PSSig$keygen12[0],
                    pk = _PSSig$keygen12[1];

                var m = "Hello World!";
                var sig = _PSSig2.default.sign(params, sk, m);
                var aggregateSignature = _PSSig2.default.aggregateSignatures(params, [sig]);

                chai.assert.isTrue(_PSSig2.default.verifyAggregation(params, [pk], m, aggregateSignature));
            });

            (0, _mocha.it)("Works for three distinct signatures", function () {
                var params = _PSSig2.default.setup();

                var _params9 = _slicedToArray(params, 5),
                    G = _params9[0],
                    o = _params9[1],
                    g1 = _params9[2],
                    g2 = _params9[3],
                    e = _params9[4];

                var messagesToSign = 3;
                var pks = [];
                var signatures = [];

                var m = "Hello World!";

                for (var i = 0; i < messagesToSign; i++) {
                    var _PSSig$keygen13 = _PSSig2.default.keygen(params),
                        _PSSig$keygen14 = _slicedToArray(_PSSig$keygen13, 2),
                        sk = _PSSig$keygen14[0],
                        pk = _PSSig$keygen14[1];

                    pks.push(pk);
                    var signature = _PSSig2.default.sign(params, sk, m);
                    signatures.push(signature);
                }

                var aggregateSignature = _PSSig2.default.aggregateSignatures(params, signatures);

                chai.assert.isTrue(_PSSig2.default.verifyAggregation(params, pks, m, aggregateSignature));
            });

            (0, _mocha.it)("Doesn't work when one of three signatures is on different message", function () {
                var params = _PSSig2.default.setup();

                var _params10 = _slicedToArray(params, 5),
                    G = _params10[0],
                    o = _params10[1],
                    g1 = _params10[2],
                    g2 = _params10[3],
                    e = _params10[4];

                var messagesToSign = 2;
                var pks = [];
                var signatures = [];

                var m = "Hello World!";

                for (var i = 0; i < messagesToSign; i++) {
                    var _PSSig$keygen15 = _PSSig2.default.keygen(params),
                        _PSSig$keygen16 = _slicedToArray(_PSSig$keygen15, 2),
                        sk = _PSSig$keygen16[0],
                        pk = _PSSig$keygen16[1];

                    pks.push(pk);
                    var signature = _PSSig2.default.sign(params, sk, m);
                    signatures.push(signature);
                }

                var m2 = "Malicious Hello World";

                var _PSSig$keygen17 = _PSSig2.default.keygen(params),
                    _PSSig$keygen18 = _slicedToArray(_PSSig$keygen17, 2),
                    skm = _PSSig$keygen18[0],
                    pkm = _PSSig$keygen18[1];

                pks.push(pkm);
                var maliciousSignature = _PSSig2.default.sign(params, skm, m2);
                signatures.push(maliciousSignature);

                var aggregateSignature = _PSSig2.default.aggregateSignatures(params, signatures);

                chai.assert.isNotTrue(_PSSig2.default.verifyAggregation(params, pks, m, aggregateSignature));
            });
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L1BTU2lnVGVzdHMuanMiXSwibmFtZXMiOlsiY2hhaSIsInBhcmFtcyIsInNldHVwIiwiRyIsIm8iLCJnMSIsImcyIiwiZSIsImFzc2VydCIsImlzTm90TnVsbCIsImlzVHJ1ZSIsImN0eCIsIkJJRyIsIkVDUCIsIkVDUDIiLCJGdW5jdGlvbiIsImtleWdlbiIsInNrIiwicGsiLCJ4IiwieSIsImciLCJYIiwiWSIsImVxdWFscyIsIm11bCIsIm0iLCJzaWduYXR1cmUiLCJzaWduIiwic2lnMSIsInNpZzIiLCJoYXNoVG9CSUciLCJtY3B5IiwibW9kIiwidDEiLCJ4REJJRyIsIkRCSUciLCJpIiwiTkxFTiIsInciLCJhZGQiLCJLIiwic2lnX3Rlc3QiLCJQQUlSIiwiRzFtdWwiLCJzaWciLCJ2ZXJpZnkiLCJtMiIsImlzTm90VHJ1ZSIsInJhbmRvbWl6ZSIsImFnZ3JlZ2F0ZVNpZyIsImFnZ3JlZ2F0ZVNpZ25hdHVyZXMiLCJhZ2dyZWdhdGVTaWduYXR1cmUiLCJ2ZXJpZnlBZ2dyZWdhdGlvbiIsIm1lc3NhZ2VzVG9TaWduIiwicGtzIiwic2lnbmF0dXJlcyIsInB1c2giLCJza20iLCJwa20iLCJtYWxpY2lvdXNTaWduYXR1cmUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7O0FBQ0E7O0lBQVlBLEk7Ozs7OztBQUdaLHFCQUFTLDBEQUFULEVBQXFFLFlBQU07QUFDdkUseUJBQVMsT0FBVCxFQUFrQixZQUFNO0FBQ3BCLFlBQU1DLFNBQVMsZ0JBQU1DLEtBQU4sRUFBZjs7QUFEb0IscUNBRU1ELE1BRk47QUFBQSxZQUViRSxDQUZhO0FBQUEsWUFFVkMsQ0FGVTtBQUFBLFlBRVBDLEVBRk87QUFBQSxZQUVIQyxFQUZHO0FBQUEsWUFFQ0MsQ0FGRDs7QUFJcEIsdUJBQUcsd0JBQUgsRUFBNkIsWUFBTTtBQUMvQlAsaUJBQUtRLE1BQUwsQ0FBWUMsU0FBWixDQUFzQk4sQ0FBdEI7QUFDQUgsaUJBQUtRLE1BQUws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QUExQixFQUFrQ3VELFVBQWxDLENBQTNCOztBQUVBeEQscUJBQUtRLE1BQUwsQ0FBWXdDLFNBQVosQ0FBc0IsZ0JBQU1LLGlCQUFOLENBQXdCcEQsTUFBeEIsRUFBZ0NzRCxHQUFoQyxFQUFxQzdCLENBQXJDLEVBQXdDMEIsa0JBQXhDLENBQXRCO0FBQ0gsYUExQkQ7QUEyQkgsU0EvREQ7QUFnRUgsS0FqRUQ7QUFrRUgsQ0FwUEQiLCJmaWxlIjoiUFNTaWdUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQU1NpZyBmcm9tIFwiLi4vUFNTaWdcIjtcclxuaW1wb3J0IEJwR3JvdXAgZnJvbSBcIi4uL0JwR3JvdXBcIjtcclxuXHJcbmltcG9ydCB7ZGVzY3JpYmUsIGl0LCB4aXR9IGZyb20gXCJtb2NoYVwiO1xyXG5pbXBvcnQgKiBhcyBjaGFpIGZyb20gJ2NoYWknO1xyXG5cclxuXHJcbmRlc2NyaWJlKFwiUG9pbnRjaGV2YWwtU2FuZGVycyBTaG9ydCBSYW5kb21pemFibGUgU2lnbmF0dXJlcyBzY2hlbWVcIiwgKCkgPT4ge1xyXG4gICAgZGVzY3JpYmUoXCJTZXR1cFwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEJwR3JvdXAgT2JqZWN0XCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKEcpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoRyBpbnN0YW5jZW9mIChCcEdyb3VwKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBHcm91cCBPcmRlclwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90TnVsbChvKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKG8gaW5zdGFuY2VvZiAoRy5jdHguQklHKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBHZW4xXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKGcxKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKGcxIGluc3RhbmNlb2YgKEcuY3R4LkVDUCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcIlJldHVybnMgR2VuMlwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90TnVsbChnMik7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShnMiBpbnN0YW5jZW9mIChHLmN0eC5FQ1AyKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBQYWlyIGZ1bmN0aW9uXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKGUpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZSBpbnN0YW5jZW9mIChGdW5jdGlvbikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoXCJLZXlnZW5cIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFBTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3NrLCBwa10gPSBQU1NpZy5rZXlnZW4ocGFyYW1zKTtcclxuXHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gc2s7XHJcbiAgICAgICAgbGV0IFtnLCBYLCBZXSA9IHBrO1xyXG5cclxuICAgICAgICBpdChcIlJldHVybnMgU2VjcmV0IEtleSAoeCx5KVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZSh4IGluc3RhbmNlb2YgKEcuY3R4LkJJRykpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoeSBpbnN0YW5jZW9mIChHLmN0eC5CSUcpKTtcclxuICAgICAgICB9KTtcclxuXHJcbi8vIHRvZG86IHJlcGxhY2UgZzIubXVsIHdpdGggUEFJUi5HMm11bFxyXG4gICAgICAgIGRlc2NyaWJlKFwiUmV0dXJucyBWYWxpZCBQcml2YXRlIEtleSAoZyxYLFkpXCIsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoXCJnID0gZzJcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKGcyLmVxdWFscyhnKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJYID0gZzIqeFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoWC5lcXVhbHMoZzIubXVsKHgpKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJZID0gZzIqeVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoWS5lcXVhbHMoZzIubXVsKHkpKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcblxyXG4vLyBoLCBzaWcgPSAoeCt5Km0pICogaFxyXG4gICAgZGVzY3JpYmUoXCJTaWduXCIsICgpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICAgICAgY29uc3QgW3gsIHldID0gc2s7XHJcblxyXG4gICAgICAgIGxldCBtID0gXCJIZWxsbyBXb3JsZCFcIjtcclxuXHJcbiAgICAgICAgY29uc3Qgc2lnbmF0dXJlID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcclxuICAgICAgICBjb25zdCBbc2lnMSwgc2lnMl0gPSBzaWduYXR1cmU7XHJcblxyXG5cclxuICAgICAgICBpdChcIkZvciBzaWduYXR1cmUoc2lnMSwgc2lnMiksIHNpZzIgPSAoKHgreSoobSBtb2QgcCkpIG1vZCBwKSAqIHNpZzFcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBtID0gRy5oYXNoVG9CSUcobSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1jcHkgPSBuZXcgRy5jdHguQklHKG0pO1xyXG4gICAgICAgICAgICBtY3B5Lm1vZChvKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHQxID0gRy5jdHguQklHLm11bCh5LCBtY3B5KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHhEQklHID0gbmV3IEcuY3R4LkRCSUcoMCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgRy5jdHguQklHLk5MRU47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgeERCSUcud1tpXSA9IHgud1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0MS5hZGQoeERCSUcpO1xyXG4gICAgICAgICAgICBjb25zdCBLID0gdDEubW9kKG8pO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2lnX3Rlc3QgPSBHLmN0eC5QQUlSLkcxbXVsKHNpZzEsIEspO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoc2lnMi5lcXVhbHMoc2lnX3Rlc3QpKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGRlc2NyaWJlKFwiVmVyaWZ5XCIsICgpID0+IHtcclxuICAgICAgICBkZXNjcmliZShcIldpdGggc2sgPSAoNDIsIDUxMylcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuXHJcbiAgICAgICAgICAgIC8vIGtleWdlbiBuZWVkcyB0byBiZSBkb25lIFwibWFudWFsbHlcIlxyXG4gICAgICAgICAgICBjb25zdCB4ID0gbmV3IEcuY3R4LkJJRyg0Mik7XHJcbiAgICAgICAgICAgIGNvbnN0IHkgPSBuZXcgRy5jdHguQklHKDUxMyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzayA9IFt4LCB5XTtcclxuICAgICAgICAgICAgY29uc3QgcGsgPSBbZzIsIGcyLm11bCh4KSwgZzIubXVsKHkpXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG0gPSBcIkhlbGxvIFdvcmxkIVwiO1xyXG4gICAgICAgICAgICBjb25zdCBzaWcgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJTdWNjZXNzZnVsIHZlcmlmaWNhdGlvbiBmb3Igb3JpZ2luYWwgbWVzc2FnZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiRmFpbGVkIHZlcmlmaWNhdGlvbiBmb3IgYW5vdGhlciBtZXNzYWdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtMiA9IFwiT3RoZXIgSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdFRydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0yLCBzaWcpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZShcIldpdGggJ3Byb3BlcicgcmFuZG9tXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpZyA9IFBTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIlN1Y2Nlc3NmdWwgdmVyaWZpY2F0aW9uIGZvciBvcmlnaW5hbCBtZXNzYWdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShQU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbSwgc2lnKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJGYWlsZWQgdmVyaWZpY2F0aW9uIGZvciBhbm90aGVyIG1lc3NhZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG0yID0gXCJPdGhlciBIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90VHJ1ZShQU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbTIsIHNpZykpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBkZXNjcmliZShcIlJhbmRvbWl6ZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuICAgICAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xyXG4gICAgICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xyXG5cclxuICAgICAgICBjb25zdCBtID0gXCJIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICBsZXQgc2lnID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcclxuICAgICAgICBzaWcgPSBQU1NpZy5yYW5kb21pemUocGFyYW1zLCBzaWcpO1xyXG5cclxuICAgICAgICBpdChcIlN1Y2Nlc3NmdWwgdmVyaWZpY2F0aW9uIGZvciBvcmlnaW5hbCBtZXNzYWdlIHdpdGggcmFuZG9taXplZCBzaWduYXR1cmVcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoUFNTaWcudmVyaWZ5KHBhcmFtcywgcGssIG0sIHNpZykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcIkZhaWxlZCB2ZXJpZmljYXRpb24gZm9yIGFub3RoZXIgbWVzc2FnZSB3aXRoIHJhbmRvbWl6ZWQgc2lnbmF0dXJlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG0yID0gXCJPdGhlciBIZWxsbyBXb3JsZCFcIjtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3RUcnVlKFBTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtMiwgc2lnKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbi8vIHRvZG86IGJldHRlciB0ZXN0IGZvciB3aGV0aGVyIGFnZ3JlZ2F0aW9uIGlzIGNvcnJlY3RcclxuICAgIGRlc2NyaWJlKFwiQWdncmVnYXRlXCIsICgpID0+IHtcclxuICAgICAgICBpdChcIkFnZ3JlZ2F0aW9uKHMxKSA9IHMxXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgICAgIGNvbnN0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IFt4LCB5XSA9IHNrO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgICAgIGxldCBzaWduYXR1cmUgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG4gICAgICAgICAgICBsZXQgYWdncmVnYXRlU2lnID0gUFNTaWcuYWdncmVnYXRlU2lnbmF0dXJlcyhwYXJhbXMsIFtzaWduYXR1cmVdKTtcclxuXHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShzaWduYXR1cmVbMV0uZXF1YWxzKGFnZ3JlZ2F0ZVNpZ1sxXSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGRlc2NyaWJlKFwiQWdncmVnYXRlIFZlcmlmaWNhdGlvblwiLCAoKSA9PiB7XHJcbiAgICAgICAgZGVzY3JpYmUoXCJBZ2dyZWdhdGUgVmVyaWZpY2F0aW9uXCIsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoXCJXb3JrcyBmb3Igc2luZ2xlIHNpZ25hdHVyZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBQU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBbc2ssIHBrXSA9IFBTU2lnLmtleWdlbihwYXJhbXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG0gPSBcIkhlbGxvIFdvcmxkIVwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2lnID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFnZ3JlZ2F0ZVNpZ25hdHVyZSA9IFBTU2lnLmFnZ3JlZ2F0ZVNpZ25hdHVyZXMocGFyYW1zLCBbc2lnXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKFBTU2lnLnZlcmlmeUFnZ3JlZ2F0aW9uKHBhcmFtcywgW3BrXSwgbSwgYWdncmVnYXRlU2lnbmF0dXJlKSk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiV29ya3MgZm9yIHRocmVlIGRpc3RpbmN0IHNpZ25hdHVyZXNcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VzVG9TaWduID0gMztcclxuICAgICAgICAgICAgICAgIGxldCBwa3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIGxldCBzaWduYXR1cmVzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNzYWdlc1RvU2lnbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IFtzaywgcGtdID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGtzLnB1c2gocGspO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaWduYXR1cmUgPSBQU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpZ25hdHVyZXMucHVzaChzaWduYXR1cmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGFnZ3JlZ2F0ZVNpZ25hdHVyZSA9IFBTU2lnLmFnZ3JlZ2F0ZVNpZ25hdHVyZXMocGFyYW1zLCBzaWduYXR1cmVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoUFNTaWcudmVyaWZ5QWdncmVnYXRpb24ocGFyYW1zLCBwa3MsIG0sIGFnZ3JlZ2F0ZVNpZ25hdHVyZSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiRG9lc24ndCB3b3JrIHdoZW4gb25lIG9mIHRocmVlIHNpZ25hdHVyZXMgaXMgb24gZGlmZmVyZW50IG1lc3NhZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gUFNTaWcuc2V0dXAoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VzVG9TaWduID0gMjtcclxuICAgICAgICAgICAgICAgIGxldCBwa3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIGxldCBzaWduYXR1cmVzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNzYWdlc1RvU2lnbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW3NrLCBwa10gPSBQU1NpZy5rZXlnZW4ocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICBwa3MucHVzaChwayk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2lnbmF0dXJlID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcclxuICAgICAgICAgICAgICAgICAgICBzaWduYXR1cmVzLnB1c2goc2lnbmF0dXJlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBtMiA9IFwiTWFsaWNpb3VzIEhlbGxvIFdvcmxkXCI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBbc2ttLCBwa21dID0gUFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICBwa3MucHVzaChwa20pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWFsaWNpb3VzU2lnbmF0dXJlID0gUFNTaWcuc2lnbihwYXJhbXMsIHNrbSwgbTIpO1xyXG4gICAgICAgICAgICAgICAgc2lnbmF0dXJlcy5wdXNoKG1hbGljaW91c1NpZ25hdHVyZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWdncmVnYXRlU2lnbmF0dXJlID0gUFNTaWcuYWdncmVnYXRlU2lnbmF0dXJlcyhwYXJhbXMsIHNpZ25hdHVyZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90VHJ1ZShQU1NpZy52ZXJpZnlBZ2dyZWdhdGlvbihwYXJhbXMsIHBrcywgbSwgYWdncmVnYXRlU2lnbmF0dXJlKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXX0=