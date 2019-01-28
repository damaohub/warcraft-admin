import { queryStaff, addStaff,updateStaff, rD, currentStaff, salaryStaff} from '@/services/staff';

export default {
  namespace: 'staff',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    res: {},
    current: {},
    salary: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStaff, payload);
      yield put({
        type: 'save',
        payload: response,
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
    *salary({ payload }, { call, put }) {
      const response = yield call(salaryStaff, payload);
      yield put({
        type: 'sy',
        payload: response,
      });
    }
  },

  

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
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
    },
    sy(state, action) {
      return {
       ...state,
       salary: action.payload
      }
     }
  },
};
