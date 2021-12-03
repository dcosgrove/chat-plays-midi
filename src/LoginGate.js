import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card } from 'react-bootstrap';
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
      <Card>
        <Card.Body>
          Login to Twitch to get started!
          <Button onClick={() => {
            window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${REDIRECT_URL}&response_type=token&scope=bits%3Aread%20channel%3Aread%3Aredemptions%20channel%3Aread%3Asubscriptions`;
          }}>
            Login
          </Button>
        </Card.Body>
      </Card>
}

export default LoginGate;
