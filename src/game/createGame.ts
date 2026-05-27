import Phaser from "phaser";
import type { VkRuntime } from "../vk/vkBridge";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { MenuScene } from "./scenes/MenuScene";
import { LevelSelectScene } from "./scenes/LevelSelectScene";
import { HuntScene } from "./scenes/HuntScene";
import { ResultsScene } from "./scenes/ResultsScene";
import { ShopScene } from "./scenes/ShopScene";

export type GameServices = {
  vk: VkRuntime;
};

export function createGame(options: { parent: string; vk: VkRuntime }): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: options.parent,
    backgroundColor: "#10251f",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 960,
      height: 540
    },
    input: {
      activePointers: 2
    },
    scene: [BootScene, PreloadScene, MenuScene, LevelSelectScene, HuntScene, ResultsScene, ShopScene],
    callbacks: {
      postBoot: (game) => {
        game.registry.set("services", { vk: options.vk } satisfies GameServices);
      }
    }
  };

  return new Phaser.Game(config);
}

