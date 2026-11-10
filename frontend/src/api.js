const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

function getErrorMessage(payload) {
  if (typeof payload === "string") return payload;
  if (Array.isArray(payload)) {
    return payload.map(getErrorMessage).filter(Boolean).join(" ");
  }
  if (payload && typeof payload === "object") {
    const detail = payload.detail || payload.message;
    if (typeof detail === "string") return detail;
    return Object.values(payload).map(getErrorMessage).filter(Boolean).join(" ");
  }
  return "";
}

async function requestJSON(path, options = {}) {
  const url = `${API_BASE_URL}/api/${path}`;
  let response;
  try {
    response = await fetch(url, {
      ...options,
      cache: "no-store",
      headers: { Accept: "application/json", ...options.headers },
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(`Unable to connect to the portfolio API: ${error.message}`);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    if (response.ok) {
      throw new Error("The portfolio API returned an invalid response.");
    }
  }

  if (!response.ok) {
    const detail = getErrorMessage(payload);
    throw new Error(detail || `The portfolio API request failed (${response.status}).`);
  }
  return payload;
}

function requireObject(payload, resource) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(`The portfolio API returned invalid ${resource} data.`);
  }
  return payload;
}

function requireList(payload, resource) {
  const items = Array.isArray(payload) ? payload : payload?.results;
  const requiredFields = {
    projects: ["name", "slug"],
    articles: ["title", "slug", "kind"],
    skills: ["name", "group"],
  }[resource] || [];
  if (
    !Array.isArray(items)
    || items.some((item) => !item || typeof item !== "object" || Array.isArray(item)
      || requiredFields.some((field) => typeof item[field] !== "string"))
  ) {
    throw new Error(`The portfolio API returned invalid ${resource} data.`);
  }
  return items;
}

export async function getProfile({ signal } = {}) {
  return requireObject(await requestJSON("profile/", { signal }), "profile");
}

export async function getProjects({ signal } = {}) {
  return requireList(await requestJSON("projects/", { signal }), "projects");
}

export async function getArticles({ signal } = {}) {
  return requireList(await requestJSON("articles/", { signal }), "articles");
}

export async function getArticle(slug, { signal } = {}) {
  const article = requireObject(
    await requestJSON(`articles/${encodeURIComponent(slug)}/`, { signal }),
    "article",
  );
  if (typeof article.title !== "string" || article.slug !== slug) {
    throw new Error("The portfolio API returned invalid article data.");
  }
  return article;
}

export async function getSkills({ signal } = {}) {
  return requireList(await requestJSON("skills/", { signal }), "skills");
}

export async function submitContact(form) {
  const payload = requireObject(
    await requestJSON("contact/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }),
    "contact response",
  );
  if (typeof payload.message !== "string" || typeof payload.email_configured !== "boolean") {
    throw new Error("The portfolio API returned an invalid contact response.");
  }
  return payload;
}
