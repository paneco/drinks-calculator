/** @nocompile */
'use strict';

const calculator = require('../js/drinks-calculator.js');

test('determine number of hours value when hours and minutes are zero', () => {
  document.body.innerHTML = '<div>' +
    '<input id="dc-duration-hours" name="dc-duration-hours" type="number" min="1" max="10" step="1" required value="0"/>' +
    '<input id="dc-duration-minutes" name="dc-duration-minutes" type="number" min="0" max="30" step="30" required value="0"/>' +
    '</div>';
  expect(calculator.getHours()).toBe(0);
});

test('determine number of hours value when hours set and minutes are zero', () => {
  document.body.innerHTML = '<div>' +
    '<input id="dc-duration-hours" name="dc-duration-hours" type="number" min="1" max="10" step="1" required value="1"/>' +
    '<input id="dc-duration-minutes" name="dc-duration-minutes" type="number" min="0" max="30" step="30" required value="0"/>' +
    '</div>';
  expect(calculator.getHours()).toBe(1);
});

test('determine number of hours value when hours set and minutes are 30', () => {
  document.body.innerHTML = '<div>' +
    '<input id="dc-duration-hours" name="dc-duration-hours" type="number" min="1" max="10" step="1" required value="1"/>' +
    '<input id="dc-duration-minutes" name="dc-duration-minutes" type="number" min="0" max="30" step="30" required value="30"/>' +
    '</div>';
  expect(calculator.getHours()).toBe(1.5);
});

test('determine percentage value when element does not exist', () => {
  document.body.innerHTML = '<div>' +
    '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="14"/>' +
    '<input id="dc-wine-range-is-locked" name="dc-wine-range-is-locked" type="checkbox"/>' +
    '</div>';
  expect(calculator.getPercentageValue('unknown')).toBe(0);
});

test('determine percentage value when element exists', () => {
  document.body.innerHTML = '<div>' +
    '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="14"/>' +
    '<input id="dc-wine-range-is-locked" name="dc-wine-range-is-locked" type="checkbox"/>' +
    '</div>';
  expect(calculator.getPercentageValue('dc-wine-range')).toBe(0.14);
});

test('determine number of servings required for zero hours', () => {
  expect(calculator.calculateServes(2, 0, 150, 2)).toBe(0);
});

test('determine number of servings required for negative hours', () => {
  expect(calculator.calculateServes(2, -1, 150, 2)).toBe(0);
});

test('determine number of servings required for zero guests', () => {
  expect(calculator.calculateServes(0, 5, 150, 2)).toBe(0);
});

test('determine number of servings required for negative guests', () => {
  expect(calculator.calculateServes(-1, 5, 150, 2)).toBe(0);
});

test('determine number of servings required for 1 hour for 1 person', () => {
  expect(calculator.calculateServes(1, 1, 150, 2)).toBe(300);
});

test('determine number of servings required when more than one unit is required', () => {
  expect(calculator.calculateServes(7, 2, 150, 2)).toBe(4200);
});

test('return the list of of non active drink preferences for an existing element', () => {
  expect(calculator.getOtherPreferences('dc-beer-range')).toEqual(['dc-spirits-range', 'dc-wine-range', 'dc-champagne-range']);
});

test('return the list of of non active drink preferences for an empty string', () => {
  expect(calculator.getOtherPreferences('')).toEqual(['dc-spirits-range', 'dc-beer-range', 'dc-wine-range', 'dc-champagne-range']);
});

test('return the list of of non active drink preferences for null', () => {
  expect(calculator.getOtherPreferences(null)).toEqual(['dc-spirits-range', 'dc-beer-range', 'dc-wine-range', 'dc-champagne-range']);
});

test('return the list of of non active drink preferences for an invalid element', () => {
  expect(calculator.getOtherPreferences('invalid')).toEqual(['dc-spirits-range', 'dc-beer-range', 'dc-wine-range', 'dc-champagne-range']);
});

test('calculate the variable balance that can be distributed amongst the inputs when no inputs are locked', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="14"/>' +
      '<input id="dc-spirits-range-is-locked" name="dc-beer-spirits-is-locked" type="checkbox"/>' +
      '</div><div>'+
      '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="14"/>' +
      '<input id="dc-wine-range-is-locked" name="dc-wine-range-is-locked" type="checkbox"/>' +
      '</div><div>'+
      '<input id="dc-champagne-range" name="dc-champagne-range" type="range" min="0" max="100" value="14"/>' +
      '<input id="dc-champagne-range-is-locked" name="dc-champagne-range-is-locked" type="checkbox"/>' +
      '</div>';
  var otherPreferences = ['dc-spirits-range', 'dc-wine-range', 'dc-champagne-range'];
  expect(calculator.getVariableBalance(50, otherPreferences)).toBe(50);
});

