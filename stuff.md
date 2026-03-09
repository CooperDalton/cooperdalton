<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">


The Sentience Portfolio: Full Technical Specification
1. Project Identity & Visual Language
User Profile: Cooper Christophe Dalton, CS Student at UCSB, Game Dev & AI enthusiast.

The Theme: "Cyber-Lofi" (Dark background, pixelated typography, heavy neon bloom).

The Colors:

Enemies: Neon Red (#FF3131).

Allies/UI: Electric Blue (#00E5FF).

Currency (Bits): Cyber Yellow (#CCFF00).

The Juice: Every interactive element (buttons, cards, towers) must use Framer Motion for spring-based scaling and "jiggle" on hover.

2. Page Structure (The Content Terrain)
The website is a single-scroll Next.js page. Each section acts as a "World Object" in the game layer.

A. The Hero Header (Top)
Content: Name, short bio ("Programmer with short brown hair and glasses"), and a pixel-art avatar.

Game Role: This is the Enemy Spawn Point. Enemies "glitch" into existence from behind the header.

B. Project Gallery (Middle)
Content: 3-4 featured projects (e.g., Unity DOTS game, AI projects, SB Hacks winner).

Game Role: These are Path Obstacles. The enemies must pathfind around these cards. The cards should have a subtle glowing border that pulses when an enemy passes nearby.

C. The Habit Tracker (Sidebar or Dedicated Section)
Visual: A 365-day pixelated heatmap (GitHub style).

Integration: Fetches data from a Google Spreadsheet.

Logic: * Opacity of the day square = % of habits hit.

The Global Buff: If the user has a 7-day "Perfect Streak," all towers turn Gold and deal 1.2x damage.

D. Blog & Book Recommendations (Bottom)
Content: Recent thoughts on AI/Game Dev and a list of books like Zero to One or The Upanishads.

Game Role: The "Core" (Nexus). If enemies reach this section, your "Website Health" (displayed at the top) decreases.

3. Game Layer Mechanics (Phaser.js)
The game runs on a transparent canvas overlaying the entire UI.

The Bit Collection System
Death: When an enemy dies, it shatters into 3-5 yellow "Bits."

Magnetism: Bits remain stationary until the mouse cursor is within 150px. They then accelerate toward the cursor using a 1/r 
2
  force calculation.

Economy: Bits are used to buy towers and upgrades.

Towers & Buildings (3 Types, 3 Levels)
Each building has a Hover Tooltip showing stats like "Damage: 10→18" using a pop-in animation.

Pulse Tower (The Standard): Shoots single blue bolts.

Lv 2: Fire rate increase.

Lv 3: Double barrels (two shots at once).

Nova Bomber (The Heavy): Lobs a slow-moving ball that explodes on impact.

Lv 2: Larger explosion radius.

Lv 3: "Fragmenting Shell" (Explosion releases 3 small bolts).

Tesla Field (The AOE): A circular ring of electricity around the building.

Lv 2: Adds a 20% "Slow" debuff to enemies.

Lv 3: Chain lightning (damage jumps to nearby enemies).

Enemy Types
The Scout: Small, fast, neon-red triangle. Low HP.

The Grunt: Standard red square. Balanced speed/HP.

The Tank: Large, slow, glowing red diamond. High HP.

4. Centralized Configuration (SiteManifest.js)
The AI agent must place all tweakable values in this single file so I can balance the game/style later:

Visuals: Bloom intensity, blur radius, font-family.

Balance: Fire rates, enemy HP, bit drop rates, upgrade costs.

UI: Spring stiffness for Framer Motion.

5. Technical Integration Requirements
Next.js Server Actions: To fetch habit data from Google Sheets without exposing API keys.

Phaser-React Bridge: A custom hook to pass the (x,y) coordinates of the Project Cards into the Phaser Pathfinding engine.

Persistence: Use localStorage so that when a visitor returns, their towers and currency are still there.

Would you like me to start by generating the SiteManifest.js file so we have the "DNA" of the site's look and feel ready?

The sketch i added is what the page layout should be like. The other 2 images are the visual style you should replicate. 

Here's how to implement the enemy spawning system

1. The "Intensity" FunctionInstead of just spawning more enemies, we use a global variable, let's call it difficultyScalar.Formula: At any given second $t$, the difficulty is $1 + (t / 600)$. This means every 10 minutes, the game is twice as hard as when you started.The Cap: You should include a MAX_DIFFICULTY cap in your GameConfig.json so the game doesn't eventually become a literal solid wall of red squares.2. Scaling the VariablesAs that difficultyScalar increases, the AI agent should apply it to three specific areas in the spawn logic:A. Spawn Rate (The "Pressure")The delay between spawns should decrease.Logic: currentDelay = BaseDelay / difficultyScalar.Result: Enemies start spawning every 3 seconds, then every 2, then every 1, etc.B. The Weighting System (The "Evolution")At the start, the game should only spawn Scouts. As time goes on, the probability of a Tank spawning increases.Early Game: 100% Scouts.Mid Game: 60% Scouts, 30% Grunts, 10% Tanks.Late Game: 20% Scouts, 40% Grunts, 40% Tanks.C. Stat Padding (The "Scaling")To keep your upgrades relevant, the enemies need more health over time.Logic: enemyHP = baseHP * (difficultyScalar ^ 0.5).We use a square root (^ 0.5) so health doesn't grow faster than your ability to upgrade towers—otherwise, it feels unfair.3. Visualizing the Difficulty CurveYou can actually display this "Intensity" on your website. Imagine a small, glowing "Threat Level" meter in the corner of your Bio section. As the game gets harder, that meter fills up and the bloom intensity of the red enemies gets slightly more aggressive.4. Implementation in the AI CodeWhen you have the AI code the Spawner.js class, tell it to use a "Token System":The game earns "Difficulty Tokens" over time.Each enemy has a "Token Cost" (Scout = 1, Grunt = 3, Tank = 10).The spawner "spends" its tokens to place enemies on the track.As the token-earn-rate increases, the spawner is forced to send bigger, meaner enemies.

go ahead and make the site