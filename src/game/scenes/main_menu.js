/**
 * Script Name: src/game/scenes/main_menu.js
 * Author: Kevin Foley
 * Description:
 */

import { Container, Assets, Sprite, Text } from "pixi.js";

export default class MainMenuScene {
    constructor(game) {

        this.game = game;

    };
    initialize() {

        // Create a stage for the scene
        this.stage = new Container();

        // Add the stage to the game's stage
        this.game.app.stage.addChild(this.stage);

        // Create and add scene elements (e.g. title, buttons) to the stage

        // background
        const backgroundTexture = Assets.get('textures/title.png');
        const backgroundSprite = new Sprite(backgroundTexture);
        this.stage.addChild(backgroundSprite);

        // start button
        const startText = new Text({
            text: "Press Space to Start",
            style: {
                fontFamily: "Jersey",
                fontSize: 16,
                fontWeight: "light",
            },
            anchor: {
                x: 1,
                y: 1
            }
        });

        startText.x = this.game.app._width_ - 10;
        startText.y = this.game.app._height_ - 10;
        this.stage.addChild(startText);

        const onKey = (e) => {
            if (e.code === 'Space') {
                window.removeEventListener('keydown', onKey);
                this.game.switchScene('main_game');
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
    update(ticker) {
        // flash the start text
        const startText = this.stage.children.find(child => child instanceof Text);
        if (startText) {
            startText.alpha = 0.75 + 0.5 * Math.sin(2 * ticker.lastTime / 300);
        }
    }
}