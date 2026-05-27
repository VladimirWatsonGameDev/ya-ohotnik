import "./styles.css";
import { createGame } from "./game/createGame";
import { initVkBridge } from "./vk/vkBridge";

async function start(): Promise<void> {
  const vk = await initVkBridge();
  createGame({
    parent: "game-root",
    vk
  });
}

start().catch((error) => {
  console.error("Game bootstrap failed", error);
  document.body.innerHTML = '<main class="fatal">Не удалось запустить игру. Попробуйте обновить страницу.</main>';
});

