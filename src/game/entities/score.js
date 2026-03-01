import { BitmapText, Assets, Container } from "pixi.js";

export class Score extends Container {
    constructor() {
        super({ isRenderGroup: false });
        this.score = 0;
        this.scoreText = new BitmapText({
            text: "Score: 0",
            style: {
                fontFamily: "Jersey",
                fontSize: 16,
                fill: 0x000000,
            },
            anchor: {
                x: 0,
                y: 0
            }
        });
        this.addChild(this.scoreText);
    }
    incrementScore(amount) {
        this.score += amount;
        this.scoreText.text = `Score: ${this.score}`;
    }
    resetScore() {
        this.score = 0;
        this.scoreText.text = `Score: ${this.score}`;
    }
}