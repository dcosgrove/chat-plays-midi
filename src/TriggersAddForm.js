import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Row,
  Form
} from 'react-bootstrap';

import Select from 'react-select';

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
    effects: []
  };

  const [ {
    device,
    condition,
    effects
  }, setFormValues ] = useState(initialState);

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
      effects: formValues.effects.map((name) => ({
        name,
        exec: formValues.device.effects[name].exec 
      }))
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
                  {/* <option value="bits">Bits</option>
                  <option value="subscriptions">Subscriptions</option> */}
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
                  placeholder="" />
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
          </Row>
          <Row className="mb-3">
            <Col className="mr-5 ml-5" md>
              <Select
                options={Object.keys(device.effects).map(name => {
                  return {
                    value: name,
                    label: name
                  }
                })}
                value={effects.map((name) => ({
                  label: name,
                  value: name
                }))}
                placeholder="Select Effects"
                onChange={(selectedTriggers) => {
                  setFormValues((formValues) => {
                    return {
                      ...formValues,
                      effects: selectedTriggers.map(({ value }) => value)
                    }
                  });
                }}
                isMulti
                />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                onClick={() => {
                  addTrigger({
                    device,
                    condition,
                    effects
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
