class ShopScene extends Phaser.Scene {

    constructor() {
        super('ShopScene');
    }

    create() {
        const W = 480, H = 640;
        const CX = W / 2;

        // ── Background ───────────────────────────────────────────────
        this.add.image(CX, H / 2, 'background').setDisplaySize(W, H);

        // Dark panel overlay
        this.add.rectangle(CX, H / 2, W, H, 0x000000, 0.55);

        // ── Title ────────────────────────────────────────────────────
        this.add.text(CX, 42, '🛍️  SKIN SHOP', {
            fontFamily: 'monospace',
            fontSize: '30px',
            color: '#facc15',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // ── Coin display ─────────────────────────────────────────────
        this.coinText = this.add.text(CX, 82, '', {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.refreshCoinText();

        // ── Skin list ────────────────────────────────────────────────
        this.skinCards = [];
        const skins = PlayerData.SKINS;
        const startY = 150;
        const cardH = 78;
        const gap = 10;

        skins.forEach((skin, i) => {
            let y = startY + i * (cardH + gap);
            this.createSkinCard(CX, y, cardH, skin);
        });

        // ── Back button ──────────────────────────────────────────────
        this._drawBtn(CX, H - 45, 200, 46, 0x4ade80, 0x16a34a, '← BACK', () => {
            this.scene.start('MenuScene');
        });
    }

    refreshCoinText() {
        this.coinText.setText('🪙  Your Coins: ' + PlayerData.getCoins());
    }

    createSkinCard(cx, cy, cardH, skin) {
        const cardW = 400;
        const isOwned = PlayerData.isSkinOwned(skin.id);
        const isActive = PlayerData.getActiveSkin() === skin.id;
        const canAfford = PlayerData.getCoins() >= skin.price;

        // Card background
        let borderColor = isActive ? 0xfacc15 : (isOwned ? 0x22c55e : 0x555555);
        let gfx = this.add.graphics();
        gfx.fillStyle(0x0a1a0a, 0.8);
        gfx.fillRoundedRect(cx - cardW / 2, cy, cardW, cardH, 12);
        gfx.lineStyle(2, borderColor, 1);
        gfx.strokeRoundedRect(cx - cardW / 2, cy, cardW, cardH, 12);

        // Frog preview (colored circle to represent skin tint)
        let previewColor = skin.tint || 0x4ade80;
        let previewGfx = this.add.graphics();
        previewGfx.fillStyle(previewColor, 1);
        previewGfx.fillCircle(cx - cardW / 2 + 42, cy + cardH / 2, 24);
        previewGfx.lineStyle(2, 0xffffff, 0.4);
        previewGfx.strokeCircle(cx - cardW / 2 + 42, cy + cardH / 2, 24);

        // Skin icon on top
        this.add.text(cx - cardW / 2 + 42, cy + cardH / 2, skin.icon, {
            fontSize: '22px'
        }).setOrigin(0.5);

        // Skin name
        this.add.text(cx - cardW / 2 + 80, cy + 16, skin.name, {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        // Price or status tag
        let tagColor = isOwned ? '#22c55e' : (canAfford ? '#facc15' : '#ef4444');
        let tagText = isOwned ? 'OWNED' : `🪙 ${skin.price}`;
        this.add.text(cx - cardW / 2 + 80, cy + 42, tagText, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: tagColor
        });

        // Action button
        let btnLabel = isActive ? '✓ EQUIPPED' : (isOwned ? 'EQUIP' : 'BUY');
        let btnColor = isActive ? 0x555555 : (isOwned ? 0x4ade80 : (canAfford ? 0xfacc15 : 0x555555));
        let btnShadow = isActive ? 0x333333 : (isOwned ? 0x16a34a : (canAfford ? 0xb45309 : 0x333333));
        let btnX = cx + cardW / 2 - 65;
        let btnY = cy + cardH / 2 - 18;

        let btnGfx = this.add.graphics();
        btnGfx.fillStyle(btnShadow, 1);
        btnGfx.fillRoundedRect(btnX - 55, btnY + 6, 110, 36, 8);
        btnGfx.fillStyle(btnColor, 1);
        btnGfx.fillRoundedRect(btnX - 55, btnY, 110, 36, 8);

        let btnTxt = this.add.text(btnX, btnY + 18, btnLabel, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Only interactive if not already active
        if (!isActive) {
            let zone = this.add.zone(btnX, btnY + 18, 110, 36).setInteractive({ useHandCursor: true });
            zone.on('pointerdown', () => this.handleSkinAction(skin));
        }
    }

    handleSkinAction(skin) {
        const isOwned = PlayerData.isSkinOwned(skin.id);

        if (isOwned) {
            // Equip it
            PlayerData.setActiveSkin(skin.id);
            this.scene.restart(); // Redraw all cards
        } else {
            // Try to buy
            if (PlayerData.spendCoins(skin.price)) {
                PlayerData.ownSkin(skin.id);
                PlayerData.setActiveSkin(skin.id);
                this.scene.restart();
            } else {
                // Not enough coins — brief shake on coin text
                this.tweens.add({
                    targets: this.coinText,
                    x: { from: this.coinText.x - 8, to: this.coinText.x + 8 },
                    duration: 60,
                    yoyo: true,
                    repeat: 3,
                    ease: 'Sine.easeInOut',
                    onComplete: () => { this.coinText.x = 240; }
                });
            }
        }
    }

    _drawBtn(cx, cy, bw, bh, color, shadow, label, callback) {
        let btnShadow = this.add.graphics();
        btnShadow.fillStyle(shadow, 1);
        btnShadow.fillRoundedRect(cx - bw / 2, cy - bh / 2 + 6, bw, bh, 10);

        let btnFace = this.add.graphics();
        btnFace.fillStyle(color, 1);
        btnFace.fillRoundedRect(cx - bw / 2, cy - bh / 2, bw, bh, 10);

        let text = this.add.text(cx, cy, label, {
            fontFamily: 'monospace',
            fontSize: '22px',
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
        zone.on('pointerup', () => { btnFace.y = 0; text.y = cy; });
        zone.on('pointerout', () => { btnFace.y = 0; text.y = cy; });
    }
}
