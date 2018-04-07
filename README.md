# Multi-Authority-SDC

### Step II: Separate Issuer Entity

### Diagram:

![Diagram](https://i.imgur.com/JvUazNF.png)

### Current Client Interface:
![Interface](https://i.imgur.com/KEfSzmX.png)


### Diagram Steps Status:

// todo: description


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

