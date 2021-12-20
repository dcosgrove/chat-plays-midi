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

import {
  QC_EFFECT_TYPES,
  CreateEffectFromParams,
  SceneLetterMap
} from './effects/QuadCortexEffects';

function QuadCortexEffectsRow({
  setEffectParams,
  effectParams
}) {

  const {
    effectType = '',
    presetNumber = '',
    setlistNumber = '',
    scene = ''
  } = effectParams;

  return <>
    <Row className="mb-3">
    <Col md>
      <FloatingLabel controlId="formQCEffectType" label="Effect Type">
        <Form.Select
          value={effectType}
          onChange={(e) => {
            // if we are changing to a new type, clear existing params
            if(e.target.value !== effectType) {
              setEffectParams({
                  effectType: e.target.value
              })
            }
          }}
          aria-label="Effect Type">
        <option value=""></option>
          {
            QC_EFFECT_TYPES.map((effectType) => (
              <option key={effectType} value={effectType}>{effectType}</option>
            ))
          }
        </Form.Select>
      </FloatingLabel>
    </Col>
    { effectType === 'Change Preset' ? 
      <>
        <Col xs>
          <FloatingLabel controlId="floatingSetlistNumber" label="Setlist #">
            <Form.Control
              type="text"
              value={setlistNumber}
              onChange={(e) => {
                setEffectParams({
                      ...effectParams,
                      setlistNumber: e.target.value
                  });
                }
              }
              />
          </FloatingLabel>
        </Col>
        <Col xs>
          <FloatingLabel controlId="floatingPresetNumber" label="Preset #">
            <Form.Control
              type="text"
              value={presetNumber}
              onChange={(e) => {
                setEffectParams({
                      ...effectParams,
                      presetNumber: e.target.value
                  });
                }
              }
              />
          </FloatingLabel>
        </Col>
      </> : effectType === 'Change Scene' ?
      <>
        <Col xs>
          <FloatingLabel controlId="floatingSceneLetter" label="Scene">
            <Form.Select
              value={scene}
              onChange={(e) => {
                setEffectParams({
                    ...effectParams,
                    scene: e.target.value
                });
              }}
              aria-label="Scene">
            <option value=""></option>
              {
               Object.keys(SceneLetterMap).map((scene) => (
                  <option key={scene} value={scene}>{scene}</option>
                ))
              }
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col xs></Col>
      </> : 
      <> 
        <Col xs></Col>
        <Col xs></Col> 
      </>
    }
  </Row>
  </>
}

function EffectAddForm() {
  const initialState = {
    device: {
      effects: []
    },
    effectName: '',
    setlistNumber: '',
    presetNumber: ''
  };

  const [ { device, effectName, effectParams = {} }, setFormValues ] = useState(initialState);

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
    updatedEffects[effectName] = {
      params: effectParams,
      exec: CreateEffectFromParams(device.output, device.channel)(effectParams)
    };
    
    setDevices([
      ...otherDevices,
      {
        ...device,
        effects: updatedEffects
      }
    ]);
  };

  return (
    <Container>
      <Row>
        <Form>
          <Row className="mb-3">
            <Col xs={6}>
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
          {
            device.type === 'quad-cortex' ?
              <QuadCortexEffectsRow
                setEffectParams={(effectParams) => {
                  setFormValues((formValues) => {
                    return {
                      ...formValues,
                      effectParams
                    }  
                  })
                }}
                effectParams={effectParams}
              /> : null
          }
          <Row>
            <Col>
              <Button
                onClick={() => {
                  addEffect({
                    device,
                    effectName,
                    effectParams
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
