import { Tree } from "../entities/tree";
import { Rock } from "../entities/rock";
import { Doggie, Laser } from "../entities/doggie";
import { SlalomCourse } from "../entities/slalom";
import { NewLife } from "../entities/newLife";
import { Ramp } from "../entities/ramp";
const spawnProbabilities = {
    'tree': 0.5,
    'rock': 0.3,
    'slalom': 0.02,
    'newLife': 0.04,
    'ramp': 0.34
}

export class SpawnManager {
    constructor(scene) {
        this.scene = scene;
        this.spawnInterval = 10; // spawn every 1 second
        this.lastSpawnTime = 0;
        this.scene.entityList = [this.scene.player];
        this.spawnIntervalEasy = [12, 3]
        this.spawnIntervalMedium = [8, 2]
        this.spawnIntervalHard = [5, 1]
        this.spawnIntervalExtreme = [3, 0.5]
        this.spawnIntervalImpossible = [1.5, 0.25]
        this.currentSpawnIntervalRange = this.spawnIntervalEasy;

    }
    updateSpawn(ticker) {
        if (this.scene.difficulty === 'easy') {
            this.currentSpawnIntervalRange = this.spawnIntervalEasy;
        } else if (this.scene.difficulty === 'medium') {
            this.currentSpawnIntervalRange = this.spawnIntervalMedium;
        } else if (this.scene.difficulty === 'hard') {
            this.currentSpawnIntervalRange = this.spawnIntervalHard;
        } else if (this.scene.difficulty === 'extreme') {
            this.currentSpawnIntervalRange = this.spawnIntervalExtreme;
        } else {
            this.currentSpawnIntervalRange = this.spawnIntervalImpossible;
        }

        this.lastSpawnTime += ticker.deltaTime;
        if (this.lastSpawnTime >= this.spawnInterval) {
            this.spawnEntity();
            this.lastSpawnTime = 0;
            this.spawnInterval = this.currentSpawnIntervalRange[0] + Math.random() * this.currentSpawnIntervalRange[1]; // randomize the spawn interval between 0.5 and 1.5 seconds
        }
    }
    getRandomSpawnPosition(preferDown = false) {
        const degrees = Math.random() * 180;
        let radians = degrees * (Math.PI / 180);
        if (preferDown) {
            radians = 90 * (Math.PI / 180) + (Math.random() - 0.5) * (Math.PI / 3); // prefer angles around 90 degrees (downwards)
        }
        const distancePlayerToBottomRightCorner = Math.sqrt((this.scene.game.app._width_ - this.scene.player.x) ** 2 + (this.scene.game.app._height_ - this.scene.player.y) ** 2);
        const x = this.scene.player.x + distancePlayerToBottomRightCorner * Math.cos(radians);
        const y = this.scene.player.y + distancePlayerToBottomRightCorner * Math.sin(radians);
        return { x, y };
    }

    spawnEntity() {
        const entityTypes = { 'tree': Tree, 'rock': Rock, 'slalom': SlalomCourse, 'newLife': NewLife, 'ramp': Ramp }; // add more entity types here
        const totalProbability = Object.values(spawnProbabilities).reduce((sum, prob) => sum + prob, 0);
        const randomValue = Math.random() * totalProbability;
        let cumulativeProbability = 0;
        let selectedEntityType = null;
        for (const [entityType, probability] of Object.entries(spawnProbabilities)) {
            cumulativeProbability += probability;
            if (randomValue <= cumulativeProbability) {
                selectedEntityType = entityType;
                break;
            }
        };

        // maximum of 3 lives
        if (selectedEntityType === 'newLife' && this.scene.lives.lives >= 3) {
            return;
        }

        // only allow one slalom course at a time
        if (selectedEntityType === 'slalom' && this.scene.entityList.some(e => e.isSlalomCourse)) {
            return;
        }

        const EntityClass = entityTypes[selectedEntityType];
        const entity = new EntityClass();
        let spawnPosition = this.getRandomSpawnPosition(entity.isSlalomCourse);

        if (entity.isSlalomCourse) {
            // dont spawn slalom courses on top of existing entities
            const minX = entity.minX + spawnPosition.x;
            const maxX = entity.maxX + spawnPosition.x;
            const minY = entity.minY + spawnPosition.y;
            const maxY = entity.maxY + spawnPosition.y;
            let cnt = 0
            while (cnt < 50 && this.scene.entityList.some(e => {
                const eMinX = e?.minX ? e.minX : e.x - e.width / 2;
                const eMaxX = e?.maxX ? e.maxX : e.x + e.width / 2;
                const eMinY = e?.minY ? e.minY : e.y - e.height / 2;
                const eMaxY = e?.maxY ? e.maxY : e.y + e.height / 2;
                const isClear = (eMaxX < minX || eMinX > maxX || eMaxY < minY || eMinY > maxY);
                return !isClear;
            })) {
                spawnPosition = this.getRandomSpawnPosition(true);
                cnt++;
            }
        }

        else {
            let cnt = 0
            // dont spawn entities on top of existing entities
            while (cnt < 50 && this.scene.entityList.some(e => {
                const eMinX = e?.minX ? e.minX + e.x : e.x - e.width / 2;
                const eMaxX = e?.maxX ? e.maxX + e.x : e.x + e.width / 2;
                const eMinY = e?.minY ? e.minY + e.y : e.y - e.height / 2;
                const eMaxY = e?.maxY ? e.maxY + e.y : e.y + e.height / 2;
                return !(eMaxX < spawnPosition.x - entity.width / 2 || eMinX > spawnPosition.x + entity.width / 2 || eMaxY < spawnPosition.y - entity.height / 2 || eMinY > spawnPosition.y + entity.height / 2);
            })) {
                spawnPosition = this.getRandomSpawnPosition();
                cnt++;
            }
        }


        entity.x = spawnPosition.x;
        entity.y = spawnPosition.y;

        // if the entity is a tree, there is a chance that a doggie will spawn behind it
        if (selectedEntityType === 'tree' && Math.random() < 0.15) {
            const doggie = new Doggie(this.scene.difficulty === 'extreme' || this.scene.difficulty === 'impossible');
            doggie.x = entity.x;
            doggie.y = entity.y
            doggie.scale.set(Math.random() < 0.5 ? -1 * doggie.scale._x : doggie.scale._x, doggie.scale._y); // randomly flip the doggie horizontally
            this.scene.entityList.push(doggie);
            this.scene.obstacleGroup.addChild(doggie);
        }



        this.scene.entityList.push(entity);
        this.scene.obstacleGroup.addChild(entity);






    }
}