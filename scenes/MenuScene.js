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

        this.add.text(120, 300, 'Tap To Start', {
            fontSize: '32px',
            color: '#facc15'
        });

        let scores = Leaderboard.getScores();

        let leaderboard = 'TOP SCORES\n\n';

        if (scores.length === 0) {

            leaderboard += 'No Scores Yet';

        } else {

            scores.forEach((score, index) => {

                leaderboard += `${index + 1}. ${score}\n`;
            });
        }

        this.add.text(150, 400, leaderboard, {
            fontSize: '24px',
            color: '#ffffff',
            align: 'center'
        });

        this.input.once('pointerdown', () => {

            this.scene.start('GameScene');
        });
    }
}