import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card } from 'react-bootstrap';
import {
  useContext
} from 'react';

import { AuthContext } from './context/Auth';

const REDIRECT_URL = process.env.PUBLIC_URL === '' ?
    'http://localhost:3000/authorize' : `${process.env.PUBLIC_URL}/authorize`;

function LoginGate(props) {
    const {
      clientId,
      token
    } = useContext(AuthContext);
    
    const loggedIn = token !== '';
    
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
