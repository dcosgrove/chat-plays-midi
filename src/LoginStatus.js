import {
  useContext
} from 'react';
import {
  CloudCheck,
  CloudSlash
} from 'react-bootstrap-icons';

import { Alert, Spinner } from 'react-bootstrap';

import { TwitchEventsContext } from './context/TwitchEvents';

function LoginStatus() {
    const {
      connectionStatus
    } = useContext(TwitchEventsContext);    

    switch (connectionStatus) {
      case 'connected':
        return <Alert variant="success" className="mb-0"> <CloudCheck color="green" /> Connected to Twitch</Alert>
      case 'connecting':
        return <Alert variant="primary" className="mb-0"> <Spinner size="sm" animation="border" /> Connecting...</Alert>
      case 'disconnected':
        return <Alert variant="danger" className="mb-0"><CloudSlash color="red" /> Disconnected from Twitch!</Alert>
      default:
        return <Alert variant="warning">Error checking connection status</Alert>
    }
}

export default LoginStatus;
