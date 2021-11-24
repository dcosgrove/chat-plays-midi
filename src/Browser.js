import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs, Tab } from 'react-bootstrap';
import DeviceList from './DeviceList';
import DeviceAddForm from './DeviceAddForm';
import { useState } from 'react';

function Browser() {

  const [devices, setDevices] = useState([]);

  const addDevice = (device) => {
    if (devices.some((d) => d.id === device.id)) {
      // TODO - some error msg
    } else {
      setDevices([
        ...devices,
        device
      ]);
    }
  };

  const removeDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
  }

  return (
    <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
      <Tab eventKey="triggers" title="Triggers">
        Triggers
      </Tab>
      <Tab eventKey="twitchActions" title="Twitch Actions">
        Twitch
      </Tab>
      <Tab eventKey="midiDevices" title="MIDI Devices">
        <DeviceList devices={devices} removeDevice={removeDevice}></DeviceList>
        <DeviceAddForm addDevice={addDevice}></DeviceAddForm>
      </Tab>
    </Tabs>
  );
}

export default Browser;