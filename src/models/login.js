import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { accountLogin, getFakeCaptcha, accountLogout, majiaLogin} from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';

export default {
  namespace: 'login',

  state: {
    token: undefined,
    roleInfo: {}
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      
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
        // window.location.reload() // 解决全局布局组件不显示数据，进行页面刷新
      }
    },

    *login1({ payload }, { call, put }) {
      const code = payload.linkcode
      const response = yield call(majiaLogin, payload);
      if (response.ret === 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        reloadAuthorized();
        yield put(routerRedux.replace(`/player-team?code=${code}`));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout({payload}, { call, put }) {
      const response = yield call(accountLogout, payload);
      if(response.ret === 0) {
        yield put({
          type: 'logoutStatus',
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
      } else {
        message.error(response.msg)
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

    logoutStatus(state) {
      localStorage.removeItem('token')
      localStorage.removeItem('warcraft-admin-authority')
      return {
        ...state,
        token: undefined,
        roleInfo: {}
      };
    }
    
  },
};
