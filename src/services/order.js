
import request from '@/utils/request';

export async function queryOrder(params) {
  return request('/api/order/list', {
    method: 'POST',
    body: params,
  });
}


export async function addOrder(params) {
  return request('/api/order/add', {
    method: 'POST',
    body: params
  });
}

export async function queryOrderInfo(params) {
  return request('/api/order/info', {
    method: 'POST',
    body: params
  });
}

export async function removeOrder(params) {
  return request('/api/order/del', {
    method: 'POST',
    body: params
  });
}
export async function updateOrder(params) {
  return request('/api/order/edit', {
    method: 'POST',
    body: params
  });
}

export async function changeOrder(params) {
  return request('/api/order/change', {
    method: 'POST',
    body: params
  });
}
export async function identForm(params) {
  return request('/api/ident/ident', {
    method: 'POST',
    body: params
  });
}

