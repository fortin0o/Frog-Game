class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    create() {
        this.gameOver = false;
        this.hasStarted = false;
        this.score = 0;

        // Background
        this.background = this.add.tileSprite(240, 320, 500, 660, 'background');
        
        this.pipes = this.physics.add.group({ allowGravity: false });

        this.frog = new Frog(this, 100, 300);
        this.frog.body.allowGravity = false; // Hover until start

        // Cliff
        this.cliff = this.physics.add.sprite(100, 600, 'cliff');
        this.cliff.setDisplaySize(200, 600);
        this.cliff.setImmovable(true);
        this.cliff.body.allowGravity = false;

        this.physics.add.collider(this.frog, this.pipes, this.handleGameOver, null, this);
        this.physics.add.collider(this.frog, this.cliff);

        this.coins = this.physics.add.group({ allowGravity: false });
        this.physics.add.overlap(this.frog, this.coins, this.collectCoin, null, this);

        this.input.on('pointerdown', this.jump, this);
        this.input.keyboard.on('keydown-SPACE', this.jump, this);

        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px', 
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.scoreText.setDepth(1);
    }

    jump() {
        if (this.gameOver) return;

        if (!this.hasStarted) {
            this.hasStarted = true;
            this.frog.body.allowGravity = true;
            this.cliff.setVelocityX(-200);

            this.pipeTimer = this.time.addEvent({
                delay: 1500,
                callback: this.addPipes,
                callbackScope: this,
                loop: true
            });
        }

        this.frog.jump();
    }

    addPipes() {
        if (this.gameOver) return;

        let difficultyLevel = Math.floor(this.score / 5);
        
        let gap = 220 - (difficultyLevel * 10);
        gap = Math.max(gap, 130); // Minimum gap of 130
        
        let currentSpeed = -200 - (difficultyLevel * 15);
        currentSpeed = Math.max(currentSpeed, -400);
        
        let pipeY = Phaser.Math.Between(250, 500);

        let pipeTop = new Pipe(this, 550, pipeY - gap/2, 'pipe_bottom', true);
        pipeTop.setOrigin(0.5, 1);
        pipeTop.body.updateFromGameObject();

        let pipeBottom = new Pipe(this, 550, pipeY + gap/2, 'pipe_bottom', false);
        pipeBottom.setOrigin(0.5, 0);
        pipeBottom.body.updateFromGameObject();

        this.pipes.add(pipeTop);
        this.pipes.add(pipeBottom);

        pipeTop.body.allowGravity = false;
        pipeBottom.body.allowGravity = false;
        
        pipeTop.setVelocityX(currentSpeed);
        pipeBottom.setVelocityX(currentSpeed);

        // Spawn coin in the gap with 30% chance
        if (Phaser.Math.Between(1, 100) <= 30) {
            let coin = this.coins.create(550, pipeY, 'coin');
            coin.setVelocityX(currentSpeed);
            coin.body.allowGravity = false;
            coin.setDisplaySize(40, 40); // ensure it's a good size
        }
    }

    update() {
        if (this.gameOver) return;

        if (this.hasStarted) {
            let difficultyLevel = Math.floor(this.score / 5);
            let currentSpeed = -200 - (difficultyLevel * 15);
            currentSpeed = Math.max(currentSpeed, -400);

            // Scale timer to spawn pipes faster as speed increases
            if (this.pipeTimer) {
                this.pipeTimer.timeScale = Math.abs(currentSpeed) / 200;
            }

            this.background.tilePositionX += Math.abs(currentSpeed) / 200;

            // Constantly update speed of all moving elements to prevent overlaps when difficulty increments
            this.pipes.getChildren().forEach(pipe => pipe.setVelocityX(currentSpeed));
            this.coins.getChildren().forEach(coin => coin.setVelocityX(currentSpeed));
        }

        this.frog.update();

        this.pipes.getChildren().forEach(pipe => {
            pipe.update();

            // Only score once per pair of pipes (the bottom pipe is not flipped)
            if (!pipe.flipY && !pipe.passed && pipe.x < this.frog.x) {
                pipe.passed = true;
                this.score++;
                this.scoreText.setText('Score: ' + this.score);
            }
        });

        // Cleanup off-screen coins
        this.coins.getChildren().forEach(coin => {
            if (coin.x < -50) {
                coin.destroy();
            }
        });

        if (this.frog.y > 750 || this.frog.y < -50) {
            this.handleGameOver();
        }
    }

    collectCoin(frog, coin) {
        if (this.gameOver) return;
        
        coin.destroy();
        this.score += 3;
        this.scoreText.setText('Score: ' + this.score);
        this.sound.play('coin', { volume: 0.4 });
    }

    handleGameOver() {
        if (this.gameOver) return;

        this.gameOver = true;

        Leaderboard.saveScore(this.score);

        this.sound.play('gameover');

        if (this.pipeTimer) {
            this.pipeTimer.remove(false);
        }

        this.physics.pause();
        this.frog.setTint(0xff0000);

        // Cartoonish death pop
        this.tweens.add({
            targets: this.frog,
            displayWidth: 120,
            displayHeight: 120,
            angle: 180,
            alpha: 0,
            duration: 800,
            ease: 'Power2'
        });

        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', { score: this.score });
        });
    }
}