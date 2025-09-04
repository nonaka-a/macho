window.addEventListener('load', () => {

    // --- グローバルゲームオブジェクト ---
    window.GAME = {
        // --- DOM要素 ---
        Dom: {},
        // --- ゲーム設定 ---
        Config: {
            BGM_VOLUME: 0.5,
            STAGE_TITLE_ANIM_SPEED_MS: 300,
            STAGE_TITLE_STAY_DURATION_MS: 2500,
            NOTE_SPEED: 300,
            KEY_MAP: { 'ArrowLeft': 0, 'ArrowUp': 1, 'ArrowRight': 2, 'ArrowDown': 3, ' ': 4 },
            MAX_GROOVE: 100,
            START_GROOVE: 50
        },
        // --- ゲーム状態 ---
        State: {
            audioContext: null,
            cachedAssets: {},
            spriteData: null,
            notesSpriteSheetData: null,
            spriteImage: null,
            gameStartTime: 0,
            isPlaying: false,
            score: 0,
            combo: 0,
            maxCombo: 0,
            activeNotes: [],
            feedback: { text: '', time: 0 },
            gamePhase: 'IDLE',
            nextNoteIndex: 0,
            playerState: 'idle',
            teacherState: 'idle',
            playerActionEndTime: 0,
            teacherActionEndTime: 0,
            idleAnimCounter: 0,
            fullNoteChart: [],
            teacherHighlight: 0,
            playerHighlight: 0,
            grooveValue: 50,
            keyState: {},
            audioSource: null,
            titleAudioSource: null,
            storyAudioSource: null,
            gameplayGainNode: null,
            titleGainNode: null,
            isMuted: false,
            particles: [],
            particleSpawnTimer: 0,
            shouldSpawnParticles: false,
            isBackgroundUpgraded: false,
            isCountdown: false,
            isPaused: false,
            pauseStartTime: 0,
            currentStageInfo: null,
            currentStageId: null,
            timingOffset: 0,
            currentStory: [],
            storyIndex: 0,
            resolveStory: null,
            isTyping: false,
            isSkipped: false,
            currentStoryBgmPath: null,
            isStoryAdvancing: false,
            poseAnimationInterval: null,
            storyTimers: [],
            endingIntervalId: null,
            unlockedStages: [],
        },
        // --- Canvas関連 ---
        Canvas: {
            canvas: null,
            ctx: null,
            width: 0,
            height: 0,
            JUDGE_LINE_X: 0,
            TEACHER_LANE_Y: 0,
            PLAYER_LANE_Y: 0
        }
    };

    // --- DOM要素の取得 ---
    const D = GAME.Dom;
    D.entryScreen = document.getElementById('entry-screen');
    D.entryButton = document.getElementById('entry-button');
    D.loadingText = document.getElementById('loading-text');
    D.titleScreen = document.getElementById('title-screen');
    D.titleLogo = document.getElementById('title-logo');
    D.titleStartButton = document.getElementById('title-start-button');
    D.howToPlayButton = document.getElementById('how-to-play-button');
    D.gameContainer = document.getElementById('game-container');
    D.storyScreen = document.getElementById('story-screen');
    D.storyImageArea = document.getElementById('story-image-area');
    D.storyBgImage = document.getElementById('story-bg-image');
    D.storyBgImageNext = document.getElementById('story-bg-image-next');
    D.storyCharacterImage = document.getElementById('story-character-image');
    D.storyTextArea = document.getElementById('story-text-area');
    D.storyText = document.getElementById('story-text');
    D.stageTitleScreen = document.getElementById('stage-title-screen');
    D.stageTitleText = document.getElementById('stage-title-text');
    D.gamePlayScreen = document.getElementById('game-play-screen');
    D.countdownContainer = document.getElementById('countdown-container');
    D.howToPlayScreen = document.getElementById('how-to-play-screen');
    D.howToPlayCloseButton = document.getElementById('how-to-play-close-button');
    D.skipButton = document.getElementById('skip-button');
    D.pauseButton = document.getElementById('pause-button');
    D.pauseTitleButton = document.getElementById('pause-title-button');
    D.scoreEl = document.getElementById('score');
    D.comboEl = document.getElementById('combo');
    D.startButton = document.getElementById('start-button');
    D.overlay = document.getElementById('overlay');
    D.playerCharEl = document.getElementById('player-char');
    D.teacherCharEl = document.getElementById('teacher-char');
    D.playerFaceEl = document.getElementById('player-face');
    D.teacherFaceEl = document.getElementById('teacher-face');
    D.grooveGaugeBar = document.getElementById('groove-gauge-bar');
    D.grooveGaugeContainer = document.getElementById('groove-gauge-container');
    D.soundToggleButton = document.getElementById('sound-toggle-button');
    D.resultScreen = document.getElementById('result-screen');
    D.resultTitle = document.getElementById('result-title');
    D.resultScoreEl = document.getElementById('result-score');
    D.resultComboEl = document.getElementById('result-combo');
    D.resultCharImageEl = document.getElementById('result-char-image');
    D.resultBackgroundA = document.getElementById('result-background-a');
    D.resultBackgroundB = document.getElementById('result-background-b');
    D.resultGaugeBar = document.getElementById('groove-gauge-bar-result');
    D.particleContainer = document.getElementById('particle-container');
    D.backgroundLayerA = document.getElementById('background-layer-a');
    D.backgroundLayerB = document.getElementById('background-layer-b');
    D.fadeOverlay = document.getElementById('fade-overlay');

    D.stageSelectScreen = document.getElementById('stage-select-screen');
    D.stageSelectOpenButton = document.getElementById('stage-select-open-button');
    D.stageSelectCloseButton = document.getElementById('stage-select-close-button');
    D.stageSelectButtonsContainer = document.querySelector('.stage-select-buttons');
    D.titleButtons = document.querySelector('.title-buttons');
    
    D.uiContainer = document.getElementById('ui-container');
    D.topRightUiContainer = document.getElementById('top-right-ui-container');
    
    D.endingScreen = document.getElementById('ending-screen');
    D.endingDanceImage = document.getElementById('ending-dance-image');
    D.endingLogo = document.getElementById('ending-logo');
D.creditsContainer = document.getElementById('credits-container');
    D.creditsRoll = document.getElementById('credits-roll');

    // Canvas初期設定
    GAME.Canvas.canvas = document.getElementById('game-canvas');
    GAME.Canvas.ctx = GAME.Canvas.canvas.getContext('2d');

    initialize();
});

