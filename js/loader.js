function handleStageSelect(stageId) {
    return new Promise(async (resolve, reject) => {
        const S = GAME.State;
        const D = GAME.Dom;

        if (S.titleAudioSource) {
            S.titleAudioSource.stop();
            S.titleAudioSource = null;
        }
        D.titleScreen.style.display = 'none';
        D.howToPlayScreen.style.display = 'none';
        D.storyScreen.style.display = 'none';
        D.stageTitleScreen.style.display = 'none';
        
        try {
            const stageInfo = STAGE_DATA[stageId];
            if (!stageInfo) throw new Error(`ステージデータ[${stageId}]が見つかりません。`);
            
            await loadStageAssets(stageInfo);
            
            D.gamePlayScreen.style.display = 'block';
            D.pauseButton.style.display = 'flex';
            
            await startGame(stageInfo, stageId); // ★ stageId を渡す
            resolve();
        } catch (error) {
            console.error(error);
            D.fadeOverlay.style.transition = 'none';
            D.fadeOverlay.classList.remove('fade-in');
            alert('ステージの読み込みに失敗しました。');
            reject(error);
        }
    });
}

async function loadAsset(path, type) {
    const S = GAME.State;
    if (S.cachedAssets[path]) return S.cachedAssets[path];
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path} の読み込みに失敗`);
    let asset;
    switch (type) {
        case 'image':
            asset = new Image();
            asset.src = path;
            await new Promise((resolve, reject) => { asset.onload = resolve; asset.onerror = reject; });
            break;
        case 'audio':
            asset = await S.audioContext.decodeAudioData(await res.arrayBuffer());
            break;
        case 'json':
            asset = await res.json();
            break;
        default:
            throw new Error(`不明なアセットタイプ: ${type}`);
    }
    S.cachedAssets[path] = asset;
    return asset;
}

async function loadInitialAssets() {
    const promises = [
        loadAsset('sounds/bgm/bgm-title.mp3', 'audio'),
        loadAsset('sounds/bgm/bgm-story.mp3', 'audio'),
        loadAsset('sounds/bgm/bgm-interlude1.mp3', 'audio'),
        loadAsset('sounds/bgm/bgm-story5.mp3', 'audio'),
        loadAsset('sounds/bgm/bgm-end.mp3', 'audio'),
        loadAsset('sounds/se/se-logo-intro.mp3', 'audio'),
        loadAsset('sounds/se/se-result-title.mp3', 'audio'),
        loadAsset('spritesheet.json', 'json'),
        loadAsset('images/spritesheet.png', 'image'),
    ];
    await Promise.all(promises);
}

async function loadStageAssets(stageInfo) {
    const assetPaths = stageInfo.assets;
    const promises = [
        loadAsset(stageInfo.bgmPath, 'audio'),
        loadAsset(assetPaths.backgroundA, 'image'),
        loadAsset(assetPaths.backgroundB, 'image'),
        loadAsset(assetPaths.backgroundC, 'image'),
        loadAsset(assetPaths.playerSpriteSheet, 'image'),
        loadAsset(assetPaths.teacherSpriteSheet, 'image'),
        loadAsset(assetPaths.notesSpriteSheet, 'image'),
        loadAsset(assetPaths.notesJson, 'json'),
        loadAsset(assetPaths.playerFace, 'image'),
        loadAsset(assetPaths.teacherFace, 'image'),
        loadAsset(assetPaths.playerSpriteJson, 'json'),
        loadAsset(assetPaths.teacherSpriteJson, 'json'),
        loadAsset(stageInfo.se.backgroundChange, 'audio'),
        // ★★★ この行を追加 ★★★
        ...(stageInfo.se.stageTitle ? [loadAsset(stageInfo.se.stageTitle, 'audio')] : []),
        loadAsset('sounds/chara/player-left.mp3', 'audio'),
        loadAsset('sounds/chara/player-up.mp3', 'audio'),
        loadAsset('sounds/chara/player-right.mp3', 'audio'),
        loadAsset('sounds/chara/player-down.mp3', 'audio'),
        loadAsset('sounds/chara/player-pose.mp3', 'audio'),
    ];
    
    const match = assetPaths.teacherSpriteJson.match(/teacher(\d*)/);
    const teacherPrefix = match ? match[0] : 'teacher';

    const teacherSEs = ['left', 'up', 'right', 'down', 'pose'];
    teacherSEs.forEach(se => {
        promises.push(loadAsset(`sounds/chara/${teacherPrefix}-${se}.mp3`, 'audio'));
    });

    await Promise.all(promises);
}

async function loadEndingAssets() {
    const DANCE_IMAGES = [
        'images/end/ending-up.jpg',
        'images/end/ending-down.jpg',
        'images/end/ending-pose.jpg',
        'images/end/ending-left.jpg',
        'images/end/ending-right.jpg'
    ];
    const promises = DANCE_IMAGES.map(path => loadAsset(path, 'image'));
    // BGMは initialAssets ですでに読み込み済み
    await Promise.all(promises);
}