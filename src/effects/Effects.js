import ArchetypeEffects from './ArchetypeEffects';
import KemperEffects from './KemperEffects';
import {
  QuadCortexEffects,
  CreateEffectFromParams as CreateQuadCortexEffectFromParams
 } from './QuadCortexEffects';

 import {
   CreateEffectFromParams as CreateGenericEffectFromParams
 } from './GenericDeviceEffects';

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
    // Generic and others
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
    } else if(deviceType === 'neural-henson') {
      return {
        ...effect,
        exec: CreateGenericEffectFromParams(device, midiChannel)(effect.params)
      }
    } else if(deviceType === 'generic') {
      return {
        ...effect,
        exec: CreateGenericEffectFromParams(device, midiChannel)(effect.params)
      }
    }else {
      return {
        ...effect,
        exec: () => { console.log('Error: device not supported') }
      }
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
