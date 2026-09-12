const WISHLIST_PREFIX = "app_wishlist_";

function keyFor(mobile) {
  return `${WISHLIST_PREFIX}${mobile}`;
}

export function getWishlist(mobile) {
  if (typeof window === "undefined" || !mobile) return [];
  try {
    const raw = localStorage.getItem(keyFor(mobile));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setWishlist(mobile, items) {
  if (typeof window === "undefined" || !mobile) return;
  localStorage.setItem(keyFor(mobile), JSON.stringify(items));
  window.dispatchEvent(
    new CustomEvent("wishlist-change", { detail: { mobile, items } })
  );
}

export function isInWishlist(mobile, productId) {
  return getWishlist(mobile).some((p) => p.id === productId);
}

export function addToWishlist(mobile, product) {
  if (!mobile || !product?.id) return getWishlist(mobile);
  const list = getWishlist(mobile);
  if (list.some((p) => p.id === product.id)) return list;
  const next = [
    {
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      category: product.category,
      description: product.description,
      sizes: product.sizes,
      specs: product.specs,
      videoSrc: product.videoSrc,
      addedAt: new Date().toISOString(),
    },
    ...list,
  ];
  setWishlist(mobile, next);
  return next;
}

export function removeFromWishlist(mobile, productId) {
  if (!mobile) return [];
  const next = getWishlist(mobile).filter((p) => p.id !== productId);
  setWishlist(mobile, next);
  return next;
}

export function toggleWishlist(mobile, product) {
  if (!mobile || !product?.id) return { list: [], added: false };
  if (isInWishlist(mobile, product.id)) {
    return { list: removeFromWishlist(mobile, product.id), added: false };
  }
  return { list: addToWishlist(mobile, product), added: true };
}