/**
 * translationHelper.js
 *
 * Maps English values stored in MongoDB → translated display values.
 * The backend always stores/receives English. This file is purely for
 * frontend display when Urdu (or any future language) is selected.
 *
 * Usage:
 *   import { translateCategory, translateStatus, safeUpper } from '../utils/translationHelper';
 *   const display = translateCategory(product.category, t);
 */

/**
 * Maps MongoDB English category names → i18n translation keys.
 * Add new entries here whenever a new category is added to the DB.
 */
const CATEGORY_KEY_MAP = {
  // Main categories used in HomeScreen quick-access grid
  'Door Skins':         'DoorSkins',
  'Tools':              'Tools',
  'Paints':             'PaintsT',
  'Glass':              'Glass',

  // Full category list used in AddNewProductScreen / ProductListing
  'Power Tools':        'PowerTools',
  'Hand Tools':         'HandTools',
  'Safety Gear':        'SafetyGear',
  'Fasteners':          'Fasteners',
  'Electrical':         'Electrical',
  'Plumbing':           'Plumbing',
  'Building Materials': 'BuildingMaterials',
  'Cabinet Sheets':     'CabinetSheets',
  'Accessories':        'Accessories',
  'Hardboard':          'Hardboard',

  // Alternate capitalizations / slugs that might come from DB
  'power tools':        'PowerTools',
  'hand tools':         'HandTools',
  'safety gear':        'SafetyGear',
  'fasteners':          'Fasteners',
  'electrical':         'Electrical',
  'plumbing':           'Plumbing',
  'building materials': 'BuildingMaterials',
  'door skins':         'DoorSkins',
  'tools':              'Tools',
  'paints':             'PaintsT',
  'glass':              'Glass',
  'cabinet sheets':     'CabinetSheets',
  'accessories':        'Accessories',
  'hardboard':          'Hardboard',
};

/**
 * Maps MongoDB English order status values → i18n translation keys.
 * These already exist in en.json / ur.json as status_* keys.
 */
const STATUS_KEY_MAP = {
  pending:    'status_pending',
  processing: 'status_processing',
  delivered:  'status_delivered',
  completed:  'status_completed',
  cancelled:  'status_cancelled',
  shipped:    'status_shipped',
};

/**
 * Translate a category string from MongoDB into the current locale.
 *
 * @param {string} category  — English category from MongoDB (e.g. "Tools")
 * @param {Function} t       — i18next translate function
 * @returns {string}         — Translated category, or original if no mapping found
 */
export const translateCategory = (category, t) => {
  if (!category || !t) return category || '';
  const key = CATEGORY_KEY_MAP[category] || CATEGORY_KEY_MAP[category.toLowerCase()];
  if (key) {
    return t(key, { defaultValue: category });
  }
  // No mapping found — return the original English string
  return category;
};

/**
 * Translate an order status string from MongoDB into the current locale.
 *
 * @param {string} status  — English status from MongoDB (e.g. "pending")
 * @param {Function} t     — i18next translate function
 * @returns {string}       — Translated status label
 */
export const translateStatus = (status, t) => {
  if (!status || !t) return status || '';
  const normalised = status.toLowerCase();
  const key = STATUS_KEY_MAP[normalised];
  if (key) {
    return t(key, { defaultValue: status });
  }
  return status;
};

/**
 * Safe uppercase — only uppercase Latin script. For Urdu/Arabic text,
 * calling .toUpperCase() produces no visual change but can corrupt some
 * rendering engines. This helper skips uppercasing for non-Latin strings.
 *
 * @param {string} text
 * @returns {string}
 */
export const safeUpper = (text) => {
  if (!text) return '';
  // If the string contains Arabic/Urdu Unicode characters, return as-is
  const hasUrdu = /[\u0600-\u06FF]/.test(text);
  if (hasUrdu) return text;
  return text.toUpperCase();
};
