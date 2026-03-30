import { BASE_SERVINGS } from "./data.js";

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatAmount(val) {
  if (val === 0) return "0";
  if (val < 0.15) return "⅛";
  if (val < 0.29) return "¼";
  if (val < 0.40) return "⅓";
  if (val < 0.60) return "½";
  if (val < 0.70) return "⅔";
  if (val < 0.85) return "¾";
  const w = Math.floor(val), f = val - w;
  if (f < 0.15) return `${w}`;
  if (f < 0.29) return `${w > 0 ? w : ""}¼`.trim();
  if (f < 0.40) return `${w > 0 ? w : ""}⅓`.trim();
  if (f < 0.60) return `${w > 0 ? w : ""}½`.trim();
  if (f < 0.70) return `${w > 0 ? w : ""}⅔`.trim();
  if (f < 0.85) return `${w > 0 ? w : ""}¾`.trim();
  return `${w + 1}`;
}

export function scaleAmount(a, s) {
  const v = (a / BASE_SERVINGS) * s;
  if (Number.isInteger(v)) return v.toString();
  if (v >= 10) return Math.round(v).toString();
  return formatAmount(v);
}

export function fmtTimer(s) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

// Equipment image URLs (from design reference)
const IMG = {
  dutchOven:  "https://lh3.googleusercontent.com/aida-public/AB6AXuCM8Nb13N4PJXToR8lqTXc6pntXCkwa35awaIM8akuBlLf4lFCa-AJOXEA6OjJPi1y9plmEN1GhRsDwseJwqGwiW2tx3ux8FUHC6ySDlANs3ydqtEXnxn_2PKEWJfwYKr1T-_HMBp1f6s6zNJthvx702O4K2dwwbpciORURTOYEkYeUbNmIODmLAwtDwMfpF97e8pFIK-o5295jZSbgYZ9hsl_6qq_XhpwWd38K8VqTNUQzY7eDCqH_fjk0mcY9FW3kjAocSRBgGmM6",
  skillet:    "https://lh3.googleusercontent.com/aida-public/AB6AXuDqJK79T2-LKY8OAdpjEEFcGto7XzH_rE5WhZb3oW2HSEi2V0kRkMu8pdrCL2tcgeRSScGd_9RsGkoyzAUGPN-BTT9JNQAEoGtueXj5VwoeKL08RILFg_IoC42zhqdE5pS9vI2ZIs5ixIREDwmEHV714n2WeUpd_yNA3inG_DEahA-8FjoHNhv01J6kr-SQK76VUecXjA48mGI304zOwcPpteUbvhbU-x56sr-o-FYXX5ZUpjA_Atyyi8TrtieQA2voS_WNu1iJb_Mc",
  spider:     "https://lh3.googleusercontent.com/aida-public/AB6AXuCo8xbr_BLqzOBXcAIYuub_GseOMo3YUhLM8O8NfzhDOtBuAO6d5CuZ4KwI3VvZsA4h_7NuH3l2B25Xgxlew1-N3QRumb_tDR5zUP0pKrUrDR9LGljYL8rh5sR3FKyjXNwubIpeBgsEMwStR3lcNztG0lTtwbf60XfrtacHj9O-WGJt8Y1mfcigXKVxeFb2Xdh3U8yawXCTeZjZZ_dvU4m1HNRGLlTSMnh1xBg0gsde10tD_i1Isrd6jHe2FCD49ngOEa-4QaDMRxz2",
  circulator: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYpLeoI5-ax5NVtYN4yyx-h9hxRTpf_7M7Al1CHHxMXAMoMDOmiRq-Mc9G3a8YVO6a6lyaTCpyzle1yyU0qRgbVKCx12znh_8VFPCShd-WgFQKvDRtVgh_8Q-PY4LLrrkPrZE9XVfpHNqz5wZfi3gksp9vkGnaDMTUzQ8jn3R45ewZAadPDziQqxHLfgk4nggXgxJxoV2qBGBTTfNs5rCOUM56maZc1XFYIgjfJMZmbq_gbgqq0xahKt_nKTla3Z4qxIHJLhnTMabz",
  cambro:     "https://lh3.googleusercontent.com/aida-public/AB6AXuAuXaRf8gPi4KdPxRtSxx7bskixkvSFNnQ_u4qsbSrlP_71h7MwkeeRkGy07ssQC5H5enfmP-gwdZa53pRxIlZYWw7ldjQWM3oHhBFkYW7iIsVz8ibVimKKgP2mWAcokL5Wq3UFKrqEwg-FfMZrn_76I8wom93khasWor4i3PBG9qBPBD2WWs3uSlO3UiMTuIsi9myX2hdSwtmI_Cmkhky0pmFKwfGAuhpx8lhDd_1-oAsnSrBVV445z3hvcwemxlh8PkYhHkaZ6Rcg",
  sheetTray:  "https://lh3.googleusercontent.com/aida-public/AB6AXuDuAj6StOl2NAozhaVbeADNRp70gjG4P4nVcK5xY2duRYqgtvZHdzrhkibST7KP7Rq5Ma5B7675NSkjR2jrsQe5za3aT8dcnmeYsHX5Q6s3bTCy31F33JscbIALFXVLVqgRvtEP9Z8GUgpz5-eXmoXipXkzAAPEQei_JamnB2iLn68OcxhFK3xeP8oijLpQaM8pIPB_DvYePt-DGENii8ElWyPcmocj7vC8D_t0MSjvUyZoCw7y_BaJERPW0x9wsAaPd5-2D2iCpeXE",
  ladle:      "https://lh3.googleusercontent.com/aida-public/AB6AXuDA-NEuUYAeoyy3xG0q6RcXWQWJks2aD0sa2CdvlmH70oSa0Cce5VTcTdtgiEaS4xHfCDwlMGDaLZRJDvHB9OSZoD3OJ0BwH_WxZM5zQtImWzjLO_IU3KzNSDH2ez9LMQ6hh1NIxLEcTBjFR9GI-EYIzt8m2s2GczvcnqvdrOFpcUhbfEEwJW9LDhLiGTBIB1t6e5tsPBmrQfjWj6V2yxGKm0wWJIAAh81QboMxB4UlvKmxIJ4En3-miZJUZld-rGvtrTMlTP2EP6jk",
  iceBath:    "https://cdn.shopify.com/s/files/1/2406/9297/files/ice-bath.jpg?v=1591979727",
  vacBags:    "https://supplies.gusta.ca/cdn/shop/products/ZWILLINGFresh_SaveVacuumBag1_988e905d-8fb1-4ebf-b657-ba76253028df.jpg?v=1625733045",
  cuttingBoard: "https://m.media-amazon.com/images/I/71LYXkFMUTL._AC_SX679_.jpg",
};

