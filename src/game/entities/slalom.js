import { AnimatedSprite, Assets, Container, Graphics } from "pixi.js";
import { OutlineFilter } from "pixi-filters";

class SlalomStart extends AnimatedSprite {
    constructor(course) {
        const spritesheet = Assets.get('sprites/pngs')
        super(spritesheet.animations['start']);
        this.anchor.set(0.5, 0.5);
        this.animationSpeed = 0.05;
        this.play();
        this.course = course;
    }
}
class SlalomFinish extends AnimatedSprite {
    constructor(course) {
        const spritesheet = Assets.get('sprites/pngs')
        super(spritesheet.animations['end']);
        this.anchor.set(0.5, 0.5);
        this.animationSpeed = 0.05;
        this.play();
        this.course = course;
    }
    celebrate() {
        const spritesheet = Assets.get('sprites/pngs')
        this.textures = spritesheet.animations['end-celebration'];
        this.animationSpeed = 0.05;
        this.play();
    }
}
class SlalomGate extends AnimatedSprite {
    constructor(course) {
        const spritesheet = Assets.get('sprites/pngs')
        super(spritesheet.animations['gate']);
        this.anchor.set(0.5, 0.5);
        this.animationSpeed = 0.05;
        this.play();
        this.course = course;
    }

}

export class SlalomCourse extends Container {
    constructor() {
        super({ isRenderGroup: false });
        this.hasMovedThisFrame = false;
        this.gateInterval = 80;
        this.courseWidth = 120;
        this.isSlalomCourse = true;

        this.gatesPassed = [];

        this.startPoint = { x: 0, y: 0 };
        this.endPoint = { x: 0, y: this.gateInterval * 5 };
        this.gates = [
            { x: -this.courseWidth / 4, y: this.gateInterval },
            { x: this.courseWidth / 4, y: this.gateInterval * 2 },
            { x: -this.courseWidth / 4, y: this.gateInterval * 3 },
            { x: this.courseWidth / 4, y: this.gateInterval * 4 },
        ]

        this.entities = [];

        for (const gate of this.gates) {
            const leftGate = new SlalomGate(this);
            leftGate.x = gate.x - this.courseWidth / 2;
            leftGate.y = gate.y;
            this.addChild(leftGate);
            this.entities.push(leftGate);
            const rightGate = new SlalomGate(this);
            rightGate.x = gate.x + this.courseWidth / 2;
            rightGate.y = gate.y;
            this.addChild(rightGate);
            this.entities.push(rightGate);
        }
        const startLeft = new SlalomStart(this);
        startLeft.x = this.startPoint.x - this.courseWidth / 2;
        startLeft.y = this.startPoint.y;
        this.addChild(startLeft);
        this.entities.push(startLeft);
        const startRight = new SlalomStart(this);
        startRight.x = this.startPoint.x + this.courseWidth / 2;
        startRight.y = this.startPoint.y;
        this.addChild(startRight);
        this.entities.push(startRight);
        this.endLeft = new SlalomFinish(this);
        this.endLeft.x = this.endPoint.x - this.courseWidth / 2;
        this.endLeft.y = this.endPoint.y;
        this.addChild(this.endLeft);
        this.entities.push(this.endLeft);
        this.endRight = new SlalomFinish(this);
        this.endRight.x = this.endPoint.x + this.courseWidth / 2;
        this.endRight.y = this.endPoint.y;
        this.addChild(this.endRight);
        this.entities.push(this.endRight);

        this.determineDimensions();


    }

    // Check if the player is within the gate's area and update gatesPassed accordingly
    passedAllGates(player) {
        for (let i = 0; i < this.entities.length; i += 2) {
            const leftgate = this.entities[i];
            const rightgate = this.entities[i + 1];
            if (player.y > leftgate.y + this.y - leftgate.height / 2 && player.y < leftgate.y + this.y + leftgate.height / 2) {
                if (player.x > leftgate.x + this.x && player.x < rightgate.x + this.x) {
                    leftgate.filters = [new OutlineFilter(2, 0x00ff00)];
                    rightgate.filters = [new OutlineFilter(2, 0x00ff00)];
                    if (!this.gatesPassed.includes(i / 2)) {
                        this.gatesPassed.push(i / 2);
                    }
                }
            }
        }
        if (this.gatesPassed.length === this.gates.length + 2) {
            this.endLeft.filters = [];
            this.endRight.filters = [];
            this.endLeft.celebrate();
            this.endRight.celebrate();
            return true;
        }
        return false;
    }

    determineDimensions() {
        const allX = this.entities.flatMap(e => [e.x - e.width / 2, e.x + e.width / 2]);
        const allY = this.entities.flatMap(e => [e.y - e.height / 2, e.y + e.height / 2]);
        this.minX = Math.min(...allX);
        this.maxX = Math.max(...allX);
        this.minY = Math.min(...allY);
        this.maxY = Math.max(...allY);
    }
}