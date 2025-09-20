function showTitleScreen() {
    const D = GAME.Dom;
    D.entryScreen.style.display = 'none';
    D.gameContainer.style.display = 'block';
    D.titleLogo.style.opacity = 0;
    D.titleScreen.style.display = 'flex';
    requestAnimationFrame(() => {
        D.titleLogo.style.opacity = 1;
        D.titleLogo.classList.add('animated');
        D.gameContainer.classList.add('shake-animated');
        playTitleBGM();
        playSE('sounds/se/se-logo-intro.mp3');
    });
}

async function showTitleScreenAndReset() {
    const S = GAME.State;
    const D = GAME.Dom;

    stopEnding(); 

    if (S.audioContext && S.audioContext.state === 'suspended') {
        await S.audioContext.resume();
    }

    if (S.poseAnimationInterval) {
        clearInterval(S.poseAnimationInterval);
        S.poseAnimationInterval = null;
    }

    // 画面遷移時にストーリー画面のレイアウトをリセット
    D.storyTextArea.style.display = 'flex';
    D.storyImageArea.style.height = '';
    D.storyBgImage.className = 'story-bg-image-element';
    D.storyBgImageNext.className = 'story-bg-image-element';
    D.storyBgImage.style.opacity = 0;
    D.storyBgImageNext.style.opacity = 0;


    stopStoryBGM();
    if (S.audioSource) {
        S.audioSource.onended = null;
        S.audioSource.stop();
        S.audioSource = null;
    }
    D.resultScreen.style.display = 'none';
    D.gamePlayScreen.style.display = 'none';
    D.howToPlayScreen.style.display = 'none';
    D.storyScreen.style.display = 'none';
    D.stageTitleScreen.style.display = 'none';
    D.pauseButton.style.display = 'none';
    S.isPaused = false;
    D.overlay.style.display = 'none';
    D.titleLogo.style.opacity = 0;
    D.titleScreen.style.display = 'flex';
    requestAnimationFrame(() => {
        D.titleLogo.style.opacity = 1;
        D.titleLogo.classList.add('animated');
        D.gameContainer.classList.add('shake-animated');
        playTitleBGM();
    });
}

async function showStageTitle(stageId) {
    const D = GAME.Dom;
    const C = GAME.Config;
    const stageInfo = STAGE_DATA[stageId];
    const titleHtml = `STAGE ${stageId.replace('stage', '')}<br>${stageInfo.title.replace(/\n/g, '<br>')}`;
    D.stageTitleText.innerHTML = titleHtml;

    // ステージ遷移時の黒画面をここで解除する
    D.fadeOverlay.classList.remove('fade-in');
    await new Promise(r => setTimeout(r, 50)); // 念のため描画更新を待つ

    D.stageTitleScreen.style.display = 'flex';

    const sePath = stageInfo.se.stageTitle || 'sounds/se/se-logo-intro.mp3';
    await loadAsset(sePath, 'audio'); 

    playSE(sePath); 
    D.stageTitleText.style.transition = 'none';
    D.stageTitleText.style.opacity = 0;
    D.stageTitleText.style.transform = 'scale(1.5)';

    await new Promise(r => requestAnimationFrame(r));

    const animSeconds = C.STAGE_TITLE_ANIM_SPEED_MS / 1000;
    D.stageTitleText.style.transition = `opacity ${animSeconds}s, transform ${animSeconds}s`;
    D.stageTitleText.style.opacity = 1;
    D.stageTitleText.style.transform = 'scale(1)';

    await new Promise(r => setTimeout(r, C.STAGE_TITLE_STAY_DURATION_MS));

    D.stageTitleText.style.opacity = 0;
    await new Promise(r => setTimeout(r, C.STAGE_TITLE_ANIM_SPEED_MS));

    D.stageTitleScreen.style.display = 'none';
}

