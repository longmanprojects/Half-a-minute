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

// Timer tick — character changes with phase
export function playTick(phase = 'calm') {
  try {
    const ac = getCtx()
    const now = ac.currentTime

    const configs = {
      calm:     { freq: 440, vol: 0.10, dur: 0.055, type: 'sine'     },
      amber:    { freq: 560, vol: 0.20, dur: 0.050, type: 'triangle' },
      critical: { freq: 740, vol: 0.32, dur: 0.045, type: 'square'   },
    }
    const { freq, vol, dur, type } = configs[phase] ?? configs.calm

    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)

    osc.type = type
    osc.frequency.setValueAtTime(freq, now)

    gain.gain.setValueAtTime(vol, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

    osc.start(now)
    osc.stop(now + dur)

    // Critical phase: add a low sub-tone for extra urgency
    if (phase === 'critical') {
      const sub = ac.createOscillator()
      const subGain = ac.createGain()
      sub.connect(subGain)
      subGain.connect(ac.destination)
      sub.type = 'sine'
      sub.frequency.setValueAtTime(freq / 2, now)
      subGain.gain.setValueAtTime(0.12, now)
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + dur)
      sub.start(now)
      sub.stop(now + dur)
    }
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
