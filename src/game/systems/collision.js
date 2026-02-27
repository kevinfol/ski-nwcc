
export function detectCollisionPixelPerfect(playerEntity, otherEntity) {
    const playerBounds = playerEntity.getBounds();
    const otherBounds = otherEntity.getBounds();
    if (playerBounds.x < otherBounds.x + otherBounds.width &&
        playerBounds.x + playerBounds.width > otherBounds.x &&
        playerBounds.y < otherBounds.y + otherBounds.height &&
        playerBounds.y + playerBounds.height > otherBounds.y) {
        // Get the overlapping rectangle
        const overlapX = Math.max(0, Math.min(playerBounds.x + playerBounds.width, otherBounds.x + otherBounds.width) - Math.max(playerBounds.x, otherBounds.x));
        const overlapY = Math.max(0, Math.min(playerBounds.y + playerBounds.height, otherBounds.y + otherBounds.height) - Math.max(playerBounds.y, otherBounds.y));

        // Create a canvas to check pixel data
        const canvas = document.createElement('canvas');
        canvas.width = overlapX;
        canvas.height = overlapY;
        const context = canvas.getContext('2d');

        // Draw the overlapping area of both entities onto the canvas
        const spriteSheetTexture = playerEntity.texture.baseTexture.resource;
        // draw the player entity using the correct frame from the spritesheet
        context.rotate(playerEntity.texture.rotation * (45 * Math.PI / 180));
        context.drawImage(
            spriteSheetTexture,
            playerEntity.texture.frame.x,
            playerEntity.texture.frame.y,
            playerEntity.texture.frame.width,
            playerEntity.texture.frame.height,
            playerBounds.x - Math.max(playerBounds.x, otherBounds.x),
            playerBounds.y - Math.max(playerBounds.y, otherBounds.y),
            playerEntity.texture.frame.width,
            playerEntity.texture.frame.height,
        );
        context.setTransform(1, 0, 0, 1, 0, 0); // Reset transformation to default
        // draw the other entity using the correct frame from the spritesheet
        const otherSpriteSheetTexture = otherEntity.texture.baseTexture.resource;
        context.rotate(otherEntity.texture.rotation * (45 * Math.PI / 180));
        context.globalCompositeOperation = 'destination-in'; // Only keep pixels that overlap
        context.drawImage(
            otherSpriteSheetTexture,
            otherEntity.texture.frame.x,
            otherEntity.texture.frame.y,
            otherEntity.texture.frame.width,
            otherEntity.texture.frame.height,
            otherBounds.x - Math.max(playerBounds.x, otherBounds.x),
            otherBounds.y - Math.max(playerBounds.y, otherBounds.y),
            otherEntity.texture.frame.width,
            otherEntity.texture.frame.height,
        );
        context.setTransform(1, 0, 0, 1, 0, 0); // Reset transformation to default

        // Check if any pixels are overlapping
        if (canvas.width === 0 || canvas.height === 0) {
            return false; // No overlapping area
        }
        const imageData = context.getImageData(0, 0, overlapX, overlapY).data;

        for (let i = 3; i < imageData.length; i += 4) { // Check alpha channel
            if (imageData[i] > 0) {
                return true; // Collision detected
            }
        }
    }
    return false; // No collision
}