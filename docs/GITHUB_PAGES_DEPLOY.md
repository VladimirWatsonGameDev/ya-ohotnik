# Загрузка игры через GitHub Pages

## Что куда загружать

В GitHub-репозиторий загружается весь исходный проект:

```text
README.md
package.json
tsconfig.json
vite.config.ts
index.html
.env.example
.github/workflows/deploy-pages.yml
src/
public/
docs/
```

Не загружать:

```text
node_modules/
dist/
.env
```

`dist/` будет собираться автоматически внутри GitHub Actions.

## Последовательность действий

### 1. Создать репозиторий

На GitHub создать новый публичный репозиторий, например:

```text
ya-ohotnik
```

Публичный репозиторий проще всего использовать с бесплатным GitHub Pages.

### 2. Загрузить файлы проекта

В корень репозитория загрузить все файлы проекта.

Итоговая структура в GitHub должна начинаться так:

```text
ya-ohotnik/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── docs/
├── public/
├── src/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 3. Включить GitHub Pages

В репозитории открыть:

```text
Settings -> Pages
```

В блоке `Build and deployment` выбрать:

```text
Source: GitHub Actions
```

### 4. Запустить сборку

После загрузки файлов в ветку `main` GitHub сам запустит workflow:

```text
Actions -> Deploy GitHub Pages
```

Workflow делает так:

1. берет исходники из репозитория;
2. ставит Node.js;
3. выполняет `npm install`;
4. выполняет `npm run build`;
5. берет папку `dist`;
6. публикует `dist` в GitHub Pages.

### 5. Получить ссылку

После успешного workflow GitHub покажет адрес вида:

```text
https://USERNAME.github.io/ya-ohotnik/
```

Это и есть HTTPS-адрес игры.

### 6. Вставить ссылку в VK

В настройках приложения VK `app54611895` указать адрес GitHub Pages:

```text
https://USERNAME.github.io/ya-ohotnik/
```

Схема запуска:

```text
vk.com/app54611895
  -> открывает GitHub Pages URL
  -> GitHub отдает index.html
  -> index.html подгружает JS/CSS
  -> игра подгружает public/assets
  -> Phaser запускает сцены
```

## Что подгружается по порядку

### 1. VK открывает URL приложения

VK открывает GitHub Pages URL внутри webview.

### 2. GitHub Pages отдает `index.html`

Файл:

```text
dist/index.html
```

Он создается автоматически из корневого `index.html`.

### 3. Браузер подгружает собранный код

Файлы:

```text
dist/assets/*.js
dist/assets/*.css
```

Эти файлы создает Vite.

### 4. Запускается `src/main.ts`

В production это уже часть JS bundle.

Алгоритм:

```text
main.ts
-> initVkBridge()
-> VKWebAppInit
-> createGame()
```

### 5. Phaser запускает сцены

Порядок:

```text
BootScene
PreloadScene
MenuScene
LevelSelectScene
HuntScene
ResultsScene
ShopScene
```

### 6. PreloadScene подгружает игровые ассеты

Файлы из `public/assets` после сборки попадают в:

```text
dist/assets/backgrounds/
dist/assets/targets/
dist/assets/ui/
```

Сейчас подгружаются:

```text
assets/backgrounds/day.svg
assets/backgrounds/night.svg
assets/targets/duck.svg
assets/targets/rabbit.svg
assets/targets/squirrel.svg
assets/targets/boar.svg
assets/targets/deer.svg
assets/targets/owl.svg
assets/targets/wolf.svg
assets/targets/bear.svg
assets/targets/insect.svg
assets/ui/crosshair.svg
assets/ui/dog-laugh.svg
```

### 7. Игра читает и сохраняет прогресс

В VK:

```text
VKWebAppStorageGet
VKWebAppStorageSet
```

Вне VK:

```text
localStorage
```

## Куда потом вставить ссылку

В кабинете VK Mini Apps:

```text
Мои приложения
-> app54611895
-> Настройки
-> Адрес приложения
-> https://USERNAME.github.io/ya-ohotnik/
```

## Проверка

После публикации открыть:

```text
https://USERNAME.github.io/ya-ohotnik/
```

Проверить:

- появляется меню;
- открывается выбор уровня;
- запускается первый уровень;
- видны фон, прицел и цели;
- магазин выдает 1000 монет;
- после прохождения прогресс сохраняется.

