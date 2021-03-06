import axios from 'axios'

import router from 'umi/router';
// import hash from 'hash.js';
// import { isAntdPro } from './utils';
import saltMD5 from './saltMD5'


const noConsole = false

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

  if(tmp === 'null' ){
    // eslint-disable-next-line no-param-reassign
    tmp='';
    // console.log(obj)
  }
  if(typeof (tmp) !== 'undefined'){
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
    // IE localStorage 兼容问题
    localStorage.setItem('dummy', 'dummyvalue');
    localStorage.removeItem('dummy');
    
    if(localStorage.getItem('token') !== 'undefined') {
      const Nobj = {...config.body, ...{ token: JSON.parse(localStorage.getItem('token')), time: `${Date.parse(new Date()) / 1000}`}}
      const sign = createSign(Nobj)
      data ={...Nobj,sign}
    } else {
      router.push('/login');
    }
    // eslint-disable-next-line
    config.data = data;
     // eslint-disable-next-line
    config.headers = { ...config.headers, ...{'Authorization':  `Bearer ${JSON.parse(localStorage.getItem('token'))}`}}
    // eslint-disable-next-line no-param-reassign
    config.timeout = 0;
    return config
  },
  error => {
    // eslint-disable-next-line no-console
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // if(response.status>=200 && response.status<300) {
      const res = response.data
      if (!noConsole) {
        // eslint-disable-next-line no-console
        console.log(
          `${new Date().toLocaleString()}【 M=${response.request.responseURL} 】【接口响应：】`,
          res
        );
      }
      // return new Promise((resolve, reject) => {
      if(res.ret !==0 ) {
        // message.error(res.msg) 
         throw (res.msg)
        // if(res.ret === 2006) {
        //   router.push('/exception/403');
        // }
        // if(res.ret === 1001) {
        //   router.push('/exception/404');
        // }
        // if(res.ret ===1003 || res.ret ===1000 || res.ret === 1004) {
        //   localStorage.removeItem('token')
        //   router.push('/login');
        //   reject();
        // }
      }
      return res
        
      // })
    // }
    
  },

// 500,404等状态会走error
  error => {
    const {status} = error.response
    if(status === 404) {
      router.push('/exception/404');
    } else if(status === 403) {
      router.push('/exception/403');
    }else if(status === 500) {
      router.push('/exception/500');
    }else if(status === 504) {
      router.push('/exception/504');
    }
    throw error;
    // return Promise.reject(error.response.data)
  }
 
)

export default service
