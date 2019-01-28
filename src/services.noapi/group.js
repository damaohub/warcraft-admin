import request from '@/utils/request';

export async function queryGruop(params) {
  return request('/gamer/groupmember', {
    method: 'POST',
    body: params,
  });
}


export async function addGroup(params) {
  return request('/gamer/add', {
    method: 'POST',
    body: params
  });
}


