import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Row,
  Form
} from 'react-bootstrap';

import { useState, useContext } from 'react';

import { MidiDeviceContext } from './context/MidiDevices';
import { TwitchEventsContext } from './context/TwitchEvents';

function TriggersAddForm() {
  const initialState = {
    device: {
      effects: []
    },
    condition: {
      type: '',
      name: ''
    },
    effect: ''
  };

  const [ { device, condition, effect }, setFormValues ] = useState(initialState);

  const {
    devices
  } = useContext(MidiDeviceContext);

  const {
    registerEventListeners
  } = useContext(TwitchEventsContext);

  const addTrigger = (formValues) => {
    const trigger = {
      id: `${formValues.device.alias}-${formValues.condition.type}-${formValues.condition.name}`,
      device: formValues.device,
      condition: formValues.condition,
      effects: [{
        name: formValues.effect,
        exec: formValues.device.effects[formValues.effect].exec
      }]
    };
    
    registerEventListeners([
      trigger
    ]);
  };

  return (
    <Container>
      <Row>
        <Form>
          <Row className="mb-3">
          <Col md>
              <FloatingLabel controlId="formTwitchEvent" label="Twitch Event Type">
                <Form.Select
                  value={condition.type}
                  onChange={(e) => {
                    setFormValues((formValues) => {
                      return {
                        ...formValues,
                        condition: {
                          name: formValues.condition.name,
                          type: e.target.value
                        }
                      }
                    });
                  }}
                  aria-label="Device Type">
                  <option value=""></option>
                  <option value="channelPoint">Channel Points</option>
                  <option value="bits">Bits</option>
                  <option value="subscriptions">Subscriptions</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col md>
              <FloatingLabel controlId="floatingInputGrid" label="Twitch Event: Value">
                <Form.Control
                  type="text"
                  value={condition.name}
                  onChange={(e) => {
                    setFormValues((formValues) => {
                      return {
                          ...formValues,
                          condition: {
                            type: formValues.condition.type,
                            name: e.target.value
                          }
                        }
                      });
                    }
                  }
                  placeholder="Tone: Toggle Reverb" />
              </FloatingLabel>
            </Col>
            <Col md>
              <FloatingLabel controlId="formDevice" label="Device">
                <Form.Select
                  value={device.id}
                  onChange={(e) => {
                    setFormValues((formValues) => {
                      return {
                        ...formValues,
                        device: devices.find((d) => (d.id === e.target.value)) || { effects: [] }
                      }
                    })
                  }}
                  aria-label="Device">
                <option value=""></option>
                  {
                    devices.map(({ alias, key, id }) => (
                      <option key={key} value={id}>{alias}</option>
                    ))
                  }
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col md>
              <FloatingLabel controlId="formEffects" label="Effects">
                <Form.Select
                  value={effect}
                  onChange={(e) => {
                    
                    setFormValues((formValues) => {
                      return {
                        ...formValues,
                        effect: e.target.value
                      }
                    });
                  }}
                  aria-label="MIDI Channel">
                  <option value=""></option>
                  {
                    Object.keys(device.effects).map((name) => {
                      return <option key={name} value={name}>{name}</option>
                     })
                  }
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                onClick={() => {
                  addTrigger({
                    device,
                    condition,
                    effect
                  });
                }}
                variant="primary">
                Add Trigger
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    </Container>
  );
}

export default TriggersAddForm;
