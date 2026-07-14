import { useEffect, useState } from "react";

const assetModules = import.meta.glob("../assets/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const assetLookup = Object.entries(assetModules).reduce<Record<string, string>>(
  (acc, [path, url]) => {
    const fileName = path.split("/").pop()?.toLowerCase();
    if (fileName) {
      acc[fileName] = url;
      const extensionIndex = fileName.lastIndexOf(".");
      if (extensionIndex > 0) {
        acc[fileName.slice(0, extensionIndex)] = url;
      }
    }
    return acc;
  },
  {},
);

const dataModules = import.meta.glob("../data/*.json") as Record<
  string,
  () => Promise<{ default: unknown }>
>;

function normalizePath(value?: string | null) {
  return typeof value === "string" ? value.replace(/\\/g, "/").trim() : "";
}

function getFileName(value: string) {
  return (
    value.split("/").filter(Boolean).pop()?.toLowerCase() ?? value.toLowerCase()
  );
}

export function resolveImageUrl(value?: string | null) {
  const normalized = normalizePath(value);

  if (!normalized) {
    return undefined;
  }

  if (
    /^https?:\/\//i.test(normalized) ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:")
  ) {
    return normalized;
  }

  if (normalized.startsWith("/")) {
    return normalized;
  }

  const fileName = getFileName(normalized);
  const cleanName = fileName.replace(/^src\//i, "").replace(/^assets\//i, "");

  return assetLookup[cleanName] || assetLookup[fileName] || normalized;
}

export function toSafeArray<T>(value: T[] | undefined | null) {
  return Array.isArray(value) ? value : [];
}

export function normalizeCategory(value?: string | null) {
  const category = typeof value === "string" ? value.trim() : "";
  return category || "General";
}

export function normalizeFilterValue(value?: string | null) {
  return normalizeCategory(value).trim().toLowerCase();
}

function getDataLoader(fileName: string) {
  const normalized = fileName.replace(/^\/+/, "");
  return dataModules[`../data/${normalized}`];
}

export async function loadPortfolioData<T>(fileName: string): Promise<T> {
  const loader = getDataLoader(fileName);
  if (!loader) {
    throw new Error(`Failed to load ${fileName}`);
  }

  const module = await loader();
  return module.default as T;
}

export function usePortfolioData<T>(fileName: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);

  useEffect(() => {
    let mounted = true;
    let interval: number | undefined;

    const refresh = async () => {
      try {
        const nextValue = await loadPortfolioData<T>(fileName);
        if (mounted) {
          setData(nextValue);
        }
      } catch {
        // Keep the last loaded value when a refresh fails.
      }
    };

    void refresh();

    if (import.meta.env.DEV) {
      interval = window.setInterval(() => {
        void refresh();
      }, 2000);
    }

    const onFocus = () => {
      void refresh();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      mounted = false;
      if (interval) {
        window.clearInterval(interval);
      }
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [fileName]);

  return data;
}
