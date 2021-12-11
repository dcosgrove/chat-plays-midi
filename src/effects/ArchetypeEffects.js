// Effect name to midi CC tuples
const Effects = [
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

const ArchetypeEffects = (device, channel) => {
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

export default ArchetypeEffects;
