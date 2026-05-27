export type AssetGroup = "boot" | "common" | "day" | "night" | "bonus" | "shop";

export type GameAsset = {
  key: string;
  type: "image" | "audio";
  group: AssetGroup;
  url: string;
};

export const ASSETS: GameAsset[] = [
  { key: "bg-day", type: "image", group: "day", url: "assets/backgrounds/day.svg" },
  { key: "bg-night", type: "image", group: "night", url: "assets/backgrounds/night.svg" },
  { key: "target-duck", type: "image", group: "day", url: "assets/targets/duck.svg" },
  { key: "target-boar", type: "image", group: "day", url: "assets/targets/boar.svg" },
  { key: "target-rabbit", type: "image", group: "day", url: "assets/targets/rabbit.svg" },
  { key: "target-deer", type: "image", group: "day", url: "assets/targets/deer.svg" },
  { key: "target-squirrel", type: "image", group: "day", url: "assets/targets/squirrel.svg" },
  { key: "target-owl", type: "image", group: "night", url: "assets/targets/owl.svg" },
  { key: "target-wolf", type: "image", group: "night", url: "assets/targets/wolf.svg" },
  { key: "target-bear", type: "image", group: "night", url: "assets/targets/bear.svg" },
  { key: "target-insect", type: "image", group: "bonus", url: "assets/targets/insect.svg" },
  { key: "dog-laugh", type: "image", group: "common", url: "assets/ui/dog-laugh.svg" },
  { key: "crosshair", type: "image", group: "common", url: "assets/ui/crosshair.svg" }
];

export function assetsForGroups(groups: AssetGroup[]): GameAsset[] {
  return ASSETS.filter((asset) => groups.includes(asset.group));
}

