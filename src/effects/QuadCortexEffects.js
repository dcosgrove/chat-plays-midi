// Neural docs https://cortex-support.neuraldsp.com/help/incoming-midi-reserved-cc-list


// Effect name to midi CC tuples
const Effects = [
]

export const QuadCortexEffects = (device, channel) => {
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

export const SceneLetterMap = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7
};

export const QC_EFFECT_TYPES = [
  'Change Preset',
  'Change Scene'
];

export const CreatePresetChangeEffect = (device, channel) => (setlist, preset) => () => {
  console.log('[Debug] QC MIDI preset change: Setlist', setlist, 'Preset', preset);

  // first CC for preset divvying
  if(preset < 128) {
    device.sendControlChange(0, 0, channel);
  } else {
    device.sendControlChange(0, 1, channel);
  }

  // CC32 for picking setlist
  device.sendControlChange(32, setlist, channel);

  // selected preset
  device.sendProgramChange(preset % 128, channel);
}

export const CreateSceneChangeEffect = (device, channel) => (scene) => () => {
  // CC#43 - neural scene changes
  device.sendControlChange(43, SceneLetterMap[scene], channel);
  console.log('[Debug] QC Changing scene to: ', scene);
}

export const CreateEffectFromParams = (device, channel) => (params) => {
  switch (params.effectType) {
    case 'Change Preset':
      return CreatePresetChangeEffect(device, channel)(params.setlistNumber, params.presetNumber);
    case 'Change Scene':
      return CreateSceneChangeEffect(device, channel)(params.scene);
    default:
      return;
  }
}

export default QuadCortexEffects;
