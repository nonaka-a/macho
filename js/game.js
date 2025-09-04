async function startGame(stageInfo, stageId) {
    const S = GAME.State;
    const D = GAME.Dom;
    const C = GAME.Config;

    S.currentStageId = stageId;
    S.currentStageInfo = stageInfo;
    if (S.audioSource) {
        S.audioSource.onended = null;
        S.audioSource.stop();
        S.audioSource = null;
    }
    S.fullNoteChart = JSON.parse(JSON.stringify(stageInfo.chart));
    


    S.spriteData = {
        player: S.cachedAssets[stageInfo.assets.playerSpriteJson]
    };
    const match = stageInfo.assets.teacherSpriteJson.match(/teacher(\d*)/);
    const teacherPrefix = match ? match[0] : 'teacher';
    S.spriteData[teacherPrefix] = S.cachedAssets[stageInfo.assets.teacherSpriteJson];
    
    S.spriteImage = {
        player: S.cachedAssets[stageInfo.assets.playerSpriteSheet]
    };
    S.spriteImage[teacherPrefix] = S.cachedAssets[stageInfo.assets.teacherSpriteSheet];

    
    S.notesSpriteSheetData = S.cachedAssets[stageInfo.assets.notesJson];
    
    await resetGame();
    
    // ★★★ ここから修正 ★★★
    // ステージ5限定の開始演出
    if (stageId === 'stage5') {
        const elementsToFade = [
            GAME.Canvas.canvas,
            D.playerFaceEl,
            D.teacherFaceEl,
            D.uiContainer,
            D.grooveGaugeContainer,
            D.backgroundLayerA,
            D.topRightUiContainer
        ];

        elementsToFade.forEach(el => {
            if (!el) return;
            el.style.transition = 'none';
            el.style.opacity = '0';
        });

        // 5秒後にフェードインを開始
        setTimeout(() => {
            elementsToFade.forEach(el => {
                if (!el) return;
                el.style.transition = 'opacity 2s ease-in-out';
                el.style.opacity = '1';
            });
        }, 5000);
    }
    // ★★★ ここまで修正 ★★★
    
    D.backgroundLayerB.style.backgroundImage = `url(${stageInfo.assets.backgroundB})`;
    D.backgroundLayerA.style.backgroundImage = `url(${stageInfo.assets.backgroundA})`;
    D.backgroundLayerB.style.setProperty('--bg-image-c', `url(${stageInfo.assets.backgroundC})`);
    D.playerCharEl.style.backgroundImage = `url(${stageInfo.assets.playerSpriteSheet})`;
    D.teacherCharEl.style.backgroundImage = `url(${stageInfo.assets.teacherSpriteSheet})`;

    if (teacherPrefix === 'teacher2' || teacherPrefix === 'teacher3' || teacherPrefix === 'teacher4'|| teacherPrefix === 'teacher5') {
        // 1段組キャラ
        D.teacherCharEl.style.backgroundSize = '800% 100%';
    } else {
        // 2段組キャラ (teacher1)
        D.teacherCharEl.style.backgroundSize = '800% 200%';
    }

    // ★ 追加: ステージ固有のレイアウト設定を適用
    if (stageInfo.layout && stageInfo.layout.teacher) {
        const { left, bottom, height, aspectRatio } = stageInfo.layout.teacher;
        D.teacherCharEl.style.left = left || '';
        D.teacherCharEl.style.bottom = bottom || '';
        D.teacherCharEl.style.height = height || '';
        D.teacherCharEl.style.aspectRatio = aspectRatio || ''; // ★ aspectRatioを確実にリセット
    } else {
        // カスタムレイアウトがない場合はCSSのデフォルトに戻す
        D.teacherCharEl.style.left = '';
        D.teacherCharEl.style.bottom = '';
        D.teacherCharEl.style.height = '';
        D.teacherCharEl.style.aspectRatio = ''; // ★ aspectRatioを確実にリセット
    }

    D.playerFaceEl.innerHTML = `<img src="${stageInfo.assets.playerFace}" alt="Player Face">`;
    D.teacherFaceEl.innerHTML = `<img src="${stageInfo.assets.teacherFace}" alt="Teacher Face">`;
    
    updateCharacterPose(D.playerCharEl, 'player-idle1');
    updateCharacterPose(D.teacherCharEl, `${teacherPrefix}-idle1`);

    const bgmBuffer = S.cachedAssets[stageInfo.bgmPath];
    S.audioSource = S.audioContext.createBufferSource();
    S.audioSource.buffer = bgmBuffer;
    S.gameplayGainNode = S.audioContext.createGain();
    S.gameplayGainNode.gain.value = S.isMuted ? 0 : C.BGM_VOLUME;
    S.audioSource.connect(S.gameplayGainNode).connect(S.audioContext.destination);
    S.audioSource.onended = () => { if (S.isPlaying) endGame(); };
    
    D.fadeOverlay.style.transition = 'none';
    D.fadeOverlay.classList.remove('fade-in');
    requestAnimationFrame(() => {
        D.fadeOverlay.style.transition = 'opacity 1s ease-in-out';
    });
    
    S.timingOffset = stageInfo.timingOffset || 0;

    S.isPlaying = true;
    S.gamePhase = 'PLAYER';
    
    const countdownPromise = showCountdown();
    if (!S.isPaused) {
        gameLoop();
    }

    S.audioSource.start(0);
    S.gameStartTime = S.audioContext.currentTime - S.timingOffset;
    await countdownPromise;
}
async function resetGame() {
    const S = GAME.State;
    const D = GAME.Dom;
    const C = GAME.Config;

    S.isPlaying = false;
    S.score = 0; S.combo = 0; S.maxCombo = 0;
    document.querySelectorAll('.note').forEach(el => el.remove());
    S.activeNotes = [];
    S.nextNoteIndex = 0;
    S.gamePhase = 'IDLE';
    S.playerState = 'idle'; S.teacherState = 'idle';

    S.teacherHighlight = 0; S.playerHighlight = 0;
    S.grooveValue = C.START_GROOVE;
    updateGrooveGauge();
    updateUI();
    S.particles.forEach(p => p.el.remove());
    S.particles = [];
    S.shouldSpawnParticles = false;
    S.isBackgroundUpgraded = false;
    D.backgroundLayerB.classList.remove('is-upgraded', 'shine-active');
    D.resultScreen.style.display = 'none';
    D.resultTitle.classList.remove('title-animated');
    D.gameContainer.classList.remove('shake-animated');
    S.keyState = {};
    
    // ★★★ ここから修正 ★★★
    // ステージ5演出用のスタイルをリセット
    const elementsToReset = [
        GAME.Canvas.canvas,
        D.playerFaceEl,
        D.teacherFaceEl,
        D.uiContainer,
        D.grooveGaugeContainer,
        D.backgroundLayerA,
        D.topRightUiContainer
    ];
    elementsToReset.forEach(el => {
        if (!el) return;
        el.style.transition = 'none';
        el.style.opacity = '1';
    });
    // ★★★ ここまで修正 ★★★

    await new Promise(resolve => requestAnimationFrame(resolve));
}

