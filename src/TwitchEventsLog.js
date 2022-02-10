import {
  useContext
} from 'react';
import {
  Container,
  FloatingLabel,
  Form
} from 'react-bootstrap';

import { TwitchEventsContext } from './context/TwitchEvents';

function TwitchEventsLog() {
    const {
      events
    } = useContext(TwitchEventsContext);

    const formattedLogs = events.map(({ userDisplayName, rewardTitle, redemptionDate }) => {
      return `[${redemptionDate}] Username: ${userDisplayName} | Channel Point Redemption: ${rewardTitle}`
    }).join('\n');
    
    return <Container>
      <FloatingLabel controlId="logsTextArea" label="Twitch Event Log">
        <Form.Control
          as="textarea"
          readOnly
          value={formattedLogs}
          style={{ height: '400px' }}
        />
      </FloatingLabel>

    </Container>
}

export default TwitchEventsLog;
