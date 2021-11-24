import {
  Button,
  Container,
  Row,
  Col,
  Table
} from 'react-bootstrap';

function DeviceList(props) {

  const { removeDevice } = props;
  return (
    <Container fluid>
      <Row>
        <Col>
          <Table striped bordered hove variant="light">
            <thead>
              <tr>
                <th>Alias</th>
                <th>ID</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {
              props.devices.map((device) => {
                  return <tr key="{device.id}">
                    <td>{device.alias}</td>
                    <td>{device.midiDevice}</td>
                    <td>{device.type}</td>
                    <td>
                      <Button variant="danger" onClick={() => {
                        removeDevice(device.id);
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
          { props.devices.length === 0 ? <h2>Add a new MIDI device to get started!</h2> : null }
        </Col>
      </Row>
    </Container>
  );
}

export default DeviceList;