test('calculate the variable balance that can be distributed amongst the inputs when all others are locked', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="14"/>' +
      '<input id="dc-spirits-range-is-locked" name="dc-spirits-range-is-locked" type="checkbox" checked/>' +
      '</div><div>'+
      '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="14"/>' +
      '<input id="dc-wine-range-is-locked" name="dc-wine-range-is-locked" type="checkbox" checked/>' +
      '</div><div>'+
      '<input id="dc-champagne-range" name="dc-champagne-range" type="range" min="0" max="100" value="14"/>' +
      '<input id="dc-champagne-range-is-locked" name="dc-champagne-range-is-locked" type="checkbox" checked/>' +
      '</div>';
    var otherPreferences = ['dc-spirits-range', 'dc-wine-range', 'dc-champagne-range'];
    expect(calculator.getVariableBalance(58, otherPreferences)).toBe(0);
});

test('calculate the variable balance that can be distributed amongst the inputs when some are locked', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="15"/>' +
      '<input id="dc-spirits-range-is-locked" name="dc-spirits-range-is-locked" type="checkbox"/>' +
      '</div><div>'+
      '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="15"/>' +
      '<input id="dc-wine-range-is-locked" name="dc-wine-range-is-locked" type="checkbox"/>' +
      '</div><div>'+
      '<input id="dc-champagne-range" name="dc-champagne-range" type="range" min="0" max="100" value="20"/>' +
      '<input id="dc-champagne-range-is-locked" name="dc-champagne-range-is-locked" type="checkbox" checked/>' +
      '</div>';
    var otherPreferences = ['dc-spirits-range', 'dc-wine-range', 'dc-champagne-range'];
    expect(calculator.getVariableBalance(50, otherPreferences)).toBe(30);
});

test('calculate the sum of the other drink types with empty input array', () => {
  expect(calculator.getRemainderSum([])).toBe(0);
});

test('calculate the sum of the other drink types with invalid input array', () => {
  document.body.innerHTML = '<div><label id="dc-label-beer" for="dc-beer-range" >Beer:</label>' +
      '<input id="dc-beer-range" name="dc-beer-range" type="range" min="0" max="100" value="22"/>' +
      '<input id="dc-beer-range-is-locked" name="dc-beer-range-is-locked" type="checkbox"/>' +
      '</div><div>'+
      '<label id="dc-label-spirits" for="dc-spirits-range" >Spirits:</label>'+
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="14"/>' +
      '<input id="dc-spirits-range-is-locked" name="dc-spirits-range-is-locked" type="checkbox"/>' +
      '</div><div>'+
      '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="14"/>' +
      '<input id="dc-wine-range-is-locked" name="dc-wine-range-is-locked" type="checkbox"/>' +
      '</div><div>'+
      '<input id="dc-champagne-range" name="dc-champagne-range" type="range" min="0" max="100" value="14"/>' +
      '<input id="dc-champagne-range-is-locked" name="dc-champagne-range-is-locked" type="checkbox"/>' +
      '</div>';

  expect(calculator.getRemainderSum(['invalid'])).toBe(0);
});

test('calculate the sum of the other drink types with valid input array', () => {
  document.body.innerHTML = '<div><label id="dc-label-beer" for="dc-beer-range" >Beer:</label>' +
      '<input id="dc-beer-range" name="dc-beer-range" type="range" min="0" max="100" value="22"/>' +
      '<input id="dc-beer-range-is-locked" name="dc-beer-range-is-locked" type="checkbox"/>' +
      '</div><div>'+
      '<label id="dc-label-spirits" for="dc-spirits-range" >Spirits:</label>'+
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="14"/>' +
      '<input id="dc-spirits-range-is-locked" name="dc-spirits-range-is-locked" type="checkbox"/>' +
      '</div>';

  expect(calculator.getRemainderSum(['dc-spirits-range', 'dc-beer-range'])).toBe(36);
});

test('calculate the preference value when remainder is zero', () => {
  expect(calculator.getPreferenceValue(7,0,5,false,2)).toBe(0);
});

test('calculate the preference value when balance is zero and preference is zero', () => {
  expect(calculator.getPreferenceValue(0,5,0,false,2)).toBe(0);
});

