import request from '@/utils/request';

export async function queryGruop(params) {
  return request('/api/gamer/groupmember', {
    method: 'POST',
    body: params,
  });
}


export async function addGroup(params) {
  return request('/api/gamer/add', {
    method: 'POST',
    body: params
  });
}


