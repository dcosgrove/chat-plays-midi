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

import { CreatePresetChangeEffect } from './effects/QuadCortexEffects';

function EffectAddForm() {
  const initialState = {
    device: {
      effects: []
    },
    effectName: '',
    setlistNumber: '',
    presetNumber: ''
  };

  const [ { device, effectName, setlistNumber, presetNumber }, setFormValues ] = useState(initialState);

  const {
    devices,
    setDevices
  } = useContext(MidiDeviceContext);

  const addEffect = () => {

    // make a QC style program change
    console.log('making effect for device', device);    
    // replace device with updated preset list
    const otherDevices = devices.filter((d) => d.id !== device.id);

    const updatedEffects = device.effects;
    updatedEffects[effectName] = CreatePresetChangeEffect(device.output, device.channel)(setlistNumber, presetNumber);
    
    setDevices([
      ...otherDevices,
      {
        ...device,
        effects: updatedEffects
      }
    ]);
  };

  console.log('device', device);
  return (
    <Container>
      <Row>
        <Form>
          <Row className="mb-3">
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
              <FloatingLabel controlId="floatingEffectName" label="Effect Name">
                <Form.Control
                  type="text"
                  value={effectName}
                  onChange={(e) => {
                    setFormValues((formValues) => {
                      return {
                          ...formValues,
                          effectName: e.target.value
                        }
                      });
                    }
                  }
                  />
              </FloatingLabel>
            </Col>
            <Col md>
              <FloatingLabel controlId="floatingSetlistNumber" label="Setlist #">
                <Form.Control
                  type="text"
                  value={setlistNumber}
                  onChange={(e) => {
                    setFormValues((formValues) => {
                      return {
                          ...formValues,
                          setlistNumber: e.target.value
                        }
                      });
                    }
                  }
                  />
              </FloatingLabel>
            </Col>
            <Col md>
              <FloatingLabel controlId="floatingPresetNumber" label="Preset #">
                <Form.Control
                  type="text"
                  value={presetNumber}
                  onChange={(e) => {
                    setFormValues((formValues) => {
                      return {
                          ...formValues,
                          presetNumber: e.target.value
                        }
                      });
                    }
                  }
                  />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                onClick={() => {
                  addEffect({
                    device,
                    effectName,
                    setlistNumber,
                    presetNumber
                  });
                }}
                variant="primary">
                Add Effect
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    </Container>
  );
}

export default EffectAddForm;
