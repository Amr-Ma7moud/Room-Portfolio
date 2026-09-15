let audioCtx: AudioContext | null = null;
let isMuted = false;

export function initAudio() {
  if (typeof window === "undefined") return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

export function playKeystroke() {
  if (isMuted || !audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // Short burst for click
  osc.type = "square";
  
  // Randomize pitch slightly for variation
  osc.frequency.setValueAtTime(150 + Math.random() * 50, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.02);

  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.02);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.02);
}

export function toggleMute() {
  isMuted = !isMuted;
  return isMuted;
}

export function getIsMuted() {
  return isMuted;
}
