class Pipe extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, textureKey, flip = false) {
        
        super(scene, x, y, textureKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.allowGravity = false;

        // Force pipe size so it's not gigantic, using a tall aspect ratio.
        this.setDisplaySize(120, 500);

        // Adjust hitbox to fit the visual pipe better
        this.body.setSize(this.width * 0.7, this.height * 0.95);

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