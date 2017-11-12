# Multi-Authority-SDC

Current main issue:
- Given secret key = (x, y)
- Some message's signature = (sig1, sig2), where sig2 = (x+y*m) * sig1
The scheme will not produce correct signature when y > 513,

The result diverge at y*m step:
When function `smul` is used, that is supposed to return `BIG` result, some of the carry is lost, for example: (y = 514, m = SHA256("Hello World!")

y: 0000000000000000000000000000000000000000000000000000000000000202

m: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069

Result produced is (y*m):

066a2dcae3dca019cdde8593d4f068b452f0d586f49b3ee6515fa424fffbf2d2

While it should have been:

100066a2dcae3dca019cdde8593d4f068b452f0d586f49b3ee6515fa424fffbf2d2

When function `mul` is used, that returns `DBIG` result, the result contains whole "value", but can't be used to multiply it by h