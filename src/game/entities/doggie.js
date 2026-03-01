import { AnimatedSprite, Assets } from "pixi.js";

export class Doggie extends AnimatedSprite {
    constructor(isLaser = false) {
        const spritesheet = Assets.get('sprites/pngs')
        super(isLaser ? spritesheet.animations['doggie_laser'] : spritesheet.animations['doggie']);
        this.anchor.set(0.5, 0.5);
        this.animationSpeed = 0.05;
        this.play();
        this.isDoggie = true;
        this.isLaser = isLaser;
        this.remainingLasers = 3
        this.lastLaserTime = 0;
    }
    timeToShootLaser(elapsedTime) {
        if (!this.isLaser) return false;
        if (this.remainingLasers <= 0) return false;
        if (elapsedTime - this.lastLaserTime < 0.5) return false;
        this.lastLaserTime = elapsedTime;
        this.remainingLasers--;
        return true;
    }
    isFacingPlayer(player) {
        return (player.x > this.x && this.scale.x < 0) || (player.x < this.x && this.scale.x > 0);
    }
}
export class Laser extends AnimatedSprite {
    constructor() {
        const spritesheet = Assets.get('sprites/pngs')
        super(spritesheet.animations['laser']);
        this.anchor.set(0.5, 0.5);
        this.animationSpeed = 0.1;
        this.play();
        this.isLaserBeam = true;
    }
}