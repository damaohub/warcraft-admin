import request from '@/utils/request';

export async function queryRole(params) {
  return request('/api/role/list', {
    method: 'POST',
    body: params,
  });
}

export async function editRl(params) {
  return request('/api/role/editrule', {
    method: 'POST',
    body: params
  });
}


export async function addRole(params) {
  return request('/api/role/add', {
    method: 'POST',
    body: params
  });
}

export async function updateRole(params) {
  return request('/api/role/edit', {
    method: 'POST',
    body: params
  });
}
