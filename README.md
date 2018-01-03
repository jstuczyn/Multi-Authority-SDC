# Multi-Authority-SDC

### Step I: Client Generating coins himself

### Diagram:

![Diagram](https://i.imgur.com/ycQoCbf.png)

### Current Client Interface:
![Interface](https://i.imgur.com/ylcVhHo.png)

### Diagram Steps Status:
- 1.generate_coin() - completed
- 2.get_signatures() - completed
- 3.sign_coin() - completed
- 4.aggregate_signatures() - completed
- 5.randomize_aggregate() - completed
- 6.spend_coin() - in progress
- 7.verify_sig() - in progress

#### Questions:
- Does it matter if id of coin is g1^id or g2^id?
- Same for NZKP, does it matter if W = g1^w or g2^w?

#### TODOs:
- Client Merchant entity
