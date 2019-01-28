import { queryTeam, addTeam, queryTeamInfo,queryGroup, queryAccount, queryStaff, bindStaff, unbindStaff, toCheck} from '@/services/team';

export default {
  namespace: 'team',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    res: {},
    info: {},
    group: {},
    account: {},
    staff:[]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTeam, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addTeam, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },

    *info({ payload }, { call, put }) {
        const response = yield call(queryTeamInfo, payload);
        yield put({
          type: 'saveInfo',
          payload: response.data,
        });
      },

      *group({ payload }, { call, put }) {
        const response = yield call(queryGroup, payload);
        
        const resp = {...response, req: payload}
        yield put({
          type: 'getGroup',
          payload: resp,
        });
      },
      *account({ payload }, { call, put }) {
        const response = yield call(queryAccount, payload);
        yield put({
          type: 'getAccount',
          payload: response,
        });
      },
      *staff({ payload }, { call, put }) {
        const response = yield call(queryStaff, payload);
        yield put({
          type: 'getStaff',
          payload: response.data,
        });
      },
      *bind({ payload }, { call, put }) {
        const response = yield call(bindStaff, payload);
        yield put({
          type: 'item',
          payload: response,
        });
      },
      *unbind({ payload }, { call, put }) {
        const response = yield call(unbindStaff, payload);
        yield put({
          type: 'item',
          payload: response,
        });
      },
      *check({ payload }, { call, put }) {
        const response = yield call(toCheck, payload);
        yield put({
          type: 'item',
          payload: response,
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
    saveInfo(state, action) {
        return {
        ...state,
        info: action.payload
        }
    },
    getGroup(state, action) {
        return {
            ...state,
            group: action.payload
        }
    },
    getAccount(state, action){
      return {
        ...state,
        account: action.payload
      }
    },
    getStaff(state,action) {
      return {
        ...state,
        staff: action.payload
      }
    }
  }
};
