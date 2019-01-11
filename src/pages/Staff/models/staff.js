import { queryStaff, addStaff,updateStaff, rD, currentStaff} from '@/services/staff';

export default {
  namespace: 'staff',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    res: {},
    current: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStaff, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addStaff, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *rd({ payload, callback }, { call, put }) {
      const response = yield call(rD, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateStaff, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *current({ payload }, { call, put }) {
      const response = yield call(currentStaff, payload);
      yield put({
        type: 'fc',
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
    fc(state, action) {
     return {
      ...state,
      current: action.payload 
     }
    }
  },
};
