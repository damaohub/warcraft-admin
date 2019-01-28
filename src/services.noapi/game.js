import request from '@/utils/request';

export async function queryRaces(params) {
  return request('/gamerole/racelist', {
    method: 'POST',
    body: params,
  });
}

export async function removeRace(params) {
  return request('/gamerole/racedel', {
    method: 'POST',
    body: params
  });
}

export async function addRace(params) {
  return request('/gamerole/raceadd', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function updateRace(params) {
  return request('/gamerole/raceedit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryProfession(params) {
  return request('/gamerole/professionlist', {
    method: 'POST',
    body: params,
  });
}

export async function removeProfession(params) {
  return request('/gamerole/professiondel', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addProfession(params) {
  return request('/gamerole/professionadd', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateProfession(params) {
  return request('/gamerole/professionedit', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function queryTalent(params) {
  return request('/gamerole/talentlist', {
    method: 'POST',
    body: params,
  });
}

export async function removeTalent(params) {
  return request('/gamerole/talentdel', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addTalent(params) {
  return request('/gamerole/talentadd', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function updateTalent(params) {
  return request('/gamerole/talentedit', {
    method: 'POST',
    body: params
  });
}
