// import 'babel-polyfill';
import { performance } from 'perf_hooks';
import * as fs from 'fs';
import pairingBenchmark from './primitives/pairing';

const MAX_REPETITIONS = 1000;
const MAX_TIME_PER_FUNCTION = 30000; // we can test each function for at most 30s

const doBenchmark = (benchmark) => {
  const prepResult = benchmark.prep();
  const timings = [];
  let runningTotal = 0;
  for (let i = 0; i < MAX_REPETITIONS + 2; i++) {
    const beforeEachResult = benchmark.beforeEach(...prepResult[1]);

    performance.mark(`start${benchmark.name}${i}`);
    const bench = benchmark.fn(...prepResult[0], ...beforeEachResult); // being measured
    performance.mark(`end${benchmark.name}${i}`);

    performance.measure(`timing${benchmark.name}${i}`, `start${benchmark.name}${i}`, `end${benchmark.name}${i}`);
    const measure = performance.getEntriesByName(`timing${benchmark.name}${i}`)[0];
    timings.push(measure.duration);
    runningTotal += measure.duration;
    if (runningTotal > MAX_TIME_PER_FUNCTION) {
      break;
    }
  }

  fs.open(`results/${benchmark.name}_timing.txt`, 'w', (err, fd) => {
    if (err) {
      throw err;
    }

    timings.forEach((val, index) => {
      // for some reason first pairing is consistently slower than the rest,
      // perhaps due to file loading/paging? (most likely JIT),
      // don't record the first entry (two entries?)
      if (index !== 0 && index !== 1) {
        fs.write(fd, `${val}\n`, () => {});
      }
    });

    fs.close(fd, () => {
      console.log('Written results to file.');
    });
  });
};

doBenchmark(pairingBenchmark);
