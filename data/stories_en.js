const STORY_DATA = {
  // Opening Story
  opening: [
    {
      type: 'slide',
      image: 'images/slides/opening-1.jpg',
      text: 'This is Macho Town, where machos from all over the world gather to decide who is the strongest.'
    },
    {
      type: 'slide',
      image: 'images/slides/opening-2.jpg',
      text: 'A quiet but incredibly cheerful macho has appeared. His dream, of course, is to become the No. 1 macho in this town.'
    },
    {
      type: 'slide',
      image: 'images/slides/opening-3.jpg',
      text: 'Now! Defeat the legendary machos in a "Macho Groove Battle"!'
    },
    {
      type: 'slide',
      image: 'images/slides/opening-3.jpg',
      text: 'And our motto? "Macho de Check-it-out!"'
    }
  ],
 interlude_to_stage3: [
    {
      type: 'slide',
      image: 'images/slides/interlude-1.jpg',
      text: 'The Super Heavyweight Heavy Lifter...\nand the Supersonic Speedster...'
    },
    {
      type: 'slide',
      image: 'images/slides/interlude-2.jpg',
      text: 'News that Macho Town\'s two great titans were defeated by one man spread through the city in an instant.'
    },
    {
      type: 'slide',
      image: 'images/slides/interlude-3.jpg',
      text: 'The rumor reached the underground\'s hidden titans.Seekers of muscle\'s truth, and architects of a new order...'
    },
    {
      type: 'slide',
      image: 'images/slides/interlude-3.jpg',
      text: 'The real battle starts now!\nGo! Macho de Check-it-out!'
    }
  ],

  // Stage 1 Intro Story
  stage1_intro: [
    {
      type: 'dialogue',
      character: 'teacher',
      pose: 'teacher-idle1',
      text: 'Haven\'t seen your face! A new macho, huh?'
    },
    {
      type: 'dialogue',
      character: 'teacher',
      pose: 'teacher-ArrowUp',
      text: 'I\'m a man who loves heavy training, and is loved by heavy weights!'
    },
    {
      type: 'dialogue',
      character: 'teacher',
      pose: 'teacher-ArrowLeft',
      text: 'Your training is too light... like a warm-up.'
    },
    {
      type: 'dialogue',
      character: 'teacher',
      pose: 'teacher-pose',
      text: 'I\'ll crush you to the floor with a truly "heavy" groove!'
    }
  ],

// Stage 2 Intro Story
  stage2_intro: [
    {
      type: 'dialogue',
      character: 'teacher2',
      pose: 'teacher2-idle1',
      text: 'Oh, welcome!'
    },
    {
      type: 'dialogue',
      character: 'teacher2',
      pose: ['teacher2-ArrowRight', 'teacher2-idle1'],
      text: 'You have too much useless muscle... Macho is about speed, not weight.'
    },
    {
      type: 'dialogue',
      character: 'teacher2',
      pose: ['teacher2-ArrowLeft', 'teacher2-idle1'],
      text: 'I\'ll whip you back into shape with my quick training!'
    },
    {
      type: 'dialogue',
      character: 'teacher2',
      pose: 'teacher2-pose',
      text: 'Can you keep up with my "supersonic" flow?'
    }
  ],
  stage3_intro: [
    {
      type: 'dialogue',
      character: 'teacher3',
      pose: 'teacher3-idle1',
      text: 'I have watched your battles. Powerful, and fast...'
    },
    {
      type: 'dialogue',
      character: 'teacher3',
      pose: 'teacher3-idle1',
      text: 'But true macho cannot be achieved by pursuing such outer muscles.'
    },
    {
      type: 'dialogue',
      character: 'teacher3',
      pose: 'teacher3-idle1',
      text: 'Macho is a state of mind.\n...Can you see it? My macho.'
    },
    {
      type: 'dialogue',
      character: 'teacher3',
      pose: 'teacher3-idle1',
      text: 'Training the spirit is the first step on the Way of Macho.'
    }
  ],
  stage4_intro: [
    {
      type: 'dialogue',
      character: 'teacher4',
      pose: 'teacher4-idle1',
      text: '...We have been expecting you.'
    },
    {
      type: 'dialogue',
      character: 'teacher4',
      pose: 'teacher4-ArrowLeft',
      text: 'Your biometric data has been acquired. There is no cause for concern.'
    },
    {
      type: 'dialogue',
      character: 'teacher4',
      pose: 'teacher4-pose',
      text: 'Commencing demonstration of "Cyber Body Make": the future of corporal design.'
    },
    {
      type: 'dialogue',
      character: 'teacher4',
      pose: 'teacher4-idle1',
      text: 'Legacy concepts such as pain and fatigue from conventional training are now obsolete.'
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
    {
      type: 'slide',
      image: 'images/slides/slide-6.jpg',
      text: 'In no time, he became the town\'s hero. His cheerful groove captivated people\'s hearts and started a huge movement.',
      bgm: 'sounds/bgm/bgm-story5.mp3'
    },
    {
      type: 'slide',
      image: 'images/slides/slide-7.jpg',
      text: 'Only one obstacle remains! The absolute champion who holds the title of "Macho of Machos," King Macho.'
    },
    {
      type: 'slide',
      image: 'images/slides/slide-8.jpg',
      text: 'Now, the final "Macho Groove Battle" begins! Rise to the top with your ultimate groove!'
    },
    {
      type: 'slide',
      image: 'images/slides/slide-8.jpg',
      text: 'Macho de Check-it-out!'
    }
  ],
  stage5_intro: [
    {
      type: 'dialogue',
      character: 'teacher5',
      pose: 'teacher5-idle1',
      bgm: 'sounds/bgm/bgm-story5.mp3',
      text: '............'
    },
    {
      type: 'dialogue',
      character: 'teacher5',
      pose: 'teacher5-idle1',
      text: 'So, you came to beat me? Not gonna happen! I\'m never losing again!'
    },
    {
      type: 'dialogue',
      character: 'teacher5',
      pose: 'teacher5-ArrowUp',
      text: 'Look at my muscles! With these, nobody can beat me!'
    },
    {
      type: 'dialogue',
      character: 'teacher5',
      pose: 'teacher5-pose',
      text: '...Muscle is justice. Muscle is truth. I\'m gonna smash you with my muscles!'
    },
    {
      type: 'dialogue',
      character: 'teacher5',
      pose: 'teacher5-pose',
      text: 'I am King Macho!!'
    }
  ],
  ending: [
      {
          type: 'auto-dialogue-sequence',
          bgm: 'sounds/bgm/bgm-end.mp3',
          pages: [
              { image: 'images/slides/ending-1.jpg', text: 'King Macho: "Damn it! I\'m the strongest...! If only I had more muscle... more muscle..."' },
              { image: 'images/slides/ending-2.jpg', text: 'That\'s some amazing macho! Hey, show me your training routine sometime!' },
              { image: 'images/slides/ending-3.jpg', text: 'King Macho: "Wh-what...?"' },
              { image: 'images/slides/ending-4.jpg', text: '' },
              { image: 'images/slides/ending-5.jpg', text: 'You\'re all so cool! But aren\'t you overthinking it a bit?' },
              { image: 'images/slides/ending-6.jpg', text: 'Let\'s just have more fun with macho!' },
              { image: 'images/slides/ending-7.jpg', text: 'King Macho: "Have... fun... with macho?"' },
              { image: 'images/slides/ending-8.jpg', text: 'Yeah! I mean, you all have such incredible macho physiques!!' },
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
              { image: 'images/slides/ending-11.jpg', text: 'King Macho: "Have fun... huh. Yeah... that sounds fun!"' },
              { image: 'images/slides/ending-12.jpg', text: 'Yeah! Macho de Check-it-out!!' }
          ]
          
      }, 
      {
          action: 'fadeOut'
      }
  ]
};