import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs, Tab } from 'react-bootstrap';
import DeviceList from './DeviceList';
import DeviceAddForm from './DeviceAddForm';
import MidiEffectList from './MidiEffectList';
import TwitchEventsLog from './TwitchEventsLog';
import MidiDeviceProvider from './context/MidiDevices';
import TriggersList from './TriggersList';
import TriggersAddForm from './TriggersAddForm';

function Browser() {
  return (
    <MidiDeviceProvider>
      <Tabs defaultActiveKey="browser" id="browser" className="mb-3">
        <Tab eventKey="triggers" title="Triggers">
          <TriggersList />
          <TriggersAddForm></TriggersAddForm>
        </Tab>
        <Tab eventKey="previewEffects" title="Preview Effects">
          <MidiEffectList></MidiEffectList>
        </Tab>
        <Tab eventKey="midiDevices" title="Manage MIDI Devices">
          <DeviceList></DeviceList>
          <DeviceAddForm></DeviceAddForm>
        </Tab>
      </Tabs>
      <hr />
      <TwitchEventsLog />
    </MidiDeviceProvider>
  );
}

export default Browser;
