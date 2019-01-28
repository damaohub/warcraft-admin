import request from '@/utils/request';

export async function queryStaff(params) {
  return request('/user/list', {
    method: 'POST',
    body: params,
  });
}

export async function rD(params) {
  return request('/user/reward-punishment', {
    method: 'POST',
    body: params
  });
}

export async function addStaff(params) {
  return request('/user/add', {
    method: 'POST',
    body: params
  });
}

export async function updateStaff(params) {
  return request('/user/perfectdata', {
    method: 'POST',
    body: params
  });
}

export async function currentStaff(params) {
  return request('/user/info', {
    method: 'POST',
    body: params
  });
}

export async function salaryStaff(params) {
  return request('/user/salary', {
    method: 'POST',
    body: params
  });
}
