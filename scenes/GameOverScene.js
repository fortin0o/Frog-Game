class GameOverScene extends Phaser.Scene {

    constructor() {
        super('GameOverScene');
    }

    create(data) {

        this.add.image(240, 360, 'background');

        this.add.text(100, 180, 'GAME OVER', {
            fontSize: '54px',
            color: '#ef4444',
            fontStyle: 'bold'
        });

        this.add.text(170, 300, `Score: ${data.score}`, {
            fontSize: '40px',
            color: '#ffffff'
        });

        let scores = Leaderboard.getScores();

        // Draw a nice dark semi-transparent panel for the leaderboard
        let panel = this.add.graphics();
        panel.fillStyle(0x000000, 0.7);
        panel.fillRoundedRect(90, 360, 300, 220, 16);

        this.add.text(240, 390, 'TOP SCORES', {
            fontSize: '28px',
            color: '#facc15',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        let yOffset = 440;
        scores.slice(0, 5).forEach((score, index) => {
            this.add.text(140, yOffset, `${index + 1}.`, { fontSize: '24px', color: '#ffffff' });
            this.add.text(340, yOffset, `${score}`, { fontSize: '24px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(1, 0);
            yOffset += 35;
        });

        let restartBtn = this.add.image(240, 630, 'start_button').setInteractive();
        restartBtn.setDisplaySize(200, 60);

        restartBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}