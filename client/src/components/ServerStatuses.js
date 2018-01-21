import React from 'react';
import { Container, Table, Header, Segment } from 'semantic-ui-react';
import { signingServers, merchant, PKs, SERVER_TYPES } from '../config';
import ServerStatus from './ServerStatus';

const ServerStatuses = () => (
  <Segment style={{ padding: '2em 0em' }} vertical>
    <Container textAlign="center" text>
      <Header
        as="h2"
        textAlign="center"
        content="Status of Servers"
      />
      <Table celled size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Server</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {signingServers.map(server => (
            <ServerStatus
              key={server}
              address={server}
              type={SERVER_TYPES.signing}
            />
          ))}
          <ServerStatus
            address={merchant}
            type={SERVER_TYPES.merchant}
          />


        </Table.Body>
      </Table>
    </Container>
  </Segment>
);

export default ServerStatuses;
