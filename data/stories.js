const STORY_DATA = {
  // オープニングストーリー
  opening: [
    {
      type: 'slide',
      image: 'images/slides/opening-1.jpg',
      text: '世界中のマッチョが集い最強のマッチョを決める街。\nその名もマッチョタウン。'
    },
    {
      type: 'slide',
      image: 'images/slides/opening-2.jpg',
      text: 'ここに、無口だが底抜けに明るい一人のマッチョが\n現れた。彼の夢は、もちろんこのマッチョタウンで\nNo.1マッチョになることだ。'
    },
    {
      type: 'slide',
      image: 'images/slides/opening-3.jpg',
      text: 'さあ！伝説のトレーニーたちを\n「マッチョ・グルーヴバトル」で打ち破れ！'
    },
    {
      type: 'slide',
      image: 'images/slides/opening-3.jpg',
      text: '合言葉は「マッチョでチェケラッチョ！」'
    }
  ],
 interlude_to_stage3: [
    {
      type: 'slide',
      image: 'images/slides/interlude-1.jpg',
      text: '超重量級ヘビートレーニー\nそして、超音速スピードスター...'
    },
    {
      type: 'slide',
      image: 'images/slides/interlude-2.jpg',
      text: 'マッチョタウンの二大巨頭がマッチョ・グルーヴバトルで一人の男に敗れたというニュースは、\n瞬く間に街をかけめぐった。'
    },
    {
      type: 'slide',
      image: 'images/slides/interlude-3.jpg',
      text: 'そのウワサは、アンダーグラウンドにひそむ\n強者たちの耳にもとどく。\n筋肉の真理を追い求める者、新たな秩序を求める者...'
    },
    {
      type: 'slide',
      image: 'images/slides/interlude-3.jpg',
      text: '本当の戦いはここからだ！\nさあ！マッチョでチェケラッチョ！'
    }
  ],

  // ステージ1 直前ストーリー
  stage1_intro: [
    {
      type: 'dialogue',
      character: 'teacher',
      pose: 'teacher-idle1',
      text: '見ない顔だな！新入りマッチョか。'
    },
    {
      type: 'dialogue',
      character: 'teacher',
      pose: 'teacher-ArrowUp',
      text: '俺はヘビーなトレーニングを愛し、ヘビーなウェイトに愛された男！'
    },
    {
      type: 'dialogue',
      character: 'teacher',
      pose: 'teacher-ArrowLeft',
      text: 'お前のトレーニングは軽すぎるぜ…まるでウォーミングアップだ。'
    },
    {
      type: 'dialogue',
      character: 'teacher',
      pose: 'teacher-pose',
      text: '本当の『ヘビー』なグルーヴで\nお前を床に沈めてやる！'
    }
  ],

// ステージ2 直前ストーリー
  stage2_intro: [
    {
      type: 'dialogue',
      character: 'teacher2',
      pose: 'teacher2-idle1',
      text: 'あら、いらっしゃい！'
    },
    {
      type: 'dialogue',
      character: 'teacher2',
      pose: ['teacher2-ArrowRight', 'teacher2-idle1'],
      text: 'あなた、無駄な筋肉が多いわね…\nマッチョに必要なのは重さじゃない、スピードよ。'
    },
    {
      type: 'dialogue',
      character: 'teacher2',
      pose: ['teacher2-ArrowLeft', 'teacher2-idle1'],
      text: '私のクイックなトレーニングで、鍛え直してあげる！'
    },
    {
      type: 'dialogue',
      character: 'teacher2',
      pose: 'teacher2-pose',
      text: 'あなたに、この『音速』は乗りこなせるかしら？'
    }
  ],
  stage3_intro: [
    {
      type: 'dialogue',
      character: 'teacher3',
      pose: 'teacher3-idle1',
      text: 'おぬしの闘い、見させてもらったぞ。\n力強く、そして速い…'
    },
    {
      type: 'dialogue',
      character: 'teacher3',
      pose: 'teacher3-idle1',
      text: 'じゃが真のマッチョとは、そんな外側の筋肉を\n追い求めても、決して手に入らぬ。'
    },
    {
      type: 'dialogue',
      character: 'teacher3',
      pose: 'teacher3-idle1',
      text: 'マッチョとは心のありようじゃ。\n…お主には見えるか？わしのマッチョが。'
    },
    {
      type: 'dialogue',
      character: 'teacher3',
      pose: 'teacher3-idle1',
      text: '心を鍛えることがマッチョ道への入り口なり。'
    }
  ],
  stage4_intro: [
    {
      type: 'dialogue',
      character: 'teacher4',
      pose: 'teacher4-idle1',
      text: '…お待ちしておりまシタ。'
    },
    {
      type: 'dialogue',
      character: 'teacher4',
      pose: 'teacher4-ArrowLeft',
      text: 'あなたの身体データは、すでにスキャン済みですので\nご安心くだサイ。'
    },
    {
      type: 'dialogue',
      character: 'teacher4',
      pose: 'teacher4-pose',
      text: 'これより、未来のマッチョデザイン『サイバー・ボディメイク』のデモンストレーションを開始しマス。'
    },
    {
      type: 'dialogue',
      character: 'teacher4',
      pose: 'teacher4-idle1',
      text: '美しいマッチョを手に入れるために\n従来のトレーニングに付属する苦痛や疲労といった\n旧世代の概念は、もうあなたに必要ありまセン。'
    }
  ],
  interlude_to_stage5: [
    {
      type: 'auto-slide-sequence',
      bgm: 'sounds/bgm/bgm-interlude1.mp3',
      slides: [
        { image: 'images/slides/interlude-slide-1.jpg', effect: 'zoom' },
        { image: 'images/slides/interlude-slide-2.jpg', effect: 'zoom' },
        { image: 'images/slides/interlude-slide-3.jpg', effect: 'pan-right' },
        { image: 'images/slides/interlude-slide-4.jpg', effect: 'pan-left' },
        { image: 'images/slides/interlude-slide-5.jpg', effect: 'zoom' }
      ],
      displayDuration: 5000,
      fadeDuration: 2000
    },
    // --- 幕間2 ---
    {
      type: 'slide',
      image: 'images/slides/slide-6.jpg',
      text: 'あっという間に彼は街のヒーローになった。\nその陽気なグルーヴは人々の心を惹きつけ\n大きなムーブメントとなっていく。',
      bgm: 'sounds/bgm/bgm-story5.mp3'
    },
    {
      type: 'slide',
      image: 'images/slides/slide-7.jpg',
      text: '残る壁はただ一つ！\n「マッチョ・オブ・マッチョ」の称号を持つ絶対王者\nキングマッチョだ。'
    },
    {
      type: 'slide',
      image: 'images/slides/slide-8.jpg',
      text: 'さあ、最後の「マッチョ・グルーヴバトル」が始まる！\n最高のグルーヴで、頂点へ駆け上がれ！'
    },
    {
      type: 'slide',
      image: 'images/slides/slide-8.jpg',
      text: 'マッチョでチェケラッチョ！'
    }
  ],
  stage5_intro: [
    {
      type: 'dialogue',
      character: 'teacher5',
      pose: 'teacher5-idle1',
      bgm: 'sounds/bgm/bgm-story5.mp3',
      text: '……………。'
    },
    {
      type: 'dialogue',
      character: 'teacher5',
      pose: 'teacher5-idle1',
      text: '僕を倒そうってことか。僕はもう負けないぞ。\nあの頃の僕じゃないんだ。'
    },
    {
      type: 'dialogue',
      character: 'teacher5',
      pose: 'teacher5-ArrowUp',
      text: '見ろ、このマッチョを！\nこれさえあれば、僕は最強なんだ！'
    },
    {
      type: 'dialogue',
      character: 'teacher5',
      pose: 'teacher5-pose',
      text: '…筋肉こそ正義。筋肉こそ真実。\n僕の筋肉で捻り潰してやる！'
    },
    {
      type: 'dialogue',
      character: 'teacher5',
      pose: 'teacher5-pose',
      text: '僕がキングマッチョだ！！'
    }
  ],
  // ★★★ ここから追加 ★★★
  ending: [
      {
          type: 'auto-dialogue-sequence',
          bgm: 'sounds/bgm/bgm-end.mp3',
          pages: [
              { image: 'images/slides/ending-1.jpg', text: 'キングマッチョ「くそっ！僕は最強なんだ…！\n筋肉さえあれば… 筋肉さえあれば…」' },
              { image: 'images/slides/ending-2.jpg', text: 'すごいマッチョだね！\n今度どんなトレーニングしてるか教えてよ！' },
              { image: 'images/slides/ending-3.jpg', text: 'キングマッチョ「なっ…」' },
              { image: 'images/slides/ending-4.jpg', text: '' },
              { image: 'images/slides/ending-5.jpg', text: 'みんな、すごいカッコイイよ！\nだけどちょっと難しく考えすぎじゃない？' },
              { image: 'images/slides/ending-6.jpg', text: 'マッチョをもっと楽しもうよ！' },
              { image: 'images/slides/ending-7.jpg', text: 'キングマッチョ「マッチョを…楽しむ…？」' },
              { image: 'images/slides/ending-8.jpg', text: 'そう！みんなこんなにすごいマッチョなんだから！！' },
              {
                  type: 'multi-image',
                  images: ['images/slides/ending-9a.jpg', 'images/slides/ending-9b.jpg'],
                  durations: [4000, 3000],
                  text: ''
              },
              {
                  type: 'multi-image-loop',
                  images: ['images/slides/ending-10a.jpg', 'images/slides/ending-10b.jpg', 'images/slides/ending-10c.jpg', 'images/slides/ending-10d.jpg'],
                  interval: 300,
                  totalDuration: 4000,
                  text: ''
              },
              { image: 'images/slides/ending-11.jpg', text: 'キングマッチョ「楽しむ…か。いいね、それ」' },
              { image: 'images/slides/ending-12.jpg', text: 'うん！マッチョでチェケラッチョ！！' }
          ]
          
      }, 
      {
          action: 'fadeOut'
      }
  ]
  
  // ★★★ ここまで追加 ★★★
};