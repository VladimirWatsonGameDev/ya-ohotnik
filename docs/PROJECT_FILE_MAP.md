# Карта файлов проекта

```text
.
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── docs
│   ├── LEVEL_BALANCE.md
│   ├── LOADING_ALGORITHM.md
│   ├── MONETIZATION.md
│   ├── FREE_DEMO_MODE.md
│   ├── GITHUB_PAGES_DEPLOY.md
│   ├── PROJECT_FILE_MAP.md
│   └── VK_UPLOAD_PLAN.md
├── .github
│   └── workflows
│       └── deploy-pages.yml
├── public
│   └── assets
│       ├── backgrounds
│       ├── targets
│       └── ui
└── src
    ├── main.ts
    ├── styles.css
    ├── vk
    │   └── vkBridge.ts
    └── game
        ├── assets.ts
        ├── createGame.ts
        ├── levels.ts
        ├── player.ts
        └── scenes
            ├── BootScene.ts
            ├── HuntScene.ts
            ├── LevelSelectScene.ts
            ├── MenuScene.ts
            ├── PreloadScene.ts
            ├── ResultsScene.ts
            └── ShopScene.ts
```

## Назначение ключевых файлов

- `src/main.ts` - точка входа, VK init, запуск игры.
- `src/vk/vkBridge.ts` - все обращения к VK Bridge.
- `src/game/createGame.ts` - конфигурация Phaser.
- `src/game/assets.ts` - манифест всех файлов для загрузчика.
- `src/game/levels.ts` - генератор 100 уровней.
- `src/game/player.ts` - прогресс игрока, винтовки, экономика.
- `src/game/scenes/PreloadScene.ts` - фактический загрузчик ассетов.
- `src/game/scenes/HuntScene.ts` - игровой раунд.
