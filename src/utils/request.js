import axios from 'axios'
import { message ,notification} from 'antd';

import router from 'umi/router';
// import hash from 'hash.js';
// import { isAntdPro } from './utils';
import saltMD5 from './saltMD5'


const createSign = (obj) => {
  let str = ''
  const sortedKeys = Object.keys(obj).sort()
  // eslint-disable-next-line
  for (let elem of sortedKeys.values()) {
    str += (elem.toString() + obj[elem])
  }
  return saltMD5.md5(str)
}

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    let data = {}
    if(localStorage.getItem('token') !== 'undefined') {
      const Nobj = {...config.body, ...{ token: JSON.parse(localStorage.getItem('token')), time: `${Date.parse(new Date()) / 1000}`} }
      const sign = createSign(Nobj)
      data ={...Nobj,sign} 
    } else {
      // router.push('/login');
      const Nobj = {...config.body, ...{ time: `${Date.parse(new Date()) / 1000}`} }
      const sign = createSign(Nobj)
      data ={...Nobj,sign} 
    }
    // eslint-disable-next-line
    config.data = data
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    if(response.status < 200 && response.status >= 300) {
      notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: response.statusText,
      });
      const error = new Error(response.statusText);
      error.name = response.status;
      error.response = response;
      throw error;
    }
    const res = response.data
    return new Promise((resolve) => {
     if(res.ret === 2006) {
      message.error(res.msg)
      router.push('/exception/403');
     }
     if(res.ret ===1000) {
      message.error(res.msg)
      localStorage.removeItem('token')
      router.push('/login');
     }
     if(res.ret ===1003) {
      message.error(res.msg)
      localStorage.removeItem('token')
      router.push('/login');
     }
     resolve(res)
    })
  },
 
)

export default service
