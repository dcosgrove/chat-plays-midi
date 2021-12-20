// Kemper control codes doc: https://www.manualslib.com/manual/1786994/Kemper-Profiler.html?page=208#manual

// name, cc, value, program/control
const KEMPER_PRESETS = [
  ['Delay On', 27, 1, 'control'],
  ['Delay Off', 27, 0, 'control']
]

const CreateKemperBuiltinEffect = (device, channel) => ({ cc, value, midiType }) => () => {
  switch(midiType) {
    case 'control':
      return device.sendControlChange(cc, value, channel);
    case 'program':
      return device.sendProgramChange(cc, channel);
    default:
      return;
  }
}

export const CreateEffectFromParams = (device, channel) => (params) => {
  switch (params.effectType) {
    case 'builtin':
      return CreateKemperBuiltinEffect(device, channel)(params.setlistNumber, params.presetNumber);
    default:
      return;
  }
}

const KemperEffects = (device, channel) => {
  return KEMPER_PRESETS.reduce((out, [ name, cc, value, midiType ]) => {
    const params = {
      effectType: 'builtin',
      name: name,
      cc,
      value,
      midiType
    };

    out[name] = {
      params,
      exec: CreateEffectFromParams(device, channel)(params)
    }

    return out;
  }, {});
}

export default KemperEffects;
