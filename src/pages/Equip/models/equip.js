import { queryEquip, removeEquip, addEquip, updateEquip, queryList1 } from '@/services/equip';

export default {
  namespace: 'equip',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    res: {},
    list1: {}
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
    *fetchList1({ payload }, { call, put }) {
      const response = yield call(queryList1, payload);
      yield put({
        type: 'saveList1',
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
    saveList1(state, action) {
      return {
        ...state,
        list1: action.payload.data.list
      }
    }
  },
};
