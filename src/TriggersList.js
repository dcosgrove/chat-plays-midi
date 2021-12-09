import {
  useContext
} from 'react';

import {
  Container,
  Row,
  Col,
  Table,
  Button
} from 'react-bootstrap';

import { TwitchEventsContext } from './context/TwitchEvents';

const formatConditionName = ({ type, name }) => {
  switch (type) {
    case 'channelPoint':
      return `[Channel Points] ${name}`
    default:
      return 'Error'
  }
};

function TriggersList() {
    const {
      eventListeners,
      unregisterEventListener
    } = useContext(TwitchEventsContext);

    return (
      <Container fluid>
      <Row>
        <Col>
          <Table striped bordered variant="light">
            <thead>
              <tr>
                <th>Twitch Event</th>
                <th>Device</th>
                <th>Effects</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {
              eventListeners.map(({ id, condition, device, effects }) => {
                  console.log('device id', id);
                  return <tr key={id}>
                    <td>{formatConditionName(condition)}</td>
                    <td>{device.alias}</td>
                    <td>{effects.reduce((out, effect) => (out + ' ' + effect.name), '')}</td>
                    <td>
                      <Button variant="danger" onClick={() => {
                        unregisterEventListener(id);
                      }}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                }
              )
            }
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
    );
}

export default TriggersList;
