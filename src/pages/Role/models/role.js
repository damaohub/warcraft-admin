import { queryRole, addRole, updateRole, editRl } from '@/services/role';


export default {
  namespace: 'role',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    res: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRole, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
   
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRole, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *editRule({ payload, callback }, { call, put }) {
      const response = yield call(editRl, payload);
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
