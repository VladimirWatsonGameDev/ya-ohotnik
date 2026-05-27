import Phaser from "phaser";
import type { GameServices } from "../createGame";
import { LEVELS } from "../levels";
import { defaultProgress, type PlayerProgress } from "../player";

export class LevelSelectScene extends Phaser.Scene {
  private progress: PlayerProgress = defaultProgress;

  constructor() {
    super("LevelSelectScene");
  }

  async create(): Promise<void> {
    const { vk } = this.game.registry.get("services") as GameServices;
    this.progress = await vk.getStorage("progress", defaultProgress);
    this.add.image(480, 270, "bg-day").setDisplaySize(960, 540);
    this.add.text(36, 24, "Выбор уровня", { fontSize: "34px", color: "#ffffff", fontStyle: "bold" });

    const cols = 10;
    const cell = 76;
    LEVELS.forEach((level, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = 40 + col * 88;
      const y = 86 + row * 40;
      const unlocked = level.level <= this.progress.unlockedLevel;
      const color = unlocked ? (level.theme === "night" ? 0x314e78 : level.theme === "bonus" ? 0xa65f1e : 0x1f5f46) : 0x39413e;
      const rect = this.add.rectangle(x, y, cell, 30, color).setOrigin(0, 0).setInteractive({ useHandCursor: unlocked });
      this.add.text(x + cell / 2, y + 15, String(level.level), { fontSize: "16px", color: "#ffffff" }).setOrigin(0.5);
      if (unlocked) {
        rect.on("pointerup", () => this.scene.start("HuntScene", { level: level.level }));
      }
    });

    this.add.text(38, 500, "Назад", { fontSize: "24px", color: "#f4d35e" })
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => this.scene.start("MenuScene"));
  }
}

