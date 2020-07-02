'use strict';

/**
 * @const
 */
const STANDARD_DRINKS = { wine: 150, beer: 330, spirits: 30, champagne: 135 };
/**
 * @const
 */
const STANDARD_BOTTLE_SIZE = { wine: 750, beer: 7920, spirits: 750, champagne: 750 };
/**
 * The number of drinks per hour for a liquor that one person can consume
 * @const
 */
const CONSUMPTION_RATE = { wine: 1.2, beer: 1.6, spirits: 1.2, champagne: 1.3 };
/**
 * The configuration of unit types for each drink type
 * @const
 */
const UNIT_TYPE_WINE = {single: 'Bottle', plural: 'Bottles'};
/**
 * The configuration of unit types for each drink type
 * @const
 */
const UNIT_TYPE_BEER = {single: 'Case', plural: 'Cases'};
/**
 * The configuration of unit types for each drink type
 * @const
 */
const UNIT_TYPE_SPIRITS = {single: 'Bottle', plural: 'Bottles'};
/**
 * The configuration of unit types for each drink type
 * @const
 */
const UNIT_TYPE_CHAMPAGNE = {single: 'Bottle', plural: 'Bottles'};
/**
 * @const
 */
const RANGE_PREFERENCES = ['dc-spirits-range', 'dc-beer-range', 'dc-wine-range', 'dc-champagne-range'];
/**
 * @const {string}
 */
const SUFFIX_IS_LOCKED = '-is-locked';
/**
 * @const {string}
 */
const SUFFIX_IS_REQUIRED = '-is-required';
/**
 * @const {string}
 */
const SUFFIX_TOTAL = '-total';
/**
 * @const {string}
 */
const SUFFIX_OUTPUT = '-output';

function toggleLockedRange(target, rangeFieldId) {
  var rangeField = document.getElementById(rangeFieldId);
  if (target.checked) {
    rangeField.disabled = true;
  } else {
    rangeField.disabled = false;
  }
}

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
    liquorNodeList.forEach(function(liquorNode) {
      var isLiquorTypeRequired = document.getElementById(liquorNode.id).checked;
      liquorType[liquorNode.id+SUFFIX_IS_REQUIRED] = isLiquorTypeRequired;
      if (isLiquorTypeRequired) {
        liquorType.count++;
      }
    }, 'thisArg');
  }
}

