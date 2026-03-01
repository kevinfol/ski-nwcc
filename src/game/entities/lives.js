import { Assets, BitmapText, Container } from "pixi.js";

export class Lives extends Container {
    constructor() {
        super({ isRenderGroup: false });
        this.lives = 3;
        this.livesText = new BitmapText({
            text: "Lives: 3",
            style: {
                fontFamily: "Jersey",
                fontSize: 16,
                fill: 0x000000,
            },
            anchor: {
                x: 1,
                y: 0
            }
        });
        this.livesText.x = 0;
        this.livesText.y = 0;
        this.addChild(this.livesText);
    }
    plusOneLivesAnnouncement() {
        const plusOneText = new BitmapText({
            text: "+1 Life!",
            style: {
                fontFamily: "Jersey",
                fontSize: 16,
                fill: "green",
            },
            anchor: {
                x: 1,
                y: 0
            }
        });
        plusOneText.x = 0;
        plusOneText.y = 10;
        this.addChild(plusOneText);
        setTimeout(() => {
            this.removeChild(plusOneText);
        }, 800);
    }
    minusOneLivesAnnouncement() {
        const minusOneText = new BitmapText({
            text: "-1 Life!",
            style: {
                fontFamily: "Jersey",
                fontSize: 16,
                fill: "red",
            },
            anchor: {
                x: 1,
                y: 0
            }
        });
        minusOneText.x = 0;
        minusOneText.y = 10;
        this.addChild(minusOneText);
        setTimeout(() => {
            this.removeChild(minusOneText);
        }, 800);
    }
    decrementLives(amount) {
        this.lives -= amount;
        this.livesText.text = `Lives: ${this.lives}`;
        this.minusOneLivesAnnouncement();
    }
    incrementLives(amount) {
        this.lives += amount;
        this.livesText.text = `Lives: ${this.lives}`;
        this.plusOneLivesAnnouncement();
    }
}
