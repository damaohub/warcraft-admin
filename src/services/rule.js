import request from '@/utils/request';

export async function queryRule(params) {
  return request('/api/rule/list', {
    method: 'POST',
    body: params,
  });
}

export async function editGp(params) {
  return request('/api/rule/editgroup', {
    method: 'POST',
    body: params
  });
}

export async function addGp(params) {
  return request('/api/rule/addgroup', {
    method: 'POST',
    body: params
  });
}
export async function addRule(params) {
  return request('/api/rule/add', {
    method: 'POST',
    body: params
  });
}

export async function updateRule(params) {
  return request('/api/rule/edit', {
    method: 'POST',
    body: params
  });
}
