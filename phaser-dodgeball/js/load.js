
class Load {
    preload() {
        // load all the sprites 
        this.load.image('sprCoin', 'assets/coin.png');
        this.load.image('sprPlayer', 'assets/player.png');
        this.load.image('sprBall', 'assets/ball.png');
        this.load.image('pixel', 'assets/pixel.png');

        // load all the sounds
        this.load.audio('sndCoin', ['assets/coin.ogg', 'assets/coin.mp3']);
        this.load.audio('sndDead', ['assets/dead.ogg', 'assets/dead.mp3']);

        // load all the music
        this.load.audio('musMenu', ['assets/musMenu.wav']);
        this.load.audio('musGame', ['assets/musGame.wav']);

        // add a loading label 
        let loadLabel = this.add.text(480, 360, 'Loading...',
        { font: '60px Roboto', fill: '#fff' });
        loadLabel.setOrigin(0.5, 0.5);
    }
    
    create() {
        // immediately go to the menu scene after loading is finished
        this.scene.start('menu');
    }
}