(() => {
  const controls = document.getElementById('audio-controls');
  const mute = document.getElementById('audio-mute');
  const label = document.getElementById('audio-label');
  const volume = document.getElementById('audio-volume');
  const value = document.getElementById('audio-value');
  const hint = document.getElementById('audio-hint');
  const canvas = document.getElementById('unity-canvas');
  let muted = false;
  let adjusting = false;

  function send(method, number) {
    if (window.unityInstance) window.unityInstance.SendMessage('Story Game', method, number);
  }
  function renderMute() {
    const action = muted ? '取消静音' : '静音';
    mute.setAttribute('aria-label', action);
    mute.setAttribute('aria-pressed', String(muted));
    mute.title = action;
    label.textContent = muted ? '已静音' : '声音';
  }
  window.syncStoryAudio = state => {
    if (!state.audioClipsReady || !window.unityInstance) return;
    controls.hidden = false;
    muted = state.audioMuted;
    renderMute();
    if (!adjusting) {
      volume.value = String(Math.round(state.audioVolume * 100));
      value.textContent = volume.value + '%';
    }
    hint.hidden = state.audioStarted;
  };
  mute.addEventListener('click', () => {
    muted = !muted;
    renderMute();
    send('SetMuted', muted ? 1 : 0);
    canvas.focus();
  });
  volume.addEventListener('input', () => {
    adjusting = true;
    value.textContent = volume.value + '%';
    send('SetVolume', Number(volume.value) / 100);
  });
  volume.addEventListener('change', () => { adjusting = false; });
  volume.addEventListener('pointerup', () => canvas.focus());
  volume.addEventListener('blur', () => { adjusting = false; });
  document.addEventListener('visibilitychange', () => send('SetPageHidden', document.hidden ? 1 : 0));
})();
