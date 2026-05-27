import Phaser from "phaser";
import type { GameServices } from "../createGame";
import { defaultProgress, RIFLES, type PlayerProgress } from "../player";

export class ShopScene extends Phaser.Scene {
  private progress: PlayerProgress = defaultProgress;

  constructor() {
    super("ShopScene");
  }

  async create(): Promise<void> {
    const { vk } = this.game.registry.get("services") as GameServices;
    this.progress = await vk.getStorage("progress", defaultProgress);
    this.add.image(480, 270, "bg-day").setDisplaySize(960, 540);
    this.add.text(36, 28, `Магазин | Монеты: ${this.progress.coins}`, { fontSize: "34px", color: "#ffffff", fontStyle: "bold" });

    RIFLES.forEach((rifle, index) => {
      const x = 48 + index * 220;
      const owned = this.progress.ownedRifles.includes(rifle.id);
      const selected = this.progress.selectedRifle === rifle.id;
      this.add.rectangle(x, 120, 188, 240, selected ? 0x315f9a : 0x14362b, 0.92).setOrigin(0, 0);
      this.add.text(x + 18, 144, rifle.title, { fontSize: "22px", color: "#ffffff", fontStyle: "bold" });
      this.add.text(x + 18, 194, `Скорость: ${rifle.bulletSpeed}`, { fontSize: "18px", color: "#ffffff" });
      this.add.text(x + 18, 226, `Стабильность: ${rifle.aimStability}`, { fontSize: "18px", color: "#ffffff" });
      this.add.text(x + 18, 258, `Перезарядка: ${rifle.reloadMs}мс`, { fontSize: "18px", color: "#ffffff" });
      this.add.text(x + 18, 310, owned ? (selected ? "Выбрано" : "Выбрать") : `${rifle.priceCoins} монет`, {
        fontSize: "19px",
        color: "#f4d35e"
      }).setInteractive({ useHandCursor: true }).on("pointerup", async () => {
        if (owned) {
          await vk.setStorage("progress", { ...this.progress, selectedRifle: rifle.id });
        } else if (this.progress.coins >= rifle.priceCoins) {
          await vk.setStorage("progress", {
            ...this.progress,
            coins: this.progress.coins - rifle.priceCoins,
            ownedRifles: [...this.progress.ownedRifles, rifle.id],
            selectedRifle: rifle.id
          });
        }
        this.scene.restart();
      });
    });

    this.add.text(52, 414, "Получить 1000 монет", { fontSize: "24px", color: "#f4d35e" })
      .setInteractive({ useHandCursor: true })
      .on("pointerup", async () => {
        await vk.setStorage("progress", {
          ...this.progress,
          coins: this.progress.coins + 1000
        });
        this.scene.restart();
      });

    this.add.text(52, 470, "Назад", { fontSize: "24px", color: "#ffffff" })
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => this.scene.start("MenuScene"));
  }
}
