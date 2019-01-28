import request from '@/utils/request';

export async function queryRole(params) {
  return request('/role/list', {
    method: 'POST',
    body: params,
  });
}

export async function editRl(params) {
  return request('/role/editrule', {
    method: 'POST',
    body: params
  });
}


export async function addRole(params) {
  return request('/role/add', {
    method: 'POST',
    body: params
  });
}

export async function updateRole(params) {
  return request('/role/edit', {
    method: 'POST',
    body: params
  });
}
