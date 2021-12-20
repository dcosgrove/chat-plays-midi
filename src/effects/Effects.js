import ArchetypeEffects from './ArchetypeEffects';
import KemperEffects from './KemperEffects';
import QuadCortexEffects from './QuadCortexEffects';

// attach a list of effects to a device based on its type
const getEffectsForDevice = (midiOutput, midiChannel, deviceType) => {
  if(deviceType === 'kemper') {
    return KemperEffects(midiOutput, midiChannel);
  } else if(deviceType === 'neural-henson') {
    return ArchetypeEffects(midiOutput, midiChannel);
  } else if(deviceType === 'neural-gojira') {
    return ArchetypeEffects(midiOutput, midiChannel);
  } else if(deviceType === 'quad-cortex') {
    return QuadCortexEffects(midiOutput, midiChannel);
  }else {
    // TODO
    return [];
  }
};

const attachBuiltinEffectsToDevice = (device) => {
  return {
    ...device,
    effects: getEffectsForDevice(device.output, device.midiChannel, device.type)
  }
};

export default attachBuiltinEffectsToDevice;