test('calculate the preference value when balance is zero and preference is greater than zero', () => {
  expect(calculator.getPreferenceValue(7,5,0,false,2)).toBe(0);
});

test('calculate the preference value when preference is zero and balance is greater than zero', () => {
  expect(calculator.getPreferenceValue(0,7,5,false,2)).toBe(2.5);
});

test('calculate the preference value when all values are greater than zero', () => {
  expect(calculator.getPreferenceValue(48,4,5,false,2)).toBe(60);
});

test('calculate the preference value when preference is locked', () => {
  expect(calculator.getPreferenceValue(48,4,5,true,2)).toBe(48);
});

test('calculate the count of remaining preferences that are unlocked when none are locked', () => {
  document.body.innerHTML = '<div><label id="dc-label-beer" for="dc-beer-range" >Beer:</label>' +
      '<input id="dc-beer-range" name="dc-beer-range" type="range" min="0" max="100" value="22"/>' +
      '<input id="dc-beer-range-is-locked" name="dc-beer-range-is-locked" type="checkbox"/>' +
      '</div><div>'+
      '<label id="dc-label-spirits" for="dc-spirits-range" >Spirits:</label>'+
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="14"/>' +
      '<input id="dc-spirits-range-is-locked" name="dc-spirits-range-is-locked" type="checkbox"/>' +
      '</div>';

  expect(calculator.getAvailablePreferenceCount(['dc-spirits-range', 'dc-beer-range'])).toBe(2);
});

test('calculate the count of remaining preferences that are unlocked when some are locked', () => {
  document.body.innerHTML = '<div><label id="dc-label-beer" for="dc-beer-range" >Beer:</label>' +
      '<input id="dc-beer-range" name="dc-beer-range" type="range" min="0" max="100" value="22"/>' +
      '<input id="dc-beer-range-is-locked" name="dc-beer-range-is-locked" type="checkbox" checked="true"/>' +
      '</div><div>'+
      '<label id="dc-label-spirits" for="dc-spirits-range" >Spirits:</label>'+
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="14"/>' +
      '<input id="dc-spirits-range-is-locked" name="dc-spirits-range-is-locked" type="checkbox"/>' +
      '</div>';

  expect(calculator.getAvailablePreferenceCount(['dc-spirits-range', 'dc-beer-range'])).toBe(1);
});

test('calculate the count of remaining preferences that are unlocked when all are locked', () => {
  document.body.innerHTML = '<div><label id="dc-label-beer" for="dc-beer-range" >Beer:</label>' +
      '<input id="dc-beer-range" name="dc-beer-range" type="range" min="0" max="100" value="22"/>' +
      '<input id="dc-beer-range-is-locked" name="dc-beer-range-is-locked" type="checkbox" checked="true"/>' +
      '</div><div>'+
      '<label id="dc-label-spirits" for="dc-spirits-range" >Spirits:</label>'+
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="14"/>' +
      '<input id="dc-spirits-range-is-locked" name="dc-spirits-range-is-locked" type="checkbox" checked="true"/>' +
      '</div>';

    expect(calculator.getAvailablePreferenceCount(['dc-spirits-range', 'dc-beer-range'])).toBe(0);
});

test('determine count of liquor and sub-types required when no matches on the container id', () => {
  document.body.innerHTML = '<details id="dc-wine-types">'+
      '<div><input type="checkbox" id="dc-red-wine" name="dc-wine-preference" value="red-wine" data-parent-id="dc-wine-range"/></div>'+
      '<div><input type="checkbox" id="dc-white-wine" name="dc-wine-preference" value="white-wine" data-parent-id="dc-wine-range"/></div>'+
    '</details>';
  var liquorType = {count: 0};
  calculator.calculateLiquorTypeCount('unknown', 'input[data-parent-id]', liquorType);
  expect(liquorType.count).toBe(0);
  expect(liquorType['dc-red-wine-is-required']).toBeUndefined();
  expect(liquorType['dc-white-wine-is-required']).toBeUndefined();
});