async function showResultScreen(isClear, stageInfo) {
    const S = GAME.State;
    const D = GAME.Dom;

    D.gamePlayScreen.style.display = 'none';
    D.resultScreen.style.display = 'grid';

    if (!stageInfo || !stageInfo.assets) {
        console.error("結果画面表示エラー: stageInfoが不正です。", stageInfo);
        D.resultBackgroundB.style.backgroundImage = `url(images/bg/background-stage1_B.jpg)`;
        D.resultBackgroundA.style.backgroundImage = `url(images/bg/background-stage1_A.png)`;
        D.resultScreen.querySelector('.result-music-name').textContent = "Unknown Stage";
    } else {
        D.resultBackgroundB.style.backgroundImage = `url(${stageInfo.assets.backgroundB})`;
        D.resultBackgroundA.style.backgroundImage = `url(${stageInfo.assets.backgroundA})`;
        D.resultScreen.querySelector('.result-stage-name').textContent = `STAGE ${S.currentStageId.replace('stage', '')}`;
        D.resultScreen.querySelector('.result-music-name').innerHTML = stageInfo.title.replace(/\n/g, '<br>');
    }

    const retryButton = document.getElementById('retry-button');
    const nextStageButton = document.getElementById('next-stage-button');
    
    const isEnglish = document.documentElement.classList.contains('lang-en');

    if (isClear && S.currentStageId === 'stage5') {
        retryButton.textContent = isEnglish ? 'TO ENDING' : 'エンディング';
        retryButton.style.display = 'inline-block';
        nextStageButton.style.display = 'none';
    } else if (isClear && stageInfo.nextStage) {
        retryButton.style.display = 'none';
        nextStageButton.style.display = 'inline-block';
        const nextStageNumber = stageInfo.nextStage.replace('stage', '');
        nextStageButton.textContent = isEnglish ? `TO STAGE ${nextStageNumber}` : `ステージ ${nextStageNumber} へ`;
        nextStageButton.dataset.nextStageId = stageInfo.nextStage;
    } else {
        retryButton.textContent = isEnglish ? 'RETRY' : 'リトライ';
        retryButton.style.display = 'inline-block';
        nextStageButton.style.display = 'none';
    }

    D.resultCharImageEl.style.backgroundImage = `url(${stageInfo.assets.teacherSpriteSheet})`;
    
    const match = stageInfo.assets.teacherSpriteJson.match(/teacher(\d*)/);
    const teacherPrefix = match ? match[0] : 'teacher';

    D.resultCharImageEl.style.backgroundSize = '800% auto';

    let poseType;
    if (S.currentStageId === 'stage1') {
        poseType = 'idle1';
    } else {
        poseType = isClear ? 'pose' : 'idle1';
    }

    const frameName = `${teacherPrefix}-${poseType}`;

    const teacherSpriteData = S.cachedAssets[stageInfo.assets.teacherSpriteJson];
    const teacherSpriteImage = S.cachedAssets[stageInfo.assets.teacherSpriteSheet];

    if (teacherSpriteData && teacherSpriteImage) {
        updateCharacterPose(D.resultCharImageEl, frameName, teacherSpriteData, teacherSpriteImage);
    } else {
        D.resultCharImageEl.style.backgroundPosition = '0% 0%';
    }

    D.resultBackgroundA.style.animation = 'rhythm-bounce 0.5s ease-in-out infinite';
    await new Promise(resolve => requestAnimationFrame(resolve));
    D.resultTitle.classList.add('title-animated');
    D.gameContainer.classList.add('shake-animated');
    playSE('sounds/se/se-result-title.mp3');
    D.resultTitle.textContent = isClear ? "STAGE CLEAR!" : "TRY AGAIN?";
    D.resultScoreEl.textContent = S.score;
    D.resultComboEl.textContent = S.maxCombo;
    const resultGaugeValue = 100 - S.grooveValue;
    D.resultGaugeBar.style.width = `${resultGaugeValue}%`;
    D.resultTitle.classList.toggle('fail', !isClear);
}

function updateUI() {
    const S = GAME.State;
    const D = GAME.Dom;
    D.scoreEl.textContent = S.score;
    D.comboEl.textContent = S.combo;
}

function togglePause() {
    const S = GAME.State;
    const D = GAME.Dom;

    if (S.gamePhase === 'FINISHED') return;
    S.isPaused = !S.isPaused;
    if (S.isPaused) {
        S.isPlaying = false;
        S.pauseStartTime = S.audioContext.currentTime;
        S.audioContext.suspend();
        D.overlay.style.display = 'flex';
        D.startButton.style.display = 'none';
        D.pauseTitleButton.style.display = 'block';
        D.pauseButton.innerHTML = '▶';
    } else {
        const pausedDuration = S.audioContext.currentTime - S.pauseStartTime;
        S.gameStartTime += pausedDuration;
        S.audioContext.resume().then(() => {
            S.isPlaying = true;
            S.isCountdown = false;
            gameLoop();
            D.overlay.style.display = 'none';
            D.pauseButton.innerHTML = '❚❚';
        });
    }
}

