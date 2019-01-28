import request from '@/utils/request';

export async function queryAccount(params) {
  return request('/gamer/account', {
    method: 'POST',
    body: params,
  });
}


export async function addAccount(params) {
  return request('/gamer/add', {
    method: 'POST',
    body: params
  });
}


