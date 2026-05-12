class Frog extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {

        super(scene, x, y, 'frog');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Force a sensible physical size regardless of the generated image size
        this.setDisplaySize(85, 85);

        this.setCollideWorldBounds(true);

        // Tighter hitbox for a more forgiving feel (50% of the image)
        this.body.setSize(this.width * 0.5, this.height * 0.5);

    }

    jump() {
        // Increased jump velocity for a snappier feel
        this.setVelocityY(-400);
    }

    update() {
        // Tilt up and down based on velocity
        this.rotation = Phaser.Math.Clamp(
            this.body.velocity.y * 0.0015,
            -0.5,
            0.5
        );
    }
}