/*
	Licensed to the Apache Software Foundation (ASF) under one
	or more contributor license agreements.  See the NOTICE file
	distributed with this work for additional information
	regarding copyright ownership.  The ASF licenses this file
	to you under the Apache License, Version 2.0 (the
	"License"); you may not use this file except in compliance
	with the License.  You may obtain a copy of the License at
	
	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an
	"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, either express or implied.  See the License for the
	specific language governing permissions and limitations
	under the License.
*/

var romField = require('./rom_field');
var romCurve = require('./rom_curve');
var aes = require('./aes');
var gcm = require('./gcm');
var uint64 = require('./uint64');
var hash256 = require('./hash256');
var hash384 = require('./hash384');
var hash512 = require('./hash512');
var sha3 = require('./sha3');
var rand = require('./rand');
var big = require('./big');
var fp = require('./fp');
var ecp = require('./ecp');
var ecdh = require('./ecdh');

var ff = require('./ff');
var rsa = require('./rsa');

var fp2 = require('./fp2');
var fp4 = require('./fp4');
var fp12 = require('./fp12');
var ecp2 = require('./ecp2');
var pair = require('./pair');
var mpin = require('./mpin');
var newhope = require('./newhope');
var nhs = require('./nhs');

var CTXLIST = {
    "ED25519": {
        "BITS": "256",
        "FIELD": "25519",
        "CURVE": "ED25519",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 255,
        "@M8": 5,
        "@MT": 1,
        "@CT": 1,
        "@PF": 0
    },

    "C25519": {
        "BITS": "256",
        "FIELD": "25519",
        "CURVE": "C25519",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 255,
        "@M8": 5,
        "@MT": 1,
        "@CT": 2,
        "@PF": 0
    },

    "NIST256": {
        "BITS": "256",
        "FIELD": "NIST256",
        "CURVE": "NIST256",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 7,
        "@MT": 0,
        "@CT": 0,
        "@PF": 0
    },

    "NIST384": {
        "BITS": "384",
        "FIELD": "NIST384",
        "CURVE": "NIST384",
        "@NB": 48,
        "@BASE": 56,
        "@NBT": 384,
        "@M8": 7,
        "@MT": 0,
        "@CT": 0,
        "@PF": 0
    },

    "BRAINPOOL": {
        "BITS": "256",
        "FIELD": "BRAINPOOL",
        "CURVE": "BRAINPOOL",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 7,
        "@MT": 0,
        "@CT": 0,
        "@PF": 0
    },

    "ANSSI": {
        "BITS": "256",
        "FIELD": "ANSSI",
        "CURVE": "ANSSI",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 7,
        "@MT": 0,
        "@CT": 0,
        "@PF": 0
    },

    "HIFIVE": {
        "BITS": "336",
        "FIELD": "HIFIVE",
        "CURVE": "HIFIVE",
        "@NB": 42,
        "@BASE": 23,
        "@NBT": 336,
        "@M8": 5,
        "@MT": 1,
        "@CT": 1,
        "@PF": 0
    },

    "GOLDILOCKS": {
        "BITS": "448",
        "FIELD": "GOLDILOCKS",
        "CURVE": "GOLDILOCKS",
        "@NB": 56,
        "@BASE": 23,
        "@NBT": 448,
        "@M8": 7,
        "@MT": 2,
        "@CT": 1,
        "@PF": 0
    },

    "C41417": {
        "BITS": "416",
        "FIELD": "C41417",
        "CURVE": "C41417",
        "@NB": 52,
        "@BASE": 23,
        "@NBT": 414,
        "@M8": 7,
        "@MT": 1,
        "@CT": 1,
        "@PF": 0
    },

    "NIST521": {
        "BITS": "528",
        "FIELD": "NIST521",
        "CURVE": "NIST521",
        "@NB": 66,
        "@BASE": 23,
        "@NBT": 521,
        "@M8": 7,
        "@MT": 1,
        "@CT": 0,
        "@PF": 0
    },

    "NUMS256W": {
        "BITS": "256",
        "FIELD": "256PM",
        "CURVE": "NUMS256W",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 3,
        "@MT": 1,
        "@CT": 0,
        "@PF": 0
    },

    "NUMS256E": {
        "BITS": "256",
        "FIELD": "256PM",
        "CURVE": "NUMS256E",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 256,
        "@M8": 3,
        "@MT": 1,
        "@CT": 1,
        "@PF": 0
    },

    "NUMS384W": {
        "BITS": "384",
        "FIELD": "384PM",
        "CURVE": "NUMS384W",
        "@NB": 48,
        "@BASE": 23,
        "@NBT": 384,
        "@M8": 3,
        "@MT": 1,
        "@CT": 0,
        "@PF": 0
    },

    "NUMS384E": {
        "BITS": "384",
        "FIELD": "384PM",
        "CURVE": "NUMS384E",
        "@NB": 48,
        "@BASE": 23,
        "@NBT": 384,
        "@M8": 3,
        "@MT": 1,
        "@CT": 1,
        "@PF": 0
    },

    "NUMS512W": {
        "BITS": "512",
        "FIELD": "512PM",
        "CURVE": "NUMS512W",
        "@NB": 64,
        "@BASE": 23,
        "@NBT": 512,
        "@M8": 7,
        "@MT": 1,
        "@CT": 0,
        "@PF": 0
    },

    "NUMS512E": {
        "BITS": "512",
        "FIELD": "512PM",
        "CURVE": "NUMS512E",
        "@NB": 64,
        "@BASE": 23,
        "@NBT": 512,
        "@M8": 7,
        "@MT": 1,
        "@CT": 1,
        "@PF": 0
    },

    "BN254": {
        "BITS": "256",
        "FIELD": "BN254",
        "CURVE": "BN254",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 254,
        "@M8": 3,
        "@MT": 0,
        "@CT": 0,
        "@PF": 1
    },

    "BN254CX": {
        "BITS": "256",
        "FIELD": "BN254CX",
        "CURVE": "BN254CX",
        "@NB": 32,
        "@BASE": 24,
        "@NBT": 254,
        "@M8": 3,
        "@MT": 0,
        "@CT": 0,
        "@PF": 1
    },

    "BLS383": {
        "BITS": "384",
        "FIELD": "BLS383",
        "CURVE": "BLS383",
        "@NB": 48,
        "@BASE": 23,
        "@NBT": 383,
        "@M8": 3,
        "@MT": 0,
        "@CT": 0,
        "@PF": 2
    },

    "RSA2048": {
        "BITS": "1024",
        "TFF": "2048",
        "@NB": 128,
        "@BASE": 22,
        "@ML": 2,
    },

    "RSA3072": {
        "BITS": "384",
        "TFF": "3072",
        "@NB": 48,
        "@BASE": 23,
        "@ML": 8,
    },

    "RSA4096": {
        "BITS": "512",
        "TFF": "4096",
        "@NB": 64,
        "@BASE": 23,
        "@ML": 8,
    },
}