async function showCountdown() {
    const S = GAME.State;
    const D = GAME.Dom;

    S.isCountdown = true;
    const counts = [{ text: "3", size: "100px" }, { text: "2", size: "100px" }, { text: "1", size: "100px" }, { text: "GO", size: "150px" }, { text: "MACHO!", size: "150px" }];
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    for (const count of counts) {
        D.countdownContainer.innerHTML = `<span class="countdown-text" style="font-size: ${count.size};">${count.text}</span>`;
        await wait(800);
    }
    D.countdownContainer.innerHTML = '';
    S.isCountdown = false;
}

// --- ストーリー関連UI ---

function startStory(storyKey, stageId) {
    const S = GAME.State;
    const D = GAME.Dom;

    // ★★★ ここから追加 ★★★
    // ストーリー再生を開始したステージをアンロックする
    if (stageId && !S.unlockedStages.includes(stageId)) {
        S.unlockedStages.push(stageId);
        saveUnlockedStages();
    }
    // ★★★ ここまで追加 ★★★

    return new Promise(async resolve => {
        S.currentStory = STORY_DATA[storyKey];
        if (!S.currentStory) {
            console.error(`ストーリーが見つかりません: ${storyKey}`);
            resolve();
            return;
        }

        if (!S.storyAudioSource && !S.currentStory[0].bgm) {
            playStoryBGM();
        }

        S.storyIndex = 0;
        S.resolveStory = resolve;
        S.currentStoryStageId = stageId;

        // 新しいストーリーを開始する前に、前のストーリーの表示内容を完全にリセットする
        D.storyBgImage.style.backgroundImage = 'none';
        D.storyBgImageNext.style.backgroundImage = 'none';
        D.storyCharacterImage.style.backgroundImage = 'none';
        D.storyText.innerHTML = ''; // テキストもクリアする

        D.skipButton.style.display = 'flex';
        D.storyScreen.style.display = 'flex';
        await updateStory();
    });
}


async function advanceStory() {
    const S = GAME.State;
    const D = GAME.Dom;

    S.isStoryAdvancing = true;

    const currentPage = S.currentStory[S.storyIndex];
    if (currentPage.action === 'fadeOut') {
        D.fadeOverlay.classList.add('fade-in');
        if (S.storyAudioSource) {
            S.titleGainNode.gain.linearRampToValueAtTime(0, S.audioContext.currentTime + 0.5);
        }
        await new Promise(r => setTimeout(r, 1500)); 
    }
    
    S.storyIndex++;
    if (S.storyIndex >= S.currentStory.length) {
        if (S.poseAnimationInterval) {
            clearInterval(S.poseAnimationInterval);
            S.poseAnimationInterval = null;
        }
        D.skipButton.style.display = 'none';
        D.storyScreen.style.display = 'none';
        stopStoryBGM();
        S.resolveStory();
        S.resolveStory = null;
    } else {
        await updateStory();
    }

    S.isStoryAdvancing = false;
}

function skipStory() {
    const S = GAME.State;
    const D = GAME.Dom;

    // --- 1. エンディングダンス中のスキップ処理 ---
    if (S.gamePhase === 'ENDING_DANCE') {
        if (S.titleAudioSource) {
            S.titleAudioSource.onended = null; // onendedが発火してロゴが表示されるのを防ぐ
            S.titleAudioSource.stop();
            S.titleAudioSource = null;
        }
        showTitleScreenAndReset(); // stopEnding()もこの中で呼ばれます
        return;
    }

    // --- 2. ストーリー中のスキップ処理 ---
    if (!S.resolveStory) return;

    if (S.poseAnimationInterval) {
        clearInterval(S.poseAnimationInterval);
        S.poseAnimationInterval = null;
    }
    
    if (S.storyTimers.length > 0) {
        // setTimeoutとsetIntervalの両方のタイマーをクリア
        S.storyTimers.forEach(timerId => {
            clearTimeout(timerId);
            clearInterval(timerId);
        });
        S.storyTimers = [];
    }
    
    // スキップ時にUIスタイルをリセット
    D.storyTextArea.style.display = 'flex';
    D.storyImageArea.style.height = '';
    D.storyBgImage.className = 'story-bg-image-element';
    D.storyBgImageNext.className = 'story-bg-image-element';
    D.storyBgImage.style.opacity = 0;
    D.storyBgImageNext.style.opacity = 0;

    S.isSkipped = true;

    const isEndingStory = S.currentStory === STORY_DATA.ending;

    // ストーリーのPromiseを解決して待機中の処理を続行させる
    const resolve = S.resolveStory;
    S.resolveStory = null;
    resolve();

    // エンディングストーリーでなければ、ゲーム画面へ遷移
    if (!isEndingStory) {
        const stageId = S.currentStoryStageId;
        fadeToGame(stageId);
    }
    // エンディングストーリーの場合は、この後の処理はstartEndingFlowに任せる
}

