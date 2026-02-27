import { AnimatedSprite, Assets } from "pixi.js";

export class Tree extends AnimatedSprite {
    constructor() {
        const spritesheet = Assets.get('sprites/pngs')
        super(spritesheet.animations['tree']);
        this.anchor.set(0.5, 0.5);
        this.animationSpeed = 0.05;

        this.play();
        this.scale.set(Math.random() < 0.5 ? -1 : 1, 1); // randomly flip the

    }
}