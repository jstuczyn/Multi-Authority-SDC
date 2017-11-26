const express = require('express');
const bodyParser = require('body-parser');
import PSSig from "./PSSig";

const hostname = '127.0.0.1';
const port = 3000;
const app = express();
const router = express.Router();
let params;
let pk;
let sk;
let pk_bytes;



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(require("body-parser").json());

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
        console.log("Got message: ", message);

        const [h, sig] = PSSig.sign(params, sk, message);
        res.json({ signature: sig});
    });

router.route('/pk')
    .get((req, res) => {
        console.log("Got PK 'GET' request");
        res.json({
            "message": {
                "g": pk_bytes[0],
                "X": pk_bytes[1],
                "Y": pk_bytes[2],
            },
        });
    });



// prefix all routes
app.use("/testapi", router);



app.listen(port, hostname, () => {
    params = PSSig.setup();
    const [G, o, g1, g2, e] = params;

    const [sk_gen, pk_gen] = PSSig.keygen(params);
    sk = sk_gen;
    pk = pk_gen;
    const [g, X, Y] = pk_gen;

    let g2_t = [];
    let X_t = [];
    let Y_t = [];

    g.toBytes(g2_t);
    X.toBytes(X_t);
    Y.toBytes(Y_t);


    pk_bytes = [g2_t, X_t, Y_t];
});



console.log(`Server Started at: http://${hostname}:${port}/`);
