"use strict";

GameStates.makeEndScreen = function( game, shared ) {

	var music = null;
	var playButton = null;
    var rKey;
    
    return {
    
        create: function () {
	    rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
 
	    game.load.image( 'endScreen', 'assets/endScreenBackground.jpg' );
            game.add.sprite(0, 0, 'endScreen');    
        },
    
        update: function () {
    		if(rKey.isDown){
			game.state.start('Game');
		}
    
        }
        
    };
};