async function handleAutoSlideSequence(page) {
    const S = GAME.State;
    const D = GAME.Dom;
    const { slides, displayDuration, fadeDuration, bgm } = page;

    if (bgm && S.currentStoryBgmPath !== bgm) {
        stopStoryBGM();
        playStoryBGM(bgm);
    }
    
    const preloadPromises = slides.map(slide => loadAsset(slide.image, 'image'));
    await Promise.all(preloadPromises);

    S.isStoryAdvancing = true; 
    D.storyTextArea.style.display = 'none';
    D.storyImageArea.style.height = '100%';
    D.storyCharacterImage.style.backgroundImage = 'none'; // キャラクターを非表示

    const wait = (ms) => new Promise(resolve => {
        const timerId = setTimeout(resolve, ms);
        S.storyTimers.push(timerId);
    });

    let currentEl = D.storyBgImage;
    let nextEl = D.storyBgImageNext;

    const setSlide = (el, slide) => {
        el.className = 'story-bg-image-element'; // Reset all classes
        void el.offsetWidth; // Force repaint
        el.style.backgroundImage = `url(${slide.image})`;
        if (slide.effect === 'zoom') {
            el.classList.add('anim-story-zoom-in');
        } else if (slide.effect === 'pan-right') {
            el.classList.add('anim-story-pan-right');
        } else if (slide.effect === 'pan-left') {
            el.classList.add('anim-story-pan-left');
        }
    };
    
    // 最初のスライドを設定
    setSlide(currentEl, slides[0]);
    currentEl.style.transition = 'opacity 0s';
    currentEl.style.opacity = 1;
    await new Promise(r => requestAnimationFrame(r));
    D.fadeOverlay.classList.remove('fade-in');

    for (let i = 0; i < slides.length; i++) {
        if (S.isSkipped) break;
        
        await wait(displayDuration);
        if (S.isSkipped) break;

        if (i < slides.length - 1) {
            const nextSlide = slides[i + 1];
            
            setSlide(nextEl, nextSlide);
            
            currentEl.style.transition = `opacity ${fadeDuration / 1000}s ease-in-out`;
            nextEl.style.transition = `opacity ${fadeDuration / 1000}s ease-in-out`;
            currentEl.style.opacity = 0;
            nextEl.style.opacity = 1;
            
            await wait(fadeDuration);
            if (S.isSkipped) break;

            [currentEl, nextEl] = [nextEl, currentEl];

        } else {
            D.fadeOverlay.classList.add('fade-in');
             if (S.storyAudioSource && S.titleGainNode) {
                S.titleGainNode.gain.linearRampToValueAtTime(0, S.audioContext.currentTime + (fadeDuration / 1000));
            }
            await wait(fadeDuration);
        }
    }

    // 終了処理
    S.storyTimers = [];
    D.storyTextArea.style.display = 'flex';
    D.storyImageArea.style.height = '';
    D.storyBgImage.className = 'story-bg-image-element';
    D.storyBgImageNext.className = 'story-bg-image-element';
    D.storyBgImage.style.opacity = 0;
    D.storyBgImageNext.style.opacity = 0;
    S.isStoryAdvancing = false;
}

