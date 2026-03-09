import * as Phaser from "phaser";
import { SiteManifest } from "../../SiteManifest";
import { CyberUIFactory } from "../ui/CyberUIFactory";

class Tower extends Phaser.GameObjects.Rectangle {
    type: string;
    level: number;
    fireRate: number;
    lastFired: number;
    damage: number;

    constructor(scene: Phaser.Scene, x: number, y: number, type: string) {
        // Mock visuals for Standard Pulse Tower (Level 1)
        super(scene, x, y, 32, 32, parseInt(SiteManifest.visuals.colors.allyBlue.replace('#', '0x')));
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // Static body
        this.type = type;
        this.level = 1;
        this.fireRate = 1000;
        this.lastFired = 0;
        this.damage = 10;

        // Jiggle effect using Phaser tweens
        this.setInteractive();
        this.on('pointerover', () => {
            scene.tweens.add({
                targets: this,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100,
                yoyo: true
            });
        });
    }

    fire(target: Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle, time: number) {
        if (time > this.lastFired + this.fireRate) {
            this.lastFired = time;
            // Create a projectile
            const proj = this.scene.add.rectangle(this.x, this.y, 4, 8, 0xffffff);
            this.scene.physics.add.existing(proj);
            const body = proj.body as Phaser.Physics.Arcade.Body;
            this.scene.physics.moveToObject(proj, target, 400);

            // Mock collision logic handling later. Right now just destroy target in scene.
            // A real implementation would use colliders.
            this.scene.time.delayedCall(Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) / 400 * 1000, () => {
                if (target.active) {
                    proj.destroy();
                    // Enemy takes damage
                    (target as any).hp -= this.damage;
                    if ((target as any).hp <= 0) {
                        (this.scene as MainScene).dropBits(target.x, target.y);
                        target.destroy();
                    }
                } else {
                    proj.destroy();
                }
            });
        }
    }
}

export default class MainScene extends Phaser.Scene {
    bits!: Phaser.Physics.Arcade.Group;
    enemies!: Phaser.Physics.Arcade.Group;
    towers!: Phaser.GameObjects.Group;
    cursorVec!: Phaser.Math.Vector2;
    score: number = 0;
    scoreText!: Phaser.GameObjects.Text;

    // Difficulty System
    startTime: number = 0;
    difficultyTokens: number = 0;
    lastTokenTick: number = 0;

    constructor() {
        super("MainScene");
    }

