class Play {
    create() {
        // create the player object
        this.player = this.physics.add.sprite(640, 480, 'sprPlayer');
        this.coin = this.physics.add.sprite(600, 130, 'sprCoin');
        this.arrow = this.input.keyboard.createCursorKeys();

        // create the dodgeball spawner
        this.dodgeballs = this.physics.add.group();

        // add a dodgeball every second
        this.time.addEvent({
            delay: 500,
            callback: () => this.spawnDodgeball(),
            loop: true,
        });

        // label that displays current score and combo
        this.scoreLabel = this.add.text(20, 20, 'Score: 0\nCombo: 0x',
            { font: '20px Roboto', fill: '#fff' });
        this.score = 0;
        this.combo = 0;

        // define the sound effects
        this.sndCoin = this.sound.add('sndCoin');
        this.sndDead = this.sound.add('sndDead');
        
        // loop the game music
        this.music = this.sound.add('musGame');
        this.music.loop = true;
        this.music.play();

        // particle emitter used to create groups of particles
        let particles = this.add.particles('pixel');
        this.emitter = particles.createEmitter({
            quantity: 15,
            speed: {min: -150, max: 150},
            scale: {start: 2, end: 0.1},
            lifespan: 800,
            on: false,
        });
    }

    update() {
        // if player died, do nothing
        if (!this.player.active) {
            return;
        }
        // move player based on inputs
        this.movePlayer();
        // keep player in the room
        if (this.player.x < 50) this.player.x = 50;
        else if (this.player.x > 910) this.player.x = 910;
        if (this.player.y < 50) this.player.y = 50;
        else if (this.player.y > 670) this.player.y = 670;

        // check for collisions with coins and dodgeballs
        if (this.physics.overlap(this.player, this.coin)) {
            this.takeCoin();
        }
        if (this.physics.overlap(this.player, this.dodgeballs)) {
            this.playerDie();
        }


        
    }
    spawnDodgeball() {
        // this method spawns a dodgeball on a random side (top, right, bottom, or left)
        // with a random position and speed.

        // The speed of the dodgeballs increase as the player collects more coins and increases combo.
        let currentSpeed = 300 + this.combo; 
        let side = Phaser.Math.RND.pick([0, 1, 2, 3]);
        let ball = this.dodgeballs.create(0, 0, 'sprBall');
        
        // spawn the dodgeball on the corresponding side
        if (side === 0) {
            ball.x = Phaser.Math.RND.integerInRange(30, 930);
            ball.y = 0;
            ball.body.velocity.y = Phaser.Math.RND.integerInRange(0.75*currentSpeed, 0.75*currentSpeed*1.3);
        }
        else if (side === 1) {
            ball.x = Phaser.Math.RND.integerInRange(30, 930);
            ball.y = 720;
            ball.body.velocity.y = Phaser.Math.RND.integerInRange(-0.75*currentSpeed, -0.75*currentSpeed*1.3);
        }
        else if (side === 2) {
            ball.x = 0;
            ball.y = Phaser.Math.RND.integerInRange(30, 690);
            ball.body.velocity.x = Phaser.Math.RND.integerInRange(currentSpeed, currentSpeed*1.3);
        }
        else {
            ball.x = 960;
            ball.y = Phaser.Math.RND.integerInRange(30, 690);
            ball.body.velocity.x = Phaser.Math.RND.integerInRange(-1*currentSpeed, -1*currentSpeed*1.3);
        }

        this.time.addEvent({
            delay: 5000,
            callback: () => ball.destroy(),
        });
    }

    movePlayer() {
        // checks for current keyboard input
        let leftDown = this.arrow.left.isDown ? 1 : 0;
        let rightDown = this.arrow.right.isDown ? 1 : 0;
        let upDown = this.arrow.up.isDown ? 1 : 0;
        let downDown = this.arrow.down.isDown ? 1 : 0;

        // move the player based on input
        this.player.body.velocity.x = 400 * (rightDown - leftDown);
        this.player.body.velocity.y = 400 * (downDown - upDown);
    }

    takeCoin() {
        // Destry the coin and increase score and combo
        this.score += 100 + (8*this.combo);
        this.combo += 1;
        this.scoreLabel.setText('Score: ' + thousandsString(this.score) + 
        '\nCombo: ' + thousandsString(this.combo) + 'x');

        // coin respawns at a different location
        this.updateCoinPosition();
        this.sndCoin.play();

        // coin pickup animation
        this.coin.setScale(0);
        this.tweens.add({
            targets: this.coin,
            scale: 1,
            duration: 300,
        });
        this.tweens.add({
            targets: this.player,
            scale: 1.3,
            duration: 100,
            yoyo: true,
        });
    }

    updateCoinPosition() {
        // choose a new position for the coin to reappear in so the player can collect more coins
        this.coin.setPosition(Phaser.Math.RND.integerInRange(960*0.2, 960*0.8), Phaser.Math.RND.integerInRange(720*0.2, 720*0.8));
    }

    playerDie() {
        // destroy player and go back to main menu
        this.player.destroy();
        this.time.addEvent({
            delay: 1000,
            callback: () => this.scene.start('menu', {score: this.score}),
        });
        this.sndDead.play();
        this.music.stop();

        // display explosion particle and camera shake effect
        this.emitter.setPosition(this.player.x, this.player.y);
        this.emitter.explode();

        this.cameras.main.shake(300, 0.02);
    }
};

function thousandsString(num) {
    // takes in an integer and returns a string which contains commas inserted at every third digit.
    let str = num.toString();
    let ret = "";
    if (str.length <= 3) return str;

    let place = ((str.length - 1) % 3) + 1;
    ret += str.slice(0, place);

    while (place < str.length) {
        ret += ",";
        ret += str.slice(place, place + 3);
        place += 3;
    }
    return ret;
}