function initialize() {
    const D = GAME.Dom;
 loadUnlockedStages();

    D.entryButton.addEventListener('click', handleEntryClick);
    D.titleStartButton.addEventListener('click', startOpeningFlow);
    D.howToPlayButton.addEventListener('click', () => { D.howToPlayScreen.style.display = 'flex'; });
    D.howToPlayCloseButton.addEventListener('click', () => { D.howToPlayScreen.style.display = 'none'; });
    D.skipButton.addEventListener('click', skipStory);
    D.pauseButton.addEventListener('click', togglePause);
    D.pauseTitleButton.addEventListener('click', showTitleScreenAndReset);
    D.soundToggleButton.addEventListener('click', toggleMute);

  if (D.stageSelectOpenButton) {
        D.stageSelectOpenButton.addEventListener('click', () => {
            // ステージセレクトボタンの状態を更新
            const buttons = D.stageSelectButtonsContainer.querySelectorAll('.stage-select-button');
            buttons.forEach(button => {
                const stageId = button.dataset.stageId;
                if (GAME.State.unlockedStages.includes(stageId)) {
                    button.disabled = false;
                } else {
                    button.disabled = true;
                }
            });

            D.titleLogo.style.display = 'none';
            D.titleButtons.style.display = 'none';
            D.stageSelectScreen.style.display = 'flex';
        });
    }
    if (D.stageSelectCloseButton) {
        D.stageSelectCloseButton.addEventListener('click', () => {
            D.stageSelectScreen.style.display = 'none';
            D.titleLogo.style.display = 'block';
            D.titleButtons.style.display = 'flex';
        });
    }
    if (D.stageSelectButtonsContainer) {
        D.stageSelectButtonsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('stage-select-button')) {
                const stageId = e.target.dataset.stageId;
                D.stageSelectScreen.style.display = 'none';
                D.titleLogo.style.display = 'block';
                D.titleButtons.style.display = 'flex';

                if (stageId === 'stage1') {
                    startOpeningFlow();
                } else if (stageId === 'ending') {
                    startEndingFlow();
                } else {
                    startNextStageFlow(stageId);
                }
            }
        });
    }

    document.querySelector('.result-buttons').addEventListener('click', (e) => {
        const target = e.target;
        if (target.id === 'retry-button') {
            const stageId = GAME.State.currentStageId;
            if (stageId === 'stage5' && target.textContent === 'エンディング') {
                startEndingFlow();
            } else {
                handleStageSelect(stageId);
            }
        } else if (target.id === 'next-stage-button') {
            const nextStageId = target.dataset.nextStageId;
            startNextStageFlow(nextStageId);
        } else if (target.id === 'title-button') {
            showTitleScreenAndReset();
        }
    });

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', setupCanvas);

    D.storyScreen.addEventListener('click', handleStoryInput);
    setupCanvas();
}

