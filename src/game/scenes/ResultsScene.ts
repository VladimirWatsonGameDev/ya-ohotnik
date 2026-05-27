import Phaser from "phaser";

export class ResultsScene extends Phaser.Scene {
  constructor() {
    super("ResultsScene");
  }

  create(data: { level: number; passed: boolean; stars: number; coins: number; score: number }): void {
    this.add.image(480, 270, "bg-day").setDisplaySize(960, 540);
    this.add.rectangle(480, 270, 520, 320, 0x10251f, 0.88);
    this.add.text(480, 160, data.passed ? "Уровень пройден" : "Нужно попробовать еще", {
      fontSize: "34px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);
    this.add.text(480, 220, `Звезды: ${"★".repeat(data.stars)}${"☆".repeat(3 - data.stars)}`, {
      fontSize: "32px",
      color: "#f4d35e"
    }).setOrigin(0.5);
    this.add.text(480, 274, `Очки: ${data.score} | Монеты: +${data.coins}`, {
      fontSize: "24px",
      color: "#ffffff"
    }).setOrigin(0.5);
    this.button(300, 356, "К уровням", () => this.scene.start("LevelSelectScene"));
    this.button(508, 356, data.passed && data.level < 100 ? "Дальше" : "Повтор", () => {
      this.scene.start("HuntScene", { level: data.passed ? Math.min(100, data.level + 1) : data.level });
    });
  }

  private button(x: number, y: number, label: string, onClick: () => void): void {
    const rect = this.add.rectangle(x, y, 160, 44, 0x1f5f46).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
    const text = this.add.text(x + 80, y, label, { fontSize: "20px", color: "#ffffff" }).setOrigin(0.5);
    rect.on("pointerup", onClick);
    text.setInteractive({ useHandCursor: true }).on("pointerup", onClick);
  }
}
