"use strict";

var _BpGroup = require("../BpGroup");

var _BpGroup2 = _interopRequireDefault(_BpGroup);

var _mocha = require("mocha");

var mocha = _interopRequireWildcard(_mocha);

var _chai = require("chai");

var chai = _interopRequireWildcard(_chai);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("Bilinear Pairing", function () {
        describe("Bilinearity Property", function () {
                var G = new _BpGroup2.default();

                // Get group generators
                var g1 = G.gen1;
                var g2 = G.gen2;
                var o = G.order;
                var e = G.pair;

                var x = G.ctx.BIG.randomnum(o, G.rngGen);
                var y = G.ctx.BIG.randomnum(o, G.rngGen);

                // Create G1Elem and G2Elem
                var g1Elem = G.ctx.PAIR.G1mul(g1, x);
                var g2Elem = G.ctx.PAIR.G2mul(g2, y);

                // pairing
                var gt = e(g1Elem, g2Elem);

                var big2 = new G.ctx.BIG(2);
                var big3 = new G.ctx.BIG(3);
                var big4 = new G.ctx.BIG(4);
                var big6 = new G.ctx.BIG(6);
                var big7 = new G.ctx.BIG(7);

                var g1test = g1Elem.mul(big2);
                var g2test = g2Elem.mul(big3);

                var gt6_1 = e(g1test, g2test);
                var gt6_2 = G.ctx.PAIR.GTpow(gt, big6);

                it("e(2*g1, 3*g2) == e(g1, g2)^6", function () {
                        chai.assert.isTrue(gt6_1.equals(gt6_2));
                });

                it("e(2*g1, 3*g2) != e(g1, g2)^7", function () {
                        var gt_7 = G.ctx.PAIR.GTpow(gt, big7);
                        chai.assert.isNotTrue(gt6_1.equals(gt_7));
                });

                // Should have bilinearity property (  )


                it("e(3*g1, 4*g2) != e(g1, g2)^6", function () {
                        var g1test_2 = g1Elem.mul(big3);
                        var g2test_2 = g2Elem.mul(big4);
                        var gt6_3 = e(g1test_2, g2test_2);

                        chai.assert.isNotTrue(gt6_3.equals(gt6_2));
                });

                it("e(a*g1, g2) == e(g1,g2)^a for random a", function () {
                        var a = G.ctx.BIG.randomnum(o, G.rngGen);
                        var g1_test2 = g1Elem.mul(a);
                        var gt_1 = e(g1_test2, g2Elem);
                        var gt_2 = G.ctx.PAIR.GTpow(e(g1Elem, g2Elem), a);

                        chai.assert.isTrue(gt_1.equals(gt_2));
                });

                it("e(g1, a*g2) == e(g1,g2)^a for random a", function () {
                        var a = G.ctx.BIG.randomnum(o, G.rngGen);
                        var g2_test2 = g2Elem.mul(a);
                        var gt_1 = e(g1Elem, g2_test2);
                        var gt_2 = G.ctx.PAIR.GTpow(e(g1Elem, g2Elem), a);

                        chai.assert.isTrue(gt_1.equals(gt_2));
                });

                // it("e(a*g1, b*g2) == e(g1, g2)^(a*b) for random (a,b)", () => {
                //     const a = G.ctx.BIG.randomnum(o, G.rngGen);
                //     const b = G.ctx.BIG.randomnum(o, G.rngGen);
                //
                //     const g1_test2 = g1Elem.mul(a);
                //     const g2_test2 = g2Elem.mul(b);
                //
                //     const gt_1 = e(g1_test2, g2_test2);
                //
                //     const c = G.ctx.BIG.smul(a,b);
                //     // const c = G.ctx.BIG.mul(a,b);
                //
                //
                //     const gt_2 = G.ctx.PAIR.GTpow(e(g1Elem, g2Elem), c);
                //
                //     console.log("This is the core issue");
                //
                //     chai.assert.isTrue(gt_1.equals(gt_2));
                // })
        });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L1BhaXJpbmdUZXN0cy5qcyJdLCJuYW1lcyI6WyJtb2NoYSIsImNoYWkiLCJkZXNjcmliZSIsIkciLCJnMSIsImdlbjEiLCJnMiIsImdlbjIiLCJvIiwib3JkZXIiLCJlIiwicGFpciIsIngiLCJjdHgiLCJCSUciLCJyYW5kb21udW0iLCJybmdHZW4iLCJ5IiwiZzFFbGVtIiwiUEFJUiIsIkcxbXVsIiwiZzJFbGVtIiwiRzJtdWwiLCJndCIsImJpZzIiLCJiaWczIiwiYmlnNCIsImJpZzYiLCJiaWc3IiwiZzF0ZXN0IiwibXVsIiwiZzJ0ZXN0IiwiZ3Q2XzEiLCJndDZfMiIsIkdUcG93IiwiaXQiLCJhc3NlcnQiLCJpc1RydWUiLCJlcXVhbHMiLCJndF83IiwiaXNOb3RUcnVlIiwiZzF0ZXN0XzIiLCJnMnRlc3RfMiIsImd0Nl8zIiwiYSIsImcxX3Rlc3QyIiwiZ3RfMSIsImd0XzIiLCJnMl90ZXN0MiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUVBOztJQUFZQSxLOztBQUNaOztJQUFZQyxJOzs7Ozs7QUFHWkMsU0FBUyxrQkFBVCxFQUE2QixZQUFNO0FBQy9CQSxpQkFBUyxzQkFBVCxFQUFpQyxZQUFNO0FBQ25DLG9CQUFNQyxJQUFJLHVCQUFWOztBQUVBO0FBQ0Esb0JBQU1DLEtBQUtELEVBQUVFLElBQWI7QUFDQSxvQkFBTUMsS0FBS0gsRUFBRUksSUFBYjtBQUNBLG9CQUFNQyxJQUFJTCxFQUFFTSxLQUFaO0FBQ0Esb0JBQU1DLElBQUlQLEVBQUVRLElBQVo7O0FBRUEsb0JBQU1DLElBQUlULEVBQUVVLEdBQUYsQ0FBTUMsR0FBTixDQUFVQyxTQUFWLENBQW9CUCxDQUFwQixFQUF1QkwsRUFBRWEsTUFBekIsQ0FBVjtBQUNBLG9CQUFNQyxJQUFJZCxFQUFFVSxHQUFGLENBQU1DLEdBQU4sQ0FBVUMsU0FBVixDQUFvQlAsQ0FBcEIsRUFBdUJMLEVBQUVhLE1BQXpCLENBQVY7O0FBRUE7QUFDQSxvQkFBTUUsU0FBU2YsRUFB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Q0FBVjtBQUNBLDRCQUFNZ0MsV0FBVzNCLE9BQU9TLEdBQVAsQ0FBV2MsQ0FBWCxDQUFqQjtBQUNBLDRCQUFNRSxPQUFPcEMsRUFBRVEsTUFBRixFQUFVOEIsUUFBVixDQUFiO0FBQ0EsNEJBQU1ELE9BQU81QyxFQUFFVSxHQUFGLENBQU1NLElBQU4sQ0FBV2UsS0FBWCxDQUFpQnhCLEVBQUVRLE1BQUYsRUFBVUcsTUFBVixDQUFqQixFQUFvQ3VCLENBQXBDLENBQWI7O0FBRUEzQyw2QkFBS21DLE1BQUwsQ0FBWUMsTUFBWixDQUFtQlMsS0FBS1IsTUFBTCxDQUFZUyxJQUFaLENBQW5CO0FBQ0gsaUJBUEQ7O0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSCxTQTNGRDtBQTZGSCxDQTlGRCIsImZpbGUiOiJQYWlyaW5nVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnBHcm91cCBmcm9tIFwiLi4vQnBHcm91cFwiO1xyXG5cclxuaW1wb3J0ICogYXMgbW9jaGEgZnJvbSBcIm1vY2hhXCI7XHJcbmltcG9ydCAqIGFzIGNoYWkgZnJvbSAnY2hhaSc7XHJcblxyXG5cclxuZGVzY3JpYmUoXCJCaWxpbmVhciBQYWlyaW5nXCIsICgpID0+IHtcclxuICAgIGRlc2NyaWJlKFwiQmlsaW5lYXJpdHkgUHJvcGVydHlcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IEcgPSBuZXcgQnBHcm91cCgpO1xyXG5cclxuICAgICAgICAvLyBHZXQgZ3JvdXAgZ2VuZXJhdG9yc1xyXG4gICAgICAgIGNvbnN0IGcxID0gRy5nZW4xO1xyXG4gICAgICAgIGNvbnN0IGcyID0gRy5nZW4yO1xyXG4gICAgICAgIGNvbnN0IG8gPSBHLm9yZGVyO1xyXG4gICAgICAgIGNvbnN0IGUgPSBHLnBhaXI7XHJcblxyXG4gICAgICAgIGNvbnN0IHggPSBHLmN0eC5CSUcucmFuZG9tbnVtKG8sIEcucm5nR2VuKTtcclxuICAgICAgICBjb25zdCB5ID0gRy5jdHguQklHLnJhbmRvbW51bShvLCBHLnJuZ0dlbik7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBHMUVsZW0gYW5kIEcyRWxlbVxyXG4gICAgICAgIGNvbnN0IGcxRWxlbSA9IEcuY3R4LlBBSVIuRzFtdWwoZzEsIHgpO1xyXG4gICAgICAgIGNvbnN0IGcyRWxlbSA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIHkpO1xyXG5cclxuICAgICAgICAvLyBwYWlyaW5nXHJcbiAgICAgICAgY29uc3QgZ3QgPSBlKGcxRWxlbSwgZzJFbGVtKTtcclxuXHJcbiAgICAgICAgY29uc3QgYmlnMiA9IG5ldyBHLmN0eC5CSUcoMik7XHJcbiAgICAgICAgY29uc3QgYmlnMyA9IG5ldyBHLmN0eC5CSUcoMyk7XHJcbiAgICAgICAgY29uc3QgYmlnNCA9IG5ldyBHLmN0eC5CSUcoNCk7XHJcbiAgICAgICAgY29uc3QgYmlnNiA9IG5ldyBHLmN0eC5CSUcoNik7XHJcbiAgICAgICAgY29uc3QgYmlnNyA9IG5ldyBHLmN0eC5CSUcoNyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGcxdGVzdCA9IGcxRWxlbS5tdWwoYmlnMik7XHJcbiAgICAgICAgY29uc3QgZzJ0ZXN0ID0gZzJFbGVtLm11bChiaWczKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ3Q2XzEgPSBlKGcxdGVzdCwgZzJ0ZXN0KTtcclxuICAgICAgICBjb25zdCBndDZfMiA9IEcuY3R4LlBBSVIuR1Rwb3coZ3QsIGJpZzYpO1xyXG5cclxuICAgICAgICBpdChcImUoMipnMSwgMypnMikgPT0gZShnMSwgZzIpXjZcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZ3Q2XzEuZXF1YWxzKGd0Nl8yKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiZSgyKmcxLCAzKmcyKSAhPSBlKGcxLCBnMileN1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGd0XzcgPSBHLmN0eC5QQUlSLkdUcG93KGd0LCBiaWc3KTtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3RUcnVlKGd0Nl8xLmVxdWFscyhndF83KSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFNob3VsZCBoYXZlIGJpbGluZWFyaXR5IHByb3BlcnR5ICggIClcclxuXHJcblxyXG4gICAgICAgIGl0KFwiZSgzKmcxLCA0KmcyKSAhPSBlKGcxLCBnMileNlwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGcxdGVzdF8yID0gZzFFbGVtLm11bChiaWczKTtcclxuICAgICAgICAgICAgY29uc3QgZzJ0ZXN0XzIgPSBnMkVsZW0ubXVsKGJpZzQpO1xyXG4gICAgICAgICAgICBjb25zdCBndDZfMyA9IGUoZzF0ZXN0XzIsIGcydGVzdF8yKTtcclxuXHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90VHJ1ZShndDZfMy5lcXVhbHMoZ3Q2XzIpKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGl0KFwiZShhKmcxLCBnMikgPT0gZShnMSxnMileYSBmb3IgcmFuZG9tIGFcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhID0gRy5jdHguQklHLnJhbmRvbW51bShvLCBHLnJuZ0dlbik7XHJcbiAgICAgICAgICAgIGNvbnN0IGcxX3Rlc3QyID0gZzFFbGVtLm11bChhKTtcclxuICAgICAgICAgICAgY29uc3QgZ3RfMSA9IGUoZzFfdGVzdDIsIGcyRWxlbSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGd0XzIgPSBHLmN0eC5QQUlSLkdUcG93KGUoZzFFbGVtLCBnMkVsZW0pLCBhKTtcclxuXHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShndF8xLmVxdWFscyhndF8yKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiZShnMSwgYSpnMikgPT0gZShnMSxnMileYSBmb3IgcmFuZG9tIGFcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhID0gRy5jdHguQklHLnJhbmRvbW51bShvLCBHLnJuZ0dlbik7XHJcbiAgICAgICAgICAgIGNvbnN0IGcyX3Rlc3QyID0gZzJFbGVtLm11bChhKTtcclxuICAgICAgICAgICAgY29uc3QgZ3RfMSA9IGUoZzFFbGVtLCBnMl90ZXN0Mik7XHJcbiAgICAgICAgICAgIGNvbnN0IGd0XzIgPSBHLmN0eC5QQUlSLkdUcG93KGUoZzFFbGVtLCBnMkVsZW0pLCBhKTtcclxuXHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShndF8xLmVxdWFscyhndF8yKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvLyBpdChcImUoYSpnMSwgYipnMikgPT0gZShnMSwgZzIpXihhKmIpIGZvciByYW5kb20gKGEsYilcIiwgKCkgPT4ge1xyXG4gICAgICAgIC8vICAgICBjb25zdCBhID0gRy5jdHguQklHLnJhbmRvbW51bShvLCBHLnJuZ0dlbik7XHJcbiAgICAgICAgLy8gICAgIGNvbnN0IGIgPSBHLmN0eC5CSUcucmFuZG9tbnVtKG8sIEcucm5nR2VuKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICBjb25zdCBnMV90ZXN0MiA9IGcxRWxlbS5tdWwoYSk7XHJcbiAgICAgICAgLy8gICAgIGNvbnN0IGcyX3Rlc3QyID0gZzJFbGVtLm11bChiKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICBjb25zdCBndF8xID0gZShnMV90ZXN0MiwgZzJfdGVzdDIpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIGNvbnN0IGMgPSBHLmN0eC5CSUcuc211bChhLGIpO1xyXG4gICAgICAgIC8vICAgICAvLyBjb25zdCBjID0gRy5jdHguQklHLm11bChhLGIpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgY29uc3QgZ3RfMiA9IEcuY3R4LlBBSVIuR1Rwb3coZShnMUVsZW0sIGcyRWxlbSksIGMpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiVGhpcyBpcyB0aGUgY29yZSBpc3N1ZVwiKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICBjaGFpLmFzc2VydC5pc1RydWUoZ3RfMS5lcXVhbHMoZ3RfMikpO1xyXG4gICAgICAgIC8vIH0pXHJcblxyXG4gICAgfSk7XHJcblxyXG59KTsiXX0=