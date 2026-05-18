# Frog Jump

Frog Jump is a web-based 2D game built using the [Phaser 3](https://phaser.io/) framework. It features a flappy-style gameplay mechanic where the player controls a frog, navigating through obstacles (pipes), and competing for high scores.

## Features

- **Phaser 3 Engine**: Smooth 2D physics and rendering.
- **Classic Gameplay**: Tap or click to make the frog jump and avoid pipes.
- **Scenes**: Structured using Phaser scenes (Boot, Menu, Game, GameOver).
- **Leaderboard System**: Tracks and displays high scores.
- **Responsive Canvas**: Configured for mobile and desktop screens.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- [Phaser 3](https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.js)

## Project Structure

```
Frog/
├── index.html            # Main HTML entry point
├── style.css             # Stylesheet for the game container
├── main.js               # Game configuration and initialization
├── objects/
│   ├── Frog.js           # Frog player object class
│   └── Pipe.js           # Obstacle pipe object class
├── scenes/
│   ├── BootScene.js      # Asset loading scene
│   ├── MenuScene.js      # Main menu and start screen
│   ├── GameScene.js      # Main gameplay loop
│   └── GameOverScene.js  # Game over screen with replay options
└── utils/
    └── leaderboard.js    # Leaderboard utility functions
```

## Play Online

The game is deployed and hosted on Vercel. You can play it directly in your browser without any setup!

[**Play Frog Jump Now!**]((https://frog-game-pi.vercel.app/))


## Controls

- **Desktop**: Click the mouse or press the Spacebar to jump.
- **Mobile**: Tap the screen to jump.
