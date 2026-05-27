export type RifleId = "starter" | "swift" | "hunter" | "night";

export type RifleConfig = {
  id: RifleId;
  title: string;
  priceCoins: number;
  bulletSpeed: number;
  aimStability: number;
  reloadMs: number;
};

export type PlayerProgress = {
  coins: number;
  unlockedLevel: number;
  bestScore: number;
  ownedRifles: RifleId[];
  selectedRifle: RifleId;
  levelStars: Record<string, number>;
};

export const RIFLES: RifleConfig[] = [
  { id: "starter", title: "ИЖ Старт", priceCoins: 0, bulletSpeed: 1, aimStability: 0.76, reloadMs: 420 },
  { id: "swift", title: "Сокол", priceCoins: 900, bulletSpeed: 1.18, aimStability: 0.82, reloadMs: 360 },
  { id: "hunter", title: "Таежник", priceCoins: 2200, bulletSpeed: 1.34, aimStability: 0.9, reloadMs: 320 },
  { id: "night", title: "Ночной след", priceCoins: 4200, bulletSpeed: 1.48, aimStability: 0.94, reloadMs: 290 }
];

export const defaultProgress: PlayerProgress = {
  coins: 150,
  unlockedLevel: 1,
  bestScore: 0,
  ownedRifles: ["starter"],
  selectedRifle: "starter",
  levelStars: {}
};

export function getSelectedRifle(progress: PlayerProgress): RifleConfig {
  return RIFLES.find((rifle) => rifle.id === progress.selectedRifle) ?? RIFLES[0];
}

