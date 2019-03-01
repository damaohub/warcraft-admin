import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { accountLogin, getFakeCaptcha, accountLogout } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
// import { message } from 'antd';

export default {
  namespace: 'login',

  state: {
    token: undefined,
    roleInfo: {}
  },

  effects: {
    *login({ payload }, { call, put }) {
      
      const response = yield call(accountLogin, payload);
      console.log(response)
      // Login successfully
      if (response.ret === 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout({payload}, { call, put }) {
      const response = yield call(accountLogout, payload);
      if(response.ret === 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(
          routerRedux.push({
            pathname: '/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
      
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      localStorage.setItem('token', JSON.stringify(payload.data.token));
      const currentAuthority = payload.data.role_info.id;
      setAuthority(currentAuthority);
      return {
        ...state,
        token: payload.data.token,
        roleInfo: payload.data.role_info,
      };
    },

    
  },
};
