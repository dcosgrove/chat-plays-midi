import {
  useContext,
  useEffect,
  useState
} from 'react';

import { 
  Button,
  Col,
  Container,
  Row
} from 'react-bootstrap';

import { MidiDeviceContext } from './context/MidiDevices';
import { TwitchEventsContext } from './context/TwitchEvents';

import attachEffectsToDevice from './effects/Effects';


const saveConfigurationToStorage = (name, { triggers, devices }) => {
  localStorage.setItem(`${name}-triggers`, JSON.stringify(triggers));
  localStorage.setItem(`${name}-devices`, JSON.stringify(devices));
};

const loadConfigurationFromStorage = (name) => {
  const triggers = JSON.parse(localStorage.getItem(`${name}-triggers`));
  const devices = JSON.parse(localStorage.getItem(`${name}-devices`));

  if (triggers && devices) {
    return {
      triggers,
      devices
    }
  } else {
    return null;
  }
};

function ConfigurationBackupForm() {
    const {
      eventListeners,
      setEventListeners
    } = useContext(TwitchEventsContext);

    const {
      devices,
      setDevices,
      midiOutputs
    } = useContext(MidiDeviceContext)

    const [ errors, setErrors ] = useState([]);

    const serializeCurrentConfiguration = () => {
      const serializedTriggers = eventListeners.map((eventListener) => {
        return {
          id: eventListener.id,
          condition: eventListener.condition,
          device: eventListener.device.id,
          effects: eventListener.effects.map(e => e.name)
        };
      });

      const serializedDevices = devices.map((device) => {         
        return {
          id: device.id,
          alias: device.alias,
          channel: device.channel,
          type: device.type,
          midiOutput: device.output.id
        };
      });

      return {
        triggers: serializedTriggers,
        devices: serializedDevices
      };
    };
  
    const deserializeAndLoadConfiguration = ({ triggers = [], devices = [] }) => {
      const deviceDeserializationResult = devices.reduce(({ devices, errors }, device) => {
        const midiOutput = midiOutputs.find(output => output.id === device.midiOutput);
        if(midiOutput) {

          const deviceWithoutEffects = {
            ...device,
            key: device.id,
            output: midiOutput
          };

          return {
            devices: [
              ...devices,
              attachEffectsToDevice(deviceWithoutEffects)
            ],
            errors: errors
          }
        } else {
          return { 
            devices: devices,
            errors: [
              ...errors,
              new Error(`Error loading configuration for device ${device.alias} - ID ${device.midiOutput} not found`)
            ]
          }
        }
      }, {
        devices: [],
        errors: []
      });

      setErrors(deviceDeserializationResult.errors);
      setDevices(deviceDeserializationResult.devices);
      
      const deserializedTriggers = triggers.reduce((triggers, trigger) => {
        const device = deviceDeserializationResult.devices.find((d) => d.id === trigger.device);

        if(device) {
          const hydratedTrigger = {
            ...trigger,
            device: device,
            effects: trigger.effects.map((name) => {
              return {
                name: name,
                exec: device.effects[name]
              }
            })
          }

          return [
            ...triggers,
            hydratedTrigger
          ]
        } else {
          return triggers;
        }
      }, []);

      setEventListeners(deserializedTriggers);

      return deviceDeserializationResult.errors;
    };

    const [ initialLoad, setInitialLoad ] = useState(true);

    useEffect(() => {
      if(initialLoad) {
        const configuration = loadConfigurationFromStorage('current');
        if (configuration) {
          const errors = deserializeAndLoadConfiguration(configuration);
          if (errors.length === 0) {
            setInitialLoad(false);
          }
        } else {
          setInitialLoad(false);
        }
      }
    }, [ midiOutputs, initialLoad, setInitialLoad, deserializeAndLoadConfiguration ]);

    return <Container>
      <Row className="mb-2">
        <Col>
          <Button
            variant="primary"
            onClick={() => {
              const configuration = serializeCurrentConfiguration();
              saveConfigurationToStorage('current', configuration);
            }}
            >
          Save Current Configuration
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button
            variant="primary"
            onClick={() => {
              const configuration = loadConfigurationFromStorage('current');
              if (configuration) {
                deserializeAndLoadConfiguration(configuration);
              }
            }}
            >
          Restore Last Saved Configuration
          </Button>
        </Col>
      </Row>
    </Container>
}

export default ConfigurationBackupForm;
