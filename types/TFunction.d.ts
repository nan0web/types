/**
 * Creates a translation function bound to a specific vocabulary.
 * Supports ICU-like simple variable replacement ({name}) and plural/ordinal suffixes.
 *
 * @param {Object<string, string> | Map<string, string>} vocab - Mapping from keys to localized strings.
 * @param {string} [locale='en'] - The locale used for plural rules.
 * @returns {function(string, Record<string, any>=): string} Translation function.
 *
 * Example:
 *   const t = TFunction({ "Hello {name}": "{name}, вітаю!" }, "uk-UA")
 *   t("Hello {name}", { name: "Іван" }) // → "Іван, вітаю!"
 */
export default function TFunction(vocab?: {
    [x: string]: string;
} | Map<string, string>, locale?: string): (arg0: string, arg1: Record<string, any> | undefined) => string;
