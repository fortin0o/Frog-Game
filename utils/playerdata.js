class PlayerData {

    // ── Skins catalogue ──────────────────────────────────────────────
    static get SKINS() {
        return [
            { id: 'default', name: 'Default',   price: 0,   tint: null,       icon: '🐸' },
            { id: 'golden',  name: 'Golden',    price: 30,  tint: 0xFFD700,   icon: '✨' },
            { id: 'neon',    name: 'Neon',      price: 60,  tint: 0x00FFEE,   icon: '💎' },
            { id: 'crimson', name: 'Crimson',   price: 100, tint: 0xFF4444,   icon: '🔥' },
            { id: 'shadow',  name: 'Shadow',    price: 150, tint: 0x6622CC,   icon: '🌑' },
        ];
    }

    // ── Coins ────────────────────────────────────────────────────────
    static getCoins() {
        return parseInt(localStorage.getItem('frogCoins') || '0', 10);
    }

    static addCoins(amount) {
        localStorage.setItem('frogCoins', this.getCoins() + amount);
    }

    static spendCoins(amount) {
        let current = this.getCoins();
        if (current < amount) return false;
        localStorage.setItem('frogCoins', current - amount);
        return true;
    }

    // ── Owned skins ──────────────────────────────────────────────────
    static getOwnedSkins() {
        return JSON.parse(localStorage.getItem('frogOwnedSkins') || '["default"]');
    }

    static ownSkin(id) {
        let owned = this.getOwnedSkins();
        if (!owned.includes(id)) {
            owned.push(id);
            localStorage.setItem('frogOwnedSkins', JSON.stringify(owned));
        }
    }

    static isSkinOwned(id) {
        return this.getOwnedSkins().includes(id);
    }

    // ── Active skin ──────────────────────────────────────────────────
    static getActiveSkin() {
        return localStorage.getItem('frogActiveSkin') || 'default';
    }

    static setActiveSkin(id) {
        localStorage.setItem('frogActiveSkin', id);
    }

    static getActiveTint() {
        let skin = this.SKINS.find(s => s.id === this.getActiveSkin());
        return skin ? skin.tint : null;
    }
}
