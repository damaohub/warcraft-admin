import request from '@/utils/request';

export async function queryEquip(params) {
  return request('/equip/list', {
    method: 'POST',
    body: params,
  });
}

export async function removeEquip(params) {
  return request('/equip/del', {
    method: 'POST',
    body: params
  });
}

export async function addEquip(params) {
  return request('/equip/add', {
    method: 'POST',
    body: params
  });
}

export async function updateEquip(params) {
  return request('/equip/edit', {
    method: 'POST',
    body: params
  });
}

export async function queryData1(params) {
  return request('/equip/locationtypelist', {
    method: 'POST',
    body: params
  });
}
