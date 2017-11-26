"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _BLSSig = require("../BLSSig");

var _BLSSig2 = _interopRequireDefault(_BLSSig);

var _BpGroup = require("../BpGroup");

var _BpGroup2 = _interopRequireDefault(_BpGroup);

var _mocha = require("mocha");

var _chai = require("chai");

var chai = _interopRequireWildcard(_chai);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)("Boneh–Lynn–Shacham-based Signature scheme", function () {
    (0, _mocha.describe)("Setup", function () {
        var params = _BLSSig2.default.setup();

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
        var params = _BLSSig2.default.setup();

        var _params2 = _slicedToArray(params, 5),
            G = _params2[0],
            o = _params2[1],
            g1 = _params2[2],
            g2 = _params2[3],
            e = _params2[4];

        var _BLSSig$keygen = _BLSSig2.default.keygen(params),
            _BLSSig$keygen2 = _slicedToArray(_BLSSig$keygen, 2),
            sk = _BLSSig$keygen2[0],
            pk = _BLSSig$keygen2[1];

        (0, _mocha.it)("Returns Secret Key x", function () {
            chai.assert.isTrue(sk instanceof G.ctx.BIG);
        });

        (0, _mocha.it)("Returns Valid Private Key v = x * g2", function () {
            chai.assert.isTrue(pk.equals(G.ctx.PAIR.G2mul(g2, sk)));
        });
    });

    // sig = sk * H(m)
    (0, _mocha.describe)("Sign", function () {
        var params = _BLSSig2.default.setup();

        var _params3 = _slicedToArray(params, 5),
            G = _params3[0],
            o = _params3[1],
            g1 = _params3[2],
            g2 = _params3[3],
            e = _params3[4];

        var _BLSSig$keygen3 = _BLSSig2.default.keygen(params),
            _BLSSig$keygen4 = _slicedToArray(_BLSSig$keygen3, 2),
            sk = _BLSSig$keygen4[0],
            pk = _BLSSig$keygen4[1];

        var m = "Hello World!";

        var signature = _BLSSig2.default.sign(params, sk, m);

        (0, _mocha.it)("signature = sk * H(m)", function () {
            var h = G.hashToPointOnCurve(m);

            var sig_test = G.ctx.PAIR.G1mul(h, sk);
            chai.assert.isTrue(signature.equals(sig_test));
        });
    });

    // e(sig, g2) = e(h, pk)
    (0, _mocha.describe)("Verify", function () {
        var params = _BLSSig2.default.setup();

        var _params4 = _slicedToArray(params, 5),
            G = _params4[0],
            o = _params4[1],
            g1 = _params4[2],
            g2 = _params4[3],
            e = _params4[4];

        var _BLSSig$keygen5 = _BLSSig2.default.keygen(params),
            _BLSSig$keygen6 = _slicedToArray(_BLSSig$keygen5, 2),
            sk = _BLSSig$keygen6[0],
            pk = _BLSSig$keygen6[1];

        var m = "Hello World!";
        var sig = _BLSSig2.default.sign(params, sk, m);

        (0, _mocha.it)("Successful verification for original message", function () {
            chai.assert.isTrue(_BLSSig2.default.verify(params, pk, m, sig));
        });

        (0, _mocha.it)("Failed verification for another message", function () {
            var m2 = "Other Hello World!";
            chai.assert.isNotTrue(_BLSSig2.default.verify(params, pk, m2, sig));
        });
    });

    (0, _mocha.describe)("Aggregate", function () {
        (0, _mocha.it)("Aggregation(sig1) = sig1", function () {
            var params = _BLSSig2.default.setup();

            var _params5 = _slicedToArray(params, 5),
                G = _params5[0],
                o = _params5[1],
                g1 = _params5[2],
                g2 = _params5[3],
                e = _params5[4];

            var _BLSSig$keygen7 = _BLSSig2.default.keygen(params),
                _BLSSig$keygen8 = _slicedToArray(_BLSSig$keygen7, 2),
                sk = _BLSSig$keygen8[0],
                pk = _BLSSig$keygen8[1];

            var m = "Hello World!";
            var sig = _BLSSig2.default.sign(params, sk, m);
            var aggregateSignature = _BLSSig2.default.aggregateSignatures(params, [sig]);

            chai.assert.isTrue(sig.equals(aggregateSignature));
        });
    });

    (0, _mocha.describe)("Aggregate Verification", function () {
        (0, _mocha.it)("Works for single signature", function () {
            var params = _BLSSig2.default.setup();

            var _params6 = _slicedToArray(params, 5),
                G = _params6[0],
                o = _params6[1],
                g1 = _params6[2],
                g2 = _params6[3],
                e = _params6[4];

            var _BLSSig$keygen9 = _BLSSig2.default.keygen(params),
                _BLSSig$keygen10 = _slicedToArray(_BLSSig$keygen9, 2),
                sk = _BLSSig$keygen10[0],
                pk = _BLSSig$keygen10[1];

            var m = "Hello World!";
            var sig = _BLSSig2.default.sign(params, sk, m);
            var aggregateSignature = _BLSSig2.default.aggregateSignatures(params, [sig]);

            chai.assert.isTrue(_BLSSig2.default.verifyAggregation(params, [pk], m, aggregateSignature));
        });

        (0, _mocha.it)("Works for three distinct signatures", function () {
            var params = _BLSSig2.default.setup();

            var _params7 = _slicedToArray(params, 5),
                G = _params7[0],
                o = _params7[1],
                g1 = _params7[2],
                g2 = _params7[3],
                e = _params7[4];

            var messagesToSign = 3;
            var pks = [];
            var signatures = [];

            var m = "Hello World!";

            for (var i = 0; i < messagesToSign; i++) {
                var _BLSSig$keygen11 = _BLSSig2.default.keygen(params),
                    _BLSSig$keygen12 = _slicedToArray(_BLSSig$keygen11, 2),
                    sk = _BLSSig$keygen12[0],
                    pk = _BLSSig$keygen12[1];

                pks.push(pk);
                var signature = _BLSSig2.default.sign(params, sk, m);
                signatures.push(signature);
            }

            var aggregateSignature = _BLSSig2.default.aggregateSignatures(params, signatures);

            chai.assert.isTrue(_BLSSig2.default.verifyAggregation(params, pks, m, aggregateSignature));
        });

        (0, _mocha.it)("Doesn't work when one of three signatures is on different message", function () {
            var params = _BLSSig2.default.setup();

            var _params8 = _slicedToArray(params, 5),
                G = _params8[0],
                o = _params8[1],
                g1 = _params8[2],
                g2 = _params8[3],
                e = _params8[4];

            var messagesToSign = 2;
            var pks = [];
            var signatures = [];

            var m = "Hello World!";

            for (var i = 0; i < messagesToSign; i++) {
                var _BLSSig$keygen13 = _BLSSig2.default.keygen(params),
                    _BLSSig$keygen14 = _slicedToArray(_BLSSig$keygen13, 2),
                    sk = _BLSSig$keygen14[0],
                    pk = _BLSSig$keygen14[1];

                pks.push(pk);
                var signature = _BLSSig2.default.sign(params, sk, m);
                signatures.push(signature);
            }

            var m2 = "Malicious Hello World";

            var _BLSSig$keygen15 = _BLSSig2.default.keygen(params),
                _BLSSig$keygen16 = _slicedToArray(_BLSSig$keygen15, 2),
                skm = _BLSSig$keygen16[0],
                pkm = _BLSSig$keygen16[1];

            pks.push(pkm);
            var maliciousSignature = _BLSSig2.default.sign(params, skm, m2);
            signatures.push(maliciousSignature);

            var aggregateSignature = _BLSSig2.default.aggregateSignatures(params, signatures);

            chai.assert.isNotTrue(_BLSSig2.default.verifyAggregation(params, pks, m, aggregateSignature));
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L0JMU1NpZ1Rlc3RzLmpzIl0sIm5hbWVzIjpbImNoYWkiLCJwYXJhbXMiLCJzZXR1cCIsIkciLCJvIiwiZzEiLCJnMiIsImUiLCJhc3NlcnQiLCJpc05vdE51bGwiLCJpc1RydWUiLCJjdHgiLCJCSUciLCJFQ1AiLCJFQ1AyIiwiRnVuY3Rpb24iLCJrZXlnZW4iLCJzayIsInBrIiwiZXF1YWxzIiwiUEFJUiIsIkcybXVsIiwibSIsInNpZ25hdHVyZSIsInNpZ24iLCJoIiwiaGFzaFRvUG9pbnRPbkN1cnZlIiwic2lnX3Rlc3QiLCJHMW11bCIsInNpZyIsInZlcmlmeSIsIm0yIiwiaXNOb3RUcnVlIiwiYWdncmVnYXRlU2lnbmF0dXJlIiwiYWdncmVnYXRlU2lnbmF0dXJlcyIsInZlcmlmeUFnZ3JlZ2F0aW9uIiwibWVzc2FnZXNUb1NpZ24iLCJwa3MiLCJzaWduYXR1cmVzIiwiaSIsInB1c2giLCJza20iLCJwa20iLCJtYWxpY2lvdXNTaWduYXR1cmUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7O0FBQ0E7O0lBQVlBLEk7Ozs7OztBQUVaLHFCQUFTLDJDQUFULEVBQXNELFlBQU07QUFDeEQseUJBQVMsT0FBVCxFQUFrQixZQUFNO0FBQ3BCLFlBQU1DLFNBQVMsaUJBQU9DLEtBQVAsRUFBZjs7QUFEb0IscUNBRU1ELE1BRk47QUFBQSxZQUViRSxDQUZhO0FBQUEsWUFFVkMsQ0FGVTtBQUFBLFlBRVBDLEVBRk87QUFBQSxZQUVIQyxFQUZHO0FBQUEsWUFFQ0MsQ0FGRDs7QUFJcEIsdUJBQUcsd0JBQUgsRUFBNkIsWUFBTTtBQUMvQlAsaUJBQUtRLE1BQUwsQ0FBWUMsU0FBWixDQUFzQk4sQ0FBdEI7QUFDQUgsaUJBQUtRLE1BQUwsQ0FBWUUsTUFBWixDQUFtQlAsOEJBQW5CO0FBQ0gsU0FIRDs7QUFLQSx1QkFBRyxxQkFBSCxFQUEwQixZQUFNO0FBQzVCSCxpQkFBS1EsTUFBTCxDQUFZQyxTQUFaLENBQXNC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LGlCQUFLLElBQUlpQixJQUFJLENBQWIsRUFBZ0JBLElBQUlILGNBQXBCLEVBQW9DRyxHQUFwQyxFQUF5QztBQUFBLHVDQUNwQixpQkFBT3ZCLE1BQVAsQ0FBY2YsTUFBZCxDQURvQjtBQUFBO0FBQUEsb0JBQzlCZ0IsRUFEOEI7QUFBQSxvQkFDMUJDLEVBRDBCOztBQUVyQ21CLG9CQUFJRyxJQUFKLENBQVN0QixFQUFUO0FBQ0Esb0JBQU1LLFlBQVksaUJBQU9DLElBQVAsQ0FBWXZCLE1BQVosRUFBb0JnQixFQUFwQixFQUF3QkssQ0FBeEIsQ0FBbEI7QUFDQWdCLDJCQUFXRSxJQUFYLENBQWdCakIsU0FBaEI7QUFDSDs7QUFFRCxnQkFBTVEsS0FBSyx1QkFBWDs7QUFqQjBFLG1DQWtCdkQsaUJBQU9mLE1BQVAsQ0FBY2YsTUFBZCxDQWxCdUQ7QUFBQTtBQUFBLGdCQWtCbkV3QyxHQWxCbUU7QUFBQSxnQkFrQjlEQyxHQWxCOEQ7O0FBbUIxRUwsZ0JBQUlHLElBQUosQ0FBU0UsR0FBVDtBQUNBLGdCQUFNQyxxQkFBcUIsaUJBQU9uQixJQUFQLENBQVl2QixNQUFaLEVBQW9Cd0MsR0FBcEIsRUFBeUJWLEVBQXpCLENBQTNCO0FBQ0FPLHVCQUFXRSxJQUFYLENBQWdCRyxrQkFBaEI7O0FBRUEsZ0JBQU1WLHFCQUFxQixpQkFBT0MsbUJBQVAsQ0FBMkJqQyxNQUEzQixFQUFtQ3FDLFVBQW5DLENBQTNCOztBQUVBdEMsaUJBQUtRLE1BQUwsQ0FBWXdCLFNBQVosQ0FBc0IsaUJBQU9HLGlCQUFQLENBQXlCbEMsTUFBekIsRUFBaUNvQyxHQUFqQyxFQUFzQ2YsQ0FBdEMsRUFBeUNXLGtCQUF6QyxDQUF0QjtBQUNILFNBMUJEO0FBMkJILEtBL0REO0FBZ0VILENBaktEIiwiZmlsZSI6IkJMU1NpZ1Rlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJMU1NpZyBmcm9tIFwiLi4vQkxTU2lnXCI7XHJcbmltcG9ydCBCcEdyb3VwIGZyb20gXCIuLi9CcEdyb3VwXCI7XHJcblxyXG5pbXBvcnQge2Rlc2NyaWJlLCBpdCwgeGl0fSBmcm9tIFwibW9jaGFcIjtcclxuaW1wb3J0ICogYXMgY2hhaSBmcm9tICdjaGFpJztcclxuXHJcbmRlc2NyaWJlKFwiQm9uZWjigJNMeW5u4oCTU2hhY2hhbS1iYXNlZCBTaWduYXR1cmUgc2NoZW1lXCIsICgpID0+IHtcclxuICAgIGRlc2NyaWJlKFwiU2V0dXBcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IEJMU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgICAgICBpdChcIlJldHVybnMgQnBHcm91cCBPYmplY3RcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoRyk7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShHIGluc3RhbmNlb2YgKEJwR3JvdXApKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEdyb3VwIE9yZGVyXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKG8pO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUobyBpbnN0YW5jZW9mIChHLmN0eC5CSUcpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIEdlbjFcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZzEpO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZzEgaW5zdGFuY2VvZiAoRy5jdHguRUNQKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiUmV0dXJucyBHZW4yXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3ROdWxsKGcyKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKGcyIGluc3RhbmNlb2YgKEcuY3R4LkVDUDIpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJSZXR1cm5zIFBhaXIgZnVuY3Rpb25cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdE51bGwoZSk7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShlIGluc3RhbmNlb2YgKEZ1bmN0aW9uKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZShcIktleWdlblwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gQkxTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3NrLCBwa10gPSBCTFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcblxyXG5cclxuICAgICAgICBpdChcIlJldHVybnMgU2VjcmV0IEtleSB4XCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHNrIGluc3RhbmNlb2YgKEcuY3R4LkJJRykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcIlJldHVybnMgVmFsaWQgUHJpdmF0ZSBLZXkgdiA9IHggKiBnMlwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShway5lcXVhbHMoRy5jdHguUEFJUi5HMm11bChnMiwgc2spKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBzaWcgPSBzayAqIEgobSlcclxuICAgIGRlc2NyaWJlKFwiU2lnblwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gQkxTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3NrLCBwa10gPSBCTFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcblxyXG4gICAgICAgIGxldCBtID0gXCJIZWxsbyBXb3JsZCFcIjtcclxuXHJcbiAgICAgICAgY29uc3Qgc2lnbmF0dXJlID0gQkxTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XHJcblxyXG4gICAgICAgIGl0KFwic2lnbmF0dXJlID0gc2sgKiBIKG0pXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaCA9IEcuaGFzaFRvUG9pbnRPbkN1cnZlKG0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2lnX3Rlc3QgPSBHLmN0eC5QQUlSLkcxbXVsKGgsIHNrKTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKHNpZ25hdHVyZS5lcXVhbHMoc2lnX3Rlc3QpKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gZShzaWcsIGcyKSA9IGUoaCwgcGspXHJcbiAgICBkZXNjcmliZShcIlZlcmlmeVwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gQkxTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgY29uc3QgW3NrLCBwa10gPSBCTFNTaWcua2V5Z2VuKHBhcmFtcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG0gPSBcIkhlbGxvIFdvcmxkIVwiO1xyXG4gICAgICAgIGNvbnN0IHNpZyA9IEJMU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG5cclxuICAgICAgICBpdChcIlN1Y2Nlc3NmdWwgdmVyaWZpY2F0aW9uIGZvciBvcmlnaW5hbCBtZXNzYWdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKEJMU1NpZy52ZXJpZnkocGFyYW1zLCBwaywgbSwgc2lnKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiRmFpbGVkIHZlcmlmaWNhdGlvbiBmb3IgYW5vdGhlciBtZXNzYWdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbTIgPSBcIk90aGVyIEhlbGxvIFdvcmxkIVwiO1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdFRydWUoQkxTU2lnLnZlcmlmeShwYXJhbXMsIHBrLCBtMiwgc2lnKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZShcIkFnZ3JlZ2F0ZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoXCJBZ2dyZWdhdGlvbihzaWcxKSA9IHNpZzFcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBCTFNTaWcuc2V0dXAoKTtcclxuICAgICAgICAgICAgY29uc3QgW0csIG8sIGcxLCBnMiwgZV0gPSBwYXJhbXM7XHJcbiAgICAgICAgICAgIGNvbnN0IFtzaywgcGtdID0gQkxTU2lnLmtleWdlbihwYXJhbXMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpZyA9IEJMU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG4gICAgICAgICAgICBjb25zdCBhZ2dyZWdhdGVTaWduYXR1cmUgPSBCTFNTaWcuYWdncmVnYXRlU2lnbmF0dXJlcyhwYXJhbXMsIFtzaWddKTtcclxuXHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShzaWcuZXF1YWxzKGFnZ3JlZ2F0ZVNpZ25hdHVyZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoXCJBZ2dyZWdhdGUgVmVyaWZpY2F0aW9uXCIsICgpID0+IHtcclxuICAgICAgICBpdChcIldvcmtzIGZvciBzaW5nbGUgc2lnbmF0dXJlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gQkxTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG4gICAgICAgICAgICBjb25zdCBbc2ssIHBrXSA9IEJMU1NpZy5rZXlnZW4ocGFyYW1zKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG0gPSBcIkhlbGxvIFdvcmxkIVwiO1xyXG4gICAgICAgICAgICBjb25zdCBzaWcgPSBCTFNTaWcuc2lnbihwYXJhbXMsIHNrLCBtKTtcclxuICAgICAgICAgICAgY29uc3QgYWdncmVnYXRlU2lnbmF0dXJlID0gQkxTU2lnLmFnZ3JlZ2F0ZVNpZ25hdHVyZXMocGFyYW1zLCBbc2lnXSk7XHJcblxyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoQkxTU2lnLnZlcmlmeUFnZ3JlZ2F0aW9uKHBhcmFtcywgW3BrXSwgbSwgYWdncmVnYXRlU2lnbmF0dXJlKSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcIldvcmtzIGZvciB0aHJlZSBkaXN0aW5jdCBzaWduYXR1cmVzXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gQkxTU2lnLnNldHVwKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IFtHLCBvLCBnMSwgZzIsIGVdID0gcGFyYW1zO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZXNUb1NpZ24gPSAzO1xyXG4gICAgICAgICAgICBsZXQgcGtzID0gW107XHJcbiAgICAgICAgICAgIGxldCBzaWduYXR1cmVzID0gW107XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtID0gXCJIZWxsbyBXb3JsZCFcIjtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVzc2FnZXNUb1NpZ247IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IFtzaywgcGtdID0gQkxTU2lnLmtleWdlbihwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgcGtzLnB1c2gocGspO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNpZ25hdHVyZSA9IEJMU1NpZy5zaWduKHBhcmFtcywgc2ssIG0pO1xyXG4gICAgICAgICAgICAgICAgc2lnbmF0dXJlcy5wdXNoKHNpZ25hdHVyZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFnZ3JlZ2F0ZVNpZ25hdHVyZSA9IEJMU1NpZy5hZ2dyZWdhdGVTaWduYXR1cmVzKHBhcmFtcywgc2lnbmF0dXJlcyk7XHJcblxyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoQkxTU2lnLnZlcmlmeUFnZ3JlZ2F0aW9uKHBhcmFtcywgcGtzLCBtLCBhZ2dyZWdhdGVTaWduYXR1cmUpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJEb2Vzbid0IHdvcmsgd2hlbiBvbmUgb2YgdGhyZWUgc2lnbmF0dXJlcyBpcyBvbiBkaWZmZXJlbnQgbWVzc2FnZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IEJMU1NpZy5zZXR1cCgpO1xyXG4gICAgICAgICAgICBjb25zdCBbRywgbywgZzEsIGcyLCBlXSA9IHBhcmFtcztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VzVG9TaWduID0gMjtcclxuICAgICAgICAgICAgbGV0IHBrcyA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgc2lnbmF0dXJlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbSA9IFwiSGVsbG8gV29ybGQhXCI7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc3NhZ2VzVG9TaWduOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IFtzaywgcGtdID0gQkxTU2lnLmtleWdlbihwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgcGtzLnB1c2gocGspO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2lnbmF0dXJlID0gQkxTU2lnLnNpZ24ocGFyYW1zLCBzaywgbSk7XHJcbiAgICAgICAgICAgICAgICBzaWduYXR1cmVzLnB1c2goc2lnbmF0dXJlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbTIgPSBcIk1hbGljaW91cyBIZWxsbyBXb3JsZFwiO1xyXG4gICAgICAgICAgICBjb25zdCBbc2ttLCBwa21dID0gQkxTU2lnLmtleWdlbihwYXJhbXMpO1xyXG4gICAgICAgICAgICBwa3MucHVzaChwa20pO1xyXG4gICAgICAgICAgICBjb25zdCBtYWxpY2lvdXNTaWduYXR1cmUgPSBCTFNTaWcuc2lnbihwYXJhbXMsIHNrbSwgbTIpO1xyXG4gICAgICAgICAgICBzaWduYXR1cmVzLnB1c2gobWFsaWNpb3VzU2lnbmF0dXJlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFnZ3JlZ2F0ZVNpZ25hdHVyZSA9IEJMU1NpZy5hZ2dyZWdhdGVTaWduYXR1cmVzKHBhcmFtcywgc2lnbmF0dXJlcyk7XHJcblxyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc05vdFRydWUoQkxTU2lnLnZlcmlmeUFnZ3JlZ2F0aW9uKHBhcmFtcywgcGtzLCBtLCBhZ2dyZWdhdGVTaWduYXR1cmUpKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiXX0=