test('determine count of liquor and sub-types required when no matches on query string', () => {
  document.body.innerHTML = '<details id="dc-wine-types">'+
      '<div><input type="checkbox" id="dc-red-wine" name="dc-wine-preference" value="red-wine" data-parent-id="dc-wine-range"/></div>'+
      '<div><input type="checkbox" id="dc-white-wine" name="dc-wine-preference" value="white-wine" data-parent-id="dc-wine-range"/></div>'+
    '</details>';
  var liquorType = {count: 0};
  calculator.calculateLiquorTypeCount('dc-wine-types', 'input[data-unknown]', liquorType);
  expect(liquorType.count).toBe(0);
  expect(liquorType['dc-red-wine-is-required']).toBeUndefined();
  expect(liquorType['dc-white-wine-is-required']).toBeUndefined();
});

test('determine count of liquor and sub-types required when all types are not set', () => {
  document.body.innerHTML = '<details id="dc-wine-types">'+
      '<div><input type="checkbox" id="dc-red-wine" name="dc-wine-preference" value="red-wine" data-parent-id="dc-wine-range"/></div>'+
      '<div><input type="checkbox" id="dc-white-wine" name="dc-wine-preference" value="white-wine" data-parent-id="dc-wine-range"/></div>'+
    '</details>';
  var liquorType = {count: 0};
  calculator.calculateLiquorTypeCount('dc-wine-types', 'input[data-parent-id]', liquorType);
  expect(liquorType.count).toBe(0);
  expect(liquorType['dc-red-wine-is-required']).toBe(false);
  expect(liquorType['dc-white-wine-is-required']).toBe(false);
});

test('determine count of liquor and sub-types required when all types are set', () => {
  document.body.innerHTML = '<details id="dc-wine-types">'+
      '<div><input type="checkbox" id="dc-red-wine" name="dc-wine-preference" value="red-wine" data-parent-id="dc-wine-range" checked/></div>'+
      '<div><input type="checkbox" id="dc-white-wine" name="dc-wine-preference" value="white-wine" data-parent-id="dc-wine-range" checked/></div>'+
    '</details>';
  var liquorType = {count: 0};
  calculator.calculateLiquorTypeCount('dc-wine-types', 'input[data-parent-id]', liquorType);
  expect(liquorType.count).toBe(2);
  expect(liquorType['dc-red-wine-is-required']).toBe(true);
  expect(liquorType['dc-white-wine-is-required']).toBe(true);
});

test('determine count of liquor and sub-types required when some types are set', () => {
  document.body.innerHTML = '<details id="dc-wine-types">'+
      '<div><input type="checkbox" id="dc-red-wine" name="dc-wine-preference" value="red-wine" data-parent-id="dc-wine-range" checked/></div>'+
      '<div><input type="checkbox" id="dc-white-wine" name="dc-wine-preference" value="white-wine" data-parent-id="dc-wine-range"/></div>'+
    '</details>';
  var liquorType = {count: 0};
  calculator.calculateLiquorTypeCount('dc-wine-types', 'input[data-parent-id]', liquorType);
  expect(liquorType.count).toBe(1);
  expect(liquorType['dc-red-wine-is-required']).toBe(true);
  expect(liquorType['dc-white-wine-is-required']).toBe(false);
});

test('determine the total liquor and sub-types of units required when liquor type count is less than zero', () => {
  document.body.innerHTML = '<dl id="dc-wine-results">'+
    '<dt><output id="dc-wine-results-total" for="dc-guests dc-duration" name="dc-wine-results-total">0</output> Bottles (750ml) of Wine</dt>'+
    '<dd><output id="dc-wine-results-red-wine" for="dc-red-wine" name="dc-wine-results-red-wine">0</output> Red Wine</dd>'+
    '<dd><output id="dc-wine-results-white-wine" for="dc-white-wine" name="dc-wine-results-white-wine">0</output> White Wine</dd>'+
    '</dl>';
  var liquorType = {count: -1, "dc-red-wine-is-required": false, "dc-white-wine-is-required": false};
  var results = calculator.calculateUnitResults('dc-wine-results', 'output', liquorType, 50, 1, {'single': 'Bottle', 'plural': 'Bottles'});
  expect(results['dc-wine-results-total']).toBe('1 Bottle');
  expect(results['dc-wine-results-red-wine']).toBe(0);
  expect(results['dc-wine-results-white-wine']).toBe(0);
});

