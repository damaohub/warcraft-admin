import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

// export async function queryCurrent() {
//   return request('http://maochenhui.top/blog/test');
// }
export async function queryCurrent() {
  return request('/api/currentUser');
}
