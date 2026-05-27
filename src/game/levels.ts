export type TargetKind =
  | "duck"
  | "rabbit"
  | "squirrel"
  | "boar"
  | "deer"
  | "owl"
  | "wolf"
  | "bear"
  | "insect";

export type LevelTheme = "day" | "night" | "bonus";

export type LevelConfig = {
  level: number;
  theme: LevelTheme;
  targets: TargetKind[];
  targetCount: number;
  ammo: number;
  targetSpeed: number;
  spawnDelayMs: number;
  aimDrift: number;
  rewardCoins: number;
  perfectBonusCoins: number;
};

const dayTargets: TargetKind[] = ["duck", "rabbit", "squirrel", "boar", "deer"];
const nightTargets: TargetKind[] = ["duck", "owl", "wolf", "bear"];
const bonusTargets: TargetKind[] = ["insect"];

export const LEVELS: LevelConfig[] = Array.from({ length: 100 }, (_, index) => {
  const level = index + 1;
  const isBonus = level % 10 === 0;
  const theme: LevelTheme = isBonus ? "bonus" : level >= 30 ? "night" : "day";
  const tier = Math.floor((level - 1) / 10);
  const targetCount = isBonus ? 18 + tier * 2 : 5 + Math.floor(level * 0.65);
  const ammo = targetCount + Math.max(1, 4 - Math.floor(level / 25));
  const targetSpeed = 120 + level * 7 + (isBonus ? 80 : 0);
  const spawnDelayMs = Math.max(420, 1400 - level * 9 - (isBonus ? 180 : 0));
  const aimDrift = Number(Math.min(0.42, 0.04 + level * 0.004).toFixed(3));
  const rewardCoins = 12 + level * 2 + (isBonus ? 35 : 0);

  return {
    level,
    theme,
    targets: theme === "bonus" ? bonusTargets : theme === "night" ? nightTargets : dayTargets,
    targetCount,
    ammo,
    targetSpeed,
    spawnDelayMs,
    aimDrift,
    rewardCoins,
    perfectBonusCoins: Math.round(rewardCoins * 0.45)
  };
});

export function getLevelConfig(level: number): LevelConfig {
  return LEVELS[Math.max(0, Math.min(99, level - 1))];
}

