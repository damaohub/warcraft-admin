import request from '@/utils/request';

export async function queryRule(params) {
  return request('/rule/list', {
    method: 'POST',
    body: params,
  });
}

export async function editGp(params) {
  return request('/rule/editgroup', {
    method: 'POST',
    body: params
  });
}

export async function addGp(params) {
  return request('/rule/addgroup', {
    method: 'POST',
    body: params
  });
}
export async function addRule(params) {
  return request('/rule/add', {
    method: 'POST',
    body: params
  });
}

export async function updateRule(params) {
  return request('/rule/edit', {
    method: 'POST',
    body: params
  });
}
