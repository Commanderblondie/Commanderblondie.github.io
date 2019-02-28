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
	game.load.image( 'Uspike', 'assets/uSpike.png' );
	game.load.image( 'Opendoor', 'assets/door.png' );
	game.load.image( 'Sidedoor', 'assets/doorSide.png' );
	game.load.image( 'ladder', 'assets/ladder.png' );
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
    var elevator;
    var text;
    var eleButton;

	//Sounds
    var BGM;
    var bjump;
    var ojump;
    var buttPress;

	//Bools
    var movingDown = false;
    var activeMov = false;
    var eleMove = false;
    var firstStage = true;
    var secondStage = false;
    var thirdStage = false;

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
    var spikes2;
    var ladgrp;
    var doors;
    var plat;
    var endButt;
    var eleButt;
    var duoSpikeButt;
    var duoTopButt;



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
	
	game.world.setBounds(0, 0, 3200, 1600);
	
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
	spikes2 = game.add.group(); //Collision = death
	doors = game.add.group(); //Collision = next room
        ladgrp = game.add.group(); //Endgame

	plat = game.add.group(); //For room two, to move it up and down
	endButt = game.add.group(); //To be pressed
	eleButt = game.add.group(); //To be pressed
	duoSpikeButt = game.add.group(); //To be pressed
	duoTopButt = game.add.group(); //To be pressed
//Room 1

	//Ground
	var ground = platforms.create(0, 560, 'squarePanel');
	ground.scale.setTo(16,1);
	game.physics.arcade.enable(ground);
	ground.body.immovable = true;
	ground.body.allowGravity = false;

	//Explanatory text
	text = game.add.text(400, 100, "WASD and arrow keys to move.\nR key resets position.", {
        font: "40px Arial",
        fill: "#ff0044",
        align: "center"
    }); // From the Update Text example of Phaser
	text.anchor.setTo(0.5, 0.5);

	
	//Door Wall
	D = platforms.create(795, -30, 'squarePanel');
	D.scale.setTo(1,12);
	game.physics.arcade.enable(D);
	D.body.immovable = true;
	D.body.allowGravity = false;	

	//Door
	realD = doors.create(790, 460, 'Sidedoor');
	realD.scale.setTo(0.5,0.5);
	game.physics.arcade.enable(realD);
	realD.body.immovable = true;
	realD.body.allowGravity = false;


	//Block for wallButton
	var wallButtonBlock = platforms.create(200, 250, 'squarePanel');
	game.physics.arcade.enable(wallButtonBlock);
	wallButtonBlock.body.immovable = true;
	wallButtonBlock.body.allowGravity = false;
	
	//Create button to lower wall 
	var wButton = wallButton.create(220, 295, 'button')
	game.physics.arcade.enable(wButton);
	wButton.body.immovable = true;
	wButton.body.allowGravity = false;
	
	//Create wall
	wall = platforms.create(300, -30, 'squarePanel');
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
	var ground2 = platforms.create(800, 560, 'squarePanel');
	ground2.scale.setTo(16,1);
	game.physics.arcade.enable(ground2);
	ground2.body.immovable = true;
	ground2.body.allowGravity = false;
	
	
	//Block for platformButton
	var platformButtonBlock = platforms.create(830, 250, 'squarePanel');
	game.physics.arcade.enable(platformButtonBlock);
	platformButtonBlock.body.immovable = true;
	platformButtonBlock .body.allowGravity = false;
	
	//Create button to move platform
	var pButton = plat.create(850, 240, 'button')
	game.physics.arcade.enable(pButton);
	pButton.body.immovable = true;
	pButton.body.allowGravity = false;

	//Platform for platformButton
	movingPlatform = platforms.create(900, 277, 'squarePanel');
	movingPlatform.scale.setTo(2,0.5);
	game.physics.arcade.enable(movingPlatform);
	movingPlatform.body.immovable = true;
	movingPlatform.body.allowGravity = false;

	//Platform for getting to movingPlatform
	var p = platforms.create(1050, 500, 'squarePanel');
	p.scale.setTo(2,0.5);
	game.physics.arcade.enable(p);
	p.body.immovable = true;
	p.body.allowGravity = false;

	//Block for elevatorButton
	var elevatorButtonBlock = platforms.create(1350, 150, 'squarePanel');
	game.physics.arcade.enable(elevatorButtonBlock);
	elevatorButtonBlock.body.immovable = true;
	elevatorButtonBlock .body.allowGravity = false;

	//Create button for elevator
	var endButton = endButt.create(1367, 140, 'button')
	game.physics.arcade.enable(endButton);
	endButton.body.immovable = true;
	endButton.body.allowGravity = false;

	elevator = platforms.create(1500, 532, 'squarePanel');
	elevator.scale.setTo(2, 2);
	game.physics.arcade.enable(elevator);
	elevator.body.immovable = true;
	elevator.body.allowGravity = false;

