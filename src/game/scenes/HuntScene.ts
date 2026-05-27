import Phaser from "phaser";
import type { GameServices } from "../createGame";
import { getLevelConfig, type LevelConfig, type TargetKind } from "../levels";
import { defaultProgress, getSelectedRifle, type PlayerProgress } from "../player";

type TargetSprite = Phaser.GameObjects.Image & { targetKind?: TargetKind };

const targetTexture: Record<TargetKind, string> = {
  duck: "target-duck",
  rabbit: "target-rabbit",
  squirrel: "target-squirrel",
  boar: "target-boar",
  deer: "target-deer",
  owl: "target-owl",
  wolf: "target-wolf",
  bear: "target-bear",
  insect: "target-insect"
};

export class HuntScene extends Phaser.Scene {
  private level!: LevelConfig;
  private progress: PlayerProgress = defaultProgress;
  private ammo = 0;
  private hits = 0;
  private spawned = 0;
  private score = 0;
  private crosshair!: Phaser.GameObjects.Image;
  private ammoText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private spawnTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super("HuntScene");
  }

  async create(data: { level: number }): Promise<void> {
    const { vk } = this.game.registry.get("services") as GameServices;
    this.progress = await vk.getStorage("progress", defaultProgress);
    this.level = getLevelConfig(data.level);
    this.ammo = this.level.ammo;

    this.add.image(480, 270, this.level.theme === "night" ? "bg-night" : "bg-day").setDisplaySize(960, 540);
    this.add.rectangle(480, 506, 960, 68, 0x14362b, 0.86);
    this.ammoText = this.add.text(24, 486, "", { fontSize: "24px", color: "#ffffff" });
    this.scoreText = this.add.text(252, 486, "", { fontSize: "24px", color: "#ffffff" });
    this.add.text(760, 486, `Уровень ${this.level.level}`, { fontSize: "24px", color: "#f4d35e" });

    this.crosshair = this.add.image(480, 270, "crosshair").setDepth(10).setScale(0.9);
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      const rifle = getSelectedRifle(this.progress);
      const drift = this.level.aimDrift * (1 - rifle.aimStability) * 80;
      this.crosshair.setPosition(pointer.x + Math.sin(this.time.now / 180) * drift, pointer.y);
    });
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => this.shoot(pointer.x, pointer.y));

    this.updateHud();
    this.spawnTimer = this.time.addEvent({
      delay: this.level.spawnDelayMs,
      loop: true,
      callback: () => this.spawnTarget()
    });
    this.spawnTarget();
  }

  private spawnTarget(): void {
    if (this.spawned >= this.level.targetCount) {
      this.checkFinish();
      return;
    }

    const kind = Phaser.Utils.Array.GetRandom(this.level.targets);
    const fromLeft = Math.random() > 0.5;
    const y = Phaser.Math.Between(110, 390);
    const x = fromLeft ? -80 : 1040;
    const texture = targetTexture[kind];
    const target = this.add.image(x, y, texture).setInteractive() as TargetSprite;
    target.targetKind = kind;
    target.setScale(kind === "bear" ? 1.2 : kind === "insect" ? 0.55 : 0.82);

    const duration = Math.max(850, 3900 - this.level.targetSpeed * 9);
    this.tweens.add({
      targets: target,
      x: fromLeft ? 1040 : -80,
      y: y + Phaser.Math.Between(-80, 70),
      duration,
      ease: "Sine.easeInOut",
      onComplete: () => target.destroy()
    });

    this.spawned += 1;
  }

  private shoot(x: number, y: number): void {
    if (this.ammo <= 0) {
      this.showDog();
      this.checkFinish();
      return;
    }

    this.ammo -= 1;
    const hit = this.children.list.find((child) => {
      const target = child as TargetSprite;
      if (!target.targetKind || !target.active) {
        return false;
      }
      return Phaser.Math.Distance.Between(x, y, target.x, target.y) < target.displayWidth * 0.42;
    }) as TargetSprite | undefined;

    if (hit) {
      this.hits += 1;
      this.score += 100 + this.level.level * 5;
      this.tweens.killTweensOf(hit);
      hit.destroy();
    } else {
      this.showDog();
    }

    this.updateHud();
    this.checkFinish();
  }

  private showDog(): void {
    const dog = this.add.image(480, 430, "dog-laugh").setScale(0.9).setDepth(8);
    this.tweens.add({
      targets: dog,
      y: 398,
      duration: 180,
      yoyo: true,
      hold: 360,
      onComplete: () => dog.destroy()
    });
  }

  private updateHud(): void {
    this.ammoText.setText(`Патроны: ${this.ammo}/${this.level.ammo}`);
    this.scoreText.setText(`Попадания: ${this.hits}/${this.level.targetCount} | Очки: ${this.score}`);
  }

  private async checkFinish(): Promise<void> {
    if (this.hits >= this.level.targetCount || (this.ammo <= 0 && this.spawned >= this.level.targetCount)) {
      this.spawnTimer?.destroy();
      const passed = this.hits >= Math.ceil(this.level.targetCount * 0.72);
      const stars = this.hits === this.level.targetCount ? 3 : passed ? 2 : this.hits > this.level.targetCount * 0.5 ? 1 : 0;
      const coins = passed ? this.level.rewardCoins + (stars === 3 ? this.level.perfectBonusCoins : 0) : 0;
      const { vk } = this.game.registry.get("services") as GameServices;
      const nextProgress: PlayerProgress = {
        ...this.progress,
        coins: this.progress.coins + coins,
        bestScore: Math.max(this.progress.bestScore, this.score),
        unlockedLevel: passed ? Math.min(100, Math.max(this.progress.unlockedLevel, this.level.level + 1)) : this.progress.unlockedLevel,
        levelStars: {
          ...this.progress.levelStars,
          [this.level.level]: Math.max(this.progress.levelStars[this.level.level] ?? 0, stars)
        }
      };
      await vk.setStorage("progress", nextProgress);
      this.scene.start("ResultsScene", { level: this.level.level, passed, stars, coins, score: this.score });
    }
  }
}
