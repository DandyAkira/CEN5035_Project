var round = Math.round;
var abs = Math.abs;
var sqrt = Math.sqrt;
var atan = Math.atan;
var atan2 = Math.atan2;
// Just for testing jtest
function sum(a, b) {
  return a + b;
}
function sub(a, b) {
  return a - b;
}
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
test('sub 1 - 2 to equal -1', () => {
  expect(sub(1, 2)).toBe(-1);
});
// Some fuctions from mui.js
var getDirection = function(x, y) {
  if(x === y) {
    return '';
  }
  if(abs(x) >= abs(y)) {
    return x > 0 ? 'left' : 'right';
  }
  return y > 0 ? 'up' : 'down';
};
var getDistance = function(p1, p2, props) {
  if(!props) {
    props = ['x', 'y'];
  }
  var x = p2[props[0]] - p1[props[0]];
  var y = p2[props[1]] - p1[props[1]];
  return sqrt((x * x) + (y * y));
};

var getAngle = function(p1, p2, props) {
  if(!props) {
    props = ['x', 'y'];
  }
  var x = p2[props[0]] - p1[props[0]];
  var y = p2[props[1]] - p1[props[1]];
  return atan2(y, x) * 180 / Math.PI;
};
	/**
	 * scale
	 * @param {Object} starts
	 * @param {Object} moves
	 */
   var getScale = function(starts, moves) {
		if(starts.length >= 2 && moves.length >= 2) {
			var props = ['pageX', 'pageY'];
			return getDistance(moves[1], moves[0], props) / getDistance(starts[1], starts[0], props);
		}
		return 1;
	};
	/**
	 * rotation
	 * @param {Object} start
	 * @param {Object} end
	 */
   var getRotation = function(start, end) {
		var props = ['pageX', 'pageY'];
		return getAngle(end[1], end[0], props) - getAngle(start[1], start[0], props);
	};

test('(2, 1) is left', () => {
  expect(getDirection(2, 1)).toBe('left');
});
test('(-2, 1) is right', () => {
  expect(getDirection(-2, 1)).toBe('right');
});
test('(1, 2) is up', () => {
  expect(getDirection(1, 2)).toBe('up');
});
test('(1, -2) is down', () => {
  expect(getDirection(1, -2)).toBe('down');
});
test('The distance is 5', () => {
  expect(getDistance({'pageX':3, 'pageY':4}, {'pageX':0, 'pageY':0}, ['pageX', 'pageY'])).toBe(5);
});
test('The distance is 50', () => {
  expect(getDistance({'pageX':30, 'pageY':40}, {'pageX':0, 'pageY':0}, ['pageX', 'pageY'])).toBe(50);
});
test('The distance is 125.31959144523253', () => {
  expect(getDistance({'pageX':-11, 'pageY':9}, {'pageX':112, 'pageY':33}, ['pageX', 'pageY'])).toBe(125.31959144523253);
});
test('The distance is 14.142135623730951', () => {
  expect(getDistance({'pageX':0, 'pageY':0}, {'pageX':10, 'pageY':10}, ['pageX', 'pageY'])).toBe(14.142135623730951);
});
test('The distance is 84.31488599292535', () => {
  expect(getDistance({'pageX':-3, 'pageY':-4}, {'pageX':44, 'pageY':66}, ['pageX', 'pageY'])).toBe(84.31488599292535);
});
test('The distance is 1762.1447159640436', () => {
  expect(getDistance({'pageX':555, 'pageY':666}, {'pageX':-22, 'pageY':-999}, ['pageX', 'pageY'])).toBe(1762.1447159640436);
});
test('The angle is -126.86989764584402', () => {
  expect(getAngle({'pageX':3, 'pageY':4}, {'pageX':0, 'pageY':0}, ['pageX', 'pageY'])).toBe(-126.86989764584402);
});
test('The angle is 0', () => {
  expect(getAngle({'pageX':0, 'pageY':0}, {'pageX':0, 'pageY':0}, ['pageX', 'pageY'])).toBe(0);
});
test('The angle is -2.5448043798130957', () => {
  expect(getAngle({'pageX':0, 'pageY':4}, {'pageX':90, 'pageY':0}, ['pageX', 'pageY'])).toBe(-2.5448043798130957);
});
test('The angle is -135', () => {
  expect(getAngle({'pageX':333, 'pageY':333}, {'pageX':0, 'pageY':0}, ['pageX', 'pageY'])).toBe(-135);
});
test('The angle is -45', () => {
  expect(getAngle({'pageX':34, 'pageY':38}, {'pageX':38, 'pageY':34}, ['pageX', 'pageY'])).toBe(-45);
});
test('The scale is 0.1', () => {
  expect(getScale([{'pageX':-30, 'pageY':40}, {'pageX':0, 'pageY':0}],[{'pageX':-3, 'pageY':-4}, {'pageX':0, 'pageY':0}], ['pageX', 'pageY'])).toBe(0.1);
});
test('The scale is 0.05', () => {
  expect(getScale([{'pageX':-60, 'pageY':80}, {'pageX':0, 'pageY':0}],[{'pageX':-3, 'pageY':-4}, {'pageX':0, 'pageY':0}], ['pageX', 'pageY'])).toBe(0.05);
});
test('The scale is 10', () => {
  expect(getScale([{'pageX':-3, 'pageY':4}, {'pageX':-33, 'pageY':44}],[{'pageX':0, 'pageY':0}, {'pageX':300, 'pageY':400}], ['pageX', 'pageY'])).toBe(10);
});
test('The scale is 1', () => {
  expect(getScale([{'pageX':-30, 'pageY':40}, {'pageX':0, 'pageY':0}],[{'pageX':-33, 'pageY':-4}, {'pageX':-3, 'pageY':-44}], ['pageX', 'pageY'])).toBe(1);
});
test('The scale is 0.0022843055780150186', () => {
  expect(getScale([{'pageX':-3242342, 'pageY':4343}, {'pageX':423423, 'pageY':9980}],[{'pageX':-3346, 'pageY':-7667}, {'pageX':5, 'pageY':7}], ['pageX', 'pageY'])).toBe(0.0022843055780150186);
});
test('The scale is 0.053251295634025336', () => {
  expect(getScale([{'pageX':-666, 'pageY':7}, {'pageX':-9999, 'pageY':12220}],[{'pageX':-3, 'pageY':-40}, {'pageX':660, 'pageY':440}], ['pageX', 'pageY'])).toBe(0.053251295634025336);
});