function gameLoop() {
    const S = GAME.State;
    if (!S.isPlaying) return;
    const currentTime = S.audioContext.currentTime - S.gameStartTime;
    update(currentTime);
    draw(currentTime);
    requestAnimationFrame(gameLoop);
}

function update(currentTime) {
    const S = GAME.State;
    const C = GAME.Config;
    const CV = GAME.Canvas;

    S.idleAnimCounter = (S.idleAnimCounter + 1) % 60;

    if (S.isCountdown) return;

    // ★★★ 修正: 譜面データ(S.fullNoteChart)が存在しない場合は処理を中断する ★★★
    if (!S.fullNoteChart) {
        return;
    }

    while (S.nextNoteIndex < S.fullNoteChart.length && S.fullNoteChart[S.nextNoteIndex].time <= currentTime + (CV.width - CV.JUDGE_LINE_X) / C.NOTE_SPEED) {
        const noteData = { ...S.fullNoteChart[S.nextNoteIndex], isHit: false, isSEPlayed: false };
        createNoteElement(noteData);
        S.activeNotes.push(noteData);
        S.nextNoteIndex++;
    }
    if (S.playerState !== 'idle' && Date.now() > S.playerActionEndTime) S.playerState = 'idle';
    if (S.teacherState !== 'idle' && Date.now() > S.teacherActionEndTime) S.teacherState = 'idle';
    if (S.teacherHighlight > 0) S.teacherHighlight = Math.max(0, S.teacherHighlight - 0.1);
    if (S.playerHighlight > 0) S.playerHighlight = Math.max(0, S.playerHighlight - 0.1);

    for (const note of S.activeNotes) {
        if (note.isHit) {
            continue;
        }
        const noteX = CV.JUDGE_LINE_X + (note.time - currentTime) * C.NOTE_SPEED;
        if (note.element) {
            const noteY = note.isTeacherNote ? CV.TEACHER_LANE_Y : CV.PLAYER_LANE_Y;
            note.element.style.left = `${noteX - 48 / 2}px`;
            note.element.style.top = `${noteY - 48 / 2}px`;
        }
        if (note.isTeacherNote) {
            if (!note.isSEPlayed && currentTime >= note.time - 0.1) {
                if (note.key) {
                    const seFile = note.key === ' ' ? 'pose' : note.key.replace('Arrow', '').toLowerCase();
                    const match = S.currentStageInfo.assets.teacherSpriteJson.match(/teacher(\d*)/);
                    const teacherPrefix = match ? match[0] : 'teacher';
                    playSE(`sounds/chara/${teacherPrefix}-${seFile}.mp3`);
                }
                note.isSEPlayed = true;
            }
             if (currentTime >= note.time) {
                // --- ▼▼▼ ここから修正 ▼▼▼ ---
                const match = S.currentStageInfo.assets.teacherSpriteJson.match(/teacher(\d*)/);
                const teacherPrefix = match ? match[0] : 'teacher';
                const baseStateName = note.key === ' ' ? 'pose' : note.key;
                const finalStateName = `${teacherPrefix}-${baseStateName}`; // 例: "teacher4-ArrowLeft"

                S.teacherState = finalStateName; // 汎用名ではなく、完全な状態名をセット
                // --- ▲▲▲ ここまで修正 ▲▲▲ ---

                const duration = S.currentStageInfo.teacherPoseDuration || 500;
                S.teacherActionEndTime = Date.now() + duration;
                S.teacherHighlight = 1.0;


                triggerCharacterAnimation(GAME.Dom.teacherCharEl, baseStateName); 
                note.isHit = true;
            }
        } 
        else if (noteX < CV.JUDGE_LINE_X - 50) {
            S.combo = 0;
            showFeedback("MISS");
            S.grooveValue -= 5;
            updateGrooveGauge();
            updateUI();
            note.isHit = true;
        }
    }
    S.activeNotes = S.activeNotes.filter(note => {
        if (note.isHit) {
            if (note.element) {
                note.element.remove();
                note.element = null;
            }
            return false;
        }
        return true;
    });
}

