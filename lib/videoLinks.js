
export function getYouTubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return u.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (host.endsWith("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "shorts" || parts[0] === "embed" || parts[0] === "live") {
        return parts[1] || null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function isYouTubeUrl(url) {
  return Boolean(getYouTubeId(url));
}

export function isInstagramUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(url.trim());
    return u.hostname.replace(/^www\./, "") === "instagram.com";
  } catch {
    return false;
  }
}

export function getYouTubeEmbedUrl(url, { autoplay = false, muted = true, controls = true } = {}) {
  const id = getYouTubeId(url);
  if (!id) return null;
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: muted ? "1" : "0",
    controls: controls ? "1" : "0",
    loop: "1",
    playlist: id,
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function getInstagramEmbedUrl(url) {
  if (!isInstagramUrl(url)) return null;
  const clean = url.trim().split("?")[0].replace(/\/?$/, "/");
  return `${clean}embed`;
}

export function getPrimaryVideo(product) {
  if (!product) return null;
  if (product.youtubeUrl && isYouTubeUrl(product.youtubeUrl)) {
    return { type: "youtube", url: product.youtubeUrl };
  }
  if (product.instagramUrl && isInstagramUrl(product.instagramUrl)) {
    return { type: "instagram", url: product.instagramUrl };
  }
  return null;
}