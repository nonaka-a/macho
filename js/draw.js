function setupCanvas() {
    const D = GAME.Dom;
    const CV = GAME.Canvas;
    if (!D.gameContainer) return;
    CV.canvas.width = D.gameContainer.clientWidth;
    CV.canvas.height = D.gameContainer.clientHeight;
    CV.width = CV.canvas.width;
    CV.height = CV.canvas.height;
    CV.JUDGE_LINE_X = CV.width * 0.15;
    CV.TEACHER_LANE_Y = CV.height * 0.12;
    CV.PLAYER_LANE_Y = CV.height * 0.27;
}

function draw(currentTime) {
    const CV = GAME.Canvas;
    const S = GAME.State;

    if (!CV.width) return;
    CV.ctx.clearRect(0, 0, CV.width, CV.height);
    drawCharacters();
    updateParticles();
    
    const laneHeight = CV.height * 0.12;
    CV.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    CV.ctx.fillRect(0, CV.TEACHER_LANE_Y - laneHeight / 2, CV.width, laneHeight);
    CV.ctx.fillRect(0, CV.PLAYER_LANE_Y - laneHeight / 2, CV.width, laneHeight);
    CV.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    CV.ctx.lineWidth = 2;
    CV.ctx.setLineDash([10, 15]);
    CV.ctx.beginPath();
    CV.ctx.moveTo(0, CV.TEACHER_LANE_Y);
    CV.ctx.lineTo(CV.width, CV.TEACHER_LANE_Y);
    CV.ctx.moveTo(0, CV.PLAYER_LANE_Y);
    CV.ctx.lineTo(CV.width, CV.PLAYER_LANE_Y);
    CV.ctx.stroke();
    CV.ctx.setLineDash([]);
    const judgeBoxSize = CV.height * 0.1;
    CV.ctx.strokeStyle = '#00f5d4';
    CV.ctx.lineWidth = 4;
    CV.ctx.strokeRect(CV.JUDGE_LINE_X - judgeBoxSize / 2, CV.TEACHER_LANE_Y - judgeBoxSize / 2, judgeBoxSize, judgeBoxSize);
    if (S.teacherHighlight > 0) {
        CV.ctx.fillStyle = `rgba(0, 245, 212, ${S.teacherHighlight})`;
        CV.ctx.fillRect(CV.JUDGE_LINE_X - judgeBoxSize / 2, CV.TEACHER_LANE_Y - judgeBoxSize / 2, judgeBoxSize, judgeBoxSize);
    }
    CV.ctx.strokeStyle = '#f39c12';
    CV.ctx.lineWidth = 4;
    CV.ctx.strokeRect(CV.JUDGE_LINE_X - judgeBoxSize / 2, CV.PLAYER_LANE_Y - judgeBoxSize / 2, judgeBoxSize, judgeBoxSize);
    if (S.playerHighlight > 0) {
        CV.ctx.fillStyle = `rgba(243, 156, 18, ${S.playerHighlight})`;
        CV.ctx.fillRect(CV.JUDGE_LINE_X - judgeBoxSize / 2, CV.PLAYER_LANE_Y - judgeBoxSize / 2, judgeBoxSize, judgeBoxSize);
    }

    if (S.feedback.time > 0 && Date.now() - S.feedback.time < 500) {
        let textColor = '';
        switch (S.feedback.text) {
            case 'MISS':
                textColor = '#4389f3ff';
                break;
            case 'GOOD':
                textColor = '#48cd41ff';
                break;
            case 'PERFECT':
                textColor = '#FFA500';
                break;
            default:
                textColor = 'white';
        }

        CV.ctx.font = "bold 60px 'Impact', 'Arial Black', sans-serif";
        CV.ctx.textAlign = 'center';
        CV.ctx.textBaseline = 'middle';
        CV.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        CV.ctx.shadowOffsetX = 5;
        CV.ctx.shadowOffsetY = 5;
        CV.ctx.shadowBlur = 10;
        CV.ctx.lineWidth = 8;
        CV.ctx.strokeStyle = 'white';
        CV.ctx.strokeText(S.feedback.text, CV.width / 2, CV.height / 2 + 20);
        CV.ctx.shadowColor = 'transparent';
        CV.ctx.shadowOffsetX = 0;
        CV.ctx.shadowOffsetY = 0;
        CV.ctx.shadowBlur = 0;
        CV.ctx.fillStyle = textColor;
        CV.ctx.fillText(S.feedback.text, CV.width / 2, CV.height / 2 + 20);
    }
}

function drawCharacters() {
    const S = GAME.State;
    const D = GAME.Dom;
    if (!S.spriteData || !S.currentStageInfo) return;
    const getIdleFrameName = (charPrefix) => {
        const frame = S.idleAnimCounter;
        if (frame < 30) return `${charPrefix}-idle1`;
        if (frame < 40) return `${charPrefix}-idle2`;
        if (frame < 50) return `${charPrefix}-idle3`;
        return `${charPrefix}-idle2`;
    };

    const match = S.currentStageInfo.assets.teacherSpriteJson.match(/teacher(\d*)/);
    const teacherPrefix = match ? match[0] : 'teacher';

    const playerFrameName = S.playerState === 'idle' ? getIdleFrameName('player') : `player-${S.playerState}`;
    
    // --- ▼▼▼ ここを修正 ▼▼▼ ---
    // S.teacherState には既に "teacher4-pose" のような完全な名前が入っているので、そのまま使う
    // idle状態の時だけ getIdleFrameName で生成する
    const teacherFrameName = S.teacherState === 'idle' ? getIdleFrameName(teacherPrefix) : S.teacherState;
    // --- ▲▲▲ ここまで修正 ▲▲▲ ---
    
    updateCharacterPose(D.playerCharEl, playerFrameName);
    updateCharacterPose(D.teacherCharEl, teacherFrameName);
}

