class MenuScene extends Phaser.Scene {

    constructor() {
        super('MenuScene');
    }

    create() {

        this.add.image(240, 360, 'background');

        this.add.text(110, 180, 'FROG JUMP', {
            fontSize: '52px',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        let startBtn = this.add.image(240, 500, 'start_button').setInteractive();
        startBtn.setDisplaySize(230, 70);
        
        startBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        let leadBtn = this.add.image(240, 600, 'leaderboard_button').setInteractive();
        leadBtn.setDisplaySize(250, 75);
        // The leaderboard is already displayed on the screen as text above these buttons.
    }
}