import request from '@/utils/request';

export async function queryMonster(params) {
  return request('/api/monster/list', {
    method: 'POST',
    body: params,
  });
}

export async function removeMonster(params) {
  return request('/api/monster/del', {
    method: 'POST',
    body: params
  });
}

export async function addMonster(params) {
  return request('/api/monster/add', {
    method: 'POST',
    body: params
  });
}

export async function updateMonster(params) {
  return request('/api/monster/edit', {
    method: 'POST',
    body: params
  });
}

export async function queryInstance(params) {
    return request('/api/monster/instancelist', {
      method: 'POST',
      body: params,
    });
  }