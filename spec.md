# Specification

## Summary
**Goal:** Build a 3D Indian-themed motorcycle driving game with bike selection, traffic dodging, scoring, and a leaderboard.

**Planned changes:**
- 3D game scene using React Three Fiber with a seamlessly looping Indian highway environment (trees, buildings, chai stalls, billboard signs)
- Third-person camera that follows the player's motorcycle
- Motorcycle controls: accelerate, brake, steer left/right via keyboard (WASD / Arrow keys); bike visually leans during turns
- On-screen touch buttons for mobile devices replicating all keyboard controls
- AI traffic vehicles (auto-rickshaws, trucks, cars) spawning in both lanes; traffic density increases with score
- Collision detection: impact flash effect and speed/health reduction on collision
- HUD showing real-time speed (km/h), distance (km), score, and health bar
- Game Over screen with final score and Restart button when health reaches zero
- Bike selection screen before the game with at least three motorcycle options (Royal Enfield Bullet style, sport bike, scooter), each with speed and handling stat bars
- Selected bike loads into the game with its corresponding stats
- Backend persistence for player scores with nicknames; top-10 leaderboard screen
- Score submission flow on Game Over (player enters nickname)
- Vibrant Indian aesthetic throughout all UI: saffron/terracotta/cream palette, bold decorative Hindi-inspired font for headings, mandala/paisley border accents on menus and HUD panels

**User-visible outcome:** Players can choose a motorcycle, ride down an endless Indian highway dodging traffic, earn scores, submit their nickname to a persistent leaderboard, and experience a consistent sun-baked Indian visual theme across all screens.
