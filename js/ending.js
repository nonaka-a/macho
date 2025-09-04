async function startEnding() {
    const S = GAME.State;
    const D = GAME.Dom;

    S.gamePhase = 'ENDING_DANCE';
    D.skipButton.style.display = 'flex';

    // 既存のBGMを停止
    if (S.titleAudioSource) {
        S.titleAudioSource.stop();
        S.titleAudioSource = null;
    }
    stopStoryBGM();

    D.endingScreen.style.display = 'flex';
    D.endingDanceImage.style.display = 'block';
    D.endingDanceImage.style.opacity = 1;
    D.endingLogo.style.display = 'none';
    D.endingLogo.style.opacity = 0;
    
    // クレジットコンテンツの生成
    const creditsContent = `
<span class="credit-title">Director</span>
<span class="credit-detail">Akifumi NONAKA</span>

<span class="credit-title">Character Design & All Artwork</span>
<span class="credit-detail">Akifumi NONAKA</span>

<span class="credit-title">Original Concept By</span>
<span class="credit-detail">My Beloved Children</span>

<span class="credit-title">Game Design & Programming Support</span>
<span class="credit-detail">Gemini</span>




<span class="credit-title">Music</span>

<span class="credit-detail">Stage 1</span>
<span class="credit-music-title">Industrial Fact</span>
<span class="credit-music-by">by  Marron Fields Production</span>

<span class="credit-detail">Stage 2</span>
<span class="credit-music-title">ARTenyo - Skyline Resonance</span>
<span class="credit-music-by">by ARTenyo</span>

<span class="credit-detail">Stage 3</span>
<span class="credit-music-title">The streets Of Tokyo</span>
<span class="credit-music-by">by kaazoom</span>

<span class="credit-detail">Stage 4</span>
<span class="credit-music-title">Short 13</span>
<span class="credit-music-by">by juniorsoundays</span>

<span class="credit-detail">Stage 5</span>
<span class="credit-music-title">Stay Away</span>
<span class="credit-music-by">by Muzaproduction</span>

<span class="credit-detail">Ending Theme</span>
<span class="credit-music-title">Fallin For You</span>
<span class="credit-music-by">by Flehmann</span>




<span class="credit-title">BGM & Sound Effects</span>
<span class="credit-detail">DOVA-SYNDROME</span>
<span class="credit-detail">Pixabay</span>
<span class="credit-detail">On-Jin ～音人～</span>
<span class="credit-detail">効果音ラボ</span>




<span class="credit-title">Special Thanks</span>
<span class="credit-detail">All Players</span>
<span class="credit-detail">&</span>
<span class="credit-detail">You!</span>
`;
    D.creditsRoll.innerHTML = creditsContent.replace(/\n/g, '<br>');

    // スクロールアニメーションの準備
    D.creditsRoll.style.transition = 'none';
    D.creditsRoll.style.transform = 'translateY(0)';
    await new Promise(r => requestAnimationFrame(r));

    const danceSequence = [
        'images/end/ending-up.jpg',
        'images/end/ending-down.jpg',
        'images/end/ending-up.jpg',
        'images/end/ending-pose.jpg',
        'images/end/ending-left.jpg',
        'images/end/ending-right.jpg',
        'images/end/ending-left.jpg',
        'images/end/ending-pose.jpg'
    ];
    let sequenceIndex = 0;

    const animateDance = () => {
        D.endingDanceImage.style.backgroundImage = `url(${danceSequence[sequenceIndex]})`;
        sequenceIndex = (sequenceIndex + 1) % danceSequence.length;
    };

    // 初回の画像を表示
    animateDance();
    
    // アニメーションループを開始
    S.endingIntervalId = setInterval(animateDance, 500);

    // BGM再生し、再生時間を取得
    const bgmDuration = playEndingBGM();

    // BGMの長さに合わせてクレジットをスクロール
    if (bgmDuration > 0) {
        const creditsHeight = D.creditsRoll.offsetHeight;
        const containerHeight = D.creditsContainer.offsetHeight;
        const scrollDistance = creditsHeight + containerHeight;
        
        D.creditsRoll.style.transition = `transform ${bgmDuration}s linear`;
        D.creditsRoll.style.transform = `translateY(-${scrollDistance}px)`;
    }
}

function stopEnding() {
    const S = GAME.State;
    const D = GAME.Dom;

    S.gamePhase = 'IDLE';
    D.skipButton.style.display = 'none';

    if (S.endingIntervalId) {
        clearInterval(S.endingIntervalId);
        S.endingIntervalId = null;
    }
    
    // クレジットロールの位置をリセット
    if(D.creditsRoll) {
        D.creditsRoll.style.transition = 'none';
        D.creditsRoll.style.transform = 'translateY(0)';
    }

    // BGMの停止は playEndingBGM 側で管理
    
    D.endingScreen.style.display = 'none';
}


async function showEndingLogo() {
    const S = GAME.State;
    const D = GAME.Dom;

    // スキップボタンを非表示に
    D.skipButton.style.display = 'none';
    
    // ダンスアニメーションを停止
    if (S.endingIntervalId) {
        clearInterval(S.endingIntervalId);
        S.endingIntervalId = null;
    }
    
    // ダンス画像をフェードアウト
    D.endingDanceImage.style.opacity = 0;

    await new Promise(r => setTimeout(r, 500)); // フェードアウトを待つ

    D.endingDanceImage.style.display = 'none';

    // ロゴを表示してフェードイン
    D.endingLogo.style.display = 'block';
    await new Promise(r => requestAnimationFrame(r)); // display:blockの反映を待つ
    D.endingLogo.style.opacity = 1;

    // ロゴにクリックイベントを設定
    const onLogoClick = () => {
        stopEnding();
        showTitleScreenAndReset();
        D.endingLogo.removeEventListener('click', onLogoClick);
    };
    D.endingLogo.addEventListener('click', onLogoClick);
}