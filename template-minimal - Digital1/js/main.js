"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        game.stage.backgroundColor = '#5555ff';
        game.load.image( 'stickman', 'assets/stickman.png' );
	game.load.image( 'longGroundBlock', 'assets/longGround.png' );
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = 50;
    }
	//Player
    var player;
    var cursors;
	//Groups
    var platforms;
    var textGroup;
	//Timer
    var timer = 0;

    var rKey;

    function create() {
	//Player
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'stickman');
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.bounce.y = 0.2;
	
	player.body.gravity.y = 1200;
	cursors = game.input.keyboard.createCursorKeys();

	//Text
	var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Arrow Keys to move. R to Restart.\n   Survive!\n ", style );
        text.anchor.setTo( 0.5, 0.0 );
	game.world.bringToTop(text);




	//Ground group
	platforms = game.add.group();
	game.physics.arcade.enable(platforms);
	
	initializePlatforms();
	
	game.time.events.loop(500, spawnBlock, this);

	spawnBlock();

	rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    }
    
    function update() {

	var hitPlatform = game.physics.arcade.collide(player, platforms);

	if(rKey.isDown){
		RestartGame();
	}

	//TODO pass through platforms

	//Movement
	if(cursors.up.isDown && player.body.touching.down && hitPlatform)
	{
		
		player.body.velocity.y -= 550;

	}
	else if (cursors.down.isDown)
	{
		player.body.velocity.y += 50;
	}
	if (cursors.left.isDown)
	{
      
		player.x -= 8;    
	}
    
	else if (cursors.right.isDown)
    
	{
        
		player.x += 8; 
	}

    }

    function spawnBlock() {
	var Lvalue = Phaser.Math.random(0,250);
	var Mvalue = Phaser.Math.random(260,550);
	var Rvalue = Phaser.Math.random(560, 800);
	var LPlatform = platforms.create(Lvalue, 80, 'longGroundBlock');
	var MPlatform = platforms.create(Mvalue, 80, 'longGroundBlock');
	var RPlatform = platforms.create(Rvalue, 80, 'longGroundBlock');
	game.physics.arcade.enable(LPlatform);
	game.physics.arcade.enable(MPlatform);
	game.physics.arcade.enable(RPlatform);
        LPlatform.body.immovable = true;
	MPlatform.body.immovable = true;
	RPlatform.body.immovable = true;
}

    function RestartGame(){
	platforms.destroy();
	platforms = game.add.group();
	game.physics.arcade.enable(platforms);
	initializePlatforms();
	player.body.x = game.world.centerX;
	player.body.y = game.world.centerY;
	//game.state.start('Game');
}
    function initializePlatforms(){
	var initPlatforms = [];
	initPlatforms[0]  = platforms.create(game.world.centerX-50, game.world.centerY+50, 'longGroundBlock');
	initPlatforms[1] = platforms.create(game.world.centerX-180, game.world.centerY+150, 'longGroundBlock');
	initPlatforms[2] = platforms.create(game.world.centerX+110, game.world.centerY-70, 'longGroundBlock');
	initPlatforms[3] = platforms.create(game.world.centerX-290, game.world.centerY-150, 'longGroundBlock');
	initPlatforms[4] = platforms.create(game.world.centerX-350, game.world.centerY-40, 'longGroundBlock');
	initPlatforms[5] = platforms.create(game.world.centerX+290, game.world.centerY-150, 'longGroundBlock');
	initPlatforms[6] = platforms.create(game.world.centerX+240, game.world.centerY+230, 'longGroundBlock');
	initPlatforms[7] = platforms.create(game.world.centerX-65, game.world.centerY-200, 'longGroundBlock');
	var i;
	for(i = 0; i <= 7; i++)
	{
		game.physics.arcade.enable(initPlatforms[i]);
		initPlatforms[i].body.immovable = true;
	}
}
};
