'use strict';

const STANDARD_DRINKS = Object.freeze({ 'wine': 150, 'beer': 330, 'spirits': 30, 'champagne': 150 });
const STANDARD_BOTTLE_SIZE = Object.freeze({ 'wine': 750, 'beer': 7920, 'spirits': 750, 'champagne': 750 });
// The number of drinks per hour for a liquor that one person can consume
const CONSUMPTION_RATE = Object.freeze({ 'wine': 1, 'beer': 1.5, 'spirits': 1.2, 'champagne': 1.2 });
const RANGE_PREFERENCES = Object.freeze(['dc-spirits-range', 'dc-beer-range', 'dc-wine-range', 'dc-champagne-range']);
const SUFFIX_IS_LOCKED = '-is-locked';
const SUFFIX_IS_REQUIRED = '-is-required';

function calculateUnits(guests, hours, percentage, standardDrinks, consumptionRate, bottleSize) {
  var drinks = calculateServes(guests, hours, standardDrinks, consumptionRate);
  return Math.ceil(percentage * (drinks/bottleSize));
}

function getPercentageValue(elementId) {
  return document.getElementById(elementId)? parseInt(document.getElementById(elementId).value, 10)/100: 0;
}

function calculateLiquorTypeCount(containerId, selectorQuery, liquorType) {
  var container = document.getElementById(containerId);
  if (container) {
    var liquorNodeList = container.querySelectorAll(selectorQuery);
    liquorNodeList.forEach(function(liquorNode, index, listObj) {
      var isLiquorTypeRequired = document.getElementById(liquorNode.id).checked;
      liquorType[liquorNode.id+SUFFIX_IS_REQUIRED] = isLiquorTypeRequired;
      if (isLiquorTypeRequired) {
        liquorType.count++;
      }
    }, 'thisArg');
  }
}

function calculateUnitResults(containerId, selectorQuery, liquorType, percentage, units) {
  var results = {};
  var nodeUnitsTotal = 0;
  if (percentage > 0) {// && liquorType.count > 0) {
    var container = document.getElementById(containerId);
    var wineNodeResultsList = container? container.querySelectorAll(selectorQuery): null;
    if (wineNodeResultsList) {
      wineNodeResultsList.forEach(function(listNode, index, listObj){
        var forElementId = listNode.getAttribute('for');
        if (liquorType[forElementId+SUFFIX_IS_REQUIRED]) {
          var listNodeUnits = (liquorType[forElementId+SUFFIX_IS_REQUIRED]? Math.ceil(units/liquorType.count): 0);
          results[listNode.id] = listNodeUnits;
          nodeUnitsTotal = nodeUnitsTotal + listNodeUnits;
        } else {
          results[listNode.id] = 0;
        }
      }, 'thisArg');
    }
  }
  results[containerId+'-total'] = (nodeUnitsTotal==0)?units: nodeUnitsTotal;

  return results;
}
 
function calculateTotalUnits(guests, hours, percentageId, subTypeId, resultsId) {
  var percentage = getPercentageValue(percentageId);
  var units = calculateUnits(guests, hours, percentage, STANDARD_DRINKS.wine, CONSUMPTION_RATE.wine, STANDARD_BOTTLE_SIZE.wine);
  var liquorType = {count: 0};
  calculateLiquorTypeCount(subTypeId, 'input[data-parent-id]', liquorType);
  return calculateUnitResults(resultsId, 'output', liquorType, percentage, units);
}

function calculateBeerCases(guests, hours) {
  return calculateTotalUnits(guests, hours, 'dc-beer-range', 'dc-beer-types', 'dc-beer-results');
}

function calculateWineBottles(guests, hours) {
  return calculateTotalUnits(guests, hours, 'dc-wine-range', 'dc-wine-types', 'dc-wine-results');
}

function calculateChampagneBottles(guests, hours) {
  return calculateTotalUnits(guests, hours, 'dc-champagne-range', 'dc-champagne-types', 'dc-champagne-results');
}

