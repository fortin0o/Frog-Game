const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 720,
    parent: 'game-container',
    pixelArt: true,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 900
            },
            debug: false
        }
    },

    scene: [
        BootScene,
        MenuScene,
        GameScene,
        GameOverScene
    ]
};

new Phaser.Game(config);