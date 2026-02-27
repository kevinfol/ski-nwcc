import { Assets, TilingSprite } from "pixi.js";

export class Background extends TilingSprite {
    constructor(app) {
        const backgroundTexture = Assets.get('textures/bg.png');
        super({
            texture: backgroundTexture,
            width: app._width_ * 2,
            height: app._height_ * 2,
        });
        this.anchor.set(0, 0);

    }
    updateBg(speedX, speedY) {
        this.tilePosition.x -= speedX
        this.tilePosition.y += speedY;
    }
};