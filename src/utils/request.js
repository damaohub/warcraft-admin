import axios from 'axios'
import { message ,notification} from 'antd';

import router from 'umi/router';
// import hash from 'hash.js';
// import { isAntdPro } from './utils';
import saltMD5 from './saltMD5'


const createSign = (obj) => {
  let str = ''
  const sortedKeys = Object.keys(obj).sort()
  let tmp
  // eslint-disable-next-line
  for (let elem of sortedKeys.values()) {
    tmp = obj[elem]
   if(typeof  obj[elem] !== "string") {
      // eslint-disable-next-line
     tmp =JSON.stringify(obj[elem])
   }

  //  console.log(elem)
  //  console.log(obj[elem])
  //  console.log(typeof obj[elem])
  //  console.log('----')

  if(obj[elem]) {
    str += (elem.toString() + tmp)
   }
    // console.log(str)
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
 
    const res = response.data
    return new Promise((resolve) => {
    if(res.ret !==0 ) {
      message.error(res.msg) // 需要修改很多
      if(res.ret === 2006) {
        router.push('/exception/403');
       }
       if(res.ret === 1001) {
        router.push('/exception/404');
       }
       if(res.ret ===1003 || res.ret ===1000) {
        localStorage.removeItem('token')
        router.push('/login');
       }
    } else {
      resolve(res)
    }
     
    })
  },

  error => {
    notification.error({
      message: `请求错误 ${error.response.status}: ${error.response.request.responseURL}`,
      description: error.response.statusText,
    });
    // const err = new Error(error.response.statusText);
    // err.name = error.response.status;
    // err.response = error.response;
    // throw err;

    return Promise.reject(error.response.data)
  }
 
)

export default service
