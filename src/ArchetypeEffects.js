
const ArchetypeEffects = (device, channel) => {
  return {
    'Test': () => {
      console.log('sending control change to ', device, channel);
      device.sendControlChange(27, 1, channel);
    }
  }
}

export default ArchetypeEffects;
