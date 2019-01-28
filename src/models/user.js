import { query as queryUsers, queryCurrent, fetchSalary } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    salary: {}
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent({payload}, { call, put }) {
      const response = yield call(queryCurrent, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *salary({payload}, { call, put }) {
      const response = yield call(fetchSalary, payload);
      yield put({
        type: 'saveSalary',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.data || {},
      };
    },
    saveSalary(state, action) {
      return {
        ...state,
        salary: action.payload.data || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
