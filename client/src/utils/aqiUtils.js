// AQI category constants (mirrored from shared/constants.js for client use)
export const AQI_CATEGORIES = [
  {
    id: 'good',
    label: 'Good',
    labelHi: 'अच्छा',
    emoji: '🟢',
    min: 0,
    max: 50,
    color: '#22c55e',
    bgClass: 'bg-green-100 dark:bg-green-900',
    textClass: 'text-green-800 dark:text-green-200',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    descriptionHi: 'वायु गुणवत्ता संतोषजनक है और वायु प्रदूषण से बहुत कम या कोई जोखिम नहीं है।',
  },
  {
    id: 'satisfactory',
    label: 'Satisfactory',
    labelHi: 'संतोषजनक',
    emoji: '🟡',
    min: 51,
    max: 100,
    color: '#eab308',
    bgClass: 'bg-yellow-100 dark:bg-yellow-900',
    textClass: 'text-yellow-800 dark:text-yellow-200',
    description: 'Air quality is acceptable. Sensitive individuals may experience minor symptoms.',
    descriptionHi: 'वायु गुणवत्ता स्वीकार्य है। संवेदनशील व्यक्तियों को मामूली लक्षण हो सकते हैं।',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    labelHi: 'मध्यम',
    emoji: '🟠',
    min: 101,
    max: 200,
    color: '#f97316',
    bgClass: 'bg-orange-100 dark:bg-orange-900',
    textClass: 'text-orange-800 dark:text-orange-200',
    description: 'Members of sensitive groups may experience health effects.',
    descriptionHi: 'संवेदनशील समूहों के सदस्यों को स्वास्थ्य प्रभाव हो सकते हैं।',
  },
  {
    id: 'poor',
    label: 'Poor',
    labelHi: 'खराब',
    emoji: '🔴',
    min: 201,
    max: 300,
    color: '#ef4444',
    bgClass: 'bg-red-100 dark:bg-red-900',
    textClass: 'text-red-800 dark:text-red-200',
    description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
    descriptionHi: 'सभी को स्वास्थ्य प्रभाव हो सकते हैं; संवेदनशील समूहों को अधिक गंभीर प्रभाव हो सकते हैं।',
  },
  {
    id: 'very_poor',
    label: 'Very Poor',
    labelHi: 'बहुत खराब',
    emoji: '🟤',
    min: 301,
    max: 400,
    color: '#92400e',
    bgClass: 'bg-amber-100 dark:bg-amber-900',
    textClass: 'text-amber-900 dark:text-amber-100',
    description: 'Health alert: everyone may experience more serious health effects.',
    descriptionHi: 'स्वास्थ्य चेतावनी: सभी को अधिक गंभीर स्वास्थ्य प्रभाव हो सकते हैं।',
  },
  {
    id: 'severe',
    label: 'Severe',
    labelHi: 'गंभीर',
    emoji: '🟣',
    min: 401,
    max: Infinity,
    color: '#7c3aed',
    bgClass: 'bg-purple-100 dark:bg-purple-900',
    textClass: 'text-purple-900 dark:text-purple-100',
    description: 'Emergency conditions. Entire population is likely to be affected.',
    descriptionHi: 'आपातकालीन स्थिति। पूरी आबादी प्रभावित होने की संभावना है।',
  },
];

/**
 * Returns the AQI category object for a given AQI value.
 * @param {number} aqi
 * @returns {object}
 */
export function getAqiCategory(aqi) {
  if (aqi == null || isNaN(aqi)) return AQI_CATEGORIES[0];
  const num = Number(aqi);
  return (
    AQI_CATEGORIES.find((cat) => num >= cat.min && num <= cat.max) ||
    AQI_CATEGORIES[AQI_CATEGORIES.length - 1]
  );
}

/**
 * Returns a human-readable label for the AQI category.
 * @param {number} aqi
 * @param {'en'|'hi'} lang
 * @returns {string}
 */
export function getAqiLabel(aqi, lang = 'en') {
  const cat = getAqiCategory(aqi);
  return lang === 'hi' ? cat.labelHi : cat.label;
}

/**
 * Formats AQI as a padded string.
 * @param {number|null} aqi
 * @returns {string}
 */
export function formatAqi(aqi) {
  if (aqi == null || isNaN(aqi)) return '---';
  return String(Math.round(Number(aqi))).padStart(3, '0');
}

/**
 * Returns an accessible aria-label string for an AQI reading.
 * @param {number} aqi
 * @param {object} category
 * @param {'en'|'hi'} lang
 * @returns {string}
 */
export function getAqiAriaLabel(aqi, category, lang = 'en') {
  const label = lang === 'hi' ? category?.labelHi : category?.label;
  const desc = lang === 'hi' ? category?.descriptionHi : category?.description;
  return `Air Quality Index: ${aqi}. Category: ${label}. ${desc}`;
}
