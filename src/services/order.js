
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

