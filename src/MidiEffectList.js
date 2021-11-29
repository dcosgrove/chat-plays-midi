import {
  Button,
  Container,
  Row,
  Col,
  Table
} from 'react-bootstrap';

import { useContext } from 'react';
import { MidiDeviceContext } from './context/MidiDevices';

function MidiEffectList() {
  const { devices } = useContext(MidiDeviceContext);

  const effects = devices.reduce((effects, device) => {
    const deviceEffects = Object.entries(device.effects).map(([effect, trigger]) => ({
      key: `${device.key}-${effect}`,
      deviceAlias: device.alias,
      name: effect,
      trigger: trigger
    }));

    return [
      ...effects,
      ...deviceEffects
    ];
  },[]);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Table striped bordered variant="light">
            <thead>
              <tr>
                <th>Device</th>
                <th>Effect</th>
                <th>Test</th>
              </tr>
            </thead>
            <tbody>
            {
              effects.map((effect) => {
                  return <tr key={effect.key}>
                    <td>{effect.deviceAlias}</td>
                    <td>{effect.name}</td>
                    <td>
                      <Button onClick={() => {
                        effect.trigger();
                      }}>
                        Trigger
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

export default MidiEffectList;
