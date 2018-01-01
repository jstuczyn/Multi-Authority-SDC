/*
  todo: whole file requires re-write to make it work with 'new' client-side code
 */
import PSSig from './PSSig';

const express = require('express');
const bodyParser = require('body-parser');

const hostname = '127.0.0.1';

if (process.argv.length < 3) {
  throw new Error('No port number provided');
}

const port = parseInt(process.argv[2], 10);

const app = express();
const router = express.Router();
let params;
let pk;
let sk;
let pk_bytes;


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(require('body-parser').json());

// no longer used; we just get pk directly
// router.route('/')
//     .get((req, res) => {
//         console.log("Got isAlive 'GET' request");
//         res.json({isAlive: true});
//     });

router.route('/sign')
  .post((req, res) => {
    console.log("Got sign 'POST' request");
    const message = req.body.message;
    console.log('Got message: ', message);

    const [h, sig] = PSSig.sign(params, sk, message);
    const sig_t = [];
    const h_t = [];
    sig.toBytes(sig_t);
    h.toBytes(h_t);

    console.log('sig:', h.toString(), sig.toString());
    res.json({ signature: [h_t, sig_t] });
  });

router.route('/pk')
  .get((req, res) => {
    console.log("Got PK 'GET' request");
    res.json({
      message: {
        g: pk_bytes[0],
        X: pk_bytes[1],
        Y: pk_bytes[2],
      },
    });
  });


// prefix all routes
app.use('/testapi', router);


app.listen(port, hostname, () => {
  params = PSSig.setup();
  const [G, o, g1, g2, e] = params;

  const [sk_gen, pk_gen] = PSSig.keygen(params);
  sk = sk_gen;
  pk = pk_gen;
  const [g, X, Y] = pk_gen;

  const g2_t = [];
  const X_t = [];
  const Y_t = [];

  g.toBytes(g2_t);
  X.toBytes(X_t);
  Y.toBytes(Y_t);


  pk_bytes = [g2_t, X_t, Y_t];

  console.log('g:', g.toString());
  console.log('X', X.toString());
  console.log('Y', Y.toString());
});