module.exports = CTXLIST;

CTX = function(input_parameter) {
    this.AES = aes.AES();
    this.GCM = gcm.GCM(this);
    this.UInt64 = uint64.UInt64();
    this.HASH256 = hash256.HASH256();
    this.HASH384 = hash384.HASH384(this);
    this.HASH512 = hash512.HASH512(this);
    this.SHA3 = sha3.SHA3(this);
    this.RAND = rand.RAND(this);
    this.NewHope = newhope.NewHope();
    this.NHS = nhs.NHS(this);

    if (input_parameter === undefined)
        return;
    else {

        this.config = CTXLIST[input_parameter];

        // Set RSA parameters
        if (this.config['TFF'] !== undefined) {
            this.BIG = big.BIG(this);
            this.DBIG = big.DBIG(this);
            this.FF = ff.FF(this);
            this.RSA = rsa.RSA(this);
            this.rsa_public_key = rsa.rsa_public_key(this);
            this.rsa_private_key = rsa.rsa_private_key(this);
            return;
        };

        // Set Elliptic Curve parameters
        if (this.config['CURVE'] !== undefined) {

            switch (this.config['CURVE']) {
                case "ED25519":
                    this.ROM_CURVE = romCurve.ROM_CURVE_ED25519();
                    break;
                case "C25519":
                    this.ROM_CURVE = romCurve.ROM_CURVE_C25519();
                    break;
                case "NIST256":
                    this.ROM_CURVE = romCurve.ROM_CURVE_NIST256();
                    break;
                case "NIST384":
                    this.ROM_CURVE = romCurve.ROM_CURVE_NIST384();
                    break;
                case "BRAINPOOL":
                    this.ROM_CURVE = romCurve.ROM_CURVE_BRAINPOOL();
                    break;
                case "ANSSI":
                    this.ROM_CURVE = romCurve.ROM_CURVE_ANSSI();
                    break;
                case "HIFIVE":
                    this.ROM_CURVE = romCurve.ROM_CURVE_HIFIVE();
                    break;
                case "GOLDILOCKS":
                    this.ROM_CURVE = romCurve.ROM_CURVE_GOLDILOCKS();
                    break;
                case "C41417":
                    this.ROM_CURVE = romCurve.ROM_CURVE_C41417();
                    break;
                case "NIST521":
                    this.ROM_CURVE = romCurve.ROM_CURVE_NIST521();
                    break;
                case "NUMS256W":
                    this.ROM_CURVE = romCurve.ROM_CURVE_NUMS256W();
                    break;
                case "NUMS256E":
                    this.ROM_CURVE = romCurve.ROM_CURVE_NUMS256E();
                    break;
                case "NUMS384W":
                    this.ROM_CURVE = romCurve.ROM_CURVE_NUMS384W();
                    break;
                case "NUMS384E":
                    this.ROM_CURVE = romCurve.ROM_CURVE_NUMS384E();
                    break;
                case "NUMS512W":
                    this.ROM_CURVE = romCurve.ROM_CURVE_NUMS512W();
                    break;
                case "NUMS512E":
                    this.ROM_CURVE = romCurve.ROM_CURVE_NUMS512E();
                    break;
                case "BN254":
                    this.ROM_CURVE = romCurve.ROM_CURVE_BN254();
                    break;
                case "BN254CX":
                    this.ROM_CURVE = romCurve.ROM_CURVE_BN254CX();
                    break;
                case "BLS383":
                    this.ROM_CURVE = romCurve.ROM_CURVE_BLS383();
                    break;
                default:
                    this.ROM_CURVE = undefined;
            };


            switch (this.config['FIELD']) {
                case "25519":
                    this.ROM_FIELD = romField.ROM_FIELD_25519();
                    break;
                case "NIST256":
                    this.ROM_FIELD = romField.ROM_FIELD_NIST256();
                    break;
                case "NIST384":
                    this.ROM_FIELD = romField.ROM_FIELD_NIST384();
                    break;
                case "BRAINPOOL":
                    this.ROM_FIELD = romField.ROM_FIELD_BRAINPOOL();
                    break;
                case "ANSSI":
                    this.ROM_FIELD = romField.ROM_FIELD_ANSSI();
                    break;
                case "HIFIVE":
                    this.ROM_FIELD = romField.ROM_FIELD_HIFIVE();
                    break;
                case "GOLDILOCKS":
                    this.ROM_FIELD = romField.ROM_FIELD_GOLDILOCKS();
                    break;
                case "C41417":
                    this.ROM_FIELD = romField.ROM_FIELD_C41417();
                    break;
                case "NIST521":
                    this.ROM_FIELD = romField.ROM_FIELD_NIST521();
                    break;
                case "256PM":
                    this.ROM_FIELD = romField.ROM_FIELD_256PM();
                    break;
                case "384PM":
                    this.ROM_FIELD = romField.ROM_FIELD_384PM();
                    break;
                case "512PM":
                    this.ROM_FIELD = romField.ROM_FIELD_512PM();
                    break;
                case "BN254":
                    this.ROM_FIELD = romField.ROM_FIELD_BN254();
                    break;
                case "BN254CX":
                    this.ROM_FIELD = romField.ROM_FIELD_BN254CX();
                    break;
                case "BLS383":
                    this.ROM_FIELD = romField.ROM_FIELD_BLS383();
                    break;
                default:
                    this.ROM_FIELD = undefined;
            }

            this.BIG = big.BIG(this);
            this.DBIG = big.DBIG(this);
            this.FP = fp.FP(this);
            this.ECP = ecp.ECP(this);
            this.ECDH = ecdh.ECDH(this);

            if (this.config['@PF'] != 0) {
                this.FP2 = fp2.FP2(this);
                this.FP4 = fp4.FP4(this);
                this.FP12 = fp12.FP12(this);
                this.ECP2 = ecp2.ECP2(this);
                this.PAIR = pair.PAIR(this);
                this.MPIN = mpin.MPIN(this);
            };
            return;
        };
    };
};

module.exports = CTX;