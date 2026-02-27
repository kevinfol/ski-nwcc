import { AnimatedSprite, Assets } from "pixi.js";

export class Doggie extends AnimatedSprite {
    constructor() {
        const spritesheet = Assets.get('sprites/pngs')
        super(spritesheet.animations['doggie']);
        this.anchor.set(0.5, 0.5);
        this.animationSpeed = 0.05;
        this.play();
        this.isDoggie = true;
    }
    isFacingPlayer(player) {
        return (player.x > this.x && this.scale.x < 0) || (player.x < this.x && this.scale.x > 0);
    }
}