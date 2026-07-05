export type AffiliateCard = {
  id: string;
  title: string;
  priceText: string;
  network: "shopee" | "lazada";
  url: string;
  available: boolean;
  image?: string;
};

// Real Shopee affiliate cards. `url` is the Shopee affiliate Offer Link
// (public tracking shortlink — safe to commit). This file is the single swap
// point: to add/replace, paste a new Offer Link and keep `available: true`.
// Keep products legit & ordinary (guardrail). Source: docs/materials Shopee
// BatchProductLinks export (generated 2026-07-04).
export const AFFILIATES: AffiliateCard[] = [
  { id: "af-smarttag", title: "Smart Tag ติดตามตำแหน่งสัตว์เลี้ยง สวมปลอกคอ", priceText: "฿255", network: "shopee", url: "https://s.shopee.co.th/80AoPrx7HD", available: true, image: "/banners/affiliate/smarttag.webp" },
  { id: "af-sharpener", title: "เครื่องเหลาดินสอตั้งโต๊ะ สีพาสเทล", priceText: "฿215", network: "shopee", url: "https://s.shopee.co.th/6pyr1j1Yed", available: true, image: "/banners/affiliate/sharpener.webp" },
  { id: "af-bikelight", title: "ไฟหน้าจักรยาน LED ชาร์จ USB", priceText: "฿310", network: "shopee", url: "https://s.shopee.co.th/60Pk2C4jKV", available: true, image: "/banners/affiliate/bikelight.webp" },
  { id: "af-cloth", title: "ผ้าไมโครไฟเบอร์เช็ดรถ หนานุ่ม ซับน้ำไว", priceText: "฿125", network: "shopee", url: "https://s.shopee.co.th/7Kv7clsZba", available: true, image: "/banners/affiliate/cloth.webp" },
];
