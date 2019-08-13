'use strict';

const calculator = require('../js/drinks-calculator.js');

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
// test('find the active drink preferences when preferences is not an array', () => {
//   expect(calculator.getSelectedPreferences('not an array')).toEqual([]);
// });

// test('find the active drink preferences when preferences is an empty array', () => {
//   expect(calculator.getSelectedPreferences([])).toEqual([]);
// });

// test('find the active drink preferences when preference options are all set to false', () => {
//   var obj = [{'red-wine': false}, {'white-wine': false}, {'champagne': false}];
//   expect(calculator.getSelectedPreferences(obj)).toEqual([]);
// });

// test('find the active drink preferences when some preference options are set to true', () => {
//   var obj = [{'red-wine': false}, {'white-wine': true}, {'champagne': false}];
//   expect(calculator.getSelectedPreferences(obj)).toEqual([{'white-wine': true}]);
// });

// test('find the active drink preferences when preference options are all set to true', () => {
//   var obj = [{'red-wine': true}, {'white-wine': true}, {'champagne': true}];
//   expect(calculator.getSelectedPreferences(obj)).toEqual([{'red-wine': true}, {'white-wine': true}, {'champagne': true}]);
// });

test('determine number of wine bottles required when zero required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateWineBottles(0, 2)).toBe(0);
});

test('determine number of wine bottles required when less than one bottle required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateWineBottles(1, 1)).toBe(1);
});

test('determine number of wine bottles required when exactly one bottle required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateWineBottles(2, 2.5)).toBe(1);
});

test('determine number of wine bottles required when more than one bottle required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateWineBottles(5, 3)).toBe(3);
});

test('determine number of wine cases required when more than one case required with 100%', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
    expect(calculator.calculateWineBottles(5, 3)).toBe(3);
  });

test('determine number of wine cases required when more than one case required with less than 100%', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="50"/>' +
      '</div>';
  expect(calculator.calculateWineBottles(5, 3)).toBe(2);
});

test('determine number of wine bottles required when zero percentage', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-wine-range" name="dc-wine-range" type="range" min="0" max="100" value="0"/>' +
      '</div>';
  expect(calculator.calculateWineBottles(10, 2)).toBe(0);
});

test('determine number of beer cases required when zero required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-beer-range" name="dc-beer-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateBeerCases(0, 2)).toBe(0);
});

test('determine number of beer cases required when less than one case required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-beer-range" name="dc-beer-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateBeerCases(12, 1)).toBe(1);
});

test('determine number of beer cases required when exactly one case required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-beer-range" name="dc-beer-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateBeerCases(8, 2)).toBe(1);
});

test('determine number of beer cases required when more than one case required with 100%', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-beer-range" name="dc-beer-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateBeerCases(16, 2.5)).toBe(3);
});

test('determine number of beer cases required when more than one case required with less than 100%', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-beer-range" name="dc-beer-range" type="range" min="0" max="100" value="50"/>' +
      '</div>';
  expect(calculator.calculateBeerCases(16, 2.5)).toBe(2);
});

test('determine number of beer bottles required when zero percentage', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-beer-range" name="dc-beer-range" type="range" min="0" max="100" value="0"/>' +
      '</div>';
  expect(calculator.calculateBeerCases(10, 2)).toBe(0);
});

test('determine number of spirits bottles required when zero required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateSpiritsBottles(0, 2)).toBe(0);
});

test('determine number of spirits bottles required when less than one bottle required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateSpiritsBottles(1, 1)).toBe(1);
});

test('determine number of spirits bottles required when exactly one bottle required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateSpiritsBottles(2, 2.5)).toBe(1);
});

test('determine number of spirits bottles required when more than one bottle required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateSpiritsBottles(10, 5)).toBe(3);
});

test('determine number of spirits cases required when more than one case required with 100%', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateSpiritsBottles(10, 5)).toBe(3);
});

test('determine number of spirits cases required when more than one case required with less than 100%', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="50"/>' +
      '</div>';
  expect(calculator.calculateSpiritsBottles(10, 5)).toBe(2);
});

test('determine number of spirits bottles required when zero percentage', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-spirits-range" name="dc-spirits-range" type="range" min="0" max="100" value="0"/>' +
      '</div>';
  expect(calculator.calculateSpiritsBottles(10, 2)).toBe(0);
});

test('determine number of champagne bottles required when zero required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-champagne-range" name="dc-champagne-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateChampagneBottles(0, 2)).toBe(0);
});

test('determine number of champagne bottles required when less than one bottle required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-champagne-range" name="dc-champagne-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateChampagneBottles(1, 1)).toBe(1);
});

test('determine number of champagne bottles required when exactly one bottle required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-champagne-range" name="dc-champagne-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateChampagneBottles(2, 2)).toBe(1);
});

test('determine number of champagne bottles required when more than one bottle required', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-champagne-range" name="dc-champagne-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateChampagneBottles(4, 3)).toBe(3);
});

test('determine number of champagne cases required when more than one case required with 100%', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-champagne-range" name="dc-champagne-range" type="range" min="0" max="100" value="100"/>' +
      '</div>';
  expect(calculator.calculateChampagneBottles(4, 3)).toBe(3);
});

test('determine number of champagne cases required when more than one case required with less than 100%', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-champagne-range" name="dc-champagne-range" type="range" min="0" max="100" value="50"/>' +
      '</div>';
  expect(calculator.calculateChampagneBottles(4, 3)).toBe(2);
});

test('determine number of champagne bottles required when zero percentage', () => {
  document.body.innerHTML = '<div>' +
      '<input id="dc-champagne-range" name="dc-champagne-range" type="range" min="0" max="100" value="0"/>' +
      '</div>';
  expect(calculator.calculateChampagneBottles(10, 2)).toBe(0);
});

test('update the value of the range field when balance value is NaN', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.updateRangeOutput(input, output);
  expect(parseInt(output.value)).toBe(30);
});

test('update the value of the range field when balance value is null', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.updateRangeOutput(input, output,null);
  expect(parseInt(output.value)).toBe(30);
});

test('update the value of the range field when balance value is less than zero', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.updateRangeOutput(input, output,-1);
  expect(parseInt(output.value)).toBe(29);
});

test('update the value of the range field when balance value is zero', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.updateRangeOutput(input, output,0)
  expect(parseInt(output.value)).toBe(30);
});

test('update the value of the range field when balance value is greater than zero', () => {
  var input = document.createElement('input');
  input.value = 30;
  var output = document.createElement('output');
  output.value = 35;
  calculator.updateRangeOutput(input, output,1)
  expect(parseInt(output.value)).toBe(30);
});

// test('determine number of beer servings required for 5 hours', () => {
//   expect(calculator.calculateBeerServes(0, 0)).toBe(5);
// });

// test('determine number of beer servings required for 10 hours', () => {
//   expect(calculator.calculateBeerServes(0, 0)).toBe(10);
// });


// test('determine number of beer servings required for 1 guest', () => {
//   expect(calculator.calculateBeerServes(0, 0)).toBe(10);
// });

// test('determine number of beer servings required for 10 guests', () => {
//   expect(calculator.calculateBeerServes(0, 0)).toBe(10);
// });

// test('determine number of beer servings required for 100 guests', () => {
//   expect(calculator.calculateBeerServes(0, 0)).toBe(10);
// });