function updateGrooveGauge() {
    const S = GAME.State;
    const C = GAME.Config;
    const D = GAME.Dom;

    S.grooveValue = Math.max(0, Math.min(C.MAX_GROOVE, S.grooveValue));
    D.grooveGaugeBar.style.width = `${100 - S.grooveValue}%`;
    D.grooveGaugeContainer.classList.toggle('clear-glow', S.grooveValue >= 75);
    D.grooveGaugeContainer.classList.toggle('max-pulsing', S.grooveValue >= C.MAX_GROOVE);
    if (S.grooveValue >= C.MAX_GROOVE && !S.isBackgroundUpgraded) {
        S.isBackgroundUpgraded = true;
        playSE(S.currentStageInfo.se.backgroundChange);
        D.backgroundLayerB.classList.add('shine-active');
        D.backgroundLayerB.addEventListener('animationend', () => {
            D.backgroundLayerB.classList.remove('shine-active');
            D.backgroundLayerB.classList.add('is-upgraded');
        }, { once: true });
    } else if (S.grooveValue < C.MAX_GROOVE && S.isBackgroundUpgraded) {
        S.isBackgroundUpgraded = false;
        D.backgroundLayerB.classList.remove('is-upgraded');
    }
    S.shouldSpawnParticles = (S.grooveValue >= 75);
}