//Room Three
	
	//Ground3
	var ground3 = platforms.create(2000, 560, 'squarePanel');
	ground3.scale.setTo(16,1);
	game.physics.arcade.enable(ground3);
	ground3.body.immovable = true;
	ground3.body.allowGravity = false;

	var s5 = spikes2.create(2500, 532, 'spike')
	game.physics.arcade.enable(s5);
	s5.body.immovable = true;
	s5.body.allowGravity = false;

	var s51 = spikes2.create(2470, 532, 'spike')
	game.physics.arcade.enable(s51);
	s51.body.immovable = true;
	s51.body.allowGravity = false;

	var s52 = spikes2.create(2440, 532, 'spike')
	game.physics.arcade.enable(s52);
	s52.body.immovable = true;
	s52.body.allowGravity = false;
	
	var s53 = spikes2.create(2410, 532, 'spike')
	game.physics.arcade.enable(s53);
	s53.body.immovable = true;
	s53.body.allowGravity = false;

	var s6 = spikes2.create(2530, 532, 'spike')
	game.physics.arcade.enable(s6);
	s6.body.immovable = true;
	s6.body.allowGravity = false;

	var s7 = spikes2.create(2560, 532, 'spike')
	game.physics.arcade.enable(s7);
	s7.body.immovable = true;
	s7.body.allowGravity = false;

	var s8 = spikes2.create(2590, 532, 'spike')
	game.physics.arcade.enable(s8);
	s8.body.immovable = true;
	s8.body.allowGravity = false;

	var s9 = spikes2.create(2620, 532, 'spike')
	game.physics.arcade.enable(s9);
	s9.body.immovable = true;
	s9.body.allowGravity = false;

	var spikeP = platforms.create(2550, 400, 'squarePanel');
	spikeP.scale.setTo(4, 0.5);
	game.physics.arcade.enable(spikeP);
	spikeP.body.immovable = true;
	spikeP.body.allowGravity = false;

	var us1 = spikes2.create(2450, 413, 'Uspike')
	spikeP.anchor.setTo(.5,.5);
	spikeP.scale.x *= -1;
	game.physics.arcade.enable(us1);
	us1.body.immovable = true;
	us1.body.allowGravity = false;

	var us2 = spikes2.create(2480, 413, 'Uspike')
	game.physics.arcade.enable(us2);
	us2.body.immovable = true;
	us2.body.allowGravity = false;

	var us3 = spikes2.create(2510, 413, 'Uspike')
	game.physics.arcade.enable(us3);
	us3.body.immovable = true;
	us3.body.allowGravity = false;

	var us4 = spikes2.create(2540, 413, 'Uspike')
	game.physics.arcade.enable(us4);
	us4.body.immovable = true;
	us4.body.allowGravity = false;

	var us5 = spikes2.create(2570, 413, 'Uspike')
	game.physics.arcade.enable(us5);
	us5.body.immovable = true;
	us5.body.allowGravity = false;

	var us6 = spikes2.create(2600, 413, 'Uspike')
	game.physics.arcade.enable(us6);
	us6.body.immovable = true;
	us6.body.allowGravity = false;

	duoSpikeButt = duoSpikeButt.create(2700, 550, 'button');
	game.physics.arcade.enable(duoSpikeButt);
	duoSpikeButt.body.immovable = true;
	duoSpikeButt.body.allowGravity = false;
	duoSpikeButt.tint = 0x000fff;

	duoTopButt = duoTopButt.create(2500, 375, 'button');
	game.physics.arcade.enable(duoTopButt);
	duoTopButt.body.immovable = true;
	duoTopButt.body.allowGravity = false;
	duoTopButt.tint = 0x000fff;

	var orangeMove = platforms.create(2710, 460, 'squarePanel');
	orangeMove.scale.setTo(1, 1);
	game.physics.arcade.enable(orangeMove);
	orangeMove.body.immovable = true;
	orangeMove.body.allowGravity = false;

