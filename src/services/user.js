import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent(params) {
  return request('/api/user/userinfo', {
    method: 'POST',
    body: params
  });
}

export async function fetchSalary(params) {
  return request('/api/gamer/salary', {
    method: 'POST',
    body: params
  });
}

export async function resetPassword(params) {
  return request('/api/gamer/editpwd', {
    method: 'POST',
    body: params
  });
}
