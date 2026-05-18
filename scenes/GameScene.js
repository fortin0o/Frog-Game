class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    create() {
        this.gameOver = false;
        this.hasStarted = false;
        this.score = 0;

        // Sky phase tracking (day / dusk / night)
        this.skyPhase = 'day'; // 'day' | 'dusk' | 'night'
        this.skyTransitioning = false;

        // Power-up state
        this.hasShield = false;
        this.hasMagnet = false;
        this.magnetTimer = null;
        this.shieldGfx = null;
        this.magnetIndicator = null;

        // Background
        this.background = this.add.tileSprite(240, 320, 500, 660, 'background');
        
        // Mid-ground Clouds (Parallax)
        this.clouds = this.add.tileSprite(240, 320, 500, 660, 'clouds');

        // ── Sky Overlays (Day/Night cycle) ───────────────────────────
        // Two separate overlays, each fades in independently — no color jump
        this.duskOverlay = this.add.rectangle(240, 320, 500, 660, 0xff5500, 0);
        this.duskOverlay.setDepth(0.5);

        this.nightOverlay = this.add.rectangle(240, 320, 500, 660, 0x000033, 0);
        this.nightOverlay.setDepth(0.51);

        // Stars layer (invisible by default, shown at night)
        this.starsGfx = this.add.graphics();
        this.starsGfx.setDepth(0.6);
        this.starsGfx.setAlpha(0);
        // Pre-draw a field of random stars
        this._starPositions = [];
        for (let i = 0; i < 60; i++) {
            this._starPositions.push({
                x: Phaser.Math.Between(0, 480),
                y: Phaser.Math.Between(0, 400),
                r: Math.random() < 0.3 ? 2 : 1
            });
        }
        this.starsGfx.fillStyle(0xffffff, 1);
        this._starPositions.forEach(s => this.starsGfx.fillCircle(s.x, s.y, s.r));
        
        this.pipes = this.physics.add.group({ allowGravity: false });

        this.frog = new Frog(this, 100, 300);
        this.frog.body.allowGravity = false; // Hover until start

        // Apply active skin tint
        let skinTint = PlayerData.getActiveTint();
        if (skinTint !== null) {
            this.frog.setTint(skinTint);
        }

        // Cliff
        this.cliff = this.physics.add.sprite(100, 600, 'cliff');
        this.cliff.setDisplaySize(200, 600);
        this.cliff.setImmovable(true);
        this.cliff.body.allowGravity = false;

        this.physics.add.collider(this.frog, this.pipes, this.handlePipeCollision, null, this);
        this.physics.add.collider(this.frog, this.cliff);

        // Coins
        this.coins = this.physics.add.group({ allowGravity: false });
        this.physics.add.overlap(this.frog, this.coins, this.collectCoin, null, this);

        // Power-ups
        this.powerups = this.physics.add.group({ allowGravity: false });
        this.physics.add.overlap(this.frog, this.powerups, this.collectPowerup, null, this);

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

        // Power-up status indicator (top right)
        this.statusText = this.add.text(470, 16, '', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'right'
        }).setOrigin(1, 0).setDepth(10);

        // Shield visual aura (drawn around the frog when active)
        this.shieldGfx = this.add.graphics();
        this.shieldGfx.setDepth(3);
        // Setup Dust Particles
        try {
            // Phaser 3.60+ syntax
            this.dustEmitter = this.add.particles(0, 0, 'particle', {
                speed: { min: 50, max: 120 },
                angle: { min: 45, max: 135 }, // Downwards spread
                scale: { start: 1, end: 0 },
                alpha: { start: 0.6, end: 0 },
                lifespan: 300,
                gravityY: 200,
                emitting: false
            });
            this.dustEmitter.setDepth(2);
        } catch (e) {
            // Fallback for older Phaser 3.5x
            let particles = this.add.particles('particle');
            this.dustEmitter = particles.createEmitter({
                speed: { min: 50, max: 120 },
                angle: { min: 45, max: 135 },
                scale: { start: 1, end: 0 },
                alpha: { start: 0.6, end: 0 },
                lifespan: 300,
                gravityY: 200,
                on: false
            });
            particles.setDepth(2);
        }
    }

    // ── Difficulty curve: easy until score 100, then ramp up ──────────
    getDifficultyLevel() {
        return this.score > 100 ? Math.floor((this.score - 100) / 5) : 0;
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
        
        // Emit dust particles under the frog
        if (this.dustEmitter) {
            if (this.dustEmitter.emitParticleAt) {
                this.dustEmitter.emitParticleAt(this.frog.x, this.frog.y + 20, 6);
            } else if (this.dustEmitter.explode) {
                this.dustEmitter.explode(6, this.frog.x, this.frog.y + 20);
            }
        }
    }

    addPipes() {
        if (this.gameOver) return;

        let difficultyLevel = this.getDifficultyLevel();
        
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
            coin.setDisplaySize(40, 40);
        }

        // Spawn power-up in the gap with 8% chance (shield or magnet)
        if (Phaser.Math.Between(1, 100) <= 8) {
            let type = Phaser.Math.Between(0, 1) === 0 ? 'shield' : 'magnet';
            let pu = this.powerups.create(550, pipeY, type);
            pu.setVelocityX(currentSpeed);
            pu.body.allowGravity = false;
            pu.setDisplaySize(44, 44);
            pu.powerupType = type;

            // Gentle floating animation
            this.tweens.add({
                targets: pu,
                y: pipeY - 12,
                duration: 700,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    update() {
        if (this.gameOver) return;

        if (this.hasStarted) {
            let difficultyLevel = this.getDifficultyLevel();
            let currentSpeed = -200 - (difficultyLevel * 15);
            currentSpeed = Math.max(currentSpeed, -400);

            // Scale timer to spawn pipes faster as speed increases
            if (this.pipeTimer) {
                this.pipeTimer.timeScale = Math.abs(currentSpeed) / 200;
            }

            // Parallax Scrolling
            this.background.tilePositionX += Math.abs(currentSpeed) / 200;
            this.clouds.tilePositionX += Math.abs(currentSpeed) / 100;

            // Sync all moving elements to current speed
            this.pipes.getChildren().forEach(pipe => pipe.setVelocityX(currentSpeed));
            this.coins.getChildren().forEach(coin => coin.setVelocityX(currentSpeed));
            this.powerups.getChildren().forEach(pu => pu.setVelocityX(currentSpeed));

            // Magnet effect: attract nearby coins to frog
            if (this.hasMagnet) {
                this.coins.getChildren().forEach(coin => {
                    let dx = this.frog.x - coin.x;
                    let dy = this.frog.y - coin.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        let pull = 300;
                        coin.setVelocity(
                            currentSpeed + (dx / dist) * pull,
                            (dy / dist) * pull
                        );
                    }
                });
            }
        }

        // Day / Night sky update
        this.updateSkyPhase();

        this.frog.update();

        // Draw / clear shield aura
        this.shieldGfx.clear();
        if (this.hasShield) {
            this.shieldGfx.lineStyle(3, 0x00ccff, 0.8);
            this.shieldGfx.strokeCircle(this.frog.x, this.frog.y, 38);
            this.shieldGfx.lineStyle(1, 0xffffff, 0.3);
            this.shieldGfx.strokeCircle(this.frog.x, this.frog.y, 44);
        }

        this.pipes.getChildren().forEach(pipe => {
            pipe.update();

            // Only score once per pair of pipes (the bottom pipe is not flipped)
            if (!pipe.flipY && !pipe.passed && pipe.x < this.frog.x) {
                pipe.passed = true;
                this.score++;
                this.scoreText.setText('Score: ' + this.score);
                this.sound.play('score', { volume: 0.5 });
            }
        });

        // Cleanup off-screen coins
        this.coins.getChildren().forEach(coin => {
            if (coin.x < -50) coin.destroy();
        });

        // Cleanup off-screen power-ups
        this.powerups.getChildren().forEach(pu => {
            if (pu.x < -50) pu.destroy();
        });

        if (this.frog.y > 750 || this.frog.y < -50) {
            this.handleGameOver();
        }
    }

    // ── Sky Phase: smooth cross-fade, no color flash ──────────────────
    updateSkyPhase() {
        if (this.skyTransitioning) return;

        if (this.score >= 100 && this.skyPhase !== 'night') {
            // ── Transition: Dusk → Night ──
            this.skyPhase = 'night';
            this.skyTransitioning = true;

            // Fade OUT the dusk overlay
            this.tweens.add({
                targets: this.duskOverlay,
                fillAlpha: 0,
                duration: 3000,
                ease: 'Sine.easeInOut'
            });

            // Fade IN the night overlay
            this.tweens.add({
                targets: this.nightOverlay,
                fillAlpha: 0.55,
                duration: 3000,
                ease: 'Sine.easeInOut',
                onComplete: () => { this.skyTransitioning = false; }
            });

            // Fade in stars
            this.tweens.add({
                targets: this.starsGfx,
                alpha: 1,
                duration: 3000,
                ease: 'Sine.easeInOut'
            });

            // Darken background/clouds a bit more for night
            this.tweens.add({
                targets: [this.background, this.clouds],
                alpha: 0.6,
                duration: 3000,
                ease: 'Sine.easeInOut'
            });

        } else if (this.score >= 50 && this.score < 100 && this.skyPhase === 'day') {
            // ── Transition: Day → Dusk ──
            this.skyPhase = 'dusk';
            this.skyTransitioning = true;

            // Fade IN the dusk overlay smoothly from alpha 0
            this.tweens.add({
                targets: this.duskOverlay,
                fillAlpha: 0.30,
                duration: 3000,
                ease: 'Sine.easeInOut',
                onComplete: () => { this.skyTransitioning = false; }
            });

            // Slightly dim background for warmth
            this.tweens.add({
                targets: [this.background, this.clouds],
                alpha: 0.85,
                duration: 3000,
                ease: 'Sine.easeInOut'
            });
        }
    }

    collectCoin(frog, coin) {
        if (this.gameOver) return;
        coin.destroy();
        this.score += 3;
        PlayerData.addCoins(1); // +1 cumulative coin per pickup
        this.scoreText.setText('Score: ' + this.score);
        this.sound.play('coin', { volume: 0.4 });
    }

    collectPowerup(frog, pu) {
        if (this.gameOver) return;

        let type = pu.powerupType;
        pu.destroy();

        if (type === 'shield') {
            this.hasShield = true;
            this.updateStatusText();

            // Flash feedback
            this.cameras.main.flash(200, 0, 150, 255);
        }

        if (type === 'magnet') {
            this.hasMagnet = true;
            this.updateStatusText();

            // Flash feedback
            this.cameras.main.flash(200, 255, 140, 0);

            // Clear existing timer if any
            if (this.magnetTimer) this.magnetTimer.remove();

            this.magnetTimer = this.time.delayedCall(10000, () => {
                this.hasMagnet = false;
                this.updateStatusText();
            });
        }
    }

    updateStatusText() {
        let parts = [];
        if (this.hasShield) parts.push('🛡️ Shield');
        if (this.hasMagnet) parts.push('🧲 Magnet');
        this.statusText.setText(parts.join('  '));
    }

    handlePipeCollision(frog, pipe) {
        if (this.gameOver) return;

        if (this.hasShield) {
            // Consume shield, destroy the pipe pair that was hit
            this.hasShield = false;
            this.updateStatusText();

            // Find and destroy both pipes in the pair (same x origin)
            let hitX = Math.round(pipe.x);
            this.pipes.getChildren().slice().forEach(p => {
                if (Math.abs(Math.round(p.x) - hitX) < 60) {
                    p.destroy();
                }
            });

            // Visual shake on the frog in-place (no velocity change)
            let origX = frog.x;
            this.tweens.add({
                targets: frog,
                x: { from: origX - 12, to: origX + 12 },
                duration: 60,
                yoyo: true,
                repeat: 3,
                ease: 'Sine.easeInOut',
                onComplete: () => { frog.x = origX; }
            });

            // Flash + camera shake as feedback
            this.cameras.main.flash(250, 0, 180, 255);
            this.cameras.main.shake(300, 0.015);
            return;
        }

        this.handleGameOver();
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