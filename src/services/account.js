import request from '@/utils/request';

export async function queryAccount(params) {
  return request('/api/account/list', {
    method: 'POST',
    body: params,
  });
}


export async function addAccount(params) {
  return request('/api/account/add', {
    method: 'POST',
    body: params
  });
}

export async function updateAccount(params) {
  return request('/api/account/edit', {
    method: 'POST',
    body: params
  });
}

export async function removeAccount(params) {
  return request('/api/account/del', {
    method: 'POST',
    body: params
  });
}

export async function queryCurrent(params) {
  return request('/api/account/info', {
    method: 'POST',
    body: params
  });
}


