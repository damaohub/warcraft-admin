import request from '@/utils/request';

export async function queryRaces(params) {
  return request('/api/gamerole/racelist', {
    method: 'POST',
    body: params,
  });
}

export async function removeRace(params) {
  return request('/api/gamerole/racedel', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRace(params) {
  return request('/api/gamerole/raceadd', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRace(params) {
  return request('/api/gamerole/raceedit', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryProfession(params) {
  return request('/api/gamerole/professionlist', {
    method: 'POST',
    body: params,
  });
}

export async function removeProfession(params) {
  return request('/api/gamerole/professiondel', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addProfession(params) {
  return request('/api/gamerole/professionadd', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateProfession(params) {
  return request('/api/gamerole/professionedit', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryTalent(params) {
  return request('/api/gamerole/talentlist', {
    method: 'POST',
    body: params,
  });
}

export async function removeTalent(params) {
  return request('/api/gamerole/talentdel', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addTalent(params) {
  return request('/api/gamerole/talentadd', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateTalent(params) {
  return request('/api/gamerole/talentedit', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}
