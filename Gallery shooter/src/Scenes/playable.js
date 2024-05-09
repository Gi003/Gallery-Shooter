class Object extends Phaser.Scene {
    graphics;
    curve;
    path;
    constructor() {
        //Player
        super("1D_object");
        this.my = {sprite: {}};
        this.bodyX = 100;
        this.bodyY = 575;
        this.particleX = this.bodyX; 
        this.particleY = this.bodyY;
        //Stats
        this.player = {};
        this.player.health = 3;
        this.player.score = 0;
        this.player.wave = 0;
        this.delay_off = true;


        //Keys
        this.spcKey = null;
        this.Akey = null;
        this.D = null;

        //Enemys 
        this.runMode = false;
        this.my.sprite.particles = [];
        this.counter = 0;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.atlasXML("sheet", 'sheet.png', "sheet.xml");
        this.load.image('person', "alienBeige_walk1.png");
        //Enemys
        this.load.image("x-mark", "numeralX.png");             // x marks the spot
        this.load.image("enemyShip", "enemyGreen1.png");       // spaceship that runs along the path
        this.load.image("worm", "snakeSlime_ani.png");
        this.load.audio('laser','laserLarge_003.ogg');
        this.load.audio('laser_small','laserSmall_001.ogg');
    }

    create() {
        let my = this.my;
        //Player//Particles
        this.my.sprite.person = this.add.sprite(this.bodyX,this.bodyY,"person");
        this.my.sprite.particle = this.add.sprite(this.particleX, this.particleY, "sheet", "star2.png");
        this.my.sprite.person.setScale(0.5);

        //Controls
        this.Akey = this.input.keyboard.addKey('A');
        this.D = this.input.keyboard.addKey('D');
        this.spcKey = this.input.keyboard.addKey('SPACE');

        //Enemies//Fliers/Grounders
        this.points = [
            965,47,
            468,148,
            40,37,
        ];
        this.curve = new Phaser.Curves.Spline(this.points);
        this.graphics = this.add.graphics();
        
        this.xImages = [];
        //this.drawPoints();
        //this.drawLine();
        
        my.sprite.enemyShip = this.add.follower(this.curve, 10, 10, "enemyShip");
        this.my.sprite.enemyShip.setScale(0.5);
        my.sprite.enemyShip.visible = true;
        my.sprite.enemyShip.dead = false;
        my.sprite.worm = this.add.sprite(this.curve.points[1].x,550,"worm");
        my.sprite.worm.direction = "down";
        
        //Text 
        this.score_num = 0;
        this.health_num = 3;
        this.score = this.add.text(5,580,"Score:");
        this.health = this.add.text(900,580, "Health");

        this.small = this.sound.add("laser_small");
        this.big = this.sound.add("laser");
    }

//=======================================================================
    checkOverlap(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
    
        //d console.log(Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB));
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }

    delay(){
        this.delay_off = true;
    }
//========================================================================
    update() {
        let my = this.my;
        this.counter += 1;
        ////////////////////Player////////////////////////
        //LEFT movement
        if(this.Akey.isDown == true && this.my.sprite.person.x >= 100 ){
            this.my.sprite.person.x -= 5;
        //RIGHT movement
        } else if (this.D.isDown && this.my.sprite.person.x <= 900){
            this.my.sprite.person.x += 5;
        }
        //SHOOT movement
        if (this.spcKey.isDown == true){
            this.small.play()
            this.my.sprite.particle.x = this.my.sprite.person.x;
            this.my.sprite.particle.y = this.my.sprite.person.y;
        }
        /////////////////Enemies///////////////////////////
        //Follow path rules
        if (my.sprite.enemyShip.dead == false && this.runMode == false){
        my.sprite.enemyShip.x = this.curve.points[0].x;
        my.sprite.enemyShip.y = this.curve.points[0].y;
        my.sprite.enemyShip.visible = true;
        my.sprite.enemyShip.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 2000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true,
            rotateToPath: true,
            rotationOffset: -90
            });
            this.runMode = true;
        }
        //Worm Code
        if (my.sprite.worm.y > 800){ 
            my.sprite.worm.direction = "up";
            my.sprite.worm.x = Math.random() * 1000;
        };
        if (my.sprite.worm.y < 528){my.sprite.worm.direction = "down"};
        if (my.sprite.worm.direction == "up"){
            my.sprite.worm.y += -5
        }else if (my.sprite.worm.direction == "down"){
            my.sprite.worm.y += 5;
        }
        if (!(this.counter % 50) && my.sprite.enemyShip.dead == false) {
            this.big.play()
            my.sprite.particles.push(
                this.add.sprite(my.sprite.enemyShip.x, my.sprite.enemyShip.y, "x-mark"));
        }
        //USING LOOPS  FOR COLLISIONS OF PARTICLES
        for (let num in my.sprite.particles){
            my.sprite.particles[num].y +=10;
            if (this.checkOverlap(my.sprite.particles[num], my.sprite.person)){
                this.health_num -= 1; 
            }
        }
        /////////////////Particle Handling/////////////////
        this.my.sprite.particle.y -= 20;
        //Collisions:aw
        if (this.checkOverlap(my.sprite.particle, my.sprite.enemyShip)){
            this.score_num += 1; 
            my.sprite.enemyShip.stopFollow(); 
            this.my.sprite.enemyShip.x = 2000;
            my.sprite.enemyShip.dead = true; 
        }

    

        if (this.checkOverlap(my.sprite.person, my.sprite.worm) && this.delay_off){
            this.health_num -= 1;
            this.delay_off = false;
        }else if (!this.delay_off){
            this.timedEvent = this.time.delayedCall(3000, this.delay, [], this);
        }

        this.score.setText("Score: " + this.score_num);
        this.health.setText("Health: " + this.health_num);

        if (this.health_num < 1){
            this.runMode = false;
            my.sprite.enemyShip.dead = false;
            //this.scene.restart();
            this.scene.start("GameOver");
        };
    }
}