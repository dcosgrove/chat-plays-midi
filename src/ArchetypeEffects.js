// Effect name to midi CC tuples
const Effects = [
  [ 'Toggle Overdrive', 2 ],
  [ 'Toggle Distortion', 3 ],
  [ 'Toggle Phaser', 4 ],
  [ 'Toggle Chorus', 5 ],
  [ 'Toggle Delay', 6 ],
  [ 'Toggle Reverb', 7 ],
]

const ArchetypeEffects = (device, channel) => {
  return Effects.reduce((effectFns, [ name, cc ]) => {
      effectFns[name] = () => {
        device.sendControlChange(cc, 1, channel);
      };

      return effectFns;
  }, {});
}  

export default ArchetypeEffects;
