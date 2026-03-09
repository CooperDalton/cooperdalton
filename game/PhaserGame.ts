import * as Phaser from "phaser";
import MainScene from "./scenes/MainScene";
import { SiteManifest } from "../SiteManifest";

export const createGame = (parent: string) => {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: "100%",
        height: "100%",
        parent: parent,
        backgroundColor: SiteManifest.visuals.colors.background,
        physics: {
            default: "arcade",
            arcade: {
                debug: false,
            },
        },
        input: {
            mouse: {
                preventDefaultWheel: false,
                preventDefaultDown: false
            },
            touch: {
                capture: false
            }
        },
        scene: [MainScene],
        fps: {
            target: 60,
            forceSetTimeOut: true
        }
    };

    return new Phaser.Game(config);
};
