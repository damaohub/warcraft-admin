import request from '@/utils/request';

export async function queryStaff(params) {
  return request('/api/user/list', {
    method: 'POST',
    body: params,
  });
}

export async function rD(params) {
  return request('/api/user/reward-punishment', {
    method: 'POST',
    body: params
  });
}

export async function addStaff(params) {
  return request('/api/user/add', {
    method: 'POST',
    body: params
  });
}

export async function updateStaff(params) {
  return request('/api/user/perfectdata', {
    method: 'POST',
    body: params
  });
}

export async function currentStaff(params) {
  return request('/api/user/info', {
    method: 'POST',
    body: params
  });
}