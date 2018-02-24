// import 'babel-polyfill';
import { performance } from 'perf_hooks';
import BpGroup from '../../servers/dist/BpGroup';
import * as fs from 'fs';

const REPETITIONS = 100;

const pairing = () => {
  const timings = [];

  const G = new BpGroup();
  const g1 = G.gen1;
  const g2 = G.gen2;

  for(let i = 0; i < REPETITIONS + 1; i++) {
    // generate random nums to prevent being biased by 'special' cases that are for some reason faster to compute
    const r1 = G.ctx.BIG.randomnum(G.order, G.rngGen);
    const r2 = G.ctx.BIG.randomnum(G.order, G.rngGen);

    const G1elem = G.ctx.PAIR.G1mul(g1, r1);
    const G2elem = G.ctx.PAIR.G2mul(g2, r2);

    performance.mark(`start${i}`);
    const pairing = G.pair(G1elem, G2elem); // being measured
    performance.mark(`end${i}`);

    performance.measure(`timing${i}`, `start${i}`, `end${i}`);
    const measure = performance.getEntriesByName(`timing${i}`)[0];
    timings.push(measure.duration);
  }

  fs.open('results/pairing_timing.txt', 'w', (err, fd) => {
    if (err) {
      throw err;
    }

    timings.forEach((val, index) => {
      // for some reason first pairing is consistently slower than the rest, perhaps due to file loading/paging?,
      // don't record the first entry
      if (index !== 0) {
        fs.write(fd, `${val}\n`, () => {});
      }
    });

    fs.close(fd, () => {
      console.log('Written results to file.');
    });
  });


};

pairing();


