import Phaser from "phaser";
import { assetsForGroups, type AssetGroup } from "../assets";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  init(data: { groups?: AssetGroup[]; next?: string; level?: number }): void {
    this.registry.set("preloadNext", data.next ?? "MenuScene");
    this.registry.set("preloadLevel", data.level ?? 1);
    this.registry.set("preloadGroups", data.groups ?? ["common", "day", "night", "bonus", "shop"]);
  }

  preload(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    const bar = this.add.rectangle(width / 2, height / 2, 360, 16, 0xffffff, 0.18);
    const fill = this.add.rectangle(width / 2 - 180, height / 2, 1, 16, 0xf4d35e).setOrigin(0, 0.5);
    this.add.text(width / 2, height / 2 - 44, "Загрузка охоты", {
      fontSize: "24px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.load.on("progress", (value: number) => {
      fill.width = Math.max(1, 360 * value);
    });

    const groups = this.registry.get("preloadGroups") as AssetGroup[];
    for (const asset of assetsForGroups(groups)) {
      if (asset.type === "image") {
        this.load.image(asset.key, asset.url);
      }
      if (asset.type === "audio") {
        this.load.audio(asset.key, asset.url);
      }
    }

    this.load.once("complete", () => {
      bar.destroy();
      fill.destroy();
    });
  }

  create(): void {
    this.scene.start(this.registry.get("preloadNext") as string, {
      level: this.registry.get("preloadLevel")
    });
  }
}