async function handleAutoDialogueSequence(page) {
    const S = GAME.State;
    const D = GAME.Dom;
    const { pages, bgm } = page;

    if (bgm && S.currentStoryBgmPath !== bgm) {
        stopStoryBGM();
        playStoryBGM(bgm);
    }
    const allImages = pages.flatMap(p => p.images || (p.image ? [p.image] : []));
    const preloadPromises = allImages.map(src => loadAsset(src, 'image'));
    await Promise.all(preloadPromises);

    S.isStoryAdvancing = true;

    D.fadeOverlay.style.transition = 'none';
    D.fadeOverlay.classList.add('fade-in');
    await new Promise(r => requestAnimationFrame(r));
    D.fadeOverlay.style.transition = 'opacity 1s ease-in-out';

    const wait = (ms) => new Promise(resolve => {
        const timerId = setTimeout(resolve, ms);
        S.storyTimers.push(timerId);
    });

    // ★★★ ここから修正 ★★★
    // 最初の画像を設定し、その後にフェードインを開始する
    D.storyBgImage.style.backgroundImage = `url(${pages[0].image})`;
    D.storyBgImage.style.transition = 'opacity 0s';
    D.storyBgImage.style.opacity = 1;
    D.storyBgImageNext.style.opacity = 0;
    D.storyCharacterImage.style.backgroundImage = 'none';

    await wait(100); // 描画更新を待つ
    D.fadeOverlay.classList.remove('fade-in');
    // ★★★ ここまで修正 ★★★
    
    for (const [index, pageData] of pages.entries()) {
        if (S.isSkipped) break;

        D.storyText.innerHTML = '';
        if (index > 0) {
             D.storyBgImage.style.backgroundImage = `url(${pageData.image})`;
        }
        
        let postWaitDuration = 4000;

        if (pageData.type === 'multi-image' || pageData.type === 'multi-image-loop') {
            postWaitDuration = 0;
            let imageIndex = 0;
            const updateImage = () => {
                D.storyBgImage.style.backgroundImage = `url(${pageData.images[imageIndex]})`;
                imageIndex = (imageIndex + 1) % pageData.images.length;
            };

            if (pageData.type === 'multi-image') {
                for (let i = 0; i < pageData.images.length; i++) {
                    if (S.isSkipped) break;
                    D.storyBgImage.style.backgroundImage = `url(${pageData.images[i]})`;
                    await wait(pageData.durations[i]);
                }
            } else { 
                updateImage();
                const loopInterval = setInterval(updateImage, pageData.interval);
                S.storyTimers.push(loopInterval);
                await wait(pageData.totalDuration);
                clearInterval(loopInterval);
            }
        } else {
            S.isTyping = true;
            let charIndex = 0;
            const typeWriter = setInterval(() => {
                if (charIndex < pageData.text.length) {
                    const char = pageData.text[charIndex];
                    if (char === '\n') { D.storyText.innerHTML += '<br>'; }
                    else { D.storyText.innerHTML += char; }
                    charIndex++;
                } else {
                    clearInterval(typeWriter);
                    S.isTyping = false;
                }
            }, 50);
            S.storyTimers.push(typeWriter);

            while(S.isTyping) {
                if(S.isSkipped) break;
                await new Promise(r => setTimeout(r, 100));
            }
        }
        
        if (S.isSkipped) break;
        if (index === 0) {
            await wait(postWaitDuration + 2000);
        } else {
            await wait(postWaitDuration);
        }
    }

    S.storyTimers = [];
    S.isStoryAdvancing = false;
    if (!S.isSkipped) {
        advanceStory();
    }
}