test('determine the total liquor and sub-types of units required when liquor type count is zero', () => {
  document.body.innerHTML = '<dl id="dc-wine-results">'+
    '<dt><output id="dc-wine-results-total" for="dc-guests dc-duration" name="dc-wine-results-total">0</output> Bottles (750ml) of Wine</dt>'+
    '<dd><output id="dc-wine-results-red-wine" for="dc-red-wine" name="dc-wine-results-red-wine">0</output> Red Wine</dd>'+
    '<dd><output id="dc-wine-results-white-wine" for="dc-white-wine" name="dc-wine-results-white-wine">0</output> White Wine</dd>'+
    '</dl>';
  var liquorType = {count: 0, "dc-red-wine-is-required": false, "dc-white-wine-is-required": false};
  var results = calculator.calculateUnitResults('dc-wine-results', 'output', liquorType, 50, 1, {'single': 'Bottle', 'plural': 'Bottles'});
  expect(results['dc-wine-results-total']).toBe('1 Bottle');
  expect(results['dc-wine-results-red-wine']).toBe(0);
  expect(results['dc-wine-results-white-wine']).toBe(0);
});

test('determine the total liquor and sub-types of units required when container id does not exist', () => {
  document.body.innerHTML = '<dl id="dc-wine-results">'+
    '<dt><output id="dc-wine-results-total" for="dc-guests dc-duration" name="dc-wine-results-total">0</output> Bottles (750ml) of Wine</dt>'+
    '<dd><output id="dc-wine-results-red-wine" for="dc-red-wine" name="dc-wine-results-red-wine">0</output> Red Wine</dd>'+
    '<dd><output id="dc-wine-results-white-wine" for="dc-white-wine" name="dc-wine-results-white-wine">0</output> White Wine</dd>'+
    '</dl>';
  var liquorType = {count: 1, "dc-red-wine-is-required": false, "dc-white-wine-is-required": false};
  var results = calculator.calculateUnitResults('unknown', 'output', liquorType, 50, 1, {'single': 'Bottle', 'plural': 'Bottles'});
  expect(results['dc-wine-results-total']).toBeUndefined();
  expect(results['dc-wine-results-red-wine']).toBeUndefined();
  expect(results['dc-wine-results-white-wine']).toBeUndefined();
});

test('determine the total liquor and sub-types of units required when no matches on query string', () => {
  document.body.innerHTML = '<dl id="dc-wine-results">'+
    '<dt><output id="dc-wine-results-total" for="dc-guests dc-duration" name="dc-wine-results-total">0</output> Bottles (750ml) of Wine</dt>'+
    '<dd><output id="dc-wine-results-red-wine" for="dc-red-wine" name="dc-wine-results-red-wine">0</output> Red Wine</dd>'+
    '<dd><output id="dc-wine-results-white-wine" for="dc-white-wine" name="dc-wine-results-white-wine">0</output> White Wine</dd>'+
    '</dl>';
  var liquorType = {count: 1, "dc-red-wine-is-required": false, "dc-white-wine-is-required": false};
  var results = calculator.calculateUnitResults('dc-wine-results', 'unknown', liquorType, 50, 1, {'single': 'Bottle', 'plural': 'Bottles'});
  expect(results['dc-wine-results-total']).toBe('1 Bottle');
  expect(results['dc-wine-results-red-wine']).toBeUndefined();
  expect(results['dc-wine-results-white-wine']).toBeUndefined();
});

test('determine the total liquor and sub-types of units required when percentage is less than zero', () => {
  document.body.innerHTML = '<dl id="dc-wine-results">'+
    '<dt><output id="dc-wine-results-total" for="dc-guests dc-duration" name="dc-wine-results-total">0</output> Bottles (750ml) of Wine</dt>'+
    '<dd><output id="dc-wine-results-red-wine" for="dc-red-wine" name="dc-wine-results-red-wine">0</output> Red Wine</dd>'+
    '<dd><output id="dc-wine-results-white-wine" for="dc-white-wine" name="dc-wine-results-white-wine">0</output> White Wine</dd>'+
    '</dl>';
  var liquorType = {count: 1, "dc-red-wine-is-required": false, "dc-white-wine-is-required": false};
  var results = calculator.calculateUnitResults('dc-wine-results', 'output', liquorType, -1, 1, {'single': 'Bottle', 'plural': 'Bottles'});
  expect(results['dc-wine-results-total']).toBe('1 Bottle');
  expect(results['dc-wine-results-red-wine']).toBeUndefined();
  expect(results['dc-wine-results-white-wine']).toBeUndefined();
});

