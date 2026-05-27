import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#10251f");
    this.scene.start("PreloadScene", { level: 1 });
  }
}

