# Multi-Authority-SDC

### Step II: Separate Issuer Entity

### Diagram:

![Diagram](https://i.imgur.com/6PI5NPs.png)

### Current Client Interface:
![Interface](https://i.imgur.com/KEfSzmX.png)

### Diagram Steps Status:
- 1.1 coinKeygen() - completed
- 1.2 getCoin() - not completed
- 1.3 checkBalance() - not completed
- 1.4 generateid() - semi-completed
- 1.5 generateAndSignCoin() - semi-completed
- 1.6 return of 1.2. - not completed

- 2.1 getSignatures() - completed
- 2.2 verifySignature() - not completed
- 2.3 signCoin() - completed

- 3 aggregateAndRandomizeSignatures() - completed

- 4.1 spendCoin() - completed
- 4.2 checkDoubleSpend() - not completed
- 4.3 verifySignatureAndProof() - completed
- 4.4 DepositCoin() - not completed


### Running the system:

#### Docker Database

This will start a new docker instance which will a run Postgres DB instance on port 5432.

```
cd docker
docker-compose up -d
```

To stop the docker container:

```
docker-compose stop
```

#### Seeding

After you launch the DB instance you will need to seed the DB with the clients data (some initial dummy balance).

```
npm install knex -g

knex migrate:latest

knex seed:run
```


#### Questions:

#### TODOs:
- Benchmarking
- Tests for recently added components and features