async function startOpeningFlow() {
    const S = GAME.State;
    const D = GAME.Dom;
    S.isSkipped = false;
    
    if (S.titleAudioSource) S.titleAudioSource.stop();
    D.titleScreen.style.display = 'none';

    await startStory('opening', 'stage1');
    if (S.isSkipped) return;
    
    await startStoryFlow('stage1');
}

async function startEndingFlow() {
    const S = GAME.State;
    const D = GAME.Dom;
    S.isSkipped = false; // スキップ状態をリセット

    D.resultScreen.style.display = 'none';
    if (S.titleAudioSource) S.titleAudioSource.stop();
    D.titleScreen.style.display = 'none';

    await startStory('ending');
    // ストーリーがスキップされてもされなくても、この後の処理は実行される
    
    // エンディングダンスへ
    D.fadeOverlay.classList.add('fade-in');
    await new Promise(r => setTimeout(r, 1000));
    
    // ストーリー画面などを非表示にする
    D.storyScreen.style.display = 'none';
    
    await loadEndingAssets();
    
    startEnding();
    
    D.fadeOverlay.classList.remove('fade-in');
    D.skipButton.style.display = 'flex';
}

async function startNextStageFlow(stageId) {
    const S = GAME.State;
    const D = GAME.Dom;
    S.isSkipped = false;

    D.resultScreen.style.display = 'none';

    // 画面を一瞬黒くして遷移時のチラつきを防ぐ
    D.fadeOverlay.style.transition = 'none'; // トランジションを無効化
    D.fadeOverlay.classList.add('fade-in');   // 即座に黒くする
    await new Promise(r => requestAnimationFrame(r)); // 描画を待つ
    // 次のフレームでトランジション設定を元に戻す
    requestAnimationFrame(() => {
        D.fadeOverlay.style.transition = 'opacity 1s ease-in-out';
    });

    if (S.titleAudioSource) S.titleAudioSource.stop();
    D.titleScreen.style.display = 'none';

    const interludeKey = `interlude_to_${stageId}`;
    if (STORY_DATA[interludeKey]) {
        await startStory(interludeKey, stageId);
        if (S.isSkipped) return;
    }

    await startStoryFlow(stageId);
}

async function startStoryFlow(stageId) {
    const S = GAME.State;

    await showStageTitle(stageId);
    if (S.isSkipped) return;

    const storyKey = `${stageId}_intro`;
    if (STORY_DATA[storyKey]) {
        await startStory(storyKey, stageId);
        if (S.isSkipped) return;
    }
    
    await fadeToGame(stageId);
}

// ★★★ ストーリー進行を管理する統一された関数 ★★★
function handleStoryInput() {
    const S = GAME.State;
    if (S.resolveStory && !S.isTyping && !S.isStoryAdvancing) {
        advanceStory();
    }
}

// --- メインフロー管理 ---

async function handleEntryClick() {
    const S = GAME.State;
    const D = GAME.Dom;

    D.entryButton.disabled = true;
    D.entryButton.style.cursor = 'wait';
    D.loadingText.style.display = 'block';
    await new Promise(resolve => requestAnimationFrame(resolve));

    try {
        if (!S.audioContext) {
            S.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (S.audioContext.state === 'suspended') {
            await S.audioContext.resume();
        }
        await loadInitialAssets();
        showTitleScreen();
    } catch (error) {
        console.error("初期アセットの読み込みに失敗しました:", error);
        D.loadingText.textContent = "ロードに失敗しました…";
        D.loadingText.style.animation = 'none';
    }
}

async function fadeToGame(stageId) {
    const S = GAME.State;
    const D = GAME.Dom;

    if (S.storyAudioSource && S.titleGainNode) {
        S.titleGainNode.gain.linearRampToValueAtTime(0, S.audioContext.currentTime + 0.5);
    }
    
    D.fadeOverlay.style.transition = 'opacity 0.5s ease-in-out';
    D.fadeOverlay.classList.add('fade-in');

    await new Promise(r => setTimeout(r, 500));

    D.skipButton.style.display = 'none';
    D.storyScreen.style.display = 'none';

    stopStoryBGM();

    await handleStageSelect(stageId);
}

function loadUnlockedStages() {
    const S = GAME.State;
    const savedData = localStorage.getItem('machoUnlockedStages');
    if (savedData) {
        try {
            S.unlockedStages = JSON.parse(savedData);
        } catch (e) {
            console.error('アンロックデータの解析に失敗:', e);
            S.unlockedStages = ['stage1']; // パース失敗時は初期化
        }
    } else {
        S.unlockedStages = ['stage1']; // データがなければ初期化
    }
}

function saveUnlockedStages() {
    const S = GAME.State;
    try {
        localStorage.setItem('machoUnlockedStages', JSON.stringify(S.unlockedStages));
    } catch (e) {
        console.error('アンロックデータの保存に失敗:', e);
    }
}