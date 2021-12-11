import {
  createContext,
  useContext,
  useEffect,
  useState
 } from "react";
import useTwitchPubSubClient from "../hooks/TwitchPubSubClient";
import { AuthContext } from "./Auth";

export const TwitchEventsContext = createContext({
  events: [],
  registerEventListeners: (listenerFn) => {},
  unregisterEventListener: (id) => {},
  setEventListeners: () => {},
  eventListeners: [],
  connectionStatus: 'disconnected'
});

export const TwitchEventsProvider = ({ children }) => {
  const [ events, setEvents ] = useState([]);

  const {
    clientId,
    token
  } = useContext(AuthContext);

  const onChannelPointRedemption = ({ userDisplayName, rewardTitle, redemptionDate }) => {
    setEvents((events) => {
      return [
        ...events,
        { userDisplayName, rewardTitle, redemptionDate }
      ]
    });
    }

  const [ eventListeners, setEventListeners ] = useState([]);
  
  // run triggers for latest event
  useEffect(() => {
    if (events.length > 0) {
        const { rewardTitle } = events[events.length-1];
        eventListeners.forEach(({ condition, effects }) => {
        if(condition.type === 'channelPoint' && condition.name === rewardTitle) {
          effects.forEach(({ exec }) => exec());
        }
      });
    }    
  }, [ events ])

  const connectionStatus = useTwitchPubSubClient(clientId, token, onChannelPointRedemption);

  return <TwitchEventsContext.Provider value={{ 
      events,
      registerEventListeners: (eventListeners) => {
        setEventListeners((previous) => {
          return [
            ...previous,
            ...eventListeners
          ];
        });
      },
      unregisterEventListener: (id) => {
        setEventListeners((listeners) => {
          return listeners.filter(listener => listener.id !== id);
        });
      },
      setEventListeners: setEventListeners,
      eventListeners: eventListeners,
      connectionStatus
  }}>
    {children}
  </TwitchEventsContext.Provider>
}

export default TwitchEventsProvider;
