export async function loadMapLocations(fetchApi, action, signal) {
  const items = [];
  for (let page = 1; ; page++) {
    const data = await fetchApi(action, { data: { page, pageSize: 100 }, signal });
    items.push(...data.items.filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude)));
    if (page * data.pageSize >= data.total || !data.items.length) return items;
  }
}
