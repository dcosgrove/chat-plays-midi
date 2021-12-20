// Effect name to midi CC tuples
const HENSON_EFFECTS = [
  [ 'Toggle Overdrive', 1, 'control' ],
  [ 'Toggle Distortion', 3, 'control'],
  [ 'Toggle Phaser', 4, 'control'],
  [ 'Toggle Chorus', 5, 'control'],
  // 6 IS CURSED
  [ 'Toggle Reverb', 7, 'control' ],
  [ 'Toggle Delay', 8, 'control' ],
  [ 'Change Patch: Clean Delay', 0, 'program' ],
  [ 'Change Patch: Lead Shred', 1, 'program' ]
]

const CreateArchetypeBuiltinEffect = (device, channel) => ({ cc, midiType }) => () => {
  switch(midiType) {
    case 'control':
      return device.sendControlChange(cc, 1, channel);
    case 'program':
      return device.sendProgramChange(cc, channel);
    default:
      return;
  }
}

const CreateEffectFromParams = (device, channel) => (params) => {
  switch (params.effectType) {
    case 'builtin':
      return CreateArchetypeBuiltinEffect(device, channel)(params);
    default:
      return;
  }
}

const ArchetypeEffects = (device, channel) => {
  return HENSON_EFFECTS.reduce((out, [ name, cc, midiType ]) => {
    const params = {
      effectType: 'builtin',
      name,
      cc,
      midiType
    }

    out[name] = {
      params,
      exec: CreateEffectFromParams(device, channel)(params)
    }

    return out;
  }, {});
}  

export default ArchetypeEffects;