//Inputs

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
	var blueElevator = game.physics.arcade.collide(bluePlayer, elevator);
	var orangeElevator = game.physics.arcade.collide(orangePlayer, elevator);

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
		//Destroy door
		//realD.destroy(); 

		D.x = 780;

		//Move camera to next room
		game.camera.x += 800;

		//Set room to second and reset squares
		firstStage = false;
		secondStage = true;
		ResetCharacters();
	}

	if(game.physics.arcade.collide(bluePlayer, spikes) || game.physics.arcade.collide(bluePlayer, spikes2))
	{
		ResetBlue(); //Resets blue if spikes are hit
	}
	if(game.physics.arcade.collide(orangePlayer, spikes) || game.physics.arcade.collide(orangePlayer, spikes2))
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
		//If end game button is pressed, spawn elevator
		buttPress.play();
		endButt.y += 15;

		//Create button for elevator2
		eleButton = eleButt.create(1550, 517, 'button')
		game.physics.arcade.enable(eleButton);
		eleButton.body.immovable = true;
		eleButton.body.allowGravity = false;
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
	
	if(game.physics.arcade.collide(bluePlayer, eleButt) || game.physics.arcade.collide(orangePlayer, eleButt))
	{
		eleButt.destroy();
		PlayersOnEle();
		secondStage = false;
		thirdStage = true;
		game.camera.x += 700;
		eleMove = true;
	}
	
	if(eleMove == true && elevator.x <= 1900)
	{
		elevator.body.velocity.x = 40;
	}
	else if(eleMove == true && elevator.x >= 1900)
	{
		elevator.body.velocity.x = 0;
		game.camera.x += 450;
		eleMove = false;
		
		var Nwall = platforms.create(1850, -30, 'squarePanel');
		Nwall.scale.setTo(1,14);
		game.physics.arcade.enable(Nwall);
		Nwall.body.immovable = true;
		Nwall.body.allowGravity = false;

		var Rwall = platforms.create(2750, -30, 'squarePanel');
		Rwall.scale.setTo(1,14);
		game.physics.arcade.enable(Rwall);
		Rwall.body.immovable = true;
		Rwall.body.allowGravity = false;
	}
//Room Three

	if(game.physics.arcade.collide(bluePlayer, duoTopButt) && game.physics.arcade.collide(orangePlayer, duoSpikeButt) || game.physics.arcade.collide(orangePlayer, duoTopButt) && game.physics.arcade.collide(bluePlayer, duoSpikeButt))
	{
		duoTopButt.y += 15;
		duoSpikeButt.y += 15;

		var endB = platforms.create(2300, 170, 'squarePanel');
		endB.scale.setTo(2, 2);
		game.physics.arcade.enable(endB);
		endB.body.immovable = true;
		endB.body.allowGravity = false;

		var endO = platforms.create(2000, 400, 'squarePanel');
		endO.scale.setTo(4, 0.5);
		game.physics.arcade.enable(endO);
		endO.body.immovable = true;
		endO.body.allowGravity = false;

		var end = platforms.create(2000, 350, 'squarePanel');
		end.scale.setTo(0.5, 0.5);
		game.physics.arcade.enable(end);
		end.body.immovable = true;
		end.body.allowGravity = false;

		var ladder = ladgrp.create(2000, -250, 'ladder');
		game.physics.arcade.enable(ladder);
		ladder.body.immovable = true;
		ladder.body.allowGravity = false;

	}

	if(game.physics.arcade.collide(bluePlayer, ladgrp))
	{
		orangePlayer.destroy();
	}
	else if(game.physics.arcade.collide(orangePlayer, ladgrp))
	{
		bluePlayer.destroy();
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
		movingPlatform.body.velocity.y = -60;
	}
	//Else change velocity to upward
	else{
		movingPlatform.body.velocity.y = 60;
	}
}

  function PlayersOnEle(){
	if(bluePlayer.body.x != 1510 || orangePlayer.body.x != 1540)
	{
		bluePlayer.body.velocity.y = 0;
		bluePlayer.body.velocity.x = 0;
		bluePlayer.body.x = 1510;
		bluePlayer.body.y = 400;

		orangePlayer.body.velocity.y = 0;
		orangePlayer.body.velocity.x = 0;
		orangePlayer.body.x = 1530;
		orangePlayer.body.y = 400;
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
		bluePlayer.body.y = 300;
	}
	else if(secondStage){
		bluePlayer.body.x = 900;
		bluePlayer.body.y = 350;
	}
	else if(thirdStage){
		bluePlayer.body.x = 1950;
		bluePlayer.body.y = 350;
	}
	//Reset velocity to stop odd behavior
	bluePlayer.body.velocity.y = 0;
	bluePlayer.body.velocity.x = 0;
}

   function ResetOrange(){
	//If in the first stage, reset to first stage reset point
	if(firstStage){
		orangePlayer.body.x = 100;
		orangePlayer.body.y = 300;
	}
	else if(secondStage){
		orangePlayer.body.x = 950;
		orangePlayer.body.y = 350;
	}
	else if(thirdStage){
		orangePlayer.body.x = 2000;
		orangePlayer.body.y = 350;
	}
	//Reset velocity to stop odd behavior
	orangePlayer.body.velocity.y = 0;
	orangePlayer.body.velocity.x = 0;
}
};	