    create() {
        this.bits = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.towers = this.add.group();
        this.cursorVec = new Phaser.Math.Vector2(0, 0);
        this.startTime = this.time.now;

        // Load Persistence
        const savedData = localStorage.getItem("sentience_save");
        let initialScore = SiteManifest.balance.startingBits;

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (typeof parsed.score === 'number') initialScore = parsed.score;
                if (Array.isArray(parsed.towers)) {
                    parsed.towers.forEach((tData: any) => {
                        const tower = new Tower(this, tData.x, tData.y, tData.type || "pulse");
                        this.towers.add(tower);
                    });
                }
            } catch (err) {
                console.error("Failed to parse save data");
            }
        }

        this.score = initialScore;

        this.scoreText = this.add.text(20, 20, `BITS: ${this.score}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: "24px",
            color: SiteManifest.visuals.colors.currencyYellow,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: SiteManifest.visuals.colors.currencyYellow,
                blur: 10,
                fill: true
            }
        });
        this.scoreText.setScrollFactor(0);

        // Define world bounds
        const worldHeight = 4000;
        this.physics.world.setBounds(0, 0, Number(this.game.config.width), worldHeight);

        // Build the physical layout blocks
        this.buildLayout(Number(this.game.config.width));

        // Camera scroll variables
        let isDragging = false;
        let startDragY = 0;
        let startScrollY = 0;

        // Mouse wheel scrolling
        this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: any, deltaX: number, deltaY: number) => {
            this.cameras.main.scrollY += deltaY * 0.5;
            this.cameras.main.scrollY = Phaser.Math.Clamp(this.cameras.main.scrollY, 0, worldHeight - this.cameras.main.height);
        });

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            const objectsClicked = this.input.hitTestPointer(pointer);
            if (objectsClicked.length === 0) {
                startDragY = pointer.y; // screen y
                startScrollY = this.cameras.main.scrollY;
                isDragging = true;
            }
        });

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            this.cursorVec.set(pointer.worldX, pointer.worldY);
            if (isDragging) {
                const dy = pointer.y - startDragY;
                this.cameras.main.scrollY = startScrollY - dy;
                this.cameras.main.scrollY = Phaser.Math.Clamp(this.cameras.main.scrollY, 0, worldHeight - this.cameras.main.height);
            }
        });

        this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if (isDragging) {
                isDragging = false;
                // If it was a click and not a drag, try to place a tower
                if (Math.abs(pointer.y - startDragY) < 10) {
                    this.tryPlaceTower(pointer.worldX, pointer.worldY);
                }
            }
        });

        // Auto-save
        this.time.addEvent({
            delay: 5000,
            callback: this.saveGame,
            callbackScope: this,
            loop: true
        });
    }

    tryPlaceTower(worldX: number, worldY: number) {
        const cost = SiteManifest.balance.upgradeCosts.pulse[0];
        if (this.score >= cost) {
            this.score -= cost;
            this.scoreText.setText(`BITS: ${this.score}`);
            const tower = new Tower(this, worldX, worldY, "pulse");
            this.towers.add(tower);
            this.saveGame();
        } else {
            this.scoreText.setColor('#FF3131');
            this.time.delayedCall(200, () => this.scoreText.setColor(SiteManifest.visuals.colors.currencyYellow));
        }
    }

    buildLayout(worldWidth: number) {
        let currentY = 100;
        const centerX = worldWidth / 2;
        const colorText = SiteManifest.visuals.colors.text;
        const colorEnemy = SiteManifest.visuals.colors.enemyRed;
        const colorGreen = "#39ff14";

        // --- Header ---
        const ccd = CyberUIFactory.createText(this, 100, currentY, "[ CCD ]", colorText, "24px");
        CyberUIFactory.applyHoverTween(this, ccd);
        currentY += 200;

        // --- Hero ---
        const avatar = CyberUIFactory.createGlowingBox(this, centerX - 200, currentY, 150, 150, colorText);
        CyberUIFactory.createText(this, centerX - 240, currentY - 10, "[Avatar]", colorText, "12px");
        CyberUIFactory.applyHoverTween(this, avatar);

        const title = CyberUIFactory.createText(this, centerX - 50, currentY - 40, "Cooper Christophe\nDalton", colorText, "24px");
        CyberUIFactory.applyHoverTween(this, title);

        CyberUIFactory.createText(this, centerX - 50, currentY + 30, "CS Student @ UCSB, Game Dev & AI\nenthusiast. Programmer with\nshort brown hair and glasses.", colorText, "12px");

        currentY += 400;

        // --- Projects ---
        CyberUIFactory.createText(this, centerX - 100, currentY, "// PROJECTS", colorText, "20px");
        currentY += 150;

        const projects = [
            { title: "Unity DOTS Engine", desc: "Data-Oriented Tech Stack\ngame architecture." },
            { title: "AI Neural Net", desc: "Custom LLM inference pipeline\nin C++." },
            { title: "SB Hacks Winner", desc: "Best overall project\nat SB Hacks UX." },
        ];

        let projX = centerX - 300;
        projects.forEach((proj, i) => {
            const cardY = currentY + (i % 2 !== 0 ? 50 : 0);
            const card = CyberUIFactory.createGlowingBox(this, projX, cardY, 260, 160, colorText);
            CyberUIFactory.applyHoverTween(this, card);

            CyberUIFactory.createText(this, projX - 110, cardY - 50, proj.title, colorText, "14px");
            CyberUIFactory.createText(this, projX - 110, cardY - 10, proj.desc, colorText, "10px");

            // Progress bar
            this.add.rectangle(projX, cardY + 50, 220, 4, parseInt("0xffffff"), 0.3);
            this.add.rectangle(projX - 110 + (110 * Math.random()), cardY + 50, 220 * Math.random(), 4, parseInt("0xffffff"), 1).setOrigin(0, 0.5);

            projX += 300;
        });

        currentY += 400;

        // --- Habit Tracker ---
        const habitBox = CyberUIFactory.createGlowingBox(this, centerX, currentY, 700, 250, colorGreen, 0.1);
        CyberUIFactory.createText(this, centerX - 320, currentY - 90, "// HABIT_LOG", colorGreen, "20px");

        // Pseudo heatmap
        let startHX = centerX - 320;
        let startHY = currentY - 40;
        for (let i = 0; i < 200; i++) {
            const hx = startHX + (i % 40) * 16;
            const hy = startHY + Math.floor(i / 40) * 16;
            const active = (((i * 13) % 50) / 100) > 0.2;
            const alpha = active ? (((i * 13) % 50) / 100 + 0.5) : 0.1;
            this.add.rectangle(hx, hy, 12, 12, parseInt("0x39ff14"), alpha);
        }

        currentY += 400;

        // --- Data Banks (Nexus) ---
        CyberUIFactory.createText(this, centerX - 120, currentY, "// CORE_NEXUS", colorEnemy, "20px");
        currentY += 200;

        const coreBox = CyberUIFactory.createGlowingBox(this, centerX, currentY, 700, 300, colorText, 0.05);
        CyberUIFactory.createText(this, centerX - 320, currentY - 110, "_LATEST_THINGS", colorText, "16px");

        const posts = ["AI vs Game Design: A Synthesis", "The State of Next.js 16", "Rendering Canvas Overlays"];
        posts.forEach((p, i) => {
            const postTxt = CyberUIFactory.createText(this, centerX - 300, currentY - 50 + (i * 60), p, colorText, "12px");
            CyberUIFactory.applyHoverTween(this, postTxt);
        });

        CyberUIFactory.createText(this, centerX + 100, currentY - 110, "_DATA_BANKS", colorText, "16px");
        CyberUIFactory.createText(this, centerX + 100, currentY - 50, "Zero to One - Peter Thiel", colorText, "12px");
        CyberUIFactory.createText(this, centerX + 100, currentY, "The Upanishads - Eknath Easwaran", colorText, "12px");

        currentY += 250;
        CyberUIFactory.createText(this, centerX - 250, currentY, "WARNING: PROTECT THE NEXUS FROM GLITCH ENTITIES", colorEnemy, "10px");
    }

    saveGame() {
        const towerData = this.towers.getChildren().map((t: any) => ({
            x: t.x,
            y: t.y,
            type: t.type,
            level: t.level
        }));
        const data = {
            score: this.score,
            towers: towerData
        };
        localStorage.setItem("sentience_save", JSON.stringify(data));
    }

    getDifficultyScalar(time: number) {
        const tSeconds = (time - this.startTime) / 1000;
        const rawScalar = 1 + (tSeconds / 600); // Requested formula
        return Math.min(rawScalar, SiteManifest.balance.maxDifficultyScalar);
    }

    getTokensPerSecond(scalar: number) {
        return 1 * scalar;
    }

    spawnEnemy(scalar: number) {
        // Pick enemy based on weights and tokens
        let enemyType = "scout";
        let cost = SiteManifest.balance.tokenCosts.scout;

        const rand = Math.random();
        if (scalar > 2) { // Late Game
            if (rand < 0.4) { enemyType = "tank"; cost = SiteManifest.balance.tokenCosts.tank; }
            else if (rand < 0.8) { enemyType = "grunt"; cost = SiteManifest.balance.tokenCosts.grunt; }
        } else if (scalar > 1.2) { // Mid Game
            if (rand < 0.1) { enemyType = "tank"; cost = SiteManifest.balance.tokenCosts.tank; }
            else if (rand < 0.4) { enemyType = "grunt"; cost = SiteManifest.balance.tokenCosts.grunt; }
        }

        if (this.difficultyTokens >= cost) {
            this.difficultyTokens -= cost;

            // Scaled HP calculation
            const baseHp = SiteManifest.balance.enemyHP[enemyType as keyof typeof SiteManifest.balance.enemyHP];
            const scaledHp = baseHp * Math.pow(scalar, 0.5);

            const x = Phaser.Math.Between(100, Number(this.game.config.width) - 100);

            // Visual diff
            let size = 20; let color = SiteManifest.visuals.colors.enemyRed;
            if (enemyType === "grunt") size = 30;
            if (enemyType === "tank") size = 45;

            const enemy = this.add.rectangle(x, this.cameras.main.scrollY - 50, size, size, parseInt(color.replace('#', '0x')));
            this.physics.add.existing(enemy);

            (enemy as any).hp = scaledHp;

            const body = enemy.body as Phaser.Physics.Arcade.Body;
            const speed = enemyType === "scout" ? 100 : (enemyType === "grunt" ? 60 : 30);
            body.setVelocityY(speed);
            this.enemies.add(enemy);
        }
    }

    dropBits(x: number, y: number) {
        const { bitDropRate } = SiteManifest.balance;
        const count = Phaser.Math.Between(bitDropRate[0], bitDropRate[1]);
        for (let i = 0; i < count; i++) {
            const bit = this.add.rectangle(
                x + Phaser.Math.Between(-20, 20),
                y + Phaser.Math.Between(-20, 20),
                8, 8,
                parseInt(SiteManifest.visuals.colors.currencyYellow.replace('#', '0x'))
            );
            this.physics.add.existing(bit);
            (bit.body as Phaser.Physics.Arcade.Body).setDrag(0.9);
            this.bits.add(bit);
        }
    }

    update(time: number, delta: number) {
        const scalar = this.getDifficultyScalar(time);

        // Token accumulation
        if (time > this.lastTokenTick + 1000) {
            this.difficultyTokens += this.getTokensPerSecond(scalar);
            this.lastTokenTick = time;

            // Try spawning enemy every second if we have tokens
            this.spawnEnemy(scalar);
        }

        // Tower combat logic
        this.towers.getChildren().forEach((towerObj) => {
            const tower = towerObj as Tower;
            // Find closest enemy
            let closest: any = null;
            let minDist = 300; // Attack range

            this.enemies.getChildren().forEach((enemyObj) => {
                const enemy = enemyObj as Phaser.GameObjects.Rectangle;
                const dist = Phaser.Math.Distance.Between(tower.x, tower.y, enemy.x, enemy.y);
                if (dist < minDist) {
                    minDist = dist;
                    closest = enemy;
                }
            });

            if (closest) {
                tower.fire(closest, time);
            }
        });

        // 1/r^2 magnetic bit collection
        const magnetRadius = 150;
        this.bits.getChildren().forEach((bitObj) => {
            const bit = bitObj as Phaser.GameObjects.Rectangle;
            const body = bit.body as Phaser.Physics.Arcade.Body;
            const dist = Phaser.Math.Distance.Between(bit.x, bit.y, this.cursorVec.x, this.cursorVec.y);

            if (dist < magnetRadius && dist > 10) {
                const force = 5000 / Math.max(dist, 10);
                this.physics.moveTo(bit, this.cursorVec.x, this.cursorVec.y, force);
            } else if (dist <= 20) {
                bit.destroy();
                this.score++;
                this.scoreText.setText(`BITS: ${this.score}`);
                // Throttled save could go here, but rely on 5s auto-save
            } else {
                body.velocity.x *= 0.95;
                body.velocity.y *= 0.95;
            }
        });

        // Cleanup offscreen enemies
        this.enemies.getChildren().forEach((enemyObj) => {
            const enemy = enemyObj as Phaser.GameObjects.Rectangle;
            if (enemy.y > this.cameras.main.scrollY + this.cameras.main.height + 100) {
                enemy.destroy();
                // Reduce Nexus health goes here
            }
        });
    }
}
