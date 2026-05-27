import Phaser from "phaser";
import type { GameServices } from "../createGame";
import { defaultProgress, type PlayerProgress } from "../player";

export class MenuScene extends Phaser.Scene {
  private progress: PlayerProgress = defaultProgress;

  constructor() {
    super("MenuScene");
  }

  async create(): Promise<void> {
    const { vk } = this.game.registry.get("services") as GameServices;
    this.progress = await vk.getStorage("progress", defaultProgress);
    this.add.image(480, 270, "bg-day").setDisplaySize(960, 540);

    this.add.text(48, 48, "Я Охотник", {
      fontSize: "54px",
      color: "#ffffff",
      fontStyle: "bold"
    });
    this.add.text(52, 112, "100 уровней меткости", {
      fontSize: "22px",
      color: "#f4d35e"
    });

    this.button(56, 188, "Играть", () => {
      this.scene.start("LevelSelectScene");
    });
    this.button(56, 252, "Магазин", () => {
      this.scene.start("ShopScene");
    });

    const name = vk.user?.first_name ? `${vk.user.first_name}, ` : "";
    this.add.text(56, 458, `${name}монеты: ${this.progress.coins} | открыт уровень: ${this.progress.unlockedLevel}`, {
      fontSize: "20px",
      color: "#ffffff"
    });
  }

  private button(x: number, y: number, label: string, onClick: () => void): void {
    const rect = this.add.rectangle(x, y, 220, 46, 0x1f5f46, 1).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
    const text = this.add.text(x + 20, y, label, { fontSize: "24px", color: "#ffffff" }).setOrigin(0, 0.5);
    rect.on("pointerup", onClick);
    text.setInteractive({ useHandCursor: true }).on("pointerup", onClick);
  }
}

