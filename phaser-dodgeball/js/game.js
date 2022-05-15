// initialize the game object
let game = new Phaser.Game({
    width: 960,
    height: 720, 
    backgroundColor: '#082233',
    physics: { default: 'arcade' },
    parent: 'game',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        min: {
            width: 240,
            height: 180,
        },
        max: {
            width: 960,
            height: 720,
        },
    },
});

// add the scenes to the scene manager
game.scene.add('load', Load);
game.scene.add('menu', Menu);
game.scene.add('play', Play);

// start on the Loading scene
game.scene.start('load');