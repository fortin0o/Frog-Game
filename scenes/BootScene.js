class BootScene extends Phaser.Scene {

    constructor() {
        super('BootScene');
    }

    preload() {
        // Character & Obstacle
        this.load.image('frog', 'assets/frog.png');
        this.load.image('pipe', 'assets/pipe.png');

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
        this.scene.start('MenuScene');
    }
}