export const loadApologetas = async (fetchApi, isAdmin) => {
  const [members, ranks, missions] = await Promise.allSettled([
    fetchApi(isAdmin ? 'users.list' : 'members.list', {
      data: { ...(isAdmin ? { role: 'SOLDADO_ACTIVE' } : {}), page: 1, pageSize: 50 },
    }),
    fetchApi('ranks.get'),
    fetchApi('missions.list', { data: { page: 1, pageSize: 1 } }),
  ]);

  if (members.status === 'rejected') throw members.reason;
  if (!Array.isArray(members.value?.items)) {
    throw new Error('El servidor devolvió un listado de apologetas inválido.');
  }

  return {
    items: members.value.items,
    ranks: ranks.status === 'fulfilled' && Array.isArray(ranks.value?.ranks) ? ranks.value.ranks : [],
    totalMisiones: missions.status === 'fulfilled' ? missions.value?.total ?? null : null,
    hasPartialError: ranks.status === 'rejected' || missions.status === 'rejected',
  };
};
