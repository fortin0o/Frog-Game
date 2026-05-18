class MenuScene extends Phaser.Scene {

    constructor() {
        super('MenuScene');
    }

    create() {
        const W = 485;
        const H = 640;

        // ── Background ──────────────────────────────────────────
        // Overscan to ensure no black lines appear at the edges
        this.add.image(240, 320, 'background').setDisplaySize(485, 640);

        // Play bg music if it's not already playing
        let bgMusic = this.sound.get('bgmusic');
        if (!bgMusic) {
            bgMusic = this.sound.add('bgmusic', { loop: true, volume: 1 });
        }
        if (!bgMusic.isPlaying) {
            bgMusic.play();
        }

        // ── Title "FROG JUMP?" ───────────────────────────────────
        let title = this.add.image(240, 130, 'title');
        title.setScale(0.3); // Slightly larger to match presence

        // ── TOP SCORES panel (LEADERBOARD) ───────────────────────
        let panel = this.add.graphics();
        panel.fillStyle(0x0a1a0a, 0.75); // Slightly more transparent
        panel.fillRoundedRect(90, 260, 300, 230, 15);
        panel.lineStyle(2, 0x22c55e, 1); // Brighter green border
        panel.strokeRoundedRect(90, 260, 300, 230, 15);

        this.add.text(240, 285, 'TOP SCORES', {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#facc15',
            fontStyle: 'bold',
            letterSpacing: 2
        }).setOrigin(0.5);

        // Divider
        let div = this.add.graphics();
        div.lineStyle(2, 0xfacc15, 0.3);
        div.lineBetween(110, 310, 370, 310);

        let scores = Leaderboard.getScores();
        let yOff = 330;
        for (let i = 0; i < 4; i++) {
            let rankColor = i === 0 ? '#facc15' : '#ffffff';
            let scoreVal = scores[i] !== undefined ? scores[i] : '---';
            this.add.text(130, yOff, `${i + 1}.`, {
                fontFamily: 'monospace', fontSize: '22px', color: rankColor, fontStyle: 'bold'
            });
            this.add.text(350, yOff, `${scoreVal}`, {
                fontFamily: 'monospace', fontSize: '22px', color: rankColor, fontStyle: 'bold'
            }).setOrigin(1, 0);
            yOff += 38;
        }

        // ── Coin display ─────────────────────────────────────────────
        this.add.text(240, 235, '🪙  ' + PlayerData.getCoins() + ' coins', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#facc15',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // ── Buttons ──────────────────────────────────────────────────
        // Start Button
        this._drawBtn(240, 540, 280, 50, 0x4ade80, 0x16a34a, 'START', () => {
            this.scene.start('GameScene');
        });

        // Shop Button
        this._drawBtn(240, 600, 280, 46, 0xfacc15, 0xb45309, '🛍️ SHOP', () => {
            this.scene.start('ShopScene');
        });
    }

    _drawBtn(cx, cy, bw, bh, color, shadow, label, callback) {
        let btnShadow = this.add.graphics();
        btnShadow.fillStyle(shadow, 1);
        btnShadow.fillRoundedRect(cx - bw / 2, cy - bh / 2 + 8, bw, bh, 10); // Shadow offset

        let btnFace = this.add.graphics();
        btnFace.fillStyle(color, 1);
        btnFace.fillRoundedRect(cx - bw / 2, cy - bh / 2, bw, bh, 10);

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