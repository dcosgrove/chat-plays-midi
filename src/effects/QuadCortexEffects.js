// Effect name to midi CC tuples
const Effects = [
  // [ 'Toggle Overdrive', 1, 'control' ],
  // [ 'Toggle Distortion', 3, 'control'],
  // [ 'Toggle Phaser', 4, 'control'],
  // [ 'Toggle Chorus', 5, 'control'],
  // // 6 IS CURSED
  // [ 'Toggle Reverb', 7, 'control' ],
  // [ 'Toggle Delay', 8, 'control' ],
  // [ 'Change Patch: Clean Delay', 0, 'program' ],
  // [ 'Change Patch: Lead Shred', 1, 'program' ]
]

const QuadCortexEffects = (device, channel) => {
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


export const CreatePresetChangeEffect = (device, channel) => (setlist, preset) => () => {
  console.log('firing MIDI preset change: ', device, channel, setlist, preset);

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

export default QuadCortexEffects;
