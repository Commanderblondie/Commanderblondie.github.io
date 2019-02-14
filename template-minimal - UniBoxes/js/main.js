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
	//Load all images
        game.stage.backgroundColor = '#333333';
        game.load.image( 'orangeBox', 'assets/orangeBox.png' );
	game.load.image( 'blueBox', 'assets/blueBox.png' );
	game.load.image( 'squarePanel', 'assets/squarePanel.png' );
	game.load.image( 'button', 'assets/button.png' );
	game.load.image( 'spike', 'assets/spike.png' );
	game.load.image( 'Opendoor', 'assets/door.png' );
	game.load.image( 'Sidedoor', 'assets/doorSide.png' );
	game.physics.startSystem(Phaser.Physics.ARCADE);
	//Load all sounds
	game.load.audio('BGM', 'assets/BGM.mp3');
	game.load.audio('blueJumpSound', 'assets/blueJump.mp3');
	game.load.audio('orangeJumpSound', 'assets/orangeJump.mp3');
	game.load.audio('bPress', 'assets/buttonPress.mp3');
	game.physics.arcade.gravity.y = 100;
    }
	//Player
    var orangePlayer;
    var bluePlayer;

	//Objects
    var wall;
    var D;
    var realD;
    var movingPlatform;
    var movPlatY;
    var text;

	//Sounds
    var BGM;
    var bjump;
    var ojump;
    var buttPress;

	//Bools
    var movingDown = false;
    var activeMov = false;
    var firstStage = true;

	//Movement
    var wKey;
    var aKey;

    var dKey;
    var sKey;
    var rKey;
    var orangeOnBlue;
    var blueOnOrange;

    //var cursors;
    var blueJumps = 0;
    var blueJumping = false;

	//Groups
    var platforms;
    var wallButton;
    var spikeButton;
    var spikes;
    var doors;
    var plat;
    var endButt;




    function create() {
	//Player
        orangePlayer = game.add.sprite(50, game.world.centerY, 'orangeBox');
	orangePlayer.scale.setTo(0.5, 0.5);
	bluePlayer = game.add.sprite(100, game.world.centerY, 'blueBox');
	bluePlayer.scale.setTo(0.5, 0.5);
	//Set up orange player
	game.physics.enable(orangePlayer, Phaser.Physics.ARCADE);
	orangePlayer.body.gravity.y = 1000;
	orangePlayer.body.bounce.y = 0.2;
	orangePlayer.body.collideWorldBounds=true;
	//Set up blue player
	game.physics.enable(bluePlayer, Phaser.Physics.ARCADE);
	bluePlayer.body.gravity.y = 1000;
	bluePlayer.body.bounce.y = 0.2;
	bluePlayer.body.collideWorldBounds=true;
	
	game.world.setBounds(0, 0, 1600, 800);
	
	//Sounds
	bjump = game.add.audio('blueJumpSound');
	bjump.volume = 0.25;
	ojump = game.add.audio('orangeJumpSound');
	buttPress = game.add.audio('bPress');
	BGM = game.add.audio('BGM');
	BGM.volume = 0.35;
	BGM.loopFull();

	//Groups
	platforms = game.add.group();
	wallButton = game.add.group(); //To be pressed
	spikeButton = game.add.group(); //To be pressed
	spikes = game.add.group(); //Collision = death
	doors = game.add.group(); //Collision = next room

	plat = game.add.group(); //For room two, to move it up and down
	endButt = game.add.group(); //To be pressed
	
//Room 1

	//Ground
	var ground = platforms.create(0, game.world.centerY+150, 'squarePanel');
	ground.scale.setTo(16,1);
	game.physics.arcade.enable(ground);
	ground.body.immovable = true;
	ground.body.allowGravity = false;

	//Explanatory text
	text = game.add.text(game.world.centerX-400, game.world.centerY-300, "WASD and arrow keys to move.\nR key resets position.", {
        font: "40px Arial",
        fill: "#ff0044",
        align: "center"
    }); // From the Update Text example of Phaser
	text.anchor.setTo(0.5, 0.5);

	
	//Door Wall
	D = platforms.create(790, game.world.centerY-450, 'squarePanel');
	D.scale.setTo(1,14);
	game.physics.arcade.enable(D);
	D.body.immovable = true;
	D.body.allowGravity = false;	

	//Door
	realD = doors.create(780, game.world.centerY+50, 'Sidedoor');
	realD.scale.setTo(0.5,0.5);
	game.physics.arcade.enable(realD);
	realD.body.immovable = true;
	realD.body.allowGravity = false;


	//Block for wallButton
	var wallButtonBlock = platforms.create(230, game.world.centerY-120, 'squarePanel');
	game.physics.arcade.enable(wallButtonBlock);
	wallButtonBlock.body.immovable = true;
	wallButtonBlock.body.allowGravity = false;
	
	//Create button to lower wall 
	var wButton = wallButton.create(248, game.world.centerY-71, 'button')
	game.physics.arcade.enable(wButton);
	wButton.body.immovable = true;
	wButton.body.allowGravity = false;
	
	//Create wall
	wall = platforms.create(315, game.world.centerY-450, 'squarePanel');
	wall.scale.setTo(1,14);
	game.physics.arcade.enable(wall);
	wall.body.immovable = true;
	wall.body.allowGravity = false;
	
	
           
	//Block for spikeButton
	var spikeButtonBlock = platforms.create(675, 521, 'squarePanel');
	game.physics.arcade.enable(spikeButtonBlock);
	spikeButtonBlock.body.immovable = true;
	spikeButtonBlock.body.allowGravity = false;

	//Create button to remove spikes
	var sButton = spikeButton.create(692, 507, 'button')
	game.physics.arcade.enable(sButton);
	sButton.body.immovable = true;
	sButton.body.allowGravity = false;

	//Add all four spikes
	var s1 = spikes.create(500, 532, 'spike')
	game.physics.arcade.enable(s1);
	s1.body.immovable = true;
	s1.body.allowGravity = false;

	var s2 = spikes.create(530, 532, 'spike')
	game.physics.arcade.enable(s2);
	s2.body.immovable = true;
	s2.body.allowGravity = false;

	var s3 = spikes.create(560, 532, 'spike')
	game.physics.arcade.enable(s3);
	s3.body.immovable = true;
	s3.body.allowGravity = false;

	var s4 = spikes.create(590, 532, 'spike')
	game.physics.arcade.enable(s4);
	s4.body.immovable = true;
	s4.body.allowGravity = false;


//Room 2

	//Ground2
	var ground2 = platforms.create(800, game.world.centerY+150, 'squarePanel');
	ground2.scale.setTo(16,1);
	game.physics.arcade.enable(ground2);
	ground2.body.immovable = true;
	ground2.body.allowGravity = false;
	
	
	//Block for platformButton
	var platformButtonBlock = platforms.create(810, game.world.centerY-120, 'squarePanel');
	game.physics.arcade.enable(platformButtonBlock);
	platformButtonBlock.body.immovable = true;
	platformButtonBlock .body.allowGravity = false;
	
	//Create button to move platform
	var pButton = plat.create(827, game.world.centerY-133, 'button')
	game.physics.arcade.enable(pButton);
	pButton.body.immovable = true;
	pButton.body.allowGravity = false;

	//Platform for platformButton
	movingPlatform = platforms.create(900, 277, 'squarePanel');
	movingPlatform.scale.setTo(2,0.5);
	game.physics.arcade.enable(movingPlatform);
	movingPlatform.body.immovable = true;
	movingPlatform.body.allowGravity = false;

	//Block for elevatorButton
	var elevatorButtonBlock = platforms.create(1350, game.world.centerY-200, 'squarePanel');
	game.physics.arcade.enable(elevatorButtonBlock);
	elevatorButtonBlock.body.immovable = true;
	elevatorButtonBlock .body.allowGravity = false;

	//Create button for endgame
	var endButton = endButt.create(1367, game.world.centerY-214, 'button')
	game.physics.arcade.enable(endButton);
	endButton.body.immovable = true;
	endButton.body.allowGravity = false;

	//Add in buttons
	wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    
	aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    
	dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);

	//Reset button
	rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
 
	
	//Add in movement keys
	this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
	Phaser.Keyboard.DOWN
    ]);
    }
    
    function update() {
	//Set collision variables
	var orangeHitPlatform = game.physics.arcade.collide(orangePlayer, platforms);
	var blueHitPlatform = game.physics.arcade.collide(bluePlayer, platforms);
	var boxCollision = game.physics.arcade.collide(bluePlayer, orangePlayer);

//Room 1
	//If wallButton is hit by either square
	if(game.physics.arcade.collide(bluePlayer, wallButton) || game.physics.arcade.collide(orangePlayer, wallButton))
	{
		//Push button in and active wall
		wallButton.y -= 15;
		wall.body.allowGravity = true;
		buttPress.play();
	}

	//If spikeButton is hit, remove spikes
	if(game.physics.arcade.collide(bluePlayer, spikeButton) || game.physics.arcade.collide(orangePlayer, spikeButton))
	{
		spikeButton.y += 15;
		spikes.destroy();
		buttPress.play();
	}

	//If door is hit by both
	if(game.physics.arcade.collide(bluePlayer, realD) & game.physics.arcade.collide(orangePlayer, realD))
	{
		//Destroy wall & door
		D.destroy();
		realD.destroy(); 

		//Open door
		var openD = game.add.sprite(780, game.world.centerY+50, 'Opendoor');
		openD.scale.setTo(0.5,0.5);
		game.physics.arcade.enable(openD);
		openD.body.immovable = true;
		openD.body.allowGravity = false;

		//Move camera to next room
		game.camera.x += 800;

		//Set room to second and reset squares
		firstStage = false;
		ResetCharacters();
	}

	if(game.physics.arcade.collide(bluePlayer, spikes))
	{
		ResetBlue(); //Resets blue if spikes are hit
	}
	if(game.physics.arcade.collide(orangePlayer, spikes))
	{
		ResetOrange(); //Resets orange if spikes are hit
	}

//Room 2
	if(game.physics.arcade.collide(bluePlayer, plat) || game.physics.arcade.collide(orangePlayer, plat))
	{
		//Start moving the platform
		plat.y += 15;
		activeMov = true;//if true, platform will move
		buttPress.play();
	}
	if(activeMov == true){
		platformMove();//Continually move between y points
	}

	if(game.physics.arcade.collide(bluePlayer, endButt) || game.physics.arcade.collide(orangePlayer, endButt))
	{
		//If end game button is pressed, end the game!
		buttPress.play();
		endButt.y += 15;
		text = game.add.text(game.world.centerX+200, game.world.centerY-300, "You win!", {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    }); // From the Update Text example of Phaser
	text.anchor.setTo(0.5, 0.5);
		
	}

	if(boxCollision)//If the boxes touch
	{
		if(bluePlayer.body.y > orangePlayer.body.y && bluePlayer.body.touching.down) //Blue on top
		{
			//Set up for movement
			orangeOnBlue = true;
		}
		else if(orangePlayer.body.y > bluePlayer.body.y && orangePlayer.body.touching.down) //Orange on top
		{
			//Set up for movement
			blueOnOrange = true;
		}
	}
	else //If the boxes arent touching
	{
		orangeOnBlue = false;
		blueOnOrange = false;
	}

	//Movement for orange
	//if w key is down and jump is possible
	if(wKey.isDown && orangeHitPlatform && orangePlayer.body.touching.down || wKey.isDown && boxCollision && orangePlayer.body.touching.down) //if W is down and orange is on the ground or on blue
	{
		//Jump sound and jump
		ojump.play();
		orangePlayer.body.velocity.y -= 400;

	}
	if(sKey.isDown)
	{
		//Stop moving for precision
		orangePlayer.body.velocity.x = 0;
	}
	if (aKey.isDown) //Move left
	{
      
		//Move left
		orangePlayer.body.velocity.x -= 10;
		if(blueOnOrange)
		{
			//if blue is on orange, move blue too
			bluePlayer.body.velocity.x -= 10;
		}
	}
    
	else if (dKey.isDown)
    //Move right
	{
        
		//Move right
		orangePlayer.body.velocity.x += 10; 
		if(blueOnOrange)
		{
			//if blue is on orange, move blue too
			bluePlayer.body.velocity.x += 10;
		}
	}
	
	//Movement for blue
	//If blue can jump and is not, set variables
	if(blueHitPlatform && bluePlayer.body.touching.down|| boxCollision && bluePlayer.body.touching.down) //if blue is on the ground or on orange
	{
		blueJumping = false;
		blueJumps = 2;
	}
	//If blue has a jump left, jump
	if(this.input.keyboard.downDuration(Phaser.Keyboard.UP, 5) && blueJumps > 0)
	{
		//Jump sound and jump, decrement amount of jumps
		bjump.play();
		bluePlayer.body.velocity.y -= 450;
		blueJumps--;
	}

	if(this.input.keyboard.isDown(Phaser.Keyboard.DOWN))
	{
		//Stop moving for precision
		bluePlayer.body.velocity.x = 0;
	}
	if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	{
     
		//Limit blue x velocity for uniqueness
		if(bluePlayer.body.velocity.x > -100)
		{
			bluePlayer.body.velocity.x -= 4;
		}  
		if(orangeOnBlue)
		{
			//If orange is on blue, move orange too
			orangePlayer.body.velocity.x -= 6;
		} 
	}
    
	else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    
	{
       
		//Limit blue x velocity for uniqueness
		if(bluePlayer.body.velocity.x < 100)
		{
			bluePlayer.body.velocity.x += 4;
		}
		if(orangeOnBlue)
		{
			//If orange is on blue, move orange too
			orangePlayer.body.velocity.x += 6;
		} 
	}
	


	if(rKey.isDown)
	{
		//Reset blue and orange
		ResetCharacters();
	}
    }
  function platformMove(){   
	//If platform is low enough, move up
	if(movingPlatform.y >= 500){
		movingDown = false;
	}
	//else move down
	else if (movingPlatform.y <= 300){
		movingDown = true;
	}
	//if moving up, set velocity to an upward direction
	if(movingDown == false){
		movingPlatform.body.velocity.y = -80;
	}
	//Else change velocity to upward
	else{
		movingPlatform.body.velocity.y = 80;
	}
	
}
  function ResetCharacters(){
	//Reset both squares
	ResetBlue();
	ResetOrange();	
	
}
  function ResetBlue(){
	//If in the first stage, reset to first stage reset point
	if(firstStage){
		bluePlayer.body.x = 50;
	}
	else{
		bluePlayer.body.x = 850;
	}
	//Reset velocity to stop odd behavior
	bluePlayer.body.y = game.world.centerY;
	bluePlayer.body.velocity.y = 0;
	bluePlayer.body.velocity.x = 0;
}
   function ResetOrange(){
	//If in the first stage, reset to first stage reset point
	if(firstStage){
		orangePlayer.body.x = 100;
	}
	else{
		orangePlayer.body.x = 900;
	}
	//Reset velocity to stop odd behavior
	orangePlayer.body.y = game.world.centerY;
	orangePlayer.body.velocity.y = 0;
	orangePlayer.body.velocity.x = 0;
}
};	
