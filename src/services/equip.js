import request from '@/utils/request';

export async function queryEquip(params) {
  return request('/api/equip/list', {
    method: 'POST',
    body: params,
  });
}

export async function removeEquip(params) {
  return request('/api/equip/del', {
    method: 'POST',
    body: params
  });
}

export async function addEquip(params) {
  return request('/api/equip/add', {
    method: 'POST',
    body: params
  });
}

export async function updateEquip(params) {
  return request('/api/equip/edit', {
    method: 'POST',
    body: params
  });
}

export async function queryData1(params) {
  return request('/api/equip/locationtypelist', {
    method: 'POST',
    body: params
  });
}
