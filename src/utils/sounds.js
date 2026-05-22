let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Short mechanical click for button presses
export function playClick() {
  try {
    const ac = getCtx()
    const now = ac.currentTime

    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(900, now)
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.025)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)

    osc.start(now)
    osc.stop(now + 0.03)
  } catch (_) {}
}

// Timer tick — filtered noise burst, like a real clock mechanism
export function playTick(phase = 'calm') {
  try {
    const ac = getCtx()
    const now = ac.currentTime

    // Each phase: slightly sharper filter + louder as urgency builds
    const configs = {
      calm:     { filterFreq: 2200, Q: 1.0, vol: 0.18, dur: 0.022 },
      amber:    { filterFreq: 3000, Q: 0.8, vol: 0.30, dur: 0.020 },
      critical: { filterFreq: 4000, Q: 0.7, vol: 0.45, dur: 0.018 },
    }
    const { filterFreq, Q, vol, dur } = configs[phase] ?? configs.calm

    // Fill a short buffer with white noise
    const bufferSize = Math.floor(ac.sampleRate * 0.03)
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

    const source = ac.createBufferSource()
    source.buffer = buffer

    // Bandpass filter shapes the noise into a click/tick character
    const filter = ac.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = filterFreq
    filter.Q.value = Q

    const gain = ac.createGain()
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ac.destination)

    // Very sharp attack, fast exponential decay = tick, not buzz
    gain.gain.setValueAtTime(vol, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

    source.start(now)
    source.stop(now + 0.04)
  } catch (_) {}
}

// Three descending tones when time runs out
export function playTimeUp() {
  try {
    const ac = getCtx()
    const tones = [620, 480, 340]
    tones.forEach((freq, i) => {
      const offset = i * 0.18
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ac.currentTime + offset)
      gain.gain.setValueAtTime(0.35, ac.currentTime + offset)
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + offset + 0.22)
      osc.start(ac.currentTime + offset)
      osc.stop(ac.currentTime + offset + 0.25)
    })
  } catch (_) {}
}
