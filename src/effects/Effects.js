import ArchetypeEffects from './ArchetypeEffects';
import KemperEffects from './KemperEffects';
import {
  QuadCortexEffects,
  CreateEffectFromParams as CreateQuadCortexEffectFromParams
 } from './QuadCortexEffects';

// attach a list of effects to a device based on its type
const getBuiltinEffectsForDevice = (midiOutput, midiChannel, deviceType) => {
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

const getInitializedEffectsForDevice = (device, midiChannel, deviceType, effects) => {
  return effects.map((effect) => {
    if(deviceType === 'quad-cortex') {
      return {
        ...effect,
        exec: CreateQuadCortexEffectFromParams(device, midiChannel)(effect.params)
      }
    } else {
      return {}
    }
  }).reduce((effectsMap, effect) => {
    effectsMap[effect.name] = {
      params: effect.params,
      exec: effect.exec
    };
    
    return effectsMap;
  }, {});
};

const attachBuiltinEffectsToDevice = (device) => {
  return {
    ...device,
    effects: getBuiltinEffectsForDevice(device.output, device.channel, device.type)
  }
};

export const attachEffectsToDevice = (device, effects) => {

  return {
    ...device,
    effects: getInitializedEffectsForDevice(device.output, device.channel, device.type, effects)
  }
};

export default attachBuiltinEffectsToDevice;
