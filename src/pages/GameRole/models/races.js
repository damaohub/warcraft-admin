import { queryRaces, removeRace, addRace, updateRace } from '@/services/game';

export default {
  namespace: 'races',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRaces, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRace, payload);
      yield put({
        type: 'item',
        payload: response.data,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRace, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRace, payload);
      yield put({
        type: 'item',
        payload: response.data,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      console.log('更新数据')
      return {
        ...state,
        data: action.payload,
      };
    },

  },
};
