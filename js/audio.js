function playSE(seKey) {
    const S = GAME.State;
    const buffer = S.cachedAssets[seKey];
    if (S.isMuted || !buffer || !S.audioContext) {
       // console.warn(`SEが再生できません: ${seKey}`);
        return;
    }
    const source = S.audioContext.createBufferSource();
    source.buffer = buffer;
    const gainNode = S.audioContext.createGain();
    gainNode.gain.value = 2.0;
    source.connect(gainNode).connect(S.audioContext.destination);
    source.start(0);
}

function playTitleBGM() {
    const S = GAME.State;
    const C = GAME.Config;
    if (S.titleAudioSource) S.titleAudioSource.stop();
    const buffer = S.cachedAssets['sounds/bgm/bgm-title.mp3'];
    if (!buffer) return;
    S.titleAudioSource = S.audioContext.createBufferSource();
    S.titleAudioSource.buffer = buffer;
    S.titleAudioSource.loop = true;
    S.titleGainNode = S.audioContext.createGain();
    S.titleGainNode.gain.value = S.isMuted ? 0 : C.BGM_VOLUME;
    S.titleAudioSource.connect(S.titleGainNode).connect(S.audioContext.destination);
    S.titleAudioSource.start(0);
}

function playStoryBGM(bgmPath = 'sounds/bgm/bgm-story.mp3') {
    const S = GAME.State;
    const C = GAME.Config;
    if (S.storyAudioSource) {
        S.storyAudioSource.onended = null;
        S.storyAudioSource.stop();
    }
    const buffer = S.cachedAssets[bgmPath];
    if (!buffer) {
        console.warn(`BGMが見つかりません: ${bgmPath}`);
        return;
    }
    S.storyAudioSource = S.audioContext.createBufferSource();
    S.storyAudioSource.buffer = buffer;
    S.storyAudioSource.loop = true;

    if (!S.titleGainNode) { 
        S.titleGainNode = S.audioContext.createGain();
    }
    S.titleGainNode.gain.value = S.isMuted ? 0 : C.BGM_VOLUME;
    S.storyAudioSource.connect(S.titleGainNode).connect(S.audioContext.destination);
    S.storyAudioSource.start(0);
    S.currentStoryBgmPath = bgmPath;
}

function stopStoryBGM() {
    const S = GAME.State;
    if (S.storyAudioSource) {
        S.storyAudioSource.onended = null;
        S.storyAudioSource.stop();
        S.storyAudioSource = null;
        S.currentStoryBgmPath = null;
    }
}

function playEndingBGM() {
    const S = GAME.State;
    const C = GAME.Config;
    if (S.titleAudioSource) S.titleAudioSource.stop();
    const buffer = S.cachedAssets['sounds/bgm/bgm-title.mp3'];
    if (!buffer) return 0; // 再生できない場合は 0 を返す
    S.titleAudioSource = S.audioContext.createBufferSource();
    S.titleAudioSource.buffer = buffer;
    S.titleAudioSource.loop = false; // ループしない
    S.titleGainNode = S.audioContext.createGain();
    S.titleGainNode.gain.value = S.isMuted ? 0 : C.BGM_VOLUME;
    S.titleAudioSource.connect(S.titleGainNode).connect(S.audioContext.destination);
    S.titleAudioSource.start(0);

    // 曲が終わったらロゴを表示する関数を呼び出す
    S.titleAudioSource.onended = () => {
        // ユーザーが手動で停止した場合(stop()呼び出し)はonendedが発火するので、
        // 意図しないロゴ表示を防ぐためにタイマーIDの存在をチェックする
        if (S.endingIntervalId) {
            showEndingLogo();
        }
    };
    
    return buffer.duration; // 曲の長さを秒で返す
}
// ★★★ ここまで追加 ★★★

function toggleMute() {
    const S = GAME.State;
    const C = GAME.Config;
    const D = GAME.Dom;

    S.isMuted = !S.isMuted;
    const newVolume = S.isMuted ? 0 : C.BGM_VOLUME;
    if (S.gameplayGainNode) S.gameplayGainNode.gain.setValueAtTime(newVolume, S.audioContext.currentTime);
    if (S.titleGainNode) S.titleGainNode.gain.setValueAtTime(newVolume, S.audioContext.currentTime);
    D.soundToggleButton.innerHTML = S.isMuted ? '♪<span style="position:absolute; font-size: 24px; color: white;">✕</span>' : '♪';
}