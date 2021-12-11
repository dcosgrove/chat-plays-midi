import ArchetypeEffects from './ArchetypeEffects';
import KemperEffects from './KemperEffects';

// attach a list of effects to a device based on its type
const getEffectsForDevice = (midiOutput, midiChannel, deviceType) => {
  if(deviceType === 'kemper') {
    return KemperEffects(midiOutput, midiChannel);
  } else if(deviceType === 'neural-henson') {
    return ArchetypeEffects(midiOutput, midiChannel);
  } else if(deviceType === 'neural-gojira') {
    return ArchetypeEffects(midiOutput, midiChannel);
  } else {
    // TODO
    return [];
  }
};

const attachEffectsToDevice = (device) => {
  return {
    ...device,
    effects: getEffectsForDevice(device.output, device.midiChannel, device.type)
  }
};

export default attachEffectsToDevice;
