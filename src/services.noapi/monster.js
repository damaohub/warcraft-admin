import request from '@/utils/request';

export async function queryMonster(params) {
  return request('/monster/list', {
    method: 'POST',
    body: params,
  });
}

export async function removeMonster(params) {
  return request('/monster/del', {
    method: 'POST',
    body: params
  });
}

export async function addMonster(params) {
  return request('/monster/add', {
    method: 'POST',
    body: params
  });
}

export async function updateMonster(params) {
  return request('/monster/edit', {
    method: 'POST',
    body: params
  });
}

export async function queryInstance(params) {
    return request('/monster/instancelist', {
      method: 'POST',
      body: params,
    });
  }