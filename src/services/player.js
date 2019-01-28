import request from '@/utils/request';

export async function queryPlayer(params) {
  return request('/api/gamer/account', {
    method: 'POST',
    body: params,
  });
}


export async function addPlayer(params) {
  return request('/api/gamer/add', {
    method: 'POST',
    body: params
  });
}


