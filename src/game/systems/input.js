// This module handles keyboard input for the game. It listens for keydown and keyup events to update the state of left and right movement, which can be used by the game logic to move the player character accordingly.
const state = {
    left: false,
    right: false,
}

/**
 * Handles keyboard input for the game. Listens for keydown and keyup events to update the state of left and right movement.
 * @param {Event} e - The keyboard event
 */
function onKey(e) {
    const isDown = e.type === 'keydown';
    switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
            state.left = isDown;
            break;
        case 'ArrowRight':
        case 'KeyD':
            state.right = isDown;
            break;
    }
}

/**
 * Registers the keyboard event listeners and provides a method to get the current direction based on the state of left and right movement.
 * @returns {Object} An object with an x property indicating the horizontal direction (-1 for left, 1 for right, 0 for no movement)
 */
export default {
    register() {
        window.addEventListener('keydown', onKey);
        window.addEventListener('keyup', onKey);
    },
    direction() {
        return { x: (state.right ? 1 : 0) - (state.left ? 1 : 0) };
    }
}