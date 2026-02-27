/**
 * Script Name: src/index.js
 * Description: Entry point for the ski-nwcc game. Initializes the PixiJS application and starts the game loop.
 */

import { Application } from 'pixi.js';
import { Game } from './game/main.js';

const initialWidth = 240;
const initialHeight = 160


// Wrap game creation in an async function for Vite HMR support
async function createGame() {
    // Create a new PixiJS application
    const container = document.getElementById('game-container');
    const app = new Application();
    await app.init({
        width: initialWidth,
        height: initialHeight,
        backgroundColor: 0xdee5ef,
        backgroundAlpha: 0.71,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        antialias: false
    })
    app.ticker.maxFPS = 30;
    app._width_ = initialWidth;
    app._height_ = initialHeight;


    // Append the view (canvas) to the DOM
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.appendChild(app.canvas);

    // resize handler to make the canvas fill the window
    function handleResize() {

        const parent = container;
        if (parent) {
            let width = parent.clientWidth;
            let height = parent.clientHeight;
            if (width <= height) {
                width = height * (initialWidth / initialHeight);
            } else {
                height = width * (initialHeight / initialWidth);
            };
            app._width_ = width;
            app._height_ = height;
            app.canvas.style.width = `${width}px`
            app.canvas.style.height = `${height}px`;
        }
    }


    // Create and start the game
    handleResize();
    const game = new Game(app);
    game.start().then(() => {
        window.addEventListener('resize', handleResize);
    });


};

// Start the game
createGame();