async function updateStory() {
    const S = GAME.State;
    const D = GAME.Dom;
    const C = GAME.Config;
    const page = S.currentStory[S.storyIndex];

    if (S.poseAnimationInterval) {
        clearInterval(S.poseAnimationInterval);
        S.poseAnimationInterval = null;
    }

    // ★★★ ここから追加 ★★★
    // アクションのみのページの場合、表示処理をスキップして次の処理へ
    if (page.action) {
        await advanceStory();
        return;
    }
    // ★★★ ここまで追加 ★★★

    if (page.type === 'auto-slide-sequence') {
        await handleAutoSlideSequence(page);
        if (!S.isSkipped) { await advanceStory(); }
        return;
    }
    if (page.type === 'auto-dialogue-sequence') {
        await handleAutoDialogueSequence(page);
        return;
    }
    
    // 通常のストーリーではテキストエリアを必ず表示する
    D.storyTextArea.style.display = 'flex';

    if (S.titleGainNode) {
        S.titleGainNode.gain.linearRampToValueAtTime(S.isMuted ? 0 : C.BGM_VOLUME, S.audioContext.currentTime + 0.2);
    }
    
    if (page.bgm && S.currentStoryBgmPath !== page.bgm) {
        stopStoryBGM();
        await new Promise(r => setTimeout(r, 1000));
        playStoryBGM(page.bgm);
    }
    
    D.storyText.innerHTML = '';

    D.storyBgImageNext.style.transition = 'opacity 0s';
    D.storyBgImageNext.style.opacity = 0;
    D.storyBgImage.style.transition = 'opacity 0s';
    D.storyBgImage.style.opacity = 1;

    if (page.type === 'slide') {
        D.storyBgImage.style.backgroundImage = `url(${page.image})`;
        D.storyBgImage.style.backgroundPosition = 'center center';
        D.storyCharacterImage.style.backgroundImage = 'none';
    } else if (page.type === 'dialogue') {
        const stageId = S.currentStoryStageId;
        const stageAssets = STAGE_DATA[stageId].assets;
        D.storyBgImage.style.backgroundImage = `url(${stageAssets.backgroundB})`;
        D.storyBgImage.style.backgroundPosition = 'center 75%';
        D.storyCharacterImage.style.backgroundImage = `url(${stageAssets.teacherSpriteSheet})`;
        
        const match = stageAssets.teacherSpriteJson.match(/teacher(\d*)/);
        const teacherPrefix = match ? match[0] : 'teacher';
        
        const containerHeight = D.storyImageArea.clientHeight;

        if (teacherPrefix === 'teacher') { 
            D.storyCharacterImage.style.backgroundSize = '800% 200%';
            D.storyCharacterImage.style.width = (containerHeight * 2.40) + 'px';
            D.storyCharacterImage.style.top = '-40%';
        } else if (teacherPrefix === 'teacher3') {
            D.storyCharacterImage.style.backgroundSize = '800% 100%';
            D.storyCharacterImage.style.width = (containerHeight * 3.65) + 'px';
            D.storyCharacterImage.style.top = '-235%';
        } else if (teacherPrefix === 'teacher4') {
            D.storyCharacterImage.style.backgroundSize = '800% 100%';
            D.storyCharacterImage.style.width = (containerHeight * 2.1) + 'px';
            D.storyCharacterImage.style.top = '-50%';
        } else {
            D.storyCharacterImage.style.backgroundSize = '800% 100%';
            D.storyCharacterImage.style.width = (containerHeight * 2.65) + 'px';
            D.storyCharacterImage.style.top = '-40%';
        }

        D.storyCharacterImage.style.aspectRatio = '';

        const teacherSpriteJsonPath = stageAssets.teacherSpriteJson;
        const teacherSpriteSheetPath = stageAssets.teacherSpriteSheet;

        const tempSpriteData = await loadAsset(teacherSpriteJsonPath, 'json');
        const tempSpriteImage = await loadAsset(teacherSpriteSheetPath, 'image');

        if (tempSpriteData && tempSpriteImage) {
            if (Array.isArray(page.pose) && page.pose.length > 0) {
                let poseIndex = 0;
                const animatePose = () => {
                    const currentPose = page.pose[poseIndex % page.pose.length];
                    updateCharacterPose(D.storyCharacterImage, currentPose, tempSpriteData, tempSpriteImage);
                    poseIndex++;
                };
                animatePose(); // 最初のポーズをすぐに設定
                S.poseAnimationInterval = setInterval(animatePose, 500);
            } else {
                 updateCharacterPose(D.storyCharacterImage, page.pose, tempSpriteData, tempSpriteImage);
            }
        }
    }

    D.fadeOverlay.classList.remove('fade-in');

    await new Promise(r => setTimeout(r, 500));
    
    S.isTyping = true;
    let charIndex = 0;
    const typeWriter = setInterval(() => {
        if (charIndex < page.text.length) {
            const char = page.text[charIndex];
            if (char === '\n') {
                D.storyText.innerHTML += '<br>';
            } else {
                D.storyText.innerHTML += char;
            }
            charIndex++;
        } else {
            clearInterval(typeWriter);
            S.isTyping = false;
        }
    }, 50);
}