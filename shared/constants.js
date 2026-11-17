// shared/constants.js
// AQI categories, commute modes, household types, home types, and budget levels
// for the Urban Air Quality Assistant project.

'use strict';

/** @type {Array<{id: string, min: number, max: number, label: string, color: string, textColor: string, bgColor: string, icon: string, risk: string}>} */
const AQI_CATEGORIES = [
  {
    id: 'good',
    min: 0,
    max: 50,
    label: 'Good',
    color: 'green',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    icon: '😊',
    risk: 'low',
    riskLabel: 'Low Risk',
  },
  {
    id: 'satisfactory',
    min: 51,
    max: 100,
    label: 'Satisfactory',
    color: 'lime',
    textColor: 'text-lime-700',
    bgColor: 'bg-lime-50',
    borderColor: 'border-lime-400',
    icon: '🙂',
    risk: 'low-moderate',
    riskLabel: 'Low-Moderate Risk',
  },
  {
    id: 'moderate',
    min: 101,
    max: 200,
    label: 'Moderate',
    color: 'yellow',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    icon: '😐',
    risk: 'moderate',
    riskLabel: 'Moderate Risk',
  },
  {
    id: 'poor',
    min: 201,
    max: 300,
    label: 'Poor',
    color: 'orange',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-400',
    icon: '😷',
    risk: 'high',
    riskLabel: 'High Risk',
  },
  {
    id: 'very_poor',
    min: 301,
    max: 400,
    label: 'Very Poor',
    color: 'red',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-400',
    icon: '🚨',
    risk: 'very_high',
    riskLabel: 'Very High Risk',
  },
  {
    id: 'severe',
    min: 401,
    max: Infinity,
    label: 'Severe',
    color: 'purple',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-400',
    icon: '☠️',
    risk: 'emergency',
    riskLabel: 'Emergency',
  },
];

/** @type {Array<{value: string, label: string, labelHi: string}>} */
const COMMUTE_MODES = [
  { value: 'car', label: 'Car / Two-wheeler', labelHi: 'कार / दोपहिया' },
  { value: 'bike', label: 'Bicycle', labelHi: 'साइकिल' },
  { value: 'metro_bus', label: 'Metro / Bus', labelHi: 'मेट्रो / बस' },
  { value: 'walk', label: 'Walk', labelHi: 'पैदल' },
  { value: 'wfh', label: 'Work From Home', labelHi: 'घर से काम' },
];

/** @type {Array<{value: string, label: string, labelHi: string}>} */
const HOUSEHOLD_TYPES = [
  { value: 'family_kids', label: 'Family with Children', labelHi: 'बच्चों वाला परिवार' },
  { value: 'elderly', label: 'Elderly / Senior Citizen', labelHi: 'बुजुर्ग / वरिष्ठ नागरिक' },
  { value: 'asthma', label: 'Asthma / Respiratory Condition', labelHi: 'अस्थमा / सांस की समस्या' },
  { value: 'working_professional', label: 'Working Professional', labelHi: 'कामकाजी पेशेवर' },
  { value: 'student', label: 'Student', labelHi: 'छात्र' },
];

/** @type {Array<{value: string, label: string, labelHi: string}>} */
const HOME_TYPES = [
  { value: 'apartment', label: 'Apartment / Flat', labelHi: 'अपार्टमेंट / फ्लैट' },
  { value: 'independent', label: 'Independent House / Villa', labelHi: 'स्वतंत्र मकान / विला' },
];

/** @type {Array<{value: string, label: string, labelHi: string}>} */
const BUDGET_LEVELS = [
  { value: 'low', label: 'Budget-conscious (< ₹500/mo)', labelHi: 'किफायती (< ₹500/माह)' },
  { value: 'medium', label: 'Moderate (₹500–₹2000/mo)', labelHi: 'मध्यम (₹500–₹2000/माह)' },
  { value: 'high', label: 'Premium (₹2000+/mo)', labelHi: 'प्रीमियम (₹2000+/माह)' },
];

module.exports = {
  AQI_CATEGORIES,
  COMMUTE_MODES,
  HOUSEHOLD_TYPES,
  HOME_TYPES,
  BUDGET_LEVELS,
};