function calculateUnitResults(containerId, selectorQuery, liquorType, percentage, units, unitType) {
  var results = {};
  var nodeUnitsTotal = 0;
  if (percentage > 0) {
    var container = document.getElementById(containerId);
    var liquorNodeResultsList = container? container.querySelectorAll(selectorQuery): null;
    if (liquorNodeResultsList) {
      liquorNodeResultsList.forEach(function(listNode){
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
  var tempTotal = (nodeUnitsTotal==0)? units: nodeUnitsTotal;
  
  results[containerId+SUFFIX_TOTAL] = `${tempTotal} ${(tempTotal==1)?unitType.single: unitType.plural}`;

  return results;
}
 
function calculateTotalUnits(guests, hours, percentageId, subTypeId, resultsId, standardDrinks, consumptionRate, bottleSize, unitType) {
  var percentage = getPercentageValue(percentageId);
  var units = calculateUnits(guests, hours, percentage, standardDrinks, consumptionRate, bottleSize);
  var liquorType = {count: 0};
  calculateLiquorTypeCount(subTypeId, 'input[data-parent-id]', liquorType);
  return calculateUnitResults(resultsId, 'output', liquorType, percentage, units, unitType);
}

function calculateBeerCases(guests, hours) {
  return calculateTotalUnits(guests, hours, 'dc-beer-range', 'dc-beer-types', 'dc-beer-results', STANDARD_DRINKS.beer, CONSUMPTION_RATE.beer, STANDARD_BOTTLE_SIZE.beer, UNIT_TYPE_BEER);
}

function calculateWineBottles(guests, hours) {
  return calculateTotalUnits(guests, hours, 'dc-wine-range', 'dc-wine-types', 'dc-wine-results', STANDARD_DRINKS.wine, CONSUMPTION_RATE.wine, STANDARD_BOTTLE_SIZE.wine, UNIT_TYPE_WINE);
}

function calculateChampagneBottles(guests, hours) {
  return calculateTotalUnits(guests, hours, 'dc-champagne-range', 'dc-champagne-types', 'dc-champagne-results', STANDARD_DRINKS.champagne, CONSUMPTION_RATE.champagne, STANDARD_BOTTLE_SIZE.champagne, UNIT_TYPE_CHAMPAGNE);
}

function calculateSpiritsBottles(guests, hours) {
  return calculateTotalUnits(guests, hours, 'dc-spirits-range', 'dc-spirits-types', 'dc-spirits-results', STANDARD_DRINKS.spirits, CONSUMPTION_RATE.spirits, STANDARD_BOTTLE_SIZE.spirits, UNIT_TYPE_SPIRITS);
}

function calculateServes(guests, hours, standardDrinks, rate) {
  if (guests <= 0) return 0;

  if (hours <= 0) return 0;

  return standardDrinks * rate * guests * hours;
}

function setRangeOutput(input, output, balance) {
  if (balance < 0) input.value = parseInt(input.value, 10) + balance;

  output.value = input.value;
}

function setOtherRangesOutput(input, output, balance, isLocked) {
  if (isLocked) return;

  var inputValue = parseInt(input.value, 10);
  if (balance && (balance < 0)) {
    inputValue = inputValue + balance;
  }

  output.value = (inputValue < 0? 0: inputValue);
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

/**
 * TODO: refactor to be more modular and testable
 * 
 * refactor to make input a parameter. it is just a waste of resources.
 */
function setPreferences(inputId, output) {
  var input = document.getElementById(inputId);
  var otherPreferences = getOtherPreferences(inputId);
  var balance = getVariableBalance(input.valueAsNumber, otherPreferences);
  var remainderSum = getRemainderSum(otherPreferences);

  setRangeOutput(input, output, balance);

  var otherAvailablePreferencesCount = getAvailablePreferenceCount(otherPreferences);
  otherPreferences.forEach(preference => {
    var preferenceElement = document.getElementById(preference);
    var isLocked = document.getElementById(preference+SUFFIX_IS_LOCKED).checked;
    
    preferenceElement.value = getPreferenceValue(preferenceElement.value, remainderSum, balance, isLocked, otherAvailablePreferencesCount);
    setOtherRangesOutput(preferenceElement, document.getElementById(preference+SUFFIX_OUTPUT), balance, isLocked);
  });
}

function getHours() {
  var hours = parseInt(document.getElementById('dc-duration-hours').value, 10);
  var minutes = parseInt(document.getElementById('dc-duration-minutes').value, 10);
  return hours + (minutes/60);
}

function setResults(results) {
  var element;
  for (let [key, value] of Object.entries(results)) {
    element = document.getElementById(key);
    element.value = value;
    if (value > 0 && element.parentNode.nodeName == 'DD') {
      element.parentNode.style.display = 'block';
    }
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

/**
 * Node exports for exposing methods for unit testing
 */
module.exports = {
  calculateServes: calculateServes,
  getHours: getHours,
  getOtherPreferences: getOtherPreferences,
  getAvailablePreferenceCount: getAvailablePreferenceCount,
  getPercentageValue: getPercentageValue,
  setRangeOutput: setRangeOutput,
  setOtherRangesOutput: setOtherRangesOutput,
  getRemainderSum: getRemainderSum,
  getPreferenceValue: getPreferenceValue,
  getVariableBalance: getVariableBalance,
  calculateLiquorTypeCount: calculateLiquorTypeCount,
  calculateUnitResults: calculateUnitResults,
  toggleLockedRange: toggleLockedRange
}

// Store the public functions in global properties referenced by a string for advanced compilations and minification
window['setPreferences'] = setPreferences;
window['calculateDrinks'] = calculateDrinks;
window['toggleLockedRange'] = toggleLockedRange;
