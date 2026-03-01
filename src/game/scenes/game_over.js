/**
 * Script Name: src/game/scenes/game_over.js
 * Author: Kevin Foley
 * Description:
 */

import { Container, Assets, BitmapText } from "pixi.js";

export default class GameOverScene {
    constructor(game) {
        this.game = game;
        this._score = -9999;
    };
    async initialize() {
        
        this.stage = new Container();
        this.game.app.stage.addChild(this.stage);

        const gameOverText = new BitmapText({
            text: "Game Over",
            style: {
                fontFamily: "Jersey",
                fontSize: 48,
                fill: 0x000000,
                //fontWeight: "bold",
            }
        });
        gameOverText.anchor.set(0.5);
        gameOverText.x = this.game.app._width_ / 2;
        gameOverText.y = this.game.app._height_ / 2 - 50;
        this.stage.addChild(gameOverText);

        const scoreText = new BitmapText({
            text: `Final Score: ${this._score}`,
            style: {
                fontFamily: "Jersey",
                fontSize: 20,
                fill: 0x0000ff,
                //fontWeight: "light",
            },
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });
        scoreText.x = this.game.app._width_ / 2;
        scoreText.y = this.game.app._height_ / 2 + 20;
        this.stage.addChild(scoreText);

        this.restartText = new BitmapText({
            text: "Press Space to Restart",
            style: {
                fontFamily: "Jersey",
                fontSize: 16,
                fill: 0x000000,
                //fontWeight: "light",
            }
        });
        this.restartText.anchor.set(0.5);
        this.restartText.x = this.game.app._width_ - this.restartText.width / 2 - 10;
        this.restartText.y = this.game.app._height_ / 2 + 60;
        this.stage.addChild(this.restartText);

        const onKey = (e) => {
            if (e.code === 'Space') {
                window.removeEventListener('keydown', onKey);
                this.game.switchScene('main_menu');
            }
        };
        window.addEventListener('keydown', onKey)
    }
    destroy() {
        // Remove the stage from the game's stage
        this.game.app.stage.removeChild(this.stage);

        // Destroy the stage and its children to free up resources
        //this.stage.destroy();
    }
    setScore(score) {
        this._score = score;
    }
    update(ticker) {
        if (this.restartText) {
            this.restartText.alpha = 0.75 + 0.5 * Math.sin(2 * ticker.lastTime / 300);
        }
        // No dynamic elements to update in the game over scene
    }
}