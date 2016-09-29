
function State() {
	// this.game	: Phaser.Game;
	// this.load	: Phaser.Loader;
	// this.state	: Phaser.StateManager;
	// this.input	: Phaser.Input;
	// this.camera	: Phaser.Camera
	// this.add		: Phaser.GameObjectFactory;
	// this.physics	: Phaser.Physics;
	// this.world	: Phaser.World
	// this.rnd		: Phaser.RandomDataGenerator;
}

State.prototype = Object.create(Phaser.State.prototype);
State.prototype.constructor = State;