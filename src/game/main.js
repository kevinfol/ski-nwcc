import { Assets } from "pixi.js";

import MainMenuScene from "./scenes/main_menu.js";
import MainGameScene from "./scenes/main_game.js";
import GameOverScene from "./scenes/game_over.js";

export class Game {
    // The Game class manages the overall game state, including loading assets, initializing scenes, and handling the game loop.
    constructor(pixiApp) {
        this.app = pixiApp;
        this.currentScene = null;
    };

    // Load game assets (e.g. textures, sounds) before starting the game
    async loadGameAssets() {
        const manifestUrl = new URL('../manifest.json', import.meta.url);
        const manifest = await fetch(manifestUrl).then(res => res.json());
        await Assets.init({ manifest });
        await Assets.loadBundle('sprites');
        await Assets.loadBundle('fonts');
        await Assets.loadBundle('textures');
    }



    // Switch to a different scene by name
    switchScene(newSceneName) {
        let score;
        if (this.currentScene) {
            if (this.currentScene?.score?.score) {
                score = this.currentScene.score.score;
            }
            this.app.ticker.remove(this.currentScene.update, this.currentScene);
            this.currentScene.destroy();
        }


        if (newSceneName === 'main_menu') {
            this.currentScene = new MainMenuScene(this);
        } else if (newSceneName === 'main_game') {
            this.currentScene = new MainGameScene(this);
        } else if (newSceneName === 'game_over') {
            this.currentScene = new GameOverScene(this);
        }

        if (this.currentScene?.setScore && score) {
            this.currentScene.setScore(score);
        }
        this.currentScene.initialize();
        this.app.ticker.add(this.currentScene.update, this.currentScene);
    }

    // Start the game loop and update the current scene
    async start() {
        await this.loadGameAssets().then(() => {
            this.switchScene('main_menu');
        })
    }
}