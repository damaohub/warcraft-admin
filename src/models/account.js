import { queryAccount, addAccount, updateAccount, removeAccount, queryCurrent} from '@/services/account';

export default {
  namespace: 'account',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    res: {},
    current:{}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryAccount, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addAccount, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeAccount, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateAccount, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *current({payload}, {call, put}) {
      const response = yield call(queryCurrent, payload);
      yield put({
        type: 'saveCurrent',
        payload: response,
      });
    }
  },

  

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    item(state, action) {
      return {
        ...state,
        res: action.payload
      }
    },
    saveCurrent(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
