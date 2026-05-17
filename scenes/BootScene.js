class BootScene extends Phaser.Scene {

    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.image('frog_idle_1', 'assets/frog_idle_1.png');
        this.load.image('frog_jump_1', 'assets/frog_jump_1.png');
        this.load.image('frog_jump_2', 'assets/frog_jump_2.png');
        this.load.image('frog_flying', 'assets/frog_flying.png');
        
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('pipe_top', 'assets/pipe_top.png');
        this.load.image('pipe_bottom', 'assets/pipe_bottom.png');

        // Environment
        this.load.image('background', 'assets/background.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('cliff', 'assets/cliff.png');

        // UI
        this.load.image('start_button', 'assets/start_button.png');
        this.load.image('leaderboard_button', 'assets/leaderboard_button.png');
        this.load.image('game_over', 'assets/game_over.png');
        this.load.image('coin', 'assets/coin.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('clouds', 'assets/clouds.png');

        // Sounds
        this.load.audio('bgmusic', 'assets/bgmusic.wav');
        this.load.audio('jump', 'assets/jump.wav');
        this.load.audio('gameover', 'assets/gameover.wav');
        this.load.audio('coin', 'assets/coin.wav');
        this.load.audio('score', 'assets/score.wav');
    }

    create() {
        this.anims.create({
            key: 'idle',
            frames: [
                { key: 'frog_idle_1' }
            ],
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [
                { key: 'frog_flying' }
            ],
            frameRate: 8,
            repeat: 0
        });

        this.scene.start('MenuScene');
    }
}