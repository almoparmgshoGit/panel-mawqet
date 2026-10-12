export type DonationPalette = "forest" | "gold" | "primary" | "cocoa";

export interface Donation {
  id: string;
  title_ar: string;
  org_ar: string;
  description_ar: string | null;
  image_url: string | null;
  link_url: string;
  raised_percent: number;
  bg_palette: DonationPalette;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface DonationInput {
  title_ar: string;
  org_ar: string;
  description_ar?: string | null;
  image_url?: string | null;
  link_url: string;
  bg_palette: DonationPalette;
  is_active: boolean;
}

export const PALETTE_LABEL: Record<DonationPalette, string> = {
  forest: "أخضر داكن",
  gold: "ذهبي",
  primary: "أخضر أساسي",
  cocoa: "بُني",
};

export const PALETTE_GRADIENT: Record<DonationPalette, string> = {
  forest: "linear-gradient(135deg, #2D4A3E 0%, #1F352C 100%)",
  gold: "linear-gradient(135deg, #C9A661 0%, #8B6F47 100%)",
  primary: "linear-gradient(135deg, #3E6051 0%, #2D4A3E 100%)",
  cocoa: "linear-gradient(135deg, #5C413B 0%, #3E2D2A 100%)",
};

// ─────────────────────── ADHKAR ───────────────────────

export type AdhkarSlot =
  | "morning"
  | "evening"
  | "sleep"
  | "wake"
  | "prayer"
  | "mosque"
  | "custom";

export const SLOT_LABEL: Record<AdhkarSlot, string> = {
  morning: "أذكار الصباح",
  evening: "أذكار المساء",
  sleep: "أذكار النوم",
  wake: "أذكار الاستيقاظ",
  prayer: "أذكار الصلاة",
  mosque: "أذكار المسجد",
  custom: "مخصصة",
};

export interface AdhkarCategory {
  id: string;
  title_ar: string;
  slot: AdhkarSlot | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface AdhkarCategoryInput {
  title_ar: string;
  slot: AdhkarSlot | null;
  is_active: boolean;
}

export interface AdhkarItem {
  id: string;
  category_id: string;
  text: string;
  source: string | null;
  repeat_count: number;
  note: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface AdhkarItemInput {
  category_id: string;
  text: string;
  source: string | null;
  repeat_count: number;
  note: string | null;
  is_active: boolean;
}

// ─────────────────────── COMMUNITY POSTS ───────────────────────

export type PostKind = "ayah" | "hadith" | "dua" | "reminder";
export type PostStatus = "pending" | "active" | "hidden" | "deleted";

export const POST_KIND_LABEL: Record<PostKind, string> = {
  ayah: "آية",
  hadith: "حديث",
  dua: "دعاء",
  reminder: "تذكير",
};

export const POST_STATUS_LABEL: Record<PostStatus, string> = {
  pending: "قيد المراجعة",
  active: "نشط",
  hidden: "مخفي",
  deleted: "محذوف",
};

export interface CommunityPost {
  id: string;
  kind: PostKind;
  text: string;
  source: string | null;
  author: string | null;
  image_url: string | null;
  created_at: string;
  expires_at: string;
  status: PostStatus;
  device_hash: string;
  reports_count: number;
  moderated_at: string | null;
  moderated_reason: string | null;
}

export interface CommunityPostInput {
  kind: PostKind;
  text: string;
  source: string | null;
  author: string | null;
  image_url?: string | null;
  expires_at: string;
  status: PostStatus;
  device_hash: string;
}

// ─────────────────────── JANAZAH ───────────────────────

export type AfterPrayer =
  | "fajr"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha"
  | "custom";

export const AFTER_PRAYER_LABEL: Record<AfterPrayer, string> = {
  fajr: "بعد الفجر",
  dhuhr: "بعد الظهر",
  asr: "بعد العصر",
  maghrib: "بعد المغرب",
  isha: "بعد العشاء",
  custom: "وقت مخصص",
};

export interface Janazah {
  id: string;
  name: string;
  age: string | null;
  mosque: string;
  district: string | null;
  city: string;
  after_prayer: AfterPrayer | null;
  custom_time: string | null;
  burial: string | null;
  created_at: string;
  expires_at: string;
  status: PostStatus;
  device_hash: string;
  reports_count: number;
  moderated_at: string | null;
  moderated_reason: string | null;
}

export interface JanazahInput {
  name: string;
  age: string | null;
  mosque: string;
  district: string | null;
  city: string;
  after_prayer: AfterPrayer | null;
  custom_time: string | null;
  burial: string | null;
  expires_at: string;
  status: PostStatus;
  device_hash: string;
}

// ─────────────────────── KNOWLEDGE COLLECTIONS ───────────────────────

export interface KnowledgeCollectionFieldLabels {
  detail_1: string;
  detail_2: string;
  detail_3: string;
}

export interface KnowledgeCollection {
  id: string;
  slug: string;
  title_ar: string;
  description_ar: string | null;
  field_labels: KnowledgeCollectionFieldLabels;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface KnowledgeCollectionInput {
  slug: string;
  title_ar: string;
  description_ar: string | null;
  field_labels: KnowledgeCollectionFieldLabels;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export interface KnowledgeItem {
  id: string;
  collection_id: string;
  order_index: number;
  title_ar: string;
  subtitle: string | null;
  detail_1: string | null;
  detail_2_text: string | null;
  detail_2_ref: string | null;
  detail_3: string | null;
  is_active: boolean;
  created_at: string;
}

export interface KnowledgeItemInput {
  collection_id: string;
  order_index: number;
  title_ar: string;
  subtitle: string | null;
  detail_1: string | null;
  detail_2_text: string | null;
  detail_2_ref: string | null;
  detail_3: string | null;
  is_active: boolean;
}

export const DEFAULT_FIELD_LABELS: KnowledgeCollectionFieldLabels = {
  detail_1: "التعريف",
  detail_2: "في القرآن",
  detail_3: "المصدر",
};

// ─────────────────────── USER FEEDBACK ───────────────────────

export type FeedbackCategory =
  | "content"
  | "technical"
  | "suggestion"
  | "other";

export const FEEDBACK_CATEGORY_LABEL: Record<FeedbackCategory, string> = {
  content: "محتوى مخالف",
  technical: "مشكلة تقنية",
  suggestion: "اقتراح",
  other: "أخرى",
};

export const FEEDBACK_CATEGORY_GRADIENT: Record<FeedbackCategory, string> = {
  content: "linear-gradient(135deg, #B5453E 0%, #8C342F 100%)",
  technical: "linear-gradient(135deg, #5C413B 0%, #3E2D2A 100%)",
  suggestion: "linear-gradient(135deg, #C9A661 0%, #8B6F47 100%)",
  other: "linear-gradient(135deg, #2D4A3E 0%, #1F352C 100%)",
};

export interface UserFeedback {
  id: string;
  category: FeedbackCategory;
  message: string;
  reporter_hash: string;
  contact_email: string | null;
  created_at: string;
  resolved: boolean;
}
