import { ui as zhTWUi } from "./zh-TW/ui";
import { ui as enUi } from "./en/ui";
import { knowledgeContent as zhTWContent } from "./zh-TW/content";
import { knowledgeContent as enContent } from "./en/content";

export type Locale = "zh-TW" | "en";

export const ui = {
  "zh-TW": zhTWUi,
  en: enUi,
} as const;

export const content = {
  "zh-TW": zhTWContent,
  en: enContent,
} as const;

export type UiKey = keyof typeof zhTWUi;
