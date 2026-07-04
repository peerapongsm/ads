export type AffiliateCard = {
  id: string;
  title: string;
  priceText: string;
  network: "shopee" | "lazada";
  url: string;
  available: boolean;
};

// Placeholder cards. When a Shopee/Lazada affiliate account is approved,
// paste the real tracking url and flip `available` to true — this file is
// the single swap point. Keep products legit & ordinary (guardrail).
export const AFFILIATES: AffiliateCard[] = [
  { id: "af-earbuds", title: "หูฟังบลูทูธ ไร้สาย เสียงดี แบตอึด", priceText: "฿259", network: "shopee", url: "#TODO-shopee-earbuds", available: false },
  { id: "af-mug", title: "แก้วเก็บความเย็น 600ml สแตนเลส", priceText: "฿189", network: "lazada", url: "#TODO-lazada-mug", available: false },
  { id: "af-lamp", title: "โคมไฟตั้งโต๊ะ LED ถนอมสายตา", priceText: "฿329", network: "shopee", url: "#TODO-shopee-lamp", available: false },
  { id: "af-cable", title: "สายชาร์จ USB-C ถัก 2 เมตร ชาร์จไว", priceText: "฿99", network: "lazada", url: "#TODO-lazada-cable", available: false },
  { id: "af-bottle", title: "กระบอกน้ำพกพา 1 ลิตร มีมาตรวัด", priceText: "฿149", network: "shopee", url: "#TODO-shopee-bottle", available: false },
];
