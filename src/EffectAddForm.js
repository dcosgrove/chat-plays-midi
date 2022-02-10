import {
  Alert,
  Button,
  Col,
  Container,
  FloatingLabel,
  Row,
  Form
} from 'react-bootstrap';

import { useState, useContext } from 'react';

import { MidiDeviceContext } from './context/MidiDevices';

import {
  QC_EFFECT_TYPES,
  CreateEffectFromParams as CreateQuadCortexEffectFromParams,
  SceneLetterMap
} from './effects/QuadCortexEffects';

import {
  CreateEffectFromParams as CreateGenericEffectFromParams
} from './effects/GenericDeviceEffects';

function GenericMidiEffectsRow({
  setEffectParams,
  effectParams
}) {
  const {
    effectType = '',
    midiCc = '',
    midiPc = ''
  } = effectParams;

  return <>
    <Row className="mb-3">
    <Col md>
      <FloatingLabel controlId="formMidiEffectType" label="Effect Type">
        <Form.Select
          required
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
          <option key="Control Change" value="Control Change">Control Change</option>
          <option key="Program Change" value="Program Change">Program Change</option>            
        </Form.Select>
      </FloatingLabel>
    </Col>
    { effectType === 'Control Change' ? 
      <>
        <Col xs>
          <FloatingLabel controlId="floatingCcNumber" label="CC #">
            <Form.Control
              required
              type="text"
              value={midiCc}
              onChange={(e) => {
                setEffectParams({
                      ...effectParams,
                      midiCc: e.target.value
                  });
                }
              }
              />
          </FloatingLabel>
        </Col>
        <Col xs></Col>
      </> : effectType === 'Program Change' ?
      <>
      <Col xs>
        <FloatingLabel controlId="floatingPcNumber" label="PC #">
          <Form.Control
            required
            type="text"
            value={midiPc}
            onChange={(e) => {
              setEffectParams({
                    ...effectParams,
                    midiPc: e.target.value
                });
              }
            }
            />
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
};

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
          required
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
              required
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
              required
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
              required
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
      id: '',
      effects: []
    },
    effectName: '',
    setlistNumber: '',
    presetNumber: ''
  };

  const [ { device, effectName, effectParams = {} }, setFormValues ] = useState(initialState);

  const [ validated, setValidated ] = useState(false);
  const [ displayDuplicateError, setDisplayDuplicateError ] = useState(false);

  const resetForm = () => {
    setValidated(false);
    setDisplayDuplicateError(false);
    setFormValues(initialState);
  }  

  const {
    devices,
    setDevices
  } = useContext(MidiDeviceContext);

  const addEffect = () => {
    // replace device with updated preset list
    const otherDevices = devices.filter((d) => d.id !== device.id);

    // effect name conflict - error!
    if(device.effects[effectName]) {
      setDisplayDuplicateError(true);
      return;
    }

    const updatedEffects = device.effects;
    if(device.type === 'quad-cortex') {
      updatedEffects[effectName] = {
        params: effectParams,
        exec: CreateQuadCortexEffectFromParams(device.output, device.channel)(effectParams)
      };
    } else if(device.type === 'neural-henson' || device.type === 'generic') {
      updatedEffects[effectName] = {
        params: effectParams,
        exec: CreateGenericEffectFromParams(device.output, device.channel)(effectParams)
      }
    }
    
    setDevices([
      ...otherDevices,
      {
        ...device,
        effects: updatedEffects
      }
    ]);

    resetForm();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const form = event.currentTarget;
    
    if (form.checkValidity()) {
      addEffect();
    } else {
      setValidated(true);
    }
  }

  return (
    <Container>
      <Row>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col xs={6}>
              <FloatingLabel controlId="floatingEffectName" label="Effect Name">
                <Form.Control
                  type="text"
                  required
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
                  required
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
              /> : device.type === 'neural-henson' || device.type === 'generic' ?
              <GenericMidiEffectsRow
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
              { 
                displayDuplicateError ?
                <Alert variant={'info'}>
                  Unable to add effect: name must be unique per device!
                </Alert> : null
              }
            </Col>
            <Col>
              <Button
                type="submit"
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
