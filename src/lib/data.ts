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
