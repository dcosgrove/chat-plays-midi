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

import { attachEffectsToDevice } from './effects/Effects';

const deserializeEffects = (effects) => {
  return effects.map((effect) => {
    const params = {
      effectType: effect.effectType,
      ...Object.fromEntries(effect.params)
    };

    return {
      name: effect.name,
      params
    }
  })
};

const saveConfigurationToStorage = (name, { triggers, devices, effects }) => {
  localStorage.setItem(`${name}-triggers`, JSON.stringify(triggers));
  localStorage.setItem(`${name}-devices`, JSON.stringify(devices));
  localStorage.setItem(`${name}-effects`, JSON.stringify(effects));
};

const loadConfigurationFromStorage = (name) => {
  const triggers = JSON.parse(localStorage.getItem(`${name}-triggers`));
  const devices = JSON.parse(localStorage.getItem(`${name}-devices`));
  const effects = JSON.parse(localStorage.getItem(`${name}-effects`));

  if (triggers && devices && effects) {
    return {
      triggers,
      devices,
      effects
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

      const serializedEffects = devices.reduce((serializedEffectsList, device) => {
        const deviceDetails = {
          alias: device.alias,
          deviceType: device.type
        };

        const effects = Object.entries(device.effects).map(([ name, { params } ]) => {
          const {
            effectType,
            ...extraParams
          } = params;

          const serializedParams = Object.entries(extraParams);
          return {
            ...deviceDetails,
            name,
            effectType,
            params: serializedParams  
          }
        });

        return [
          ...serializedEffectsList,
          ...effects
        ];
      }, []);

      return {
        triggers: serializedTriggers,
        devices: serializedDevices,
        effects: serializedEffects
      };
    };
  
    const deserializeAndLoadConfiguration = ({ triggers = [], devices = [], effects = [] }) => {
      const deviceDeserializationResult = devices.reduce(({ devices, errors }, device) => {
        const midiOutput = midiOutputs.find(output => output.id === device.midiOutput);
        if(midiOutput) {
          const deviceWithoutEffects = {
            ...device,
            key: device.id,
            output: midiOutput
          };

          // filter for device and deserialize
          const deserializedEffects = deserializeEffects(effects.filter((e) => e.alias === device.alias));

          return {
            devices: [
              ...devices,
              attachEffectsToDevice(deviceWithoutEffects, deserializedEffects)
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
                exec: device.effects[name].exec
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
