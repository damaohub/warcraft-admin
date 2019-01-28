import { queryPlayer} from '@/services/player';

export default {
  namespace: 'player',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    res: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPlayer, payload);
      yield put({
        type: 'save',
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
    // item(state, action) {
    //   return {
    //     ...state,
    //     res: action.payload
    //   }
    // }
  },
};
