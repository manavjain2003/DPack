import { useSyncExternalStore } from "react";

let items = [];
let listeners = [];
let loaded = false;

const EMPTY = [];

function load() {
  if (loaded || typeof window === "undefined") return;
  try {
    items = JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    items = [];
  }
  loaded = true;
}

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
}

function emit() {
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cart:added"));
  }
}

function subscribe(l) {
  listeners.push(l);
  return () => {
    listeners = listeners.filter((x) => x !== l);
  };
}

function getSnapshot() {
  load();
  return items;
}

function getServerSnapshot() {
  return EMPTY;
}

function keyOf(product) {
  return String(product.id ?? product.name);
}

export function addToCart(product, qty = 1) {
  load();
  const key = keyOf(product);
  const existing = items.find((i) => i.key === key);
  if (existing) {
    items = items.map((i) =>
      i.key === key ? { ...i, qty: i.qty + qty } : i
    );
  } else {
    items = [
      ...items,
      {
        key,
        name: product.name,
        image: product.image,
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? null,
        category: product.category,
        qty,
      },
    ];
  }
  persist();
  emit();
}

export function updateQty(key, qty) {
  load();
  if (qty <= 0) return removeFromCart(key);
  items = items.map((i) => (i.key === key ? { ...i, qty } : i));
  persist();
  emit();
}

export function removeFromCart(key) {
  load();
  items = items.filter((i) => i.key !== key);
  persist();
  emit();
}

export function clearCart() {
  items = [];
  persist();
  emit();
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function cartCount(items) {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartSubtotal(items) {
  return items.reduce((n, i) => n + (i.price ?? 0) * i.qty, 0);
}

export function cartSavings(items) {
  return items.reduce(
    (n, i) =>
      n + (i.compareAtPrice && i.compareAtPrice > i.price
        ? (i.compareAtPrice - i.price) * i.qty
        : 0),
    0
  );
}

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}