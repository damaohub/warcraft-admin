import request from '@/utils/request';

export async function query() {
  return request('/users');
}

export async function queryCurrent(params) {
  return request('/user/userinfo', {
    method: 'POST',
    body: params
  });
}

export async function fetchSalary(params) {
  return request('/gamer/salary', {
    method: 'POST',
    body: params
  });
}
