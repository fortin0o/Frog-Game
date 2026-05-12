class Pipe extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, flip = false) {
        
        super(scene, x, y, 'pipe');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.allowGravity = false;

        // Force pipe size so it's not gigantic if AI made it large
        this.setDisplaySize(70, 400);

        // Tighten the hitbox slightly
        this.body.setSize(this.width * 0.8, this.height * 0.95);

        if (flip) {
            this.setFlipY(true);
        }

        this.setVelocityX(-200);

        this.setImmovable(true);

        this.passed = false;
    }

    update() {
        if (this.x < -100) {
            this.destroy();
        }
    }
}