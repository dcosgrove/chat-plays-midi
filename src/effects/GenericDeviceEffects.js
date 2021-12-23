// Effect name to midi CC tuples
const Effects = [
]

export const GenericDeviceEffects = (device, channel) => {
  return Effects.reduce((effectFns, [ name, cc, type ]) => {
      effectFns[name] = () => {
        if (type === 'control') {
          device.sendControlChange(cc, 1, channel);
        } else if (type === 'program') {
          device.sendProgramChange(cc, channel);
        }
      };

      return effectFns;
  }, {});
}

export const CreateMidiCcEffect = (device, channel) => (cc) => () => {
  device.sendControlChange(cc, 1, channel);
}

export const CreateMidiPcEffect = (device, channel) => (pc) => () => {
  device.sendProgramChange(pc, channel);
}

export const CreateEffectFromParams = (device, channel) => (params) => {
  switch (params.effectType) {
    case 'Control Change':
      return CreateMidiCcEffect(device, channel)(params.midiCc);
    case 'Program Change':
      return CreateMidiPcEffect(device, channel)(params.midiPc);
    default:
      return;
  }
}

export default CreateEffectFromParams;
