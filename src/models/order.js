import { queryOrder, addOrder, queryOrderInfo, removeOrder,updateOrder,changeOrder } from '@/services/order';

export default {
  namespace: 'order',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    res: {},
    info: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryOrder, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addOrder, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },

    *info({ payload }, { call, put }) {
        const response = yield call(queryOrderInfo, payload);
        yield put({
          type: 'saveInfo',
          payload: response.data,
        });
      },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeOrder, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateOrder, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *change({ payload, callback }, { call, put }) {
      const response = yield call(changeOrder, payload);
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
    },
    saveInfo(state, action) {
        return {
        ...state,
            info: action.payload
        }
    }
  },
};
