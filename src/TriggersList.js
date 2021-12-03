import {
  useContext,
  useEffect,
  useState
} from 'react';

import {
  Container,
  ListGroup
} from 'react-bootstrap';
import { MidiDeviceContext } from './context/MidiDevices';

import { TwitchEventsContext } from './context/TwitchEvents';

function TriggersList() {
    const {
      registerEventListeners
    } = useContext(TwitchEventsContext);

    const {
      devices
    } = useContext(MidiDeviceContext);

    const [ triggers, setTriggers ] = useState([]);

    useEffect(() => {
      if (devices.length > 0) {
        const device = devices[0];
        const reverbListener = {
          id: 1,
          device: device.alias,
          condition: {
            type: 'channelPoint',
            name: 'Tone: Toggle Reverb'
          },
          action: device.effects['Toggle Reverb']
          // action: () => {...}
        };

        const delayListener = {
          id: 2,
          device: device.alias,
          condition: {
            type: 'channelPoint',
            name: 'Tone: Toggle Delay'
          },
          action: device.effects['Toggle Delay']
        };

        const overdriveListener = {
          id: 3,
          device: device.alias,
          condition: {
            type: 'channelPoint',
            name: 'Tone: Toggle OD'
          },
          action: device.effects['Toggle Overdrive']
        };

        registerEventListeners([
          reverbListener,
          delayListener,
          overdriveListener
        ]);

        setTriggers([
          ...triggers,
          ...[ reverbListener, delayListener, overdriveListener ]
        ]);
      }
    }, [devices]);


    return <Container>
      <ListGroup>
        {
          triggers.map((trigger) => {
            const { id, condition, device } = trigger;
            return <ListGroup.Item key={id}>
              {`ID: ${id} | Twitch Event: ${condition.name} | Device: ${device} }`}
            </ListGroup.Item>
          })
        }
      </ListGroup>
    </Container>
}

export default TriggersList;
