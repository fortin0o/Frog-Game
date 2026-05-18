class GameOverScene extends Phaser.Scene {

    constructor() {
        super('GameOverScene');
    }

    create(data) {
        // ── Background ──────────────────────────────────────────
        this.add.image(240, 320, 'background').setDisplaySize(500, 660);

        // ── "GAME OVER" title ────────────────────────────────────
        this.add.text(240, 80, 'GAME  OVER', {
            fontSize: '64px',
            color: '#ef4444',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 10,
            shadow: { offsetX: 0, offsetY: 4, color: '#000000', blur: 0, fill: true }
        }).setOrigin(0.5);

        // ── Score display box ─────────────────────────────────────
        let scoreBg = this.add.graphics();
        scoreBg.fillStyle(0x0a1a0a, 0.75);
        scoreBg.fillRoundedRect(120, 140, 240, 70, 15);
        scoreBg.lineStyle(2, 0x22c55e, 1);
        scoreBg.strokeRoundedRect(120, 140, 240, 70, 15);

        this.add.text(240, 160, 'YOUR SCORE', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(240, 185, `${data.score}`, {
            fontFamily: 'monospace',
            fontSize: '36px',
            color: '#facc15',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // ── Leaderboard panel ─────────────────────────────────────
        let scores = Leaderboard.getScores();

        let panel = this.add.graphics();
        panel.fillStyle(0x0a1a0a, 0.75);
        panel.fillRoundedRect(75, 230, 330, 260, 15);
        panel.lineStyle(2, 0x22c55e, 1);
        panel.strokeRoundedRect(75, 230, 330, 260, 15);

        this.add.text(240, 255, 'TOP SCORES', {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#facc15',
            fontStyle: 'bold',
            letterSpacing: 2
        }).setOrigin(0.5);

        // Divider
        let div = this.add.graphics();
        div.lineStyle(2, 0xfacc15, 0.3);
        div.lineBetween(100, 275, 380, 275);

        let yOffset = 295;
        if (scores.length === 0) {
            this.add.text(240, 360, 'No scores yet!', {
                fontFamily: 'monospace', fontSize: '22px', color: '#aaaaaa'
            }).setOrigin(0.5);
        } else {
            scores.slice(0, 5).forEach((score, index) => {
                let rankColor = index === 0 ? '#facc15' : '#ffffff';
                this.add.text(120, yOffset, `${index + 1}.`, { fontFamily: 'monospace', fontSize: '24px', color: rankColor, fontStyle: 'bold' });
                this.add.text(360, yOffset, `${score}`, { fontFamily: 'monospace', fontSize: '24px', color: rankColor, fontStyle: 'bold' }).setOrigin(1, 0);
                yOffset += 40;
            });
        }

        // ── RESTART button ────────────────────────────────────────
        this._drawBtn(240, 530, 280, 50, 0x4ade80, 0x16a34a, 'RESTART', () => {
            this.scene.start('GameScene');
        });

        // ── HOME button ──────────────────────────────────────────
        this._drawBtn(240, 595, 280, 46, 0xfacc15, 0xb45309, '🏠 HOME', () => {
            this.scene.start('MenuScene');
        });
    }

    _drawBtn(cx, cy, bw, bh, color, shadow, label, callback) {
        let btnShadow = this.add.graphics();
        btnShadow.fillStyle(shadow, 1);
        btnShadow.fillRoundedRect(cx - bw/2, cy - bh/2 + 8, bw, bh, 10);

        let btnFace = this.add.graphics();
        btnFace.fillStyle(color, 1);
        btnFace.fillRoundedRect(cx - bw/2, cy - bh/2, bw, bh, 10);

        let text = this.add.text(cx, cy, label, {
            fontFamily: 'monospace',
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        let zone = this.add.zone(cx, cy, bw, bh + 6).setInteractive({ useHandCursor: true });
        
        zone.on('pointerdown', () => {
            btnFace.y = 4;
            text.y = cy + 4;
            this.time.delayedCall(100, callback);
        });
        
        zone.on('pointerup', () => {
            btnFace.y = 0;
            text.y = cy;
        });

        zone.on('pointerout', () => {
            btnFace.y = 0;
            text.y = cy;
        });
    }
}