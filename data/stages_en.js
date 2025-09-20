const STAGE_DATA = {
  'stage1': {
    title: 'SUPER HEAVYWEIGHT\nHEAVY LIFTER',
    bgmPath: 'sounds/bgm/bgm1.mp3',
    chart: manualChart,
    nextStage: 'stage2',
    assets: {
      backgroundA: 'images/bg/background-stage1_A.png',
      backgroundB: 'images/bg/background-stage1_B.jpg',
      backgroundC: 'images/bg/background-stage1_C.jpg',
      playerSpriteSheet: 'images/spritesheet.png',
      playerSpriteJson: 'spritesheet.json',
      playerFace: 'images/player-face.png',
      teacherSpriteSheet: 'images/spritesheet.png',
      teacherSpriteJson: 'spritesheet.json',
      teacherFace: 'images/teacher-face.png',
      notesSpriteSheet: 'images/spritesheet_notes.png',
      notesJson: 'spritesheet_notes.json',
    },
    se: {
      backgroundChange: 'sounds/se/se-background-change.mp3',
      stageTitle: 'sounds/se/se-stage-title-intro.mp3'
    }
  },
  'stage2': {
    title: 'SUPERSONIC\nSPEEDSTER',
    bgmPath: 'sounds/bgm/bgm2.mp3',
    chart: chart_2,
    timingOffset: 0.15,
    teacherPoseDuration: 250,
    nextStage: 'stage3',
    layout: {
      teacher: {
        left: '68%',
        bottom: '-05.5%',
        height: '65%'
      }
    },
    assets: {
      backgroundA: 'images/bg/background-stage2_A.png',
      backgroundB: 'images/bg/background-stage2_B.jpg',
      backgroundC: 'images/bg/background-stage2_C.jpg',
      playerSpriteSheet: 'images/spritesheet.png',
      playerSpriteJson: 'spritesheet.json',
      playerFace: 'images/player-face.png',
      teacherSpriteSheet: 'images/spritesheet_teacher2.png',
      teacherSpriteJson: 'spritesheet_teacher2.json',
      teacherFace: 'images/teacher2-face.png',
      notesSpriteSheet: 'images/spritesheet_notes.png',
      notesJson: 'spritesheet_notes.json',
    },
    se: {
      backgroundChange: 'sounds/se/se-background-change.mp3',
      stageTitle: 'sounds/se/se-stage-title-intro.mp3'
    }
  },
  'stage3': {
    title: 'THE TRUE\nINNER MUSCLE',
    bgmPath: 'sounds/bgm/bgm3.mp3',
    chart: chart_3,
    nextStage: 'stage4',
    layout: {
      teacher: {
        left: '70%',
        bottom: '01%',
        height: '76%'
      }
    },
    assets: {
      backgroundA: 'images/bg/background-stage3_A.png',
      backgroundB: 'images/bg/background-stage3_B.jpg',
      backgroundC: 'images/bg/background-stage3_C.jpg',
      playerSpriteSheet: 'images/spritesheet.png',
      playerSpriteJson: 'spritesheet.json',
      playerFace: 'images/player-face.png',
      teacherSpriteSheet: 'images/spritesheet_teacher3.png',
      teacherSpriteJson: 'spritesheet_teacher3.json',
      teacherFace: 'images/teacher3-face.png',
      notesSpriteSheet: 'images/spritesheet_notes.png',
      notesJson: 'spritesheet_notes.json',
    },
    se: {
      backgroundChange: 'sounds/se/se-background-change.mp3',
      stageTitle: 'sounds/se/se-stage-title-intro.mp3'
    }
  },
  'stage4': {
    title: 'CYBER\nBODY MAKER',
    bgmPath: 'sounds/bgm/bgm4.mp3',
    chart: chart_4,
    nextStage: 'stage5',
    layout: {
      teacher: {
        left: '70%',
        bottom: '0%',
        height: '68%'
      }
    },
    assets: {
      backgroundA: 'images/bg/background-stage4_A.png',
      backgroundB: 'images/bg/background-stage4_B.jpg',
      backgroundC: 'images/bg/background-stage4_C.jpg',
      playerSpriteSheet: 'images/spritesheet.png',
      playerSpriteJson: 'spritesheet.json',
      playerFace: 'images/player-face.png',
      teacherSpriteSheet: 'images/spritesheet_teacher4.png',
      teacherSpriteJson: 'spritesheet_teacher4.json',
      teacherFace: 'images/teacher4-face.png',
      notesSpriteSheet: 'images/spritesheet_notes.png',
      notesJson: 'spritesheet_notes.json',
    },
    se: {
      backgroundChange: 'sounds/se/se-background-change.mp3',
      stageTitle: 'sounds/se/se-stage-title-intro.mp3'
    }
  },
  'stage5': {
    title: 'THE SOLITARY\nKING MACHO',
    bgmPath: 'sounds/bgm/bgm5.mp3',
    chart: chart_5,
    nextStage: null,
    layout: {
      teacher: {
        left: '68%',
        bottom: '-12%',
        height: '91%'
      }
    },
    assets: {
      backgroundA: 'images/bg/background-stage5_A.png',
      backgroundB: 'images/bg/background-stage5_B.jpg',
      backgroundC: 'images/bg/background-stage5_C.jpg',
      playerSpriteSheet: 'images/spritesheet.png',
      playerSpriteJson: 'spritesheet.json',
      playerFace: 'images/player-face.png',
      teacherSpriteSheet: 'images/spritesheet_teacher5.png',
      teacherSpriteJson: 'spritesheet_teacher5.json',
      teacherFace: 'images/teacher5-face.png',
      notesSpriteSheet: 'images/spritesheet_notes.png',
      notesJson: 'spritesheet_notes.json',
    },
    se: {
      backgroundChange: 'sounds/se/se-background-change.mp3',
      stageTitle: 'sounds/se/se-stage-title-intro.mp3'
    }
  }
};

if (typeof manualChart !== 'undefined') {
  delete window.manualChart;
}
if (typeof chart_2 !== 'undefined') {
  delete window.chart_2;
}
if (typeof chart_3 !== 'undefined') {
  delete window.chart_3;
}
if (typeof chart_4 !== 'undefined') {
  delete window.chart_4;
}
if (typeof chart_5 !== 'undefined') {
  delete window.chart_5;
}