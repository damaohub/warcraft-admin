import {
  queryProfession,
  removeProfession,
  addProfession,
  updateProfession,
} from '@/services/game';

export default {
  namespace: 'profession',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryProfession, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addProfession, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) yield callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeProfession, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateProfession, payload);
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
