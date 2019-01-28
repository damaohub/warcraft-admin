import { queryRule, addGp, editGp, addRule, updateRule } from '@/services/rule';


export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    res: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *addGroup({ payload, callback }, { call, put }) {
      const response = yield call(addGp, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *editGroup({ payload, callback }, { call, put }) {
      const response = yield call(editGp, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
   
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
    }
  },
};
