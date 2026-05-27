# Алгоритм подгрузки файлов и кода

## Цель

Игра должна быстро открыть стартовый экран, показать честный прогресс загрузки и догружать тяжелые файлы только тогда, когда они нужны конкретному режиму.

## Слои загрузки

### 1. HTML shell

Браузер открывает `index.html`, затем загружает основной JS-модуль из `src/main.ts` в dev-режиме или собранный bundle в production.

### 2. VK init

`src/main.ts` вызывает `initVkBridge()`:

1. `VKWebAppInit`;
2. получение пользователя;
3. подготовка методов storage;
4. fallback на `localStorage`, если игра открыта вне VK.

### 3. Phaser boot

`createGame()` создает Phaser-приложение и регистрирует сцены.

Порядок сцен:

1. `BootScene`;
2. `PreloadScene`;
3. `MenuScene`;
4. `LevelSelectScene`;
5. `HuntScene`;
6. `ResultsScene`;
7. `ShopScene`.

### 4. Asset manifest

Все файлы описываются в `src/game/assets.ts`.

Каждый файл имеет:

- `key` - ключ в Phaser;
- `type` - image/audio;
- `group` - logical bundle;
- `url` - путь к файлу в `public`.

Группы:

- `common` - прицел, собака, общие UI-файлы;
- `day` - дневной фон и дневные цели;
- `night` - ночной фон и ночные цели;
- `bonus` - бонусные цели;
- `shop` - оружие и магазин.

### 5. PreloadScene

`PreloadScene` принимает список групп и загружает только нужные ассеты:

```ts
this.scene.start("PreloadScene", {
  groups: ["common", "night"],
  next: "HuntScene",
  level: 30
});
```

Для первого билда сейчас грузятся все группы, чтобы упростить проверку. После появления финальных тяжелых ассетов нужно включить staged loading:

- старт: `common`, `day`;
- перед уровнем 30: `night`;
- перед бонусным уровнем: `bonus`;
- при первом входе в магазин: `shop`.

## Псевдокод загрузки

```ts
startApp()
  initVK()
  createPhaser()
  boot()
  preload(["common", "day"])
  showMenu()

onLevelStart(level)
  groups = ["common"]
  if level.theme == "day" add "day"
  if level.theme == "night" add "night"
  if level.theme == "bonus" add "bonus"
  preloadMissing(groups)
  startHunt(level)

onShopOpen()
  preloadMissing(["shop"])
  showShop()
```

## Правила для production

- Все файлы ассетов должны лежать в `public/assets`.
- Пути в манифесте должны быть относительными.
- Нельзя грузить файлы с HTTP, только HTTPS.
- Большие изображения лучше WebP/AVIF, звуки лучше OGG/MP3.
- Для каждого ассета нужен fallback: если файл не загрузился, игра должна показать замену или мягкую ошибку.
- Финальная сборка не должна зависеть от dev-сервера.

## Контрольные точки

1. `index.html` доступен.
2. JS bundle загружен.
3. `VKWebAppInit` завершился или включился fallback.
4. `PreloadScene` дошла до `complete`.
5. Меню стало интерактивным.
6. Уровень запускает правильный набор ассетов.
7. После боя прогресс записывается в storage.

