import {
  Button,
  Container,
  Row,
  Col,
  Table
} from 'react-bootstrap';

import { useContext } from 'react';
import DeviceTypes from './DeviceTypes';
import { MidiDeviceContext } from './context/MidiDevices';

function DeviceList() {

  const {
    devices,
    setDevices
  } = useContext(MidiDeviceContext);

  const removeDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <Table striped bordered variant="light">
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
              devices.map((device) => {
                  return <tr key={device.key}>
                    <td>{device.alias}</td>
                    <td>{device.id}</td>
                    <td>{DeviceTypes[device.type]}</td>
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
          { devices.length === 0 ? <h2>Add a new MIDI device to get started!</h2> : null }
        </Col>
      </Row>
    </Container>
  );
}

export default DeviceList;