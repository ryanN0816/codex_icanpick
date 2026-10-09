import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickOption } from './pick.js';
test('빈 선택지를 제외하고 입력한 선택지만 고른다', () => {
 assert.equal(pickOption(['', '  파스타 ', '초밥'], () => 0), '파스타');
 assert.equal(pickOption(['파스타', '초밥'], () => 0.999), '초밥');
});
test('선택지가 부족하면 선택하지 않는다', () => {
 assert.throws(() => pickOption(['', '하나']), /두 개 이상/);
});