function updateCharacterPose(element, frameName, overrideSpriteData = null, overrideSpriteImage = null) {
    const S = GAME.State;
    const charPrefix = frameName.split('-')[0];

     const dataKey = (charPrefix === 'player') ? 'player' : 'teacher';
    const currentSpriteData = overrideSpriteData || (S.spriteData ? S.spriteData[charPrefix] : null);
    const currentSpriteImage = overrideSpriteImage || (S.spriteImage ? S.spriteImage[charPrefix] : null);


    if (!currentSpriteData || !currentSpriteData.frames[frameName] || !currentSpriteImage) {
        // console.warn(`スプライトデータまたは画像が見つかりません: '${frameName}'`);
        return;
    }
    const frameData = currentSpriteData.frames[frameName];
    
    const xRange = currentSpriteImage.width - frameData.w;
    const xPos = xRange > 0 ? (frameData.x / xRange) * 100 : 0;
    
    const yRange = currentSpriteImage.height - frameData.h;
    // ★ 修正: 2段組スプライトの場合、Y座標は単純に 0% か 100% で指定する
    const yPos = frameData.y > 0 ? 100 : 0;

    element.style.backgroundPosition = `${xPos}% ${yPos}%`;
}

function triggerCharacterAnimation(characterEl, stateName) {
    const S = GAME.State;
    const D = GAME.Dom;
    let animClass = '';
    
    switch (stateName) {
        case 'ArrowLeft':  animClass = 'anim-bounce-left'; break;
        case 'ArrowRight': animClass = 'anim-bounce-right'; break;
        case 'ArrowUp':    animClass = 'anim-bounce-up'; break;
        case 'ArrowDown':  animClass = 'anim-bounce-down'; break;
        case 'pose':       animClass = 'anim-bounce-pose'; break;
    }

    // ★ 修正: ステージ2の先生の場合のみ、高速版アニメーションクラスを使用する
    if (S.currentStageId === 'stage2' && characterEl === D.teacherCharEl) {
        animClass += '-fast';
    }

    if (animClass) {
        characterEl.className = 'character';
        void characterEl.offsetWidth;
        characterEl.classList.add(animClass);
    }
}

function createParticle() {
    const D = GAME.Dom;
    const S = GAME.State;
    const el = document.createElement('div');
    el.className = 'particle';
    D.particleContainer.appendChild(el);
    const x = Math.random() * 100;
    const duration = 2 + Math.random() * 3;
    const size = 5 + Math.random() * 10;
    const particle = { el, x, y: 105, vx: (Math.random() - 0.5) * 1, vy: -(0.5 + Math.random() * 0.5), life: duration, maxLife: duration, size };
    particle.el.style.width = `${size}px`;
    particle.el.style.height = `${size}px`;
    S.particles.push(particle);
}

function updateParticles() {
    const S = GAME.State;
    if (S.shouldSpawnParticles) {
        S.particleSpawnTimer++;
        if (S.particleSpawnTimer > 5) {
            createParticle();
            S.particleSpawnTimer = 0;
        }
    }
    S.particles.forEach((p, index) => {
        p.life -= 1 / 60;
        if (p.life <= 0) {
            p.el.remove();
            S.particles.splice(index, 1);
            return;
        }
        p.x += p.vx;
        p.y += p.vy;
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio > 0.8) {
            p.el.style.opacity = (1 - lifeRatio) / 0.2;
        } else {
            p.el.style.opacity = lifeRatio / 0.8;
        }
        p.el.style.transform = `translate(${p.x}vw, ${p.y}vh) scale(${lifeRatio})`;
    });
}

function createNoteElement(note) {
    const D = GAME.Dom;
    const S = GAME.State;
    const el = document.createElement('div');
    el.className = 'note';
    const charType = note.isTeacherNote ? 'teacher' : 'player';

    const keyForFrame = note.key === ' ' ? 'pose' : note.key;
    const frameName = `${charType}-${keyForFrame}`;

    if (!S.notesSpriteSheetData || !S.notesSpriteSheetData.frames[frameName]) {
        console.warn(`ノーツデータに '${frameName}' が見つかりません。`);
        return;
    }
    const frameData = S.notesSpriteSheetData.frames[frameName];
    const scale = 48 / 80;
    const scaledX = frameData.x * scale;
    const scaledY = frameData.y * scale;
    el.style.backgroundPosition = `-${scaledX}px -${scaledY}px`;
    D.gamePlayScreen.appendChild(el);
    note.element = el;
}

function showFeedback(text) {
    const S = GAME.State;
    S.feedback.text = text;
    S.feedback.time = Date.now();
}