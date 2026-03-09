import * as Phaser from 'phaser';
import { SiteManifest } from "../../SiteManifest";

export class CyberUIFactory {
    static createText(scene: Phaser.Scene, x: number, y: number, text: string, colorHex: string, size: string = '16px'): Phaser.GameObjects.Text {
        const txt = scene.add.text(x, y, text, {
            fontFamily: SiteManifest.visuals.fontFamily,
            fontSize: size,
            color: colorHex,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: colorHex,
                blur: 10,
                fill: true
            }
        });
        return txt;
    }

    static createGlowingBox(scene: Phaser.Scene, x: number, y: number, width: number, height: number, colorHex: string, alpha: number = 0.2): Phaser.GameObjects.Rectangle {
        const numColor = parseInt(colorHex.replace('#', '0x'));

        // Background with slight alpha
        const box = scene.add.rectangle(x, y, width, height, numColor, alpha);
        box.setStrokeStyle(2, numColor, 1);

        // Add physics body for static obstacles
        scene.physics.add.existing(box, true);

        return box;
    }

    static applyHoverTween(scene: Phaser.Scene, target: Phaser.GameObjects.GameObject) {
        target.setInteractive();

        target.on('pointerover', () => {
            scene.tweens.add({
                targets: target,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 150,
                ease: 'Back.easeOut'
            });
            document.body.style.cursor = 'pointer';
        });

        target.on('pointerout', () => {
            scene.tweens.add({
                targets: target,
                scaleX: 1.0,
                scaleY: 1.0,
                duration: 150,
                ease: 'Back.easeOut'
            });
            document.body.style.cursor = 'default';
        });
    }
}
