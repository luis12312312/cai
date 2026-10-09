import test from 'node:test';
import assert from 'node:assert/strict';
import { loadMapLocations } from '../src/data/loadMapLocations.js';

test('loads every page, includes zero coordinates and skips incomplete locations', async () => {
  const calls = [];
  const signal = new AbortController().signal;
  const result = await loadMapLocations(async (action, options) => {
    calls.push([action, options.data.page, options.signal]);
    return { pageSize: 100, total: 101, items: options.data.page === 1 ? [{ id: 'equator', latitude: 0, longitude: 0 }, { id: 'missing', latitude: null, longitude: 1 }] : [{ id: 'last', latitude: -33, longitude: -70 }] };
  }, 'members.map', signal);
  assert.deepEqual(result.map(i => i.id), ['equator', 'last']);
  assert.deepEqual(calls, [['members.map', 1, signal], ['members.map', 2, signal]]);
});
test('propagates errors rather than returning an incomplete map', async () => {
  await assert.rejects(loadMapLocations(async (_, { data }) => {
    if (data.page === 2) throw Error('Database unavailable');
    return { pageSize: 100, total: 101, items: [{ latitude: 1, longitude: 1 }] };
  }, 'members.map'), /Database unavailable/);
});
