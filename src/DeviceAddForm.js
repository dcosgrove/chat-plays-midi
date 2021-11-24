import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Row,
  Form
} from 'react-bootstrap';

import { useState } from 'react';

import useMidiDeviceList from './hooks/MidiDevice';

function DeviceAddForm(props) {

  const addDevice = props.addDevice;

  const initialState = {
    alias: 'My Example Device',
    type: '',
    midiDevice:'',
    midiChannel: ''
  };

  const [ formValues, setValues ] = useState(initialState);

  const connectedMidiDevices = useMidiDeviceList();

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
                  <option value="kemper">Kemper Profiler (all models)</option>
                  <option value="qc">Neural DSP Quad Cortex</option>
                  <option value="gr55">Roland GR-55</option>
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
                    connectedMidiDevices.map((device) => (
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
              <Button
                onClick={() => {
                  console.log(formValues);
                  addDevice({
                    ...formValues,
                    id: [formValues.midiDevice, '-', formValues.midiChannel].join()
                  });
                }}
                variant="primary">
                Add Device
              </Button>
          </Row>
        </Form>
      </Row>
    </Container>
  );
}

export default DeviceAddForm;
