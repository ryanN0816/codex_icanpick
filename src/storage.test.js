import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readHistory, readDraft } from './storage.js';
const storage = data => ({ getItem: () => JSON.stringify(data) });
test('잘못된 기록을 무시하고 유효한 기록만 읽는다', () => {
 const record = { title: '점심', result: '초밥', date: '2026-10-09T00:00:00Z' };
 assert.deepEqual(readHistory(storage([null, {}, { ...record, date: 'bad' }, record])), [record]);
 assert.equal(readHistory(storage(Array(25).fill(record))).length, 20);
});
test('작성 중인 선택지를 복원하고 잘못된 데이터에 기본값을 사용한다', () => {
 const draft = { title: '점심', options: ['초밥', '파스타'] };
 assert.deepEqual(readDraft(storage(draft)), draft);
 assert.deepEqual(readDraft(storage({ title: '', options: [null, 1] })), { title: '', options: ['', ''] });
 assert.deepEqual(readDraft({ getItem: () => { throw new Error('denied'); } }), { title: '', options: ['', ''] });
});
