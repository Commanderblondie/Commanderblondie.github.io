window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'logo', 'assets/phaser.png' );
        // load a tilemap and call it 'map'.
        // from .json file
        game.load.tilemap('map', 'assets/tilemap_example.json', null, Phaser.Tilemap.TILED_JSON);
        // alternatively, from .csv file
        //game.load.tilemap('map', 'assets/tilemap_example.csv', null, Phaser.Tilemap.CSV);
        
        //load tiles for map
        game.load.image('tiles', 'assets/grass.png');
	game.load.image('box', 'assets/box.jpg');
	game.load.image('line', 'assets/redLines.png');
	game.load.image('end', 'assets/endScreen.png');
	game.load.spritesheet('pigAni', 'assets/pigAnim.png', 64, 39, 18);
    }
    
    	var map;
    	var layer1;
   	var p1;
        var anim;
	var boxes;
	var yval;
    	var Time;
	var text;

    function create() {
        // Create the map. 
        map = game.add.tilemap('map');
        // for csv files specify the tile size.
        map = game.add.tilemap('map', 5, 5);
        
        //add tiles
        map.addTilesetImage('tiles');
        
        // Create a layer from the map
        //using the layer name given in the .json file
        layer1 = map.createLayer('Tile Layer 1');
        //for csv files
        //layer1 = map.createLayer(0);
        
        //  Resize the world
        layer1.resizeWorld();
      
        var style = { font: "25px Verdana", fill: "#200aa", align: "center" };
        text = game.add.text( 400, 15, "Don't fall behind the red line!", style );
        text.fixedToCamera = true;
        text.anchor.setTo( 0.5, 0.0 );
        


	game.world.setBounds(0, 0, 800, 600);
	game.time.events.loop(2500, spawnBox, this);
	boxes = game.add.group();
	
	var endline = game.add.sprite(40, 0, 'line');

	p1 = game.add.sprite(game.world.centerX-100, game.world.centerY, 'pigAni', 3);
	game.physics.arcade.enable(p1);
	anim = p1.animations.add('walk');

	anim.play('walk', 3, true);
	anim.loop = true;

	p1.body.onCollide = new Phaser.Signal();
	p1.body.onCollide.add(boxHit, this);

	//Add in movement keys
	this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
	Phaser.Keyboard.DOWN
    ]);
    }
    
    function update() {
	Time = this.game.time.totalElapsedSeconds();
	text.setText("Don't fall behind the red line!\n      Time: " + Phaser.Math.floorTo(Time, 0, 10));

	game.physics.arcade.collide(p1, boxes);

        if(this.input.keyboard.isDown(Phaser.Keyboard.UP))
	{
		p1.y -= 4;
	}
	if(this.input.keyboard.isDown(Phaser.Keyboard.DOWN))
	{
		p1.y += 4;
	}
	

	if(p1.x <= 40)
	{
		game.add.sprite(0, 0, 'end');
		text.setText("You were caught and put back in your pen! \nRestart the page to retry.");
		text.bringToTop()
	}
    }

   function spawnBox(){
	yval = Phaser.Math.random(0, 600);
	var box = boxes.create(750, yval, 'box');
	box.scale.setTo(0.5, 0.5);
	game.physics.arcade.enable(box);
	box.body.velocity.x = -80;
   }
   function boxHit(){
	p1.x -= 5;
   }
};
