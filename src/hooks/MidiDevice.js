import { useState, useEffect } from 'react';
import webmidi from 'webmidi';

function useMidiDeviceList() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    webmidi.enable((err) => {
      if(err) {
        console.error('Unable to enable WebMIDI', err);
        setDevices([]);
      } else {      
        setDevices(webmidi.outputs);
      }
    });
  }, []);

  return devices;
}

export default useMidiDeviceList;
