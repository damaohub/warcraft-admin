import request from '@/utils/request';

export async function queryPlayer(params) {
  return request('/api/gamer/account', {
    method: 'POST',
    body: params,
  });
}


export async function addPlayer(params) {
  return request('/api/gamer/add', {
    method: 'POST',
    body: params
  });
}

export async function queryTask(params) {
  return request('/api/gamer/index', {
    method: 'POST',
    body: params
  });
}

export async function queryTeam(params) {
  return request('/api/gamer/teaminfo', {
    method: 'POST',
    body: params
  });
}

export async function addScreen(params) {
  return request('/api/gamer/screenadd', {
    method: 'POST',
    body: params
  });
}

export async function removeScreen(params) {
  return request('/api/gamer/screendel', {
    method: 'POST',
    body: params
  });
}

export async function finish(params) {
  return request('/api/team/teamfinish', {
    method: 'POST',
    body: params
  });
}

