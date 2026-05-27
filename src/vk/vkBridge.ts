import bridge from "@vkontakte/vk-bridge";

export type VkUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  photo_100?: string;
};

export type VkRuntime = {
  isAvailable: boolean;
  user: VkUser | null;
  getStorage: <T>(key: string, fallback: T) => Promise<T>;
  setStorage: <T>(key: string, value: T) => Promise<void>;
  buyCoins: (packId: string) => Promise<boolean>;
};

const storagePrefix = "ya_ohotnik_";
const vkAppId = Number(import.meta.env.VITE_VK_APP_ID ?? 0);

export async function initVkBridge(): Promise<VkRuntime> {
  try {
    await bridge.send("VKWebAppInit");
    const user = await bridge.send("VKWebAppGetUserInfo");

    return {
      isAvailable: true,
      user: user as VkUser,
      getStorage,
      setStorage,
      buyCoins
    };
  } catch {
    return {
      isAvailable: false,
      user: null,
      getStorage: getLocalStorage,
      setStorage: setLocalStorage,
      buyCoins: async () => false
    };
  }
}

async function getStorage<T>(key: string, fallback: T): Promise<T> {
  try {
    const response = await bridge.send("VKWebAppStorageGet", {
      keys: [storagePrefix + key]
    });
    const raw = response.keys?.[0]?.value;
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return getLocalStorage(key, fallback);
  }
}

async function setStorage<T>(key: string, value: T): Promise<void> {
  try {
    await bridge.send("VKWebAppStorageSet", {
      key: storagePrefix + key,
      value: JSON.stringify(value)
    });
  } catch {
    await setLocalStorage(key, value);
  }
}

async function buyCoins(packId: string): Promise<boolean> {
  if (!vkAppId) {
    return false;
  }

  try {
    await bridge.send("VKWebAppOpenPayForm", {
      app_id: vkAppId,
      action: "pay-to-service",
      params: {
        item: packId
      }
    });
    return true;
  } catch {
    return false;
  }
}

async function getLocalStorage<T>(key: string, fallback: T): Promise<T> {
  const raw = window.localStorage.getItem(storagePrefix + key);
  return raw ? (JSON.parse(raw) as T) : fallback;
}

async function setLocalStorage<T>(key: string, value: T): Promise<void> {
  window.localStorage.setItem(storagePrefix + key, JSON.stringify(value));
}