function calculateSpiritsBottles(guests, hours) {
  return calculateTotalUnits(guests, hours, 'dc-spirits-range', 'dc-spirits-types', 'dc-spirits-results');
}

function calculateServes(guests, hours, standardDrinks, rate) {
  if (guests <= 0) return 0;

  if (hours <= 0) return 0;

  return standardDrinks * rate * guests * hours;
}

function updateRangeOutput(input, output, balance) {
  var inputValue = parseInt(input.value, 10);
  if (balance && (balance < 0)) {
    inputValue = inputValue + balance;
  }

  output.value = parseInt(inputValue, 10);
}

function getOtherPreferences(elementId) {
  return RANGE_PREFERENCES.filter(function(preference) {
    return preference != elementId;
  });
}

function getRemainderSum(otherPreferences) {
  return otherPreferences.reduce(function(sum, preference) {
    var prefElem = document.getElementById(preference);
    var isLockedElem = document.getElementById(preference+SUFFIX_IS_LOCKED);
    var isLocked = isLockedElem? isLockedElem.checked: false;
    return sum + (prefElem && !isLocked? parseInt(prefElem.value, 10): 0);
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
    var isLocked = document.getElementById(preference+SUFFIX_IS_LOCKED).checked;
    balance = balance - (isLocked? preferenceElement.value: 0);
  });
  return balance;
}

function getAvailablePreferenceCount(otherPreferences) {
  return otherPreferences.reduce(function(accumulator, preference) {
    return accumulator + (document.getElementById(preference+SUFFIX_IS_LOCKED).checked? 0: 1);
  }, 0);
}

// TODO: refactor to be more modular and testable
function setPreferences(inputId, output) {
  var input = document.getElementById(inputId);
  var otherPreferences = getOtherPreferences(inputId);
  var balance = getVariableBalance(input.valueAsNumber, otherPreferences);
  var remainderSum = getRemainderSum(otherPreferences);

  // TODO: test this
  if (balance < 0) input.value = input.valueAsNumber + balance;

  updateRangeOutput(input, output, balance);

  var otherAvailablePreferencesCount = getAvailablePreferenceCount(otherPreferences);
  otherPreferences.forEach(preference => {
    var preferenceElement = document.getElementById(preference);
    var isLocked = document.getElementById(preference+SUFFIX_IS_LOCKED).checked;
    
    preferenceElement.value = getPreferenceValue(preferenceElement.value, remainderSum, balance, isLocked, otherAvailablePreferencesCount);
    updateRangeOutput(preferenceElement, document.getElementById(preference+'-output'), balance);
  });
}

function getHours() {
  var hours = parseInt(document.getElementById('dc-duration-hours').value, 10);
  var minutes = parseInt(document.getElementById('dc-duration-minutes').value, 10);
  return hours + (minutes/60);
}

function setResults(results) {
  for (let [key, value] of Object.entries(results)) {
    document.getElementById(key).value = value;
  }
}

function calculateDrinks() {
  var guests = document.getElementById('dc-guests').valueAsNumber;
  var hours = getHours();

  var results = calculateWineBottles(guests, hours);
  setResults(results);

  results = calculateSpiritsBottles(guests, hours);
  setResults(results);

  results = calculateChampagneBottles(guests, hours);
  setResults(results);

  results = calculateBeerCases(guests, hours);
  setResults(results);

  var resultsElement = document.getElementById('dc-calculated-results');
  resultsElement.style.display = 'block';

  return false;
}

try {
  module.exports = {
    calculateServes: calculateServes,
    getHours: getHours,
    getOtherPreferences: getOtherPreferences,
    getAvailablePreferenceCount: getAvailablePreferenceCount,
    getPercentageValue: getPercentageValue,
    updateRangeOutput: updateRangeOutput,
    getRemainderSum: getRemainderSum,
    getPreferenceValue: getPreferenceValue,
    getVariableBalance: getVariableBalance,
    calculateLiquorTypeCount: calculateLiquorTypeCount,
    calculateUnitResults: calculateUnitResults
  }
} catch (error) {
  console.info("error exporting modules: \n\t"+error);  
}
