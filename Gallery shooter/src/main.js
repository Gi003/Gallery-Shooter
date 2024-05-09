//Me when I cryyy
"use strict"

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  
    },
    fps: {
        //forceSetTimeOut:true,
        target:30
    },
    width: 1000,
    height: 600,
    scene: [Object,GameOver]
}

const game = new Phaser.Game(config);