test('determine the total liquor and sub-types of units required when percentage is zero', () => {
  document.body.innerHTML = '<dl id="dc-wine-results">'+
    '<dt><output id="dc-wine-results-total" for="dc-guests dc-duration" name="dc-wine-results-total">0</output> Bottles (750ml) of Wine</dt>'+
    '<dd><output id="dc-wine-results-red-wine" for="dc-red-wine" name="dc-wine-results-red-wine">0</output> Red Wine</dd>'+
    '<dd><output id="dc-wine-results-white-wine" for="dc-white-wine" name="dc-wine-results-white-wine">0</output> White Wine</dd>'+
    '</dl>';
  var liquorType = {count: 1, "dc-red-wine-is-required": false, "dc-white-wine-is-required": false};
  var results = calculator.calculateUnitResults('dc-wine-results', 'output', liquorType, 0, 1, {'single': 'Bottle', 'plural': 'Bottles'});
  expect(results['dc-wine-results-total']).toBe('1 Bottle');
  expect(results['dc-wine-results-red-wine']).toBeUndefined();
  expect(results['dc-wine-results-white-wine']).toBeUndefined();
});

test('determine the total liquor and sub-types of units required when units less than zero', () => {
  document.body.innerHTML = '<dl id="dc-wine-results">'+
    '<dt><output id="dc-wine-results-total" for="dc-guests dc-duration" name="dc-wine-results-total">0</output> Bottles (750ml) of Wine</dt>'+
    '<dd><output id="dc-wine-results-red-wine" for="dc-red-wine" name="dc-wine-results-red-wine">0</output> Red Wine</dd>'+
    '<dd><output id="dc-wine-results-white-wine" for="dc-white-wine" name="dc-wine-results-white-wine">0</output> White Wine</dd>'+
    '</dl>';
  var liquorType = {count: 1, "dc-red-wine-is-required": false, "dc-white-wine-is-required": false};
  var results = calculator.calculateUnitResults('dc-wine-results', 'output', liquorType, 50, -1, {'single': 'Bottle', 'plural': 'Bottles'});
  expect(results['dc-wine-results-total']).toBe('-1 Bottles');
  expect(results['dc-wine-results-red-wine']).toBe(0);
  expect(results['dc-wine-results-white-wine']).toBe(0);
});

test('determine the total liquor and sub-types of units required when units are zero', () => {
  document.body.innerHTML = '<dl id="dc-wine-results">'+
    '<dt><output id="dc-wine-results-total" for="dc-guests dc-duration" name="dc-wine-results-total">0</output> Bottles (750ml) of Wine</dt>'+
    '<dd><output id="dc-wine-results-red-wine" for="dc-red-wine" name="dc-wine-results-red-wine">0</output> Red Wine</dd>'+
    '<dd><output id="dc-wine-results-white-wine" for="dc-white-wine" name="dc-wine-results-white-wine">0</output> White Wine</dd>'+
    '</dl>';
  var liquorType = {count: 1, "dc-red-wine-is-required": false, "dc-white-wine-is-required": false};
  var results = calculator.calculateUnitResults('dc-wine-results', 'output', liquorType, 50, 0, {'single': 'Bottle', 'plural': 'Bottles'});
  expect(results['dc-wine-results-total']).toBe('0 Bottles');
  expect(results['dc-wine-results-red-wine']).toBe(0);
  expect(results['dc-wine-results-white-wine']).toBe(0);
});

test('determine the total liquor and sub-types of units required when liquor option types are not set', () => {
  document.body.innerHTML = '<dl id="dc-wine-results">'+
    '<dt><output id="dc-wine-results-total" for="dc-guests dc-duration" name="dc-wine-results-total">0</output> Bottles (750ml) of Wine</dt>'+
    '<dd><output id="dc-wine-results-red-wine" for="dc-red-wine" name="dc-wine-results-red-wine">0</output> Red Wine</dd>'+
    '<dd><output id="dc-wine-results-white-wine" for="dc-white-wine" name="dc-wine-results-white-wine">0</output> White Wine</dd>'+
    '</dl>';
  var liquorType = {count: 1};
  var results = calculator.calculateUnitResults('dc-wine-results', 'output', liquorType, 50, 1, {'single': 'Bottle', 'plural': 'Bottles'});
  expect(results['dc-wine-results-total']).toBe('1 Bottle');
  expect(results['dc-wine-results-red-wine']).toBe(0);
  expect(results['dc-wine-results-white-wine']).toBe(0);
});

