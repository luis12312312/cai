import test from 'node:test';
import assert from 'node:assert/strict';
import { loadApologetas } from '../src/data/loadApologetas.js';

const items = [{ id: 'member-1', fullName: 'Miembro de prueba', rankCode: 'ESCUDERO' }];
const responses = {
  'users.list': { items },
  'members.list': { items },
  'ranks.get': { ranks: [{ code: 'ESCUDERO', name: 'Escudero' }] },
  'missions.list': { items: [], total: 12 },
};

test('consulta usuarios activos con el contrato administrativo', async () => {
  const calls = [];
  const result = await loadApologetas(async (action, options) => {
    calls.push([action, options]);
    return responses[action];
  }, true);
  assert.deepEqual(calls[0], ['users.list', { data: { role: 'SOLDADO_ACTIVE', page: 1, pageSize: 50 } }]);
  assert.deepEqual(result.items, items);
  assert.equal(result.totalMisiones, 12);
  assert.equal(result.hasPartialError, false);
});

test('consulta el directorio de miembros para usuarios sin rol administrativo', async () => {
  const calls = [];
  await loadApologetas(async (action, options) => {
    calls.push([action, options]);
    return responses[action];
  }, false);
  assert.deepEqual(calls[0], ['members.list', { data: { page: 1, pageSize: 50 } }]);
  assert.ok(!calls.some(([action]) => action === 'users.list'));
});

for (const failed of ['ranks.get', 'missions.list']) {
  test(`conserva el listado cuando falla ${failed}`, async () => {
    const result = await loadApologetas(async (action) => {
      if (action === failed) throw new Error('Servicio no disponible');
      return responses[action];
    }, true);
    assert.deepEqual(result.items, items);
    assert.equal(result.hasPartialError, true);
    if (failed === 'ranks.get') assert.deepEqual(result.ranks, []);
    else assert.equal(result.totalMisiones, null);
  });
}

test('propaga errores del listado en lugar de convertirlos en un directorio vacío', async () => {
  const error = new Error('No tienes permisos para esta operación.');
  await assert.rejects(loadApologetas(async (action) => {
    if (action === 'users.list') throw error;
    return responses[action];
  }, true), (actual) => actual === error);
});

test('distingue un directorio vacío de una respuesta inválida', async () => {
  const empty = await loadApologetas(async (action) => action === 'users.list' ? { items: [] } : responses[action], true);
  assert.deepEqual(empty.items, []);
  await assert.rejects(loadApologetas(async (action) => action === 'users.list' ? {} : responses[action], true), /listado de apologetas inválido/);
});
