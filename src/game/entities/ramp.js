import { Assets, Sprite } from "pixi.js";

export class Ramp extends Sprite {
    constructor() {
        const spritesheet = Assets.get('sprites/pngs');
        super(spritesheet.textures['ramp.png']);
        this.anchor.set(0.5, 0.5);
        this.scale.set(1.5,1)
        //this.scale.set(Math.random() < 0.5 ? -1 : 1, 1); // randomly flip the ramp horizontally
    }
}
