import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Button,
  Card,
  Container,
  Stack
} from 'react-bootstrap';
import {
  useContext
} from 'react';

import { AuthContext } from './context/Auth';

function LoginGate(props) {
    const {
      clientId,
      token
    } = useContext(AuthContext);
    
    const loggedIn = token !== '';
    
    const REDIRECT_URL = `${window.location.protocol}//${window.location.host}${window.location.pathname}authorize`

    return loggedIn ? props.children : 
      <Card className="mt-3">
        <Card.Body>
          <Stack direction="horizontal" gap={2}>
            <div>Connect your Twitch.TV account in order to get started:</div>
            <Button onClick={() => {
              window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${REDIRECT_URL}&response_type=token&scope=bits%3Aread%20channel%3Aread%3Aredemptions%20channel%3Aread%3Asubscriptions`;
            }}>
              Twitch.TV Login
            </Button>
            </Stack>
        </Card.Body>
      </Card>
}

export default LoginGate;
