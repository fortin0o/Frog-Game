class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    create() {
        this.gameOver = false;
        this.score = 0;

        // Background
        this.background = this.add.tileSprite(240, 360, 480, 720, 'background');
        
        this.pipes = this.physics.add.group({ allowGravity: false });

        this.frog = new Frog(this, 100, 300);

        // Ground removed

        this.physics.add.collider(this.frog, this.pipes, this.handleGameOver, null, this);

        this.input.on('pointerdown', this.jump, this);

        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px', 
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.scoreText.setDepth(1);

        this.pipeTimer = this.time.addEvent({
            delay: 1500,
            callback: this.addPipes,
            callbackScope: this,
            loop: true
        });
    }

    jump() {
        if (!this.gameOver) {
            this.frog.jump();
        }
    }

    addPipes() {
        if (this.gameOver) return;

        let gap = 220; // Much more generous gap
        
        let pipeY = Phaser.Math.Between(250, 500);

        let pipeTop = new Pipe(this, 550, pipeY - gap/2, true);
        pipeTop.setOrigin(0.5, 1);
        pipeTop.body.updateFromGameObject();

        let pipeBottom = new Pipe(this, 550, pipeY + gap/2, false);
        pipeBottom.setOrigin(0.5, 0);
        pipeBottom.body.updateFromGameObject();

        this.pipes.add(pipeTop);
        this.pipes.add(pipeBottom);

        pipeTop.body.allowGravity = false;
        pipeBottom.body.allowGravity = false;
        
        pipeTop.setVelocityX(-200);
        pipeBottom.setVelocityX(-200);
    }

    update() {
        if (this.gameOver) return;

        this.background.tilePositionX += 1;

        this.frog.update();

        this.pipes.getChildren().forEach(pipe => {
            pipe.update();

            // Count score only on the bottom pipe
            if (!pipe.flipY && !pipe.passed && pipe.x < this.frog.x) {
                pipe.passed = true;
                this.score++;
                this.scoreText.setText('Score: ' + this.score);
            }
        });

        if (this.frog.y > 750 || this.frog.y < -50) {
            this.handleGameOver();
        }
    }

    handleGameOver() {
        if (this.gameOver) return;

        this.gameOver = true;

        Leaderboard.saveScore(this.score);

        if (this.pipeTimer) {
            this.pipeTimer.remove(false);
        }

        this.physics.pause();
        this.frog.setTint(0xff0000);

        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', { score: this.score });
        });
    }
}