class Frog extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {

        super(scene, x, y, 'frog_idle_1');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Force a sensible physical size
        this.setDisplaySize(85, 85);

        this.setCollideWorldBounds(true);

        this.body.setSize(this.width * 0.5, this.height * 0.5);
        
        this.play('idle');
    }

    jump() {
        this.scene.sound.play('jump', { volume: 0.3 });
        this.setVelocityY(-400);
        this.play('jump');
    }

    update() {
        // Exaggerated and smoothed rotation
        let targetRotation = Phaser.Math.Clamp(
            this.body.velocity.y * 0.0025,
            -0.8,
            0.8
        );
        this.rotation += (targetRotation - this.rotation) * 0.15;
        
        if (this.body.velocity.y > 50 && this.anims.currentAnim && this.anims.currentAnim.key !== 'idle') {
            this.play('idle');
        }
    }
}