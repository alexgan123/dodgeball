class Menu {
    create(data) {
        // start playing the menu music
        this.music = this.sound.add('musMenu');
        this.music.loop = true;
        this.music.play();

        // "score" stores the most recent score that the player achieved
        let score = data.score ? data.score : 0;
        if (localStorage.getItem('bestScore') === null) {
            localStorage.setItem('bestScore', 0);
        }
        // update the highscore
        if (score > localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', score);
        }
        
        // display the title
        let nameLabel = this.add.text(480, -50, 'Dodgeball',
            { font: '50px Roboto', fill: '#fff' });
        nameLabel.setOrigin(0.5, 0.5);
        this.tweens.add({
            targets: nameLabel,
            y: 80,
            duration: 1000,
            ease: 'bounce.out',
        });

        // display the most recently achieved score and the highest achieved score
        let scoreText = 'Score: ' + thousandsString(score)
            + '\nBest score: ' + thousandsString(localStorage.getItem('bestScore'));
        let scoreLabel = this.add.text(480, 300, scoreText,
            {font: '25px Roboto', fill: '#fff', align: 'center'});
        scoreLabel.setOrigin(0.5, 0.5);
        
        // display the start text
        let startText = 'Press ENTER to start';
        let startLabel = this.add.text(480, 360, startText,
            {font: '25px Roboto', fill: '#fff' });
        startLabel.setOrigin(0.5, 0.5);
        this.tweens.add({
            targets: startLabel,
            angle: {from: -1, to: 1},
            duration: 1000,
            yoyo: true,
            repeat: -1,
        });

        // let the user know how to control the player
        let arrowKeysText = 'Use ARROW KEYS to move';
        let arrowKeysLabel = this.add.text(480, 420, arrowKeysText,
            {font: '25px Roboto', fill: '#fff' });
        arrowKeysLabel.setOrigin(0.5, 0.5);

        // enter key input
        this.enterKey = this.input.keyboard.addKey('enter');
    }
    
    update() {
        if (this.enterKey.isDown) {
            this.scene.start('play');
            this.music.stop();
        }
    }
}

