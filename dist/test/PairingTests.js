/*
import BpGroup from "../BpGroup";

import * as mocha from "mocha";
import * as chai from 'chai';


describe("Bilinear Pairing", () => {
    describe("Bilinearity Property", () => {
        const G = new BpGroup();

        // Get group generators
        const g1 = G.gen1;
        const g2 = G.gen2;
        const o = G.order;
        const e = G.pair;

        const x = G.ctx.BIG.randomnum(o, G.rngGen);
        const y = G.ctx.BIG.randomnum(o, G.rngGen);

        // Create G1Elem and G2Elem
        const g1Elem = G.ctx.PAIR.G1mul(g1, x);
        const g2Elem = G.ctx.PAIR.G2mul(g2, y);

        // pairing
        const gt = e(g1Elem, g2Elem);

        const big2 = new G.ctx.BIG(2);
        const big3 = new G.ctx.BIG(3);
        const big4 = new G.ctx.BIG(4);
        const big6 = new G.ctx.BIG(6);
        const big7 = new G.ctx.BIG(7);

        const g1test = G.ctx.PAIR.G1mul(g1Elem, big2);
        const g2test = G.ctx.PAIR.G2mul(g2Elem, big3);

        const gt6_1 = e(g1test, g2test);
        const gt6_2 = G.ctx.PAIR.GTpow(gt, big6);

        it("e(2*g1, 3*g2) == e(g1, g2)^6", () => {
            chai.assert.isTrue(gt6_1.equals(gt6_2));
        });

        it("e(2*g1, 3*g2) != e(g1, g2)^7", () => {
            const gt_7 = G.ctx.PAIR.GTpow(gt, big7);
            chai.assert.isNotTrue(gt6_1.equals(gt_7));
        });

        it("e(3*g1, 4*g2) != e(g1, g2)^6", () => {
            const g1test_2 = G.ctx.PAIR.G1mul(g1Elem, big3);
            const g2test_2 = G.ctx.PAIR.G2mul(g2Elem, big4);
            const gt6_3 = e(g1test_2, g2test_2);

            chai.assert.isNotTrue(gt6_3.equals(gt6_2));
        });


        it("e(a*g1, g2) == e(g1,g2)^a for random a", () => {
            const a = G.ctx.BIG.randomnum(o, G.rngGen);
            const g1_test2 = G.ctx.PAIR.G1mul(g1Elem, a);
            const gt_1 = e(g1_test2, g2Elem);
            const gt_2 = G.ctx.PAIR.GTpow(e(g1Elem, g2Elem), a);

            chai.assert.isTrue(gt_1.equals(gt_2));
        });

        it("e(g1, a*g2) == e(g1,g2)^a for random a", () => {
            const a = G.ctx.BIG.randomnum(o, G.rngGen);
            const g2_test2 = G.ctx.PAIR.G2mul(g2Elem, a);
            const gt_1 = e(g1Elem, g2_test2);
            const gt_2 = G.ctx.PAIR.GTpow(e(g1Elem, g2Elem), a);

            chai.assert.isTrue(gt_1.equals(gt_2));
        });


        it("e(a*g1, b*g2) == e(g1, g2)^(a*b) for random (a,b)", () => {
            const a = G.ctx.BIG.randomnum(o, G.rngGen);
            const b = G.ctx.BIG.randomnum(o, G.rngGen);

            const g1_test2 = G.ctx.PAIR.G1mul(g1, a);
            const g2_test2 = G.ctx.PAIR.G2mul(g2, b);

            const gt_1 = e(g1_test2, g2_test2);

            const c = G.ctx.BIG.mul(a,b);
            c.mod(G.order);

            const gt_2 = G.ctx.PAIR.GTpow(e(g1, g2), c);

            chai.assert.isTrue(gt_1.equals(gt_2));
        })

    });

});
*/
"use strict";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L1BhaXJpbmdUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJQYWlyaW5nVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG5pbXBvcnQgQnBHcm91cCBmcm9tIFwiLi4vQnBHcm91cFwiO1xyXG5cclxuaW1wb3J0ICogYXMgbW9jaGEgZnJvbSBcIm1vY2hhXCI7XHJcbmltcG9ydCAqIGFzIGNoYWkgZnJvbSAnY2hhaSc7XHJcblxyXG5cclxuZGVzY3JpYmUoXCJCaWxpbmVhciBQYWlyaW5nXCIsICgpID0+IHtcclxuICAgIGRlc2NyaWJlKFwiQmlsaW5lYXJpdHkgUHJvcGVydHlcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IEcgPSBuZXcgQnBHcm91cCgpO1xyXG5cclxuICAgICAgICAvLyBHZXQgZ3JvdXAgZ2VuZXJhdG9yc1xyXG4gICAgICAgIGNvbnN0IGcxID0gRy5nZW4xO1xyXG4gICAgICAgIGNvbnN0IGcyID0gRy5nZW4yO1xyXG4gICAgICAgIGNvbnN0IG8gPSBHLm9yZGVyO1xyXG4gICAgICAgIGNvbnN0IGUgPSBHLnBhaXI7XHJcblxyXG4gICAgICAgIGNvbnN0IHggPSBHLmN0eC5CSUcucmFuZG9tbnVtKG8sIEcucm5nR2VuKTtcclxuICAgICAgICBjb25zdCB5ID0gRy5jdHguQklHLnJhbmRvbW51bShvLCBHLnJuZ0dlbik7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBHMUVsZW0gYW5kIEcyRWxlbVxyXG4gICAgICAgIGNvbnN0IGcxRWxlbSA9IEcuY3R4LlBBSVIuRzFtdWwoZzEsIHgpO1xyXG4gICAgICAgIGNvbnN0IGcyRWxlbSA9IEcuY3R4LlBBSVIuRzJtdWwoZzIsIHkpO1xyXG5cclxuICAgICAgICAvLyBwYWlyaW5nXHJcbiAgICAgICAgY29uc3QgZ3QgPSBlKGcxRWxlbSwgZzJFbGVtKTtcclxuXHJcbiAgICAgICAgY29uc3QgYmlnMiA9IG5ldyBHLmN0eC5CSUcoMik7XHJcbiAgICAgICAgY29uc3QgYmlnMyA9IG5ldyBHLmN0eC5CSUcoMyk7XHJcbiAgICAgICAgY29uc3QgYmlnNCA9IG5ldyBHLmN0eC5CSUcoNCk7XHJcbiAgICAgICAgY29uc3QgYmlnNiA9IG5ldyBHLmN0eC5CSUcoNik7XHJcbiAgICAgICAgY29uc3QgYmlnNyA9IG5ldyBHLmN0eC5CSUcoNyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGcxdGVzdCA9IEcuY3R4LlBBSVIuRzFtdWwoZzFFbGVtLCBiaWcyKTtcclxuICAgICAgICBjb25zdCBnMnRlc3QgPSBHLmN0eC5QQUlSLkcybXVsKGcyRWxlbSwgYmlnMyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGd0Nl8xID0gZShnMXRlc3QsIGcydGVzdCk7XHJcbiAgICAgICAgY29uc3QgZ3Q2XzIgPSBHLmN0eC5QQUlSLkdUcG93KGd0LCBiaWc2KTtcclxuXHJcbiAgICAgICAgaXQoXCJlKDIqZzEsIDMqZzIpID09IGUoZzEsIGcyKV42XCIsICgpID0+IHtcclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKGd0Nl8xLmVxdWFscyhndDZfMikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcImUoMipnMSwgMypnMikgIT0gZShnMSwgZzIpXjdcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBndF83ID0gRy5jdHguUEFJUi5HVHBvdyhndCwgYmlnNyk7XHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzTm90VHJ1ZShndDZfMS5lcXVhbHMoZ3RfNykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcImUoMypnMSwgNCpnMikgIT0gZShnMSwgZzIpXjZcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBnMXRlc3RfMiA9IEcuY3R4LlBBSVIuRzFtdWwoZzFFbGVtLCBiaWczKTtcclxuICAgICAgICAgICAgY29uc3QgZzJ0ZXN0XzIgPSBHLmN0eC5QQUlSLkcybXVsKGcyRWxlbSwgYmlnNCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGd0Nl8zID0gZShnMXRlc3RfMiwgZzJ0ZXN0XzIpO1xyXG5cclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNOb3RUcnVlKGd0Nl8zLmVxdWFscyhndDZfMikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgaXQoXCJlKGEqZzEsIGcyKSA9PSBlKGcxLGcyKV5hIGZvciByYW5kb20gYVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBHLmN0eC5CSUcucmFuZG9tbnVtKG8sIEcucm5nR2VuKTtcclxuICAgICAgICAgICAgY29uc3QgZzFfdGVzdDIgPSBHLmN0eC5QQUlSLkcxbXVsKGcxRWxlbSwgYSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGd0XzEgPSBlKGcxX3Rlc3QyLCBnMkVsZW0pO1xyXG4gICAgICAgICAgICBjb25zdCBndF8yID0gRy5jdHguUEFJUi5HVHBvdyhlKGcxRWxlbSwgZzJFbGVtKSwgYSk7XHJcblxyXG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc1RydWUoZ3RfMS5lcXVhbHMoZ3RfMikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcImUoZzEsIGEqZzIpID09IGUoZzEsZzIpXmEgZm9yIHJhbmRvbSBhXCIsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYSA9IEcuY3R4LkJJRy5yYW5kb21udW0obywgRy5ybmdHZW4pO1xyXG4gICAgICAgICAgICBjb25zdCBnMl90ZXN0MiA9IEcuY3R4LlBBSVIuRzJtdWwoZzJFbGVtLCBhKTtcclxuICAgICAgICAgICAgY29uc3QgZ3RfMSA9IGUoZzFFbGVtLCBnMl90ZXN0Mik7XHJcbiAgICAgICAgICAgIGNvbnN0IGd0XzIgPSBHLmN0eC5QQUlSLkdUcG93KGUoZzFFbGVtLCBnMkVsZW0pLCBhKTtcclxuXHJcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzVHJ1ZShndF8xLmVxdWFscyhndF8yKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBpdChcImUoYSpnMSwgYipnMikgPT0gZShnMSwgZzIpXihhKmIpIGZvciByYW5kb20gKGEsYilcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhID0gRy5jdHguQklHLnJhbmRvbW51bShvLCBHLnJuZ0dlbik7XHJcbiAgICAgICAgICAgIGNvbnN0IGIgPSBHLmN0eC5CSUcucmFuZG9tbnVtKG8sIEcucm5nR2VuKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGcxX3Rlc3QyID0gRy5jdHguUEFJUi5HMW11bChnMSwgYSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGcyX3Rlc3QyID0gRy5jdHguUEFJUi5HMm11bChnMiwgYik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBndF8xID0gZShnMV90ZXN0MiwgZzJfdGVzdDIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYyA9IEcuY3R4LkJJRy5tdWwoYSxiKTtcclxuICAgICAgICAgICAgYy5tb2QoRy5vcmRlcik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBndF8yID0gRy5jdHguUEFJUi5HVHBvdyhlKGcxLCBnMiksIGMpO1xyXG5cclxuICAgICAgICAgICAgY2hhaS5hc3NlcnQuaXNUcnVlKGd0XzEuZXF1YWxzKGd0XzIpKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgIH0pO1xyXG5cclxufSk7XHJcbiovIl19