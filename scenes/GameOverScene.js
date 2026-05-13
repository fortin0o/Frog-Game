class GameOverScene extends Phaser.Scene {

    constructor() {
        super('GameOverScene');
    }

    create(data) {
        // ── Background ──────────────────────────────────────────
        this.add.image(240, 360, 'background');

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
        scoreBg.fillRoundedRect(120, 150, 240, 80, 15);
        scoreBg.lineStyle(2, 0xfacc15, 0.8);
        scoreBg.strokeRoundedRect(120, 150, 240, 80, 15);

        this.add.text(240, 175, 'YOUR SCORE', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(240, 205, `${data.score}`, {
            fontSize: '42px',
            color: '#facc15',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // ── Leaderboard panel ─────────────────────────────────────
        let scores = Leaderboard.getScores();

        let panel = this.add.graphics();
        panel.fillStyle(0x0a1a0a, 0.85);
        panel.fillRoundedRect(75, 260, 330, 300, 15);
        panel.lineStyle(2, 0x16a34a, 1);
        panel.strokeRoundedRect(75, 260, 330, 300, 15);

        this.add.text(240, 290, 'TOP SCORES', {
            fontSize: '26px',
            color: '#facc15',
            fontStyle: 'bold',
            letterSpacing: 2
        }).setOrigin(0.5);

        // Divider
        let div = this.add.graphics();
        div.lineStyle(2, 0xfacc15, 0.3);
        div.lineBetween(100, 315, 380, 315);

        let yOffset = 330;
        if (scores.length === 0) {
            this.add.text(240, 420, 'No scores yet!', {
                fontSize: '22px', color: '#aaaaaa'
            }).setOrigin(0.5);
        } else {
            scores.slice(0, 5).forEach((score, index) => {
                let rankColor = index === 0 ? '#facc15' : '#ffffff';
                this.add.text(120, yOffset, `${index + 1}.`, { fontSize: '26px', color: rankColor, fontStyle: 'bold' });
                this.add.text(360, yOffset, `${score}`, { fontSize: '26px', color: rankColor, fontStyle: 'bold' }).setOrigin(1, 0);
                yOffset += 45;
            });
        }

        // ── RESTART button ────────────────────────────────────────
        this._drawBtn(240, 630, 260, 64, 0x22c55e, 0x15803d, 'RESTART', () => {
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