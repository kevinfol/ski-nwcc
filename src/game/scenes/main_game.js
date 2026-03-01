/**
 * Script Name: src/game/scenes/main_game.js
 * Author: Kevin Foley
 * Description:
 */

import { Container } from "pixi.js";
import { Player, PlayerTrail } from "../entities/player";
import { Background } from "../entities/background";
import { SnowEffect } from "../entities/snow_effect";
import input from "../systems/input";
import { SpawnManager } from "../systems/spawn";
import { detectCollisionPixelPerfect } from "../systems/collision";
import { Score } from "../entities/score";
import { Lives } from "../entities/lives";
import { Laser } from "../entities/doggie";

export default class MainGameScene {
    constructor(game) {
        this.game = game;
        this.difficulty = 'easy';
        this.startTime = new Date().getTime() / 1000
    };
    updateDifficulty(timeElapsed) {
        if (timeElapsed > 240) {
            this.difficulty = 'impossible';
        } else if (timeElapsed > 120) {
            this.difficulty = 'extreme';
        } else if (timeElapsed > 60) {
            this.difficulty = 'hard';
        } else if (timeElapsed > 30) {
            this.difficulty = 'medium';
        }
    }
    initialize() {

        // register inputs
        input.register();

        // Create a stage for the scene
        this.stage = new Container();

        // Add the stage to the game's stage
        this.game.app.stage.addChild(this.stage);

        // create some groups
        this.bgGroup = new Container();
        this.playerGroup = new Container();
        this.obstacleGroup = new Container();
        this.snowingEffectGroup = new Container();
        this.hudGroup = new Container();

        // Add groups to the stage
        this.stage.addChild(this.bgGroup);
        this.stage.addChild(this.playerGroup);
        this.stage.addChild(this.obstacleGroup);
        this.stage.addChild(this.snowingEffectGroup);
        this.stage.addChild(this.hudGroup);


        this.initializeBgGroup();
        this.initializePlayerGroup();
        this.initializeSnowingEffectGroup();
        this.initializeHudGroup();

        this.spawnManager = new SpawnManager(this)
    }
    initializeBgGroup() {
        this.bg = new Background(this.game.app);
        this.bgGroup.addChild(this.bg);
    }
    initializePlayerGroup() {
        this.player = new Player();
        this.player.x = this.game.app._width_ / 2;
        this.player.y = this.player.height / 2 + 20;
        this.playerTrail = new PlayerTrail();
        this.playerTrail.initializeTrailPoints(this.player)
        this.playerGroup.addChild(this.playerTrail);
        this.playerGroup.addChild(this.player);
    }
    initializeSnowingEffectGroup() {
        this.snowEffect = new SnowEffect(this.game.app);
        this.snowingEffectGroup.addChild(this.snowEffect);
    }
    initializeHudGroup() {
        this.score = new Score()
        this.score.x = 5;
        this.score.y = 0;
        this.hudGroup.addChild(this.score);
        this.lives = new Lives();
        this.lives.x = this.game.app._width_ - 5;
        this.lives.y = 0;
        this.hudGroup.addChild(this.lives);
        const onLiveLost = () => {
            this.lives.decrementLives(1);
            if (this.lives.lives <= 0) {
                window.removeEventListener('playerCrashed', onLiveLost);
                this.game.switchScene('game_over');
            }
        }
        window.addEventListener('playerCrashed', onLiveLost);

    }
    destroy() {
        // Remove the stage from the game's stage
        this.game.app.stage.removeChild(this.stage);

        // Destroy the stage and its children to free up resources
        //this.stage.destroy();
    }
    update(ticker) {
        // move the snow effect
        this.snowEffect.tilePosition.x -= 0.25;
        this.snowEffect.tilePosition.y += 0.5;
        const timeElapsed = (new Date().getTime() / 1000) - this.startTime;
        this.updateDifficulty(timeElapsed);

        // update the score
        if (!this.player.isCrashed) {
            this.score.incrementScore(10);
        } else {
            this.score.incrementScore(-50);
        }


        // update the player
        this.player.updatePlayer(input.direction());

        // update player speed
        this.player.updateSpeed(this.difficulty);

        // update the player trail
        this.playerTrail.updateTrail(this.player.currentVelocity.x, this.player.currentVelocity.y);

        // update the background
        this.bg.updateBg(this.player.currentVelocity.x, this.player.currentVelocity.y);

        // update the spawn manager
        this.spawnManager.updateSpawn(ticker);

        // move the obstacles and remove them if they are off screen and check for collisions with the player
        this.obstacleGroup.children.forEach(obstacle => {
            obstacle.x -= this.player.currentVelocity.x;
            obstacle.y += this.player.currentVelocity.y;

            // have doggies run toward the player if they are facing the player
            if (obstacle?.isDoggie) {
                if (obstacle.isFacingPlayer(this.player)) {
                    const angleToPlayer = Math.atan2(this.player.y - obstacle.y, this.player.x - obstacle.x);
                    const velocityX = Math.cos(angleToPlayer) * 1.8;
                    const velocityY = Math.sin(angleToPlayer) * 1.9;
                    obstacle.x += velocityX;
                    obstacle.y += velocityY;

                    if (obstacle.isLaser) {
                        // if the doggie is a laser doggie, it fires a laser towards the player every 0.5 seconds
                        if (obstacle.timeToShootLaser(timeElapsed)) {
                            const laser = new Laser();
                            laser.x = obstacle.x;
                            laser.y = obstacle.y;
                            const angleToPlayer = Math.atan2(this.player.y + 50 - obstacle.y, this.player.x - obstacle.x);
                            const velocityX = Math.cos(angleToPlayer) * 5;
                            const velocityY = Math.sin(angleToPlayer) * 5;
                            laser.vx = velocityX;
                            laser.vy = velocityY;
                            this.obstacleGroup.addChild(laser);
                            this.entityList.push(laser);
                        }

                    }
                }

            }

            if (obstacle?.isLaserBeam) {
                obstacle.x += obstacle.vx;
                obstacle.y += obstacle.vy;
            }


            // check for collision with the player
            if (obstacle?.isNewLife) {
                if (detectCollisionPixelPerfect(this.player, obstacle)) {
                    this.obstacleGroup.removeChild(obstacle);
                    this.entityList = this.entityList.filter(e => e !== obstacle);
                    this.lives.incrementLives(1);
                    return;
                }
            }
            else if (obstacle?.isSlalomCourse) {
                if (obstacle.passedAllGates(this.player)) {
                    this.score.incrementScore(100);
                };
                for (const child of obstacle.entities) {
                    if (detectCollisionPixelPerfect(this.player, child)) {
                        this.obstacleGroup.removeChild(obstacle);
                        this.entityList = this.entityList.filter(e => e !== obstacle);
                        this.player.crash();
                        return;
                    }
                }
            } else {
                if (detectCollisionPixelPerfect(this.player, obstacle)) {
                    this.obstacleGroup.removeChild(obstacle);
                    this.entityList = this.entityList.filter(e => e !== obstacle);
                    this.player.crash();
                    return;
                }
            }


            // if the obstable is off screen, remove it
            if (obstacle.x < -obstacle.width || obstacle.x > this.game.app._width_ + obstacle.width || obstacle.y < -obstacle.height || obstacle.y > this.game.app._height_ + obstacle.height) {
                this.obstacleGroup.removeChild(obstacle);
                this.entityList = this.entityList.filter(e => e !== obstacle);
            }
        });



    }
}