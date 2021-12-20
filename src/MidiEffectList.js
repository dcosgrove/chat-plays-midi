import {
  Button,
  Container,
  Row,
  Col,
  Table
} from 'react-bootstrap';

import { useContext } from 'react';
import { MidiDeviceContext } from './context/MidiDevices';
import { TwitchEventsContext } from './context/TwitchEvents';

function MidiEffectList() {
  const {
    devices,
    setDevices
  } = useContext(MidiDeviceContext);

  const {
    eventListeners,
    unregisterEventListener
  } = useContext(TwitchEventsContext);

  const effects = devices.reduce((effects, device) => {
    const deviceEffects = Object.entries(device.effects).map(([effect, { exec }]) => ({
      key: `${device.key}-${effect}`,
      deviceAlias: device.alias,
      name: effect,
      exec
    }));

    return [
      ...effects,
      ...deviceEffects
    ];
  },[]);

  const removeEffect = (effect, deviceAlias) => {
    // remove the effect from the device
    setDevices((devices) => {
      const i = devices.findIndex((d) => d.alias === deviceAlias);
      const { [effect]: _, ...updated } = devices[i].effects;
      devices[i].effects = updated;
      return [...devices];
    });

    // remove any event listeners which used this effect
    const removedListeners = eventListeners.filter((listener) => {
      // if trigger's device name and effect name match
      return listener.device.alias === deviceAlias &&
        listener.effects.some((e) => e.name === effect);
    });
    
    removedListeners.forEach(l => unregisterEventListener(l.id));
  };

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
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
            {
              effects.map((effect) => {
                  return <tr key={effect.key}>
                    <td>{effect.deviceAlias}</td>
                    <td>{effect.name}</td>
                    <td>
                      <Button 
                        onClick={() => {
                          console.log('effect', effect);
                          effect.exec();
                        }}
                      >
                        Trigger
                      </Button>
                    </td>
                    <td>
                    <Button
                        variant="danger"
                        onClick={() => {
                          removeEffect(effect.name, effect.deviceAlias);
                        }}
                      >
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

export default MidiEffectList;
