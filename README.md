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

## How to Run

Because the game loads local assets (images, audio), it needs to be run on a local web server to avoid CORS (Cross-Origin Resource Sharing) issues in the browser.

### Using VS Code Live Server
1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Right-click on `index.html` and select **Open with Live Server**.
4. The game will automatically open in your default web browser.

### Using Python (if installed)
1. Open a terminal or command prompt.
2. Navigate to the game directory (`cd path/to/Frog`).
3. Run the following command:
   - For Python 3: `python -m http.server 8000`
   - For Python 2: `python -m SimpleHTTPServer 8000`
4. Open your web browser and go to `http://localhost:8000`.

### Using Node.js (http-server)
1. If you have Node.js installed, open a terminal.
2. Install `http-server` globally: `npm install -g http-server`
3. Navigate to the game directory.
4. Run: `http-server`
5. Open your web browser and go to the provided localhost URL (usually `http://localhost:8080`).

## Controls

- **Desktop**: Click the mouse or press the Spacebar to jump.
- **Mobile**: Tap the screen to jump.