function handleInput(keyName) {
    const S = GAME.State;
    if (!S.isPlaying || S.gamePhase !== 'PLAYER' || S.isCountdown) return;
    const currentTime = S.audioContext.currentTime - S.gameStartTime;
    const seFile = keyName === ' ' ? 'pose' : keyName.replace('Arrow', '').toLowerCase();
    playSE(`sounds/chara/player-${seFile}.mp3`);
    let stateName = keyName === ' ' ? 'pose' : keyName;
    S.playerState = stateName;
    S.playerActionEndTime = Date.now() + 500;
    triggerCharacterAnimation(GAME.Dom.playerCharEl, stateName);

    let closestNote = null;
    let minTimeDiff = Infinity;
    for (const note of S.activeNotes) {
        if (!note.isHit && !note.isTeacherNote) {
            const timeDiff = Math.abs(note.time - currentTime);
            if (timeDiff < minTimeDiff) {
                minTimeDiff = timeDiff;
                closestNote = note;
            }
        }
    }

    if (closestNote && minTimeDiff < 0.25) {
        if (closestNote.key === keyName) {
            S.playerHighlight = 1.0;
            if (minTimeDiff < 0.12) {
                showFeedback("PERFECT");
                S.score += 100; S.combo++; S.grooveValue += 1;
            } else {
                showFeedback("GOOD");
                S.score += 50; S.combo++; S.grooveValue += 0.5;
            }
        } else {
            showFeedback("MISS");
            S.combo = 0; S.grooveValue -= 5;
        }
        closestNote.isHit = true;
        if (S.combo > S.maxCombo) S.maxCombo = S.combo;
        updateUI();
        updateGrooveGauge();
    }
}

function handleKeyDown(e) {
    const S = GAME.State;
    const C = GAME.Config;
    if (S.resolveStory && (e.key === ' ' || e.key === 'Enter') && !S.isTyping) {
        e.preventDefault();
        // ★★★ keydownでは何もしないように変更 ★★★
        return;
    }
    if (S.isPaused) return;

    /*
    // --- デバッグ用: Pキーでクリア、Fキーで失敗 ---
    if (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 'f') {
        if (!S.isPlaying) return;
        e.preventDefault();
        S.isPlaying = false;
        if (S.audioSource) {
            S.audioSource.onended = null;
            S.audioSource.stop();
        }
        const isClear = e.key.toLowerCase() === 'p';
        endGame(isClear);
        return;
    }
    */
    
    if (C.KEY_MAP.hasOwnProperty(e.key)) {
        e.preventDefault();
        if (!S.keyState[e.key]) {
            handleInput(e.key);
            S.keyState[e.key] = true;
        }
    }
}

function handleKeyUp(e) {
    const S = GAME.State;
    const C = GAME.Config;

    if (S.resolveStory && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        handleStoryInput(); // ★統一された関数を呼び出す
        return;
    }

    if (C.KEY_MAP.hasOwnProperty(e.key)) {
        e.preventDefault();
        S.keyState[e.key] = false;
    }
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        S.keyState[e.key] = false;
    }
}


async function endGame(isClear) {
    const S = GAME.State;
    S.isPlaying = false;
    S.gamePhase = 'FINISHED';
    GAME.Dom.pauseButton.style.display = 'none';

    if (isClear === undefined) {
        isClear = S.grooveValue >= 75;
    }

    // ★★★ ここから追加 ★★★
    // ステージ5をクリアしたらエンディングをアンロック
    if (isClear && S.currentStageId === 'stage5' && !S.unlockedStages.includes('ending')) {
        S.unlockedStages.push('ending');
        saveUnlockedStages();
    }
    // ★★★ ここまで追加 ★★★

    await showResultScreen(isClear, S.currentStageInfo);
}