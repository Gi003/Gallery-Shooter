class GameOver extends Phaser.Scene {
    constructor(){
        super("GameOver");
        this.counter = 0;
    }
    preload(){}
    create(){
        this.add.text(270, 200, "You Died!\nTry Again", { font: "100px Arial",fill: 'white' });
    }
    update(){
        this.counter += 1;
        if (this.counter > 100){
            this.counter = 0
            this.scene.start("1D_object");
        }
    }

}