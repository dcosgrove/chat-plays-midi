import { Container, Row, Col, ListGroup, Table } from 'react-bootstrap';

function AddAction(props) {
  return (
    <Container fluid>
      <Row>
        <Col>
          <h1>Connections</h1>
          <Table striped bordered hove variant="dark">
            <thead>
              <tr>
                <th>Name</th>
                <th>Twitch Action</th>
                <th>MIDI Action</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {
              props.devices.map((device) => {
                  return <tr>
                    <td>{device.name}</td>
                    <td>{device.twitchAction}</td>
                    <td>{device.midiAction}</td>
                    <td>EDIT/TEST</td>
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

export default DeviceList;