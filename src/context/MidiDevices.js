import {
  createContext, useState
 } from "react";

import useMidiDeviceList from "../hooks/MidiDevice";

export const MidiDeviceContext = createContext({
  devices: [],
  setDevices: () => {},
  midiOutputs: []
});

export const MidiDeviceProvider = ({ children }) => {
    const midiOutputs = useMidiDeviceList();
    const [ devices, setDevices ] = useState([]);

    return <MidiDeviceContext.Provider value={{ 
        devices,
        setDevices,
        midiOutputs
      }}>
      {children}
    </MidiDeviceContext.Provider>
}

export default MidiDeviceProvider;