test('determine the total liquor and sub-types of units required when liquor option types are not required', () => {
  document.body.innerHTML = '<dl id="dc-wine-results">'+
    '<dt><output id="dc-wine-results-total" for="dc-guests dc-duration" name="dc-wine-results-total">0</output> Bottles (750ml) of Wine</dt>'+
    '<dd><output id="dc-wine-results-red-wine" for="dc-red-wine" name="dc-wine-results-red-wine">0</output> Red Wine</dd>'+
    '<dd><output id="dc-wine-results-white-wine" for="dc-white-wine" name="dc-wine-results-white-wine">0</output> White Wine</dd>'+
    '</dl>';
  var liquorType = {count: 1, "dc-red-wine-is-required": false, "dc-white-wine-is-required": false};
  var results = calculator.calculateUnitResults('dc-wine-results', 'output', liquorType, 50, 1, {'single': 'Bottle', 'plural': 'Bottles'});
  expect(results['dc-wine-results-total']).toBe('1 Bottle');
  expect(results['dc-wine-results-red-wine']).toBe(0);
  expect(results['dc-wine-results-white-wine']).toBe(0);
});

test('determine the total liquor and sub-types of units required when liquor option types are all required', () => {
  document.body.innerHTML = '<dl id="dc-wine-results">'+
    '<dt><output id="dc-wine-results-total" for="dc-guests dc-duration" name="dc-wine-results-total">0</output> Bottles (750ml) of Wine</dt>'+
    '<dd><output id="dc-wine-results-red-wine" for="dc-red-wine" name="dc-wine-results-red-wine">0</output> Red Wine</dd>'+
    '<dd><output id="dc-wine-results-white-wine" for="dc-white-wine" name="dc-wine-results-white-wine">0</output> White Wine</dd>'+
    '</dl>';
  var liquorType = {count: 1, "dc-red-wine-is-required": true, "dc-white-wine-is-required": true};
  var results = calculator.calculateUnitResults('dc-wine-results', 'output', liquorType, 50, 1, {'single': 'Bottle', 'plural': 'Bottles'});
  expect(results['dc-wine-results-total']).toBe('2 Bottles');
  expect(results['dc-wine-results-red-wine']).toBe(1);
  expect(results['dc-wine-results-white-wine']).toBe(1);
});

test('determine the total liquor and sub-types of units required when partial liquor option types are required', () => {
  document.body.innerHTML = '<dl id="dc-wine-results">'+
    '<dt><output id="dc-wine-results-total" for="dc-guests dc-duration" name="dc-wine-results-total">0</output> Bottles (750ml) of Wine</dt>'+
    '<dd><output id="dc-wine-results-red-wine" for="dc-red-wine" name="dc-wine-results-red-wine">0</output> Red Wine</dd>'+
    '<dd><output id="dc-wine-results-white-wine" for="dc-white-wine" name="dc-wine-results-white-wine">0</output> White Wine</dd>'+
    '</dl>';
  var liquorType = {count: 1, "dc-red-wine-is-required": true, "dc-white-wine-is-required": false};
  var results = calculator.calculateUnitResults('dc-wine-results', 'output', liquorType, 50, 1, {'single': 'Bottle', 'plural': 'Bottles'});
  expect(results['dc-wine-results-total']).toBe('1 Bottle');
  expect(results['dc-wine-results-red-wine']).toBe(1);
  expect(results['dc-wine-results-white-wine']).toBe(0);
});

test('update the value of the range field when balance value is NaN', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setOtherRangesOutput(input, output);
  expect(parseInt(output.value)).toBe(30);
});

test('update the value of the range field when balance value is null', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setOtherRangesOutput(input, output, null, false);
  expect(parseInt(output.value)).toBe(30);
});

test('update the value of the range field when balance value is less than zero', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setOtherRangesOutput(input, output, -1, false);
  expect(parseInt(output.value)).toBe(29);
});

test('update the value of the range field when balance value is greater than input value', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setOtherRangesOutput(input, output, -40, false);
  expect(parseInt(output.value)).toBe(0);
});

test('update the value of the range field when balance value is zero', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setOtherRangesOutput(input, output, 0, false);
  expect(parseInt(output.value)).toBe(30);
});

test('update the value of the range field when balance value is greater than zero', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setOtherRangesOutput(input, output, 1, false);
  expect(parseInt(output.value)).toBe(30);
});

test('update the value of the range field when the range is locked', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setOtherRangesOutput(input, output, 1, true);
  expect(parseInt(output.value)).toBe(35);
});

test('toggle the range field from editable to locked', () => {
  var target = document.createElement('input');
  target.setAttribute('checked', true);
  document.body.innerHTML = '<div>' +
    '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="14"/>' +
    '</div>';
  calculator.toggleLockedRange(target, 'dc-wine-range');
  var rangeField = document.getElementById('dc-wine-range');
  expect(rangeField.disabled).toBe(true);
});


