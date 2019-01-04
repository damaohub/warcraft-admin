import { queryEquip, removeEquip, addEquip, updateEquip, queryData1 } from '@/services/equip';

export default {
  namespace: 'equip',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    res: {},
    data1: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryEquip, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addEquip, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeEquip, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateEquip, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchData1({ payload }, { call, put }) {
      const response = yield call(queryData1, payload);
      yield put({
        type: 'saveData1',
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
    saveData1(state, action) {
      return {
        ...state,
        data1: action.payload.data
      }
    }
  },
};
