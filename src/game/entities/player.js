import { AnimatedSprite, Assets, Graphics } from "pixi.js";

export class Player extends AnimatedSprite {
    constructor() {
        const spritesheet = Assets.get('sprites/pngs')
        super(spritesheet.animations['snowman_down']);
        this.anchor.set(0.5, 0.5);
        this.animationSpeed = 0.05;
        this.play();
        this.isCrashed = false;
        this.animations = {
            down: spritesheet.animations['snowman_down'],
            right: spritesheet.animations['snowman_right'],
            down_right: spritesheet.animations['snowman_down_right'],
            crash: spritesheet.animations['snowman_crash'],
            left: spritesheet.animations['snowman_right'],
            down_left: spritesheet.animations['snowman_down_right'],
        }
        this.currentDirection = 'down';
        this.currentDirectionAngle = Math.PI // down
        this.constantVelocity = 3;
        this.currentVelocity = { x: Math.sin(this.currentDirectionAngle) * this.constantVelocity, y: Math.cos(this.currentDirectionAngle) * this.constantVelocity };
    }
    crash() {
        this.textures = this.animations['crash'];
        this.play();
        this.currentVelocity = { x: 0, y: 0 };
        this.isCrashed = true;
        this.emitCrashEvent();
        setTimeout(() => {
            this.isCrashed = false;

        }, 1000)
    }
    emitCrashEvent() {
        const event = new CustomEvent('playerCrashed', { detail: { player: this } });
        window.dispatchEvent(event);
    }
    updateSpeed(difficulty) {
        if (difficulty === 'easy') {
            this.constantVelocity = 3;
        } else if (difficulty === 'medium') {
            this.constantVelocity = 4;
        } else if (difficulty === 'hard') {
            this.constantVelocity = 5;
        } else if (difficulty === 'extreme') {
            this.constantVelocity = 6;
        } else {
            this.constantVelocity = 8;
        }
    }
    updatePlayer(direction) {
        if (this.isCrashed) {
            return;
        }
        // update the direction angle based on the input x direction
        if (direction.x > 0) {
            this.currentDirectionAngle = (0.95 * this.currentDirectionAngle + 0.05 * (Math.PI / 2));
        } else if (direction.x < 0) {
            this.currentDirectionAngle = (0.95 * this.currentDirectionAngle + 0.05 * (3 * Math.PI / 2))
        } else {
            this.currentDirectionAngle = (0.9 * this.currentDirectionAngle + (0.1 * Math.PI));
        }
        this.currentDirectionAngle = Math.min(this.currentDirectionAngle, Math.PI * 1.5);
        this.currentDirectionAngle = Math.max(this.currentDirectionAngle, Math.PI / 2);
        this.currentVelocity = { x: Math.sin(this.currentDirectionAngle) * this.constantVelocity, y: Math.cos(this.currentDirectionAngle) * this.constantVelocity };
        let newDirection = this.currentDirection;
        if (this.currentVelocity.x >= 0.9*this.constantVelocity) {
            newDirection = 'right';
        } else if (this.currentVelocity.x > 0.25*this.constantVelocity) {
            newDirection = 'down_right';
        } else if (this.currentVelocity.x <= -0.9*this.constantVelocity) {
            newDirection = 'left';
        } else if (this.currentVelocity.x < -0.25*this.constantVelocity) {
            newDirection = 'down_left';
        } else {
            newDirection = 'down';
        }
        if (newDirection !== this.currentDirection) {
            this.currentDirection = newDirection;
            this.textures = this.animations[this.currentDirection];
            if (this.currentDirection === 'left') {
                this.scale.set(-1, 1);
            } else if (this.currentDirection === 'down_left') {
                this.scale.set(-1, 1);
            } else {
                this.scale.set(1, 1);
            }
            this.play();
        }
    }
}

export class PlayerTrail extends Graphics {
    constructor() {
        super();
        this.isTrail = true;
        this.trailPoints = []
        this.offsetX = 3;
        this.offsetY = 0;
    }
    initializeTrailPoints(player) {
        this.trailPoints.push({ x: player.x, y: player.y });
    }
    updateTrail(speedX, speedY) {
        this.updatePoints(speedX, speedY);
        this.updateLine();
    }
    updatePoints(speedX, speedY) {
        const newPoint = { x: this.trailPoints[0].x + speedX, y: this.trailPoints[0].y - speedY };
        this.trailPoints.unshift(newPoint);
        this.trailPoints = this.trailPoints.slice(0, 50);
        this.trailPoints = this.trailPoints.map(point => {
            return { x: point.x - speedX, y: point.y + speedY };
        })
    }
    updateLine() {
        this.clear()
        this.moveTo(this.trailPoints[0].x - this.offsetX, this.trailPoints[0].y + this.offsetY);
        this.setStrokeStyle({ color: 0x03e3fc, width: 3, alpha: 0.5 });
        for (let i = 1; i < this.trailPoints.length; i++) {
            this.lineTo(this.trailPoints[i].x - this.offsetX, this.trailPoints[i].y + this.offsetY);
        }
        this.stroke();
        this.moveTo(this.trailPoints[0].x + this.offsetX, this.trailPoints[0].y + this.offsetY);
        this.setStrokeStyle({ color: 0x03e3fc, width: 3, alpha: 0.5 });
        for (let i = 1; i < this.trailPoints.length; i++) {
            this.lineTo(this.trailPoints[i].x + this.offsetX, this.trailPoints[i].y + this.offsetY);
        }
        this.stroke();
    }
}