export type Reveal = { patternTh: string; patternEn: string; explainer: string };

export type Template = {
  id: string;
  style: string;
  weight: number;
  headlines: string[];
  subtexts: string[];
  ctas: string[];
  reveal: Reveal;
  imageQuery?: string[];
};

export const TEMPLATES: Template[] = [
  {
    id: "lottery-popup", style: "s-neon", weight: 12,
    headlines: ["คุณคือผู้โชคดีคนที่ 1,000,000!", "ยินดีด้วย! คุณได้รับมือถือรุ่นใหม่ฟรี", "แจ้งเตือน: คุณมีของรางวัลรอรับ"],
    subtexts: ["กดรับภายใน 3 นาที ก่อนหมดสิทธิ์", "เหลือผู้โชคดีอีกแค่ 2 คนเท่านั้น", "คลิกเพื่อยืนยันตัวตนและรับรางวัล"],
    ctas: ["รับรางวัลเลย", "กดรับสิทธิ์", "ยืนยันรับของ"],
    reveal: { patternTh: "เหยื่อล่อรางวัลปลอม", patternEn: "Fake Prize", explainer: "ปั่นให้ตื่นเต้นแล้วคลิก ไม่มีรางวัลจริง" },
    imageQuery: ["gold coins", "confetti", "gift box", "jackpot"],
  },
  {
    id: "diet-miracle", style: "s-before-after", weight: 11,
    headlines: ["หมอไม่อยากให้คุณรู้ความลับนี้", "ลด 10 โล ใน 7 วัน ไม่ต้องออกกำลัง", "สูตรลับคุณหมอ กินแล้วผอมเอง"],
    subtexts: ["สาวออฟฟิศแห่ใช้ รีวิวแน่นเพจ", "ธรรมชาติ 100% ไม่โยโย่", "หมอในคลินิกดังไม่กล้าบอก"],
    ctas: ["สั่งซื้อด่วน", "ดูรีวิว", "ทักแชทเลย"],
    reveal: { patternTh: "หลอกขายด้วยสุขภาพ", patternEn: "Health-Scam Clickbait", explainer: "อ้างหมอ+ผลลัพธ์เกินจริง กระตุ้นความอยากผอม" },
    imageQuery: ["measuring tape", "green smoothie", "supplement pills"],
  },
  {
    id: "predatory-loan", style: "s-cash", weight: 10,
    headlines: ["อนุมัติไว ไม่เช็คบูโร", "เงินด่วน 50,000 โอนใน 5 นาที", "กู้ง่าย ไม่ต้องค้ำ ไม่ดูสลิป"],
    subtexts: ["ดอกเบี้ยเริ่มต้น 0% (เดือนแรก)", "แค่มีบัตรประชาชนก็กู้ได้", "รับทุกอาชีพ ติดแบล็กลิสต์ก็ผ่าน"],
    ctas: ["สมัครกู้เลย", "เช็ควงเงิน", "ทักแชท"],
    reveal: { patternTh: "สินเชื่อล่าเหยื่อ", patternEn: "Predatory Lending", explainer: "อวดอนุมัติง่าย ซ่อนดอกเบี้ยโหด ล่าคนสิ้นหวัง" },
    imageQuery: ["cash stack", "banknotes", "gold coins"],
  },
  {
    id: "gambling", style: "s-casino", weight: 9,
    headlines: ["สมัครรับ 100 ทันที!", "เว็บตรง แตกง่าย จ่ายจริง", "ทุน 50 ถอนได้ 5,000"],
    subtexts: ["ฝากถอนออโต้ ไม่มีขั้นต่ำ", "โบนัสสมาชิกใหม่ 200%", "มีทีมงานดูแล 24 ชม."],
    ctas: ["สมัครเลย", "รับโบนัส", "เข้าเล่น"],
    reveal: { patternTh: "โฆษณาพนันผิดกฎหมาย", patternEn: "Illegal Gambling Ad", explainer: "ล่อด้วยเงินฟรี ปกปิดว่าเจ้ามือได้เปรียบเสมอ" },
    imageQuery: ["casino chips", "roulette wheel", "playing cards", "dice"],
  },
  {
    id: "fake-virus", style: "s-system", weight: 9,
    headlines: ["⚠️ เครื่องคุณติดไวรัส 3 ตัว!", "แจ้งเตือนระบบ: อุปกรณ์เสี่ยงถูกแฮ็ก", "ระบบตรวจพบภัยคุกคาม"],
    subtexts: ["สแกนทันทีเพื่อป้องกันข้อมูลรั่ว", "แบตเตอรี่เสียหาย 28% กดซ่อม", "ห้ามปิดหน้านี้ก่อนแก้ไข"],
    ctas: ["สแกนเดี๋ยวนี้", "ล้างไวรัส", "แก้ไขทันที"],
    reveal: { patternTh: "ข่มขู่ให้กลัว", patternEn: "Scareware", explainer: "ปลอมเป็นแจ้งเตือนระบบ ขู่ให้คลิกทั้งที่ไม่มีอะไรเสีย" },
  },
  {
    id: "cookie-wall", style: "s-consent", weight: 8,
    headlines: ["เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ 🍪", "เว็บไซต์นี้ใช้คุกกี้", "ยอมรับคุกกี้เพื่อประสบการณ์ที่ดีที่สุด"],
    subtexts: ["เราและพันธมิตร 1,482 ราย ใช้ข้อมูลของคุณ", "กด ยอมรับทั้งหมด เพื่อดำเนินการต่อ", "การตั้งค่า · (ปุ่มเล็กจิ๋วมุมล่าง)"],
    ctas: ["ยอมรับทั้งหมด", "ตกลง", "ยอมรับและปิด"],
    reveal: { patternTh: "กับดักความยินยอม", patternEn: "Consent Dark Pattern", explainer: "ปุ่มยอมรับใหญ่โต ปุ่มปฏิเสธเล็กจนหาไม่เจอ" },
  },
  {
    id: "newsletter-guilt", style: "s-modal", weight: 8,
    headlines: ["รับส่วนลด 10% ก่อนไป!", "อย่าเพิ่งไป! มีของขวัญให้", "สมัครรับข่าวสารสิ"],
    subtexts: ["ใส่อีเมลเพื่อรับสิทธิพิเศษ", "ดีลนี้จะไม่กลับมาอีก", "คนฉลาดเขาสมัครกันหมดแล้ว"],
    ctas: ["ไม่ ฉันไม่อยากรวย", "ไม่ล่ะ ฉันชอบจ่ายเต็ม", "ไม่สนใจส่วนลด"],
    reveal: { patternTh: "กดดันด้วยความรู้สึกผิด", patternEn: "Confirmshaming", explainer: "ทำให้ปุ่มปฏิเสธฟังดูโง่ กดดันให้ยอมสมัคร" },
  },
  {
    id: "crypto-moon", style: "s-crypto", weight: 8,
    headlines: ["เหรียญนี้ x1000 ใน 7 วัน 🚀", "อย่าพลาดรถ! เข้าตอนนี้ยังทัน", "คนที่ซื้อเมื่อวานรวยไปแล้ว"],
    subtexts: ["นักลงทุนวงในแนะนำ", "พรีเซลเหลือ 3% สุดท้าย", "โอกาสเปลี่ยนชีวิตมาแล้ว"],
    ctas: ["ซื้อเลย", "เข้ากลุ่มวีไอพี", "จองพรีเซล"],
    reveal: { patternTh: "ปั่นราคาคริปโต", patternEn: "Pump Hype", explainer: "อ้างกำไรมหาศาล เร่งให้รีบซื้อก่อนโดนเทขาย" },
    imageQuery: ["gold bitcoin coin", "trading chart", "candlestick chart"],
  },
  {
    id: "fake-countdown", style: "s-countdown", weight: 8,
    headlines: ["เหลือ 2 ชิ้นสุดท้าย!", "โปรหมดใน 04:59", "คนอื่นกำลังดูสินค้านี้ 37 คน"],
    subtexts: ["ราคานี้เฉพาะวันนี้เท่านั้น", "สั่งด่วนก่อนของหมด", "มีคนหยิบใส่ตะกร้าแล้ว 12 คน"],
    ctas: ["สั่งซื้อก่อนหมด", "คว้าดีลนี้", "รีบเลย"],
    reveal: { patternTh: "สร้างความขาดแคลนปลอม", patternEn: "False Scarcity", explainer: "นับถอยหลัง+ของใกล้หมด (ที่ไม่จริง) เร่งให้รีบตัดสินใจ" },
  },
  {
    id: "clickbait-list", style: "s-chumbox", weight: 8,
    headlines: ["9 อันดับ... คุณจะไม่เชื่อสายตา", "สิ่งที่ดาราคนนี้ทำ ทำเอาแฟนๆ ตกใจ", "หมอเตือน! อย่ากินสิ่งนี้ตอนเช้า"],
    subtexts: ["อันดับ 7 ทำเอาอึ้งทั้งประเทศ", "ภาพสุดท้ายเรียกน้ำตา", "เลื่อนดูต่อเพื่อรู้ความจริง"],
    ctas: ["อ่านต่อ", "ดูภาพทั้งหมด", "คลิกเลย"],
    reveal: { patternTh: "พาดหัวล่อคลิก", patternEn: "Chumbox Clickbait", explainer: "พาดหัวยั่วให้อยากรู้ พาไปหน้าโฆษณายาวเหยียด" },
  },
  {
    id: "sponsored-horoscope", style: "s-horoscope", weight: 6,
    headlines: ["ดวงคุณสัปดาห์นี้ปังมาก ✨", "3 ราศีนี้กำลังจะรวย", "เกิดวันนี้ห้ามพลาด! เลขมงคลมาแล้ว"],
    subtexts: ["เสริมดวงด้วยวัตถุมงคล (มีสปอนเซอร์)", "ปังการเงิน แต่ต้องพก...", "อาจารย์ดังทำนายไว้"],
    ctas: ["ดูดวงเต็ม", "รับเลขเด็ด", "เสริมดวงเลย"],
    reveal: { patternTh: "คอนเทนต์แฝงโฆษณา", patternEn: "Sponsored-Content Disguise", explainer: "ปลอมเป็นดูดวง/บทความ แต่จริงๆ คือโฆษณาขายของ" },
    imageQuery: ["tarot cards", "crystal gemstone", "starry night sky", "incense smoke"],
  },
];
