import { queryTalent, removeTalent, addTalent, updateTalent } from '@/services/game';

export default {
  namespace: 'talent',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    res: {},
    all: []
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTalent, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addTalent, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeTalent, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateTalent, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchAll({ payload }, { call, put }) {
      const newPayload = Object.assign({}, payload, {pageSize: 1000})
      const response = yield call(queryTalent, newPayload);
      yield put({
        type: 'saveAll',
        payload: response.data,
      });
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
    saveAll(state, action) {
      return {
        ...state,
        all: action.payload.list
      }
    }
  },
};
