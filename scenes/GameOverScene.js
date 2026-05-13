class GameOverScene extends Phaser.Scene {

    constructor() {
        super('GameOverScene');
    }

    create(data) {
        // ── Background ──────────────────────────────────────────
        let bg = this.add.image(240, 320, 'background');
        bg.setDisplaySize(484, 644); // Slight overscale to prevent edge lines

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
        scoreBg.fillStyle(0x000000, 0.7);
        scoreBg.fillRoundedRect(120, 140, 240, 70, 15);
        scoreBg.lineStyle(2, 0xfacc15, 0.8);
        scoreBg.strokeRoundedRect(120, 140, 240, 70, 15);

        this.add.text(240, 160, 'YOUR SCORE', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(240, 185, `${data.score}`, {
            fontSize: '36px',
            color: '#facc15',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // ── Leaderboard panel ─────────────────────────────────────
        let scores = Leaderboard.getScores();

        let panel = this.add.graphics();
        panel.fillStyle(0x0a1a0a, 0.85);
        panel.fillRoundedRect(75, 230, 330, 260, 15);
        panel.lineStyle(2, 0x16a34a, 1);
        panel.strokeRoundedRect(75, 230, 330, 260, 15);

        this.add.text(240, 255, 'TOP SCORES', {
            fontSize: '24px',
            color: '#facc15',
            fontStyle: 'bold',
            letterSpacing: 2
        }).setOrigin(0.5);

        // Divider
        let div = this.add.graphics();
        div.lineStyle(2, 0xfacc15, 0.3);
        div.lineBetween(100, 275, 380, 275);

        let yOffset = 285;
        if (scores.length === 0) {
            this.add.text(240, 360, 'No scores yet!', {
                fontSize: '22px', color: '#aaaaaa'
            }).setOrigin(0.5);
        } else {
            scores.slice(0, 5).forEach((score, index) => {
                let rankColor = index === 0 ? '#facc15' : '#ffffff';
                this.add.text(120, yOffset, `${index + 1}.`, { fontSize: '24px', color: rankColor, fontStyle: 'bold' });
                this.add.text(360, yOffset, `${score}`, { fontSize: '24px', color: rankColor, fontStyle: 'bold' }).setOrigin(1, 0);
                yOffset += 40;
            });
        }

        // ── RESTART button ────────────────────────────────────────
        this._drawBtn(240, 560, 260, 60, 0x22c55e, 0x15803d, 'RESTART', () => {
            this.scene.start('GameScene');
        });
    }

    _drawBtn(cx, cy, bw, bh, color, shadow, label, callback) {
        let btnShadow = this.add.graphics();
        btnShadow.fillStyle(shadow, 1);
        btnShadow.fillRoundedRect(cx - bw/2, cy - bh/2 + 6, bw, bh, 12);

        let btnFace = this.add.graphics();
        btnFace.fillStyle(color, 1);
        btnFace.fillRoundedRect(cx - bw/2, cy - bh/2, bw, bh, 12);
        
        btnFace.fillStyle(0xffffff, 0.2);
        btnFace.fillRoundedRect(cx - bw/2 + 5, cy - bh/2 + 5, bw - 10, bh/2 - 5, { tl: 10, tr: 10, bl: 0, br: 0 });

        let text = this.add.text(cx, cy, label, {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
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