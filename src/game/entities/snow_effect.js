import { Assets, TilingSprite } from "pixi.js";

export class SnowEffect extends TilingSprite {
    constructor(app) {
        const tex = Assets.get('textures/snow.png');
        super({
            texture: tex,
            width: app._width_ * 1.5,
            height: app._height_ * 1.5,
        });
        this.anchor.set(0.5, 0.5);
    }
};