import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Row,
  Form
} from 'react-bootstrap';

import { useState, useContext } from 'react';

import DeviceTypes from './DeviceTypes';
import { MidiDeviceContext } from './context/MidiDevices';

import attachBuiltinEffectsToDevice from './effects/Effects';

function DeviceAddForm() {
  const initialState = {
    alias: 'My Example Device',
    type: '',
    midiDevice:'',
    midiChannel: ''
  };

  const [ formValues, setValues ] = useState(initialState);

  const {
    devices,
    setDevices,
    midiOutputs
  } = useContext(MidiDeviceContext);

  const addDevice = (device) => {
    if (devices.some((d) => d.key === device.key)) {
      // TODO - some validation error msg because it's already been added
    } else {
      setDevices([
        ...devices,
        attachBuiltinEffectsToDevice(device)
      ]);
    }
  };

  return (
    <Container>
      <Row>
        <Form>
          <Row>
            <Form.Group className="mb-3" controlId="formDeviceAlias">
              <Form.Label>Device Name</Form.Label>
              <Form.Control
                value={formValues.alias}
                onChange={(e) => {
                  setValues({
                    ...formValues,
                    alias: e.target.value
                  });
                }}
                type="text" />
              <Form.Text className="text-muted">
                Enter a name for the MIDI device you want to control
              </Form.Text>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Col md>
              <FloatingLabel controlId="formDeviceType" label="Device Type">
                <Form.Select
                  value={formValues.type}
                  onChange={(e) => {
                    setValues({
                      ...formValues,
                      type: e.target.value
                    });
                  }}
                  aria-label="Device Type">
                  <option value=""></option>
                  {
                    Object.entries(DeviceTypes).map(([ deviceId, deviceName ]) => {
                      return <option
                        key={deviceId}
                        value={deviceId}
                        >
                          {deviceName}
                        </option>
                        
                    })
                  }
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col md>
              <FloatingLabel controlId="formMidiDevice" label="MIDI Device">
                <Form.Select
                  value={formValues.midiDevice}
                  onChange={(e) => {
                    setValues({
                      ...formValues,
                      midiDevice: e.target.value
                    })
                  }}
                  aria-label="MIDI Device">
                <option value=""></option>
                  {
                    midiOutputs.map((device) => (
                      <option key={device.id} value={device.id}>{device.name} ({device.id})</option>
                    ))
                  }
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col md>
              <FloatingLabel controlId="formChannel" label="MIDI Channel">
                <Form.Select
                  value={formValues.midiChannel}
                  onChange={(e) => {
                    setValues({
                      ...formValues,
                      midiChannel: e.target.value
                    });
                  }}
                  aria-label="MIDI Channel">
                  <option value=""></option>
                  {
                    [...Array(16)].map((e, i) => (
                      <option key={i} value={i+1}>{i+1}</option>
                    ))
                  }
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                onClick={() => {
                  addDevice({
                    key: [formValues.midiDevice, '-', formValues.midiChannel].join(''),
                    id: [formValues.midiDevice, '-', formValues.midiChannel].join(''),
                    alias: formValues.alias,
                    channel: formValues.midiChannel,
                    type: formValues.type,                    
                    output: midiOutputs.find((output) => output.id === formValues.midiDevice)
                  });
                }}
                variant="primary">
                Add Device
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    </Container>
  );
}

export default DeviceAddForm;
