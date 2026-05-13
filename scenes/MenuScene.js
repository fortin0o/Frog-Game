class MenuScene extends Phaser.Scene {

    constructor() {
        super('MenuScene');
    }

    create() {
        const W = 480;

        // ── Background ──────────────────────────────────────────
        this.add.image(240, 360, 'background');

        // ── Title "FROG JUMP" ────────────────────────────────────
        let title = this.add.image(240, 80, 'title');
        title.setScale(0.6); // Adjust scale as needed based on image size

        // ── TOP SCORES panel ─────────────────────────────────────
        let panel = this.add.graphics();
        panel.fillStyle(0x0a1a0a, 0.85);
        panel.fillRoundedRect(100, 150, 280, 220, 15);
        panel.lineStyle(2, 0x16a34a, 1);
        panel.strokeRoundedRect(100, 150, 280, 220, 15);

        this.add.text(240, 175, 'TOP SCORES', {
            fontSize: '24px',
            color: '#facc15',
            fontStyle: 'bold',
            letterSpacing: 2
        }).setOrigin(0.5);

        // Divider
        let div = this.add.graphics();
        div.lineStyle(2, 0xfacc15, 0.3);
        div.lineBetween(120, 200, 360, 200);

        let scores = Leaderboard.getScores();
        let yOff = 215;
        for (let i = 0; i < 4; i++) {
            let rankColor = i === 0 ? '#facc15' : '#ffffff';
            let scoreVal = scores[i] !== undefined ? scores[i] : '---';
            this.add.text(140, yOff, `${i + 1}.`, {
                fontSize: '24px', color: rankColor, fontStyle: 'bold'
            });
            this.add.text(340, yOff, `${scoreVal}`, {
                fontSize: '24px', color: rankColor, fontStyle: 'bold'
            }).setOrigin(1, 0);
            yOff += 36;
        }

        // ── Big "JUMP" text ───────────────────────────────────────
        this.add.text(240, 420, 'JUMP', {
            fontSize: '84px',
            color: '#f97316',
            fontStyle: 'bold',
            stroke: '#431407',
            strokeThickness: 10,
            shadow: { offsetX: 0, offsetY: 8, color: '#000000', blur: 0, fill: true }
        }).setOrigin(0.5);

        // ── START button ─────────────────────────────────────────
        this._drawBtn(240, 510, 280, 60, 0x22c55e, 0x15803d, 'START', () => {
            this.scene.start('GameScene');
        });

        // ── LEADERBOARD button ────────────────────────────────────
        this._drawBtn(240, 585, 280, 52, 0xd97706, 0x92400e, 'LEADERBOARD', () => {
            // Leaderboard action
        });
    }

    _drawBtn(cx, cy, bw, bh, color, shadow, label, callback) {
        let btnShadow = this.add.graphics();
        btnShadow.fillStyle(shadow, 1);
        btnShadow.fillRoundedRect(cx - bw/2, cy - bh/2 + 6, bw, bh, 12);

        let btnFace = this.add.graphics();
        btnFace.fillStyle(color, 1);
        btnFace.fillRoundedRect(cx - bw/2, cy - bh/2, bw, bh, 12);
        
        // Shine
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