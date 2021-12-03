import {
  useContext
} from 'react';
import {
  Container,
  ListGroup
} from 'react-bootstrap';

import { TwitchEventsContext } from './context/TwitchEvents';

function TwitchEventsLog() {
    const {
      events,
      onNewEvent
    } = useContext(TwitchEventsContext);

    return <Container>
      <h2>Most Recent Events</h2>
      <ListGroup>
        {
          events.map(({ userDisplayName, rewardTitle, redemptionDate }) => {
            return <ListGroup.Item key={`${userDisplayName}-${redemptionDate}`}>
              {`Username: ${userDisplayName} | Reward: ${rewardTitle} | Date: ${redemptionDate}`}
            </ListGroup.Item>
          })
        }
      </ListGroup>
    </Container>
}

export default TwitchEventsLog;
