import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs, Tab } from 'react-bootstrap';
import DeviceList from './DeviceList';
import DeviceAddForm from './DeviceAddForm';
import MidiEffectList from './MidiEffectList';
import TwitchEvents from './TwitchEvents';
import MidiDeviceProvider from './context/MidiDevices';

function Browser() {
  return (
    <MidiDeviceProvider>
      <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="triggers" title="Triggers">
          Triggers
          <TwitchEvents></TwitchEvents>
        </Tab>
        <Tab eventKey="twitchActions" title="Twitch Actions">
          <MidiEffectList></MidiEffectList>
        </Tab>
        <Tab eventKey="midiDevices" title="MIDI Devices">
          <DeviceList></DeviceList>
          <DeviceAddForm></DeviceAddForm>
        </Tab>
      </Tabs>
    </MidiDeviceProvider>
  );
}

export default Browser;