export function getEquipment(servings, isSV) {
  const items = [];
  if (servings <= 6) {
    items.push({ name: "Dutch Oven",   spec: "5–6 quart",          icon: "🍲", img: IMG.dutchOven,  essential: true,  note: "Handles base + seafood comfortably" });
    items.push({ name: "Skillet",      spec: "12-inch",             icon: "🫕", img: IMG.skillet,    essential: true,  note: "For steaming clams & mussels on a second burner" });
  } else if (servings <= 10) {
    items.push({ name: "Dutch Oven",   spec: "7–8 quart",          icon: "🍲", img: IMG.dutchOven,  essential: true,  note: "Extra headroom for this volume" });
    items.push({ name: "Skillet",      spec: "12-inch",             icon: "🫕", img: IMG.skillet,    essential: true,  note: "Steam shellfish in 2 batches per type" });
  } else if (servings <= 16) {
    items.push({ name: "Large Stockpot", spec: "10–12 quart",      icon: "🍲", img: IMG.dutchOven,  essential: true,  note: "Dutch oven won't cut it — go stockpot" });
    items.push({ name: "Skillets",     spec: "12-inch (×2 ideal)", icon: "🫕", img: IMG.skillet,    essential: true,  note: "Two skillets or 2–3 batches for shellfish" });
  } else {
    items.push({ name: "Large Stockpot", spec: "16+ quart",        icon: "🍲", img: IMG.dutchOven,  essential: true,  note: "Restaurant-size — consider two pots" });
    items.push({ name: "Skillets / Wide Pot", spec: "2 × 12-inch or rondeau", icon: "🫕", img: IMG.skillet, essential: true, note: "Steam shellfish in parallel to stay on schedule" });
  }
  items.push({ name: "Spider Skimmer", spec: "Slotted spoon",      icon: "🥄", img: IMG.spider,     essential: false, note: "Essential for transferring seafood gently" });
  if (isSV) {
    items.push({ name: "Sous Vide Circulator", spec: "Anova, Joule, etc.", icon: "🌡️", img: IMG.circulator, essential: true, note: "Immersion circulator for precision temperature control" });
    items.push({ name: "Vacuum Bags or Zip-Locks", spec: `${servings <= 8 ? "3 bags" : servings <= 16 ? "5–6 bags" : "8+ bags"}`, icon: "🛍️", img: IMG.vacBags, essential: false, note: "One each for squid, cod, shrimp — double up for larger batches" });
    items.push({ name: "Container / Cambro", spec: servings <= 8 ? "12 qt" : "18+ qt", icon: "🫙", img: IMG.cambro, essential: false, note: servings <= 8 ? "Standard container works" : "Larger vessel needed to fit multiple bags with good water flow" });
    if (servings > 10) items.push({ name: "Ice Bath Bowl", spec: "Large", icon: "🧊", img: IMG.iceBath, essential: false, note: "For rapid chilling of squid bags night-before" });
  }
  if (servings > 8)  items.push({ name: "Sheet Tray + Oven", spec: "200°F / 95°C", icon: "♨️", img: IMG.sheetTray, essential: false, note: "Keep early-cooked seafood warm while finishing batches" });
  if (servings > 12) {
    items.push({ name: "Second Cutting Board", spec: "For seafood", icon: "🔪", img: IMG.cuttingBoard, essential: false, note: "Speeds up extended prep" });
    if (!isSV) items.push({ name: "Large Bowl (iced)", spec: "Bowl in ice", icon: "🧊", img: null, essential: false, note: "Keep prepped seafood cold during long prep" });
  }
  if (servings > 6)  items.push({ name: "Large Ladle", spec: "8 oz+", icon: "🫗", img: IMG.ladle, essential: false, note: "Makes portioning much faster" });
  if (servings > 16) {
    items.push({ name: "Warmed Serving Bowls", spec: `${servings}+`, icon: "🥣", img: null, essential: false, note: "Warm bowls at 200°F — keeps stew hot" });
    items.push({ name: "Bread Baskets",        spec: "2–3",          icon: "🍞", img: null, essential: false, note: "Station at multiple spots" });
  }
  const batchNote = servings <= 6  ? null
    : servings <= 10 ? "Steam clams and mussels in 2 rounds each."
    : servings <= 16 ? "Plan 2–3 batches for shellfish."
    : "Event-scale: recruit a helper for shellfish, plan 3–4 batches.";
  const nightTime = servings <= 6  ? (isSV ? "~60 min" : "~45 min")
    : servings <= 10 ? (isSV ? "~75 min" : "~55 min")
    : servings <= 16 ? (isSV ? "~90 min" : "~70 min")
    : (isSV ? "~105 min" : "~90 min");
  const dayTime = servings <= 6  ? (isSV ? "~30 min" : "~35 min")
    : servings <= 10 ? (isSV ? "~40 min" : "~45 min")
    : servings <= 16 ? (isSV ? "~45 min" : "~55 min")
    : (isSV ? "~55 min" : "~70 min");
  return { items, batchNote, nightTime, dayTime };
}