test('toggle the range field from locked to editable', () => {
  var target = document.createElement('input');
  // target.setAttribute('checked', false);
  document.body.innerHTML = '<div>' +
    '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="14 disabled="true"/>' +
    '</div>';
  calculator.toggleLockedRange(target, 'dc-wine-range');
  var rangeField = document.getElementById('dc-wine-range');
  expect(rangeField.disabled).toBe(false);
});


test('update the value of the range field when balance value is NaN', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setRangeOutput(input, output);
  expect(parseInt(output.value)).toBe(30);
});

test('update the value of the range field when balance value is null', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setRangeOutput(input, output, null);
  expect(parseInt(output.value)).toBe(30);
});

test('update the value of the range field when balance value is less than zero', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setRangeOutput(input, output, -1);
  expect(parseInt(output.value)).toBe(29);
});

test('update the value of the range field when balance value is greater than input value', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setRangeOutput(input, output, -40);
  expect(parseInt(output.value)).toBe(-10);
});

test('update the value of the range field when balance value is zero', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setRangeOutput(input, output, 0);
  expect(parseInt(output.value)).toBe(30);
});

test('update the value of the range field when balance value is greater than zero', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setRangeOutput(input, output, 1);
  expect(parseInt(output.value)).toBe(30);
});

test('update the value of the range field when the range is locked', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.setRangeOutput(input, output, 1);
  expect(parseInt(output.value)).toBe(30);
});

test('set results values with empty results', () => {
  document.body.innerHTML = '<dl id="dc-beer-results" class="dc-results-dl">' +
    '<dt class="dc-results-important"><span class="fas fa-beer"></span>&nbsp;<output id="dc-beer-results-total" for="dc-guests dc-duration-hours dc-duration-minutes" name="dc-beer-results-total">0</output> (24 Bottles) of Beer</dt>' +
    '<dd><output id="dc-beer-results-lager" for="dc-lager" name="dc-beer-results-lager">0</output> x Lager</dd>' +
    '<dd><output id="dc-beer-results-ale" for="dc-ale" name="dc-beer-results-ale">0</output> x Ale</dd>' +
    '</dl>';

  var results = {};
  calculator.setResults(results);
  var totalResultField = document.getElementById('dc-beer-results-total');
  expect(parseInt(totalResultField.value)).toBe(0);
  var subResultField = document.getElementById('dc-beer-results-lager');
  expect(parseInt(subResultField.value)).toBe(0);
});

test('set results values with total results only', () => {
  document.body.innerHTML = '<dl id="dc-beer-results" class="dc-results-dl">' +
    '<dt class="dc-results-important"><span class="fas fa-beer"></span>&nbsp;<output id="dc-beer-results-total" for="dc-guests dc-duration-hours dc-duration-minutes" name="dc-beer-results-total">0</output> (24 Bottles) of Beer</dt>' +
    '<dd><output id="dc-beer-results-lager" for="dc-lager" name="dc-beer-results-lager">0</output> x Lager</dd>' +
    '</dl>';

  var results = { 'dc-beer-results-total': '1' };
  calculator.setResults(results);
  var totalResultField = document.getElementById('dc-beer-results-total');
  expect(parseInt(totalResultField.value)).toBe(1);
  var subResultField = document.getElementById('dc-beer-results-lager');
  expect(parseInt(subResultField.value)).toBe(0);
});

test('set results values with total and subset results', () => {
  document.body.innerHTML = '<dl id="dc-beer-results" class="dc-results-dl">' +
    '<dt class="dc-results-important"><span class="fas fa-beer"></span>&nbsp;<output id="dc-beer-results-total" for="dc-guests dc-duration-hours dc-duration-minutes" name="dc-beer-results-total">0</output> (24 Bottles) of Beer</dt>' +
    '<dd><output id="dc-beer-results-lager" for="dc-lager" name="dc-beer-results-lager">0</output> x Lager</dd>' +
    '</dl>';

  var results = { 
    'dc-beer-results-total': '1',
    'dc-beer-results-lager': '2'
  };
  calculator.setResults(results);
  var totalResultField = document.getElementById('dc-beer-results-total');
  expect(parseInt(totalResultField.value)).toBe(1);
  var subResultField = document.getElementById('dc-beer-results-lager');
  expect(parseInt(subResultField.value)).toBe(2);
});
