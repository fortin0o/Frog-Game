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

        let leaderboard = 'TOP SCORES\n\n';

        scores.forEach((score, index) => {

            leaderboard += `${index + 1}. ${score}\n`;
        });

        this.add.text(150, 380, leaderboard, {
            fontSize: '24px',
            color: '#facc15',
            align: 'center'
        });

        this.add.text(110, 620, 'Tap To Restart', {
            fontSize: '32px',
            color: '#ffffff'
        });

        this.input.once('pointerdown', () => {

            this.scene.start('GameScene');
        });
    }
}