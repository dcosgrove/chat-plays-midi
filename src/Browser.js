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
import ConfigurationBackupForm from './ConfigurationBackupForm';
import EffectAddForm from './EffectAddForm';

function Browser() {
  return (
    <MidiDeviceProvider>
      <Tabs defaultActiveKey="browser" id="browser" className="mb-3">
        <Tab eventKey="triggers" title="Triggers">
          <TriggersList />
          <TriggersAddForm />
        </Tab>
        <Tab eventKey="previewEffects" title="Preview Effects">
          <MidiEffectList />
          <EffectAddForm />
        </Tab>
        <Tab eventKey="midiDevices" title="Manage MIDI Devices">
          <DeviceList />
          <DeviceAddForm />
        </Tab>
        <Tab eventKey="saveConfiguration" title="Save/Load Configuration">
          <ConfigurationBackupForm />
        </Tab>
        <Tab eventKey="eventLog" title="Twitch Event Log">
          <TwitchEventsLog />
        </Tab>
      </Tabs>
    </MidiDeviceProvider>
  );
}

export default Browser;
