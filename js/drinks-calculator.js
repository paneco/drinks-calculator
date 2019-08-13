'use strict';

const MILLISECONDS_PER_HOUR = 3600000;
const STANDARD_DRINKS = Object.freeze({ 'wine': 150, 'beer': 330, 'spirits': 30, 'champagne': 150 });
const STANDARD_BOTTLE_SIZE = Object.freeze({ 'wine': 750, 'beer': 7920, 'spirits': 750, 'champagne': 750 });
// The number of drinks per hour for a liquor that one person can consume
const CONSUMPTION_RATE = Object.freeze({ 'wine': 1, 'beer': 1.5, 'spirits': 1.2, 'champagne': 1.2 });
const RANGE_PREFERENCES = Object.freeze(['dc-spirits-range', 'dc-beer-range', 'dc-wine-range', 'dc-champagne-range']);


function calculateUnits(guests, hours, percentage, standardDrinks, consumptionRate, bottleSize) {
  var drinks = calculateServes(guests, hours, standardDrinks, consumptionRate);
  return Math.ceil(percentage * (drinks/bottleSize));
}

function calculateBeerCases(guests, hours) {
  var percentage = parseInt(document.getElementById('dc-beer-range').value)/100;
  return calculateUnits(guests, hours, percentage, STANDARD_DRINKS.beer, CONSUMPTION_RATE.beer, STANDARD_BOTTLE_SIZE.beer);
}

function getLiquorTypeCount(elementId, liquorTypeCount) {
  var isLiquorTypeRequired = document.getElementById(elementId).checked;
  return (isLiquorTypeRequired)? liquorTypeCount++: liquorTypeCount;
}

function calculateWineBottles(guests, hours) {
  var percentage = parseInt(document.getElementById('dc-wine-range').value)/100;
  var units = calculateUnits(guests, hours, percentage, STANDARD_DRINKS.wine, CONSUMPTION_RATE.wine, STANDARD_BOTTLE_SIZE.wine);
  var container = document.getElementById('dc-wine-types');
  // var liquorTypeCount = 0;
  var wineNodeList = container.querySelectorAll('data-parent-id');
  var liquorTypeCount = 0;
  liquorTypeCount = getLiquorTypeCount('dc-red-wine', liquorTypeCount);
  liquorTypeCount = getLiquorTypeCount('dc-white-wine', liquorTypeCount);

  var totalRedWineUnits = 0;
  var totalWhiteWineUnits = 0;
  if (percentage > 0 && liquorTypeCount > 0) {
    totalRedWineUnits = (isRedWineRequired? Math.ceil(units/liquorTypeCount): 0);
    totalWhiteWineUnits = (isWhiteWineRequired? Math.ceil(units/liquorTypeCount): 0);
    units = totalRedWineUnits + totalWhiteWineUnits;
  }
  return {totalUnits: units, redWineUnits: totalRedWineUnits, whiteWineUnits: totalWhiteWineUnits};
}

function calculateChampagneBottles(guests, hours) {
  var percentage = parseInt(document.getElementById('dc-champagne-range').value)/100;
  return calculateUnits(guests, hours, percentage, STANDARD_DRINKS.champagne, CONSUMPTION_RATE.champagne, STANDARD_BOTTLE_SIZE.champagne);
}

function calculateSpiritsBottles(guests, hours) {
  var percentage = parseInt(document.getElementById('dc-spirits-range').value)/100;
  return calculateUnits(guests, hours, percentage, STANDARD_DRINKS.spirits, CONSUMPTION_RATE.spirits, STANDARD_BOTTLE_SIZE.spirits);
}

function calculateServes(guests, hours, standardDrinks, rate) {
  if (guests <= 0) return 0;

  if (hours <= 0) return 0;

  return standardDrinks * rate * guests * hours;
}

function updateRangeOutput(input, output, balance) {
  var inputValue = parseInt(input.value);
  if (balance && (balance < 0)) {
    inputValue = inputValue + balance;
  }

  output.value = parseInt(inputValue);
}

function getOtherPreferences(elementId) {
  return RANGE_PREFERENCES.filter(function(preference) {
    return preference != elementId;
  });
}

function getRemainderSum(otherPreferences) {
  return otherPreferences.reduce(function(sum, preference) {
    var prefElem = document.getElementById(preference);
    var isLockedElem = document.getElementById(preference+"-is-locked");
    var isLocked = isLockedElem? isLockedElem.checked: false;
    return sum + (prefElem && !isLocked? parseInt(prefElem.value): 0);
  },0);
}

