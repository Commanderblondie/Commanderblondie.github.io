"use strict";

GameStates.makeGame = function( game, shared ) {
    //set up vars
    var bg = null;
    var player;

    //Set up groups
    var HATS;
    var lHeadGrp;

    //Text vars
    var text;
    var lives = 10;
    var hatCount = 0;

    //horseshoe vars
    var lassoHeld = true;
    var horseshoe;
    
    //Set up time
    var Time;

    //Set up music
    var music;
    var throwSound;

    //Set up recall key
    var rKey;
    function quitGame() {

	//Reset lives
        lives = 10;
	music.stop();
	game.state.start('EndScreen');
    }
    
    return {
    
        create: function () {
		 //Music
		 music = game.add.audio('gameMusic');
		 music.loopFull(0.8);;
		 throwSound = game.add.audio('throwSound');

    		 //add player/background
           	 bg = game.add.sprite( 0, 0, 'bg' );
	    	 player = game.add.sprite( 310, 330, 'player');

		 //set Groups
	   	 HATS = game.add.group();
	   	 lHeadGrp = game.add.group();

		 //Set up HATS
	   	 game.physics.arcade.enable(HATS);
 	    	 game.time.events.loop(1500, dropHats, this);
                 dropHats();

	        //set up lasso
		horseshoe = game.add.sprite(370, 415, 'horseshoe');
		game.physics.arcade.enable(horseshoe);

		//Text for game
            	var style = { font: "25px Verdana", fill: "#0000ff", align: "center" };
	    	text = game.add.text(400, 15, "Grab as many hats as you can!\n Lives: " + lives + "\nHats: " + hatCount, style);
            	text.anchor.setTo( 0.5, 0.0 );

		//Recall button
		rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
 
		
		//Get mouse input
		game.input.mouse.capture = true;	
        },
    
        update: function () {
    		
		//Update text
		Time = this.game.time.totalElapsedSeconds();
            	text.setText("Grab as many hats as you can! Left click to throw, R to recall.\n Lives: " + lives + "      Time: " + Phaser.Math.floorTo(Time, 0, 10) + "\nHats: " + hatCount);
            	if(lives == 0){
			quitGame();
		}

		//Recall horseshoe
		if(rKey.isDown){
			comeBack();
		}
		
		//Throw horseshoe
		if(game.input.activePointer.leftButton.isDown && lassoHeld){
			lassoHeld = false;
			game.physics.arcade.moveToPointer(horseshoe, 300);
			horseshoe.body.allowGravity = true;
			horseshoe.body.gravity.y = 150; 
			throwSound.play();
		}
		//Face the cursor
		else if (lassoHeld){
			horseshoe.rotation = game.physics.arcade.angleToPointer(horseshoe);
		}
		//Add the spin
		else if (!lassoHeld){
			horseshoe.angle += 5;
		}
		
		//Destroy hat on collision
		horseshoe.body.onCollide = new Phaser.Signal();
		horseshoe.body.onCollide.add(destHat, this);
		game.physics.arcade.collide(horseshoe, HATS);

        }
	
    };
	function dropHats(){ //drop a hat at a random spot
		var hat = HATS.create( Phaser.Math.random(0, 750), 50, 'hat');
		hat.checkWorldBounds = true;
		
		//Lose life if hat goes out of bounds
		hat.events.onOutOfBounds.add(loseLife, this);
		game.physics.arcade.enable(hat);
		var sizeChange = Phaser.Math.random(1,2);
		hat.scale.setTo(sizeChange, sizeChange);
		
		//Random velocity
		hat.body.velocity.y = (Phaser.Math.random(50,100));
	}
	function loseLife(){ //Lose lives
		lives -= 1;
	}
	function comeBack(){ //reset the horseshoe
		if(lassoHeld == true){
			return;
		}
		lassoHeld = true;
		horseshoe.x = 370;
		horseshoe.y = 415;
		horseshoe.body.velocity.y = 0;
		horseshoe.body.velocity.x = 0;
		horseshoe.body.allowGravity = false;
	}
	function destHat(horseshoe, colHat){ //destroy hat caught
		if(lassoHeld == true){
			return;
		}
		colHat.destroy();
		comeBack();
		hatCount += 1;
	}
};
