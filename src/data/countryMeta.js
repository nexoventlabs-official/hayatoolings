// Per-country shipping form metadata: dial code, postal-code label / pattern,
// and (for major markets) a curated state / province / region list. Anything
// not in the map falls back to a free-text state field with a generic
// postal-code regex.
//
// Schema:
//   {
//     dial: '+91',                              // E.164 dial code (with leading +)
//     postalLabel: 'PIN Code',                  // human label shown above the input
//     postalPlaceholder: '6-digit PIN',         // input placeholder hint
//     postalPattern: /^[1-9]\d{5}$/,            // validation regex (or null = no check)
//     postalExample: '560001',                  // shown in errors
//     stateLabel: 'State',                      // 'State' / 'Province' / 'Region' …
//     states: ['Andhra Pradesh', ...],          // optional list — if present, render <select>
//   }

export const COUNTRY_META = {
  IN: {
    dial: '+91',
    postalLabel: 'PIN Code',
    postalPlaceholder: '6-digit PIN',
    postalPattern: /^[1-9]\d{5}$/,
    postalExample: '560001',
    stateLabel: 'State',
    states: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
      'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
      'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
      'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
      'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
      'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
    ],
  },
  US: {
    dial: '+1',
    postalLabel: 'ZIP Code',
    postalPlaceholder: '5-digit ZIP',
    postalPattern: /^\d{5}(-\d{4})?$/,
    postalExample: '94103',
    stateLabel: 'State',
    states: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
      'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
      'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
      'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
      'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
      'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
      'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
    ],
  },
  CA: {
    dial: '+1',
    postalLabel: 'Postal Code',
    postalPlaceholder: 'A1A 1A1',
    postalPattern: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    postalExample: 'M5V 3L9',
    stateLabel: 'Province',
    states: [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
      'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
      'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon',
    ],
  },
  GB: {
    dial: '+44',
    postalLabel: 'Postcode',
    postalPlaceholder: 'SW1A 1AA',
    // Simplified UK postcode regex — covers all formats we'd actually receive.
    postalPattern: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/,
    postalExample: 'SW1A 1AA',
    stateLabel: 'County / Region',
    states: [
      'England', 'Scotland', 'Wales', 'Northern Ireland',
      'London', 'Greater Manchester', 'West Midlands', 'Yorkshire',
      'Lancashire', 'Kent', 'Essex', 'Surrey', 'Hampshire',
    ],
  },
  AU: {
    dial: '+61',
    postalLabel: 'Postcode',
    postalPlaceholder: '4-digit postcode',
    postalPattern: /^\d{4}$/,
    postalExample: '2000',
    stateLabel: 'State / Territory',
    states: [
      'Australian Capital Territory', 'New South Wales', 'Northern Territory',
      'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia',
    ],
  },
  AE: {
    dial: '+971',
    postalLabel: 'P.O. Box',
    postalPlaceholder: 'P.O. Box',
    postalPattern: null,
    postalExample: '12345',
    stateLabel: 'Emirate',
    states: [
      'Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah',
      'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain',
    ],
  },
  SG: {
    dial: '+65',
    postalLabel: 'Postal Code',
    postalPlaceholder: '6-digit postal',
    postalPattern: /^\d{6}$/,
    postalExample: '238823',
    stateLabel: 'Region',
    states: ['Central', 'East', 'North', 'North-East', 'West'],
  },
  DE: {
    dial: '+49',
    postalLabel: 'PLZ',
    postalPlaceholder: '5-digit PLZ',
    postalPattern: /^\d{5}$/,
    postalExample: '10115',
    stateLabel: 'Bundesland',
    states: [
      'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen',
      'Hamburg', 'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern',
      'North Rhine-Westphalia', 'Rhineland-Palatinate', 'Saarland', 'Saxony',
      'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia',
    ],
  },
  FR: {
    dial: '+33',
    postalLabel: 'Code Postal',
    postalPlaceholder: '5-digit code',
    postalPattern: /^\d{5}$/,
    postalExample: '75001',
    stateLabel: 'Région',
    states: [
      'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany',
      'Centre-Val de Loire', 'Corsica', 'Grand Est', 'Hauts-de-France',
      'Île-de-France', 'Normandy', 'Nouvelle-Aquitaine', 'Occitanie',
      'Pays de la Loire', "Provence-Alpes-Côte d'Azur",
    ],
  },
};

// Generic fallback for any country not in the map above.
const DEFAULT_META = {
  dial: '',
  postalLabel: 'Postal / ZIP Code',
  postalPlaceholder: 'Postal code',
  postalPattern: null,
  postalExample: '',
  stateLabel: 'State / Province / Region',
  states: null,
};

export const getCountryMeta = (code) => COUNTRY_META[code] || DEFAULT_META;

// Strip a leading dial code from a phone string so we can swap dial codes
// when the country changes without keeping the old prefix glued on.
export const stripDial = (phone, dial) => {
  if (!phone) return '';
  const trimmed = String(phone).trim();
  if (dial && trimmed.startsWith(dial)) return trimmed.slice(dial.length).trim();
  // Also strip any leading + plus 1-3 digits as a generic fallback.
  return trimmed.replace(/^\+\d{1,4}[\s-]*/, '').trim();
};