function getPreferenceValue(preferenceValue, remainderSum, balance, isLocked, otherAvailablePreferencesCount) {
  var value;
  if (isLocked) {
    value = preferenceValue;
  }
  else if (balance > 0 && preferenceValue == 0) {
    value = (balance / otherAvailablePreferencesCount);
  }
  else {
    value = (remainderSum == 0? 0: preferenceValue / remainderSum * balance);
  }
  return value;
}

function getVariableBalance(inputValue, otherPreferences) {
  var balance = 100 - inputValue;
  otherPreferences.forEach(preference => {
    var preferenceElement = document.getElementById(preference);
    var isLocked = document.getElementById(preference+"-is-locked").checked;
    balance = balance - (isLocked? preferenceElement.value: 0);
  });
  return balance;
}

function getAvailablePreferenceCount(otherPreferences) {
  return otherPreferences.reduce(function(accumulator, preference) {
    return accumulator + (document.getElementById(preference+"-is-locked").checked? 0: 1);
  }, 0);
}

// TODO: refactor to be more modular and testable
function setPreferences(inputId, output) {
  var input = document.getElementById(inputId);
  var otherPreferences = getOtherPreferences(inputId);
  var balance = getVariableBalance(input.valueAsNumber, otherPreferences);
  var remainderSum = getRemainderSum(otherPreferences);
  console.log("input = "+input.value);
  console.log("balance = "+balance);
  console.log("remainderSum = "+remainderSum);

  // TODO: test this
  if (balance < 0) input.value = input.valueAsNumber + balance;

  updateRangeOutput(input, output);

  var otherAvailablePreferencesCount = getAvailablePreferenceCount(otherPreferences);
  console.log("otherAvailablePreferencesCount = "+otherAvailablePreferencesCount);
  otherPreferences.forEach(preference => {
    var preferenceElement = document.getElementById(preference);
    var isLocked = document.getElementById(preference+"-is-locked").checked;
    console.log("preferenceElement.id = "+preferenceElement.id);
    console.log("preferenceElement.value = "+preferenceElement.value);
    
    preferenceElement.value = getPreferenceValue(preferenceElement.value, remainderSum, balance, isLocked, otherAvailablePreferencesCount);
    updateRangeOutput(preferenceElement, document.getElementById(preference+'-output'));
  });
}

function getHours(durationTicks) {
  return durationTicks/MILLISECONDS_PER_HOUR;
}

// function calculateWine(guests, hours, percentage, preferences) {
//   var liquorTypes = getSelectedPreferences(preferences);
//   return 0;
// }

// function calculateBeer(guests, hours, percentage, preferences) {
//   return 0;
// }

// function getSelectedPreferences(preferences) {
//   var selectedPreferences;
//   console.log("type = "+preferences.constructor.name);
//   if (preferences instanceof Array) {
//     selectedPreferences = preferences.filter(function(preference) {
//       console.log("preference = "+preference);
//       console.log("preference.['red-wine'] = "+preference['red-wine']);
//       console.log("preference.value = "+preference.value);
//       console.log("preference[0] = "+preference[0]);
//       console.log("preference[1] = "+preference[1]);
//       return preference.value == true;
//     });
//   } else {
//     selectedPreferences = [];
//   }
//   return selectedPreferences;
// }

function calculateDrinks() {
  var guests = document.getElementById('dc-guests').valueAsNumber;
  var hours = getHours(document.getElementById('dc-duration').valueAsNumber);

  var wineBottles = calculateWineBottles(guests,hours);
  document.getElementById('dc-wine-results').value = wineBottles['totalUnits'];
  document.getElementById('dc-wine-results-red-wine').value = wineBottles['redWineUnits'];
  document.getElementById('dc-wine-results-white-wine').value = wineBottles['whiteWineUnits'];
  document.getElementById('dc-beer-results').value = calculateBeerCases(guests,hours);
  document.getElementById('dc-spirits-results').value = calculateSpiritsBottles(guests,hours);
  document.getElementById('dc-champagne-results').value = calculateChampagneBottles(guests,hours);
  return false;
}

module.exports = {
  calculateServes: calculateServes,
  getOtherPreferences: getOtherPreferences,
  // getSelectedPreferences: getSelectedPreferences,
  getAvailablePreferenceCount: getAvailablePreferenceCount,
  updateRangeOutput: updateRangeOutput,
  getRemainderSum: getRemainderSum,
  getPreferenceValue: getPreferenceValue,
  getVariableBalance: getVariableBalance,
  calculateWineBottles: calculateWineBottles,
  calculateChampagneBottles: calculateChampagneBottles,
  calculateSpiritsBottles: calculateSpiritsBottles,
  calculateBeerCases: calculateBeerCases
}
