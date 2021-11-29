// Kemper control codes doc: https://www.manualslib.com/manual/1786994/Kemper-Profiler.html?page=208#manual

const KemperEffects = (device, channel) => {
  return {
    'Delay On': () => {
      device.sendControlChange(27, 1, channel);
    },
    'Delay Off': () => {
      device.sendControlChange(27, 0, channel);
    }
  }
}

export default KemperEffects;
