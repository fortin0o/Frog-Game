class BootScene extends Phaser.Scene {

    constructor() {
        super('BootScene');
    }

    preload() {
        // Character & Obstacle
        this.load.image('frog', 'assets/frog.png');
        this.load.image('frog_idle_1', 'assets/frog_idle_1.png');
        this.load.image('frog_idle_2', 'assets/frog_idle_2.png');
        this.load.image('frog_jump_1', 'assets/frog_jump_1.png');
        this.load.image('frog_jump_2', 'assets/frog_jump_2.png');
        
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('pipe_top', 'assets/pipe_top.png');
        this.load.image('pipe_bottom', 'assets/pipe_bottom.png');

        // Environment
        this.load.image('background', 'assets/background.png');
        this.load.image('ground', 'assets/ground.png');

        // UI
        this.load.image('start_button', 'assets/start_button.png');
        this.load.image('leaderboard_button', 'assets/leaderboard_button.png');
        this.load.image('game_over', 'assets/game_over.png');
        this.load.image('coin', 'assets/coin.png');
    }

    create() {
        this.anims.create({
            key: 'idle',
            frames: [
                { key: 'frog_idle_1' },
                { key: 'frog_idle_2' }
            ],
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [
                { key: 'frog_jump_1' },
                { key: 'frog_jump_2' }
            ],
            frameRate: 8,
            repeat: 0
        });

        this.scene.start('MenuScene');
    }
}