import { 
  queryTeam, 
  addTeam,
  removeTeam, 
  queryTeamInfo,
  queryGroup, 
  queryAccount, 
  queryStaff, 
  bindStaff, 
  unbindStaff, 
  toCheck, 
  queryAccount1, 
  queryAccount2, 
  queryAccount3, 
  queryAccount4, 
  delAccount,
  addAccount,
  downLoad,
  downLoadItem,
  getMjLink,
  seeMjLink,
  removeProblem,
  changeStatus
} from '@/services/team';

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
    staff:[],
    downLoadLink: undefined,
    mjLink: undefined
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
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeTeam, payload);
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
      *account1({ payload }, { call, put }) {
        const response = yield call(queryAccount1, payload);
        yield put({
          type: 'getAccount',
          payload: response,
        });
      },
      *account2({ payload }, { call, put }) {
        const response = yield call(queryAccount2, payload);
        yield put({
          type: 'getAccount',
          payload: response,
        });
      },
      *account3({ payload }, { call, put }) {
        const response = yield call(queryAccount3, payload);
        yield put({
          type: 'getAccount',
          payload: response,
        });
      },
      *account4({ payload }, { call, put }) {
        const response = yield call(queryAccount4, payload);
        yield put({
          type: 'getAccount',
          payload: response,
        });
      },

      *delaccount({ payload }, { call, put }) {
        const response = yield call(delAccount, payload);
        yield put({
          type: 'item',
          payload: response,
        });
      },
      *addaccount({ payload }, { call, put }) {
        const response = yield call(addAccount, payload);
        yield put({
          type: 'item',
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
      *download({ payload }, { call, put }) {
        const response = yield call(downLoad, payload);
        yield put({
          type: 'saveDownLoad',
          payload: response,
        });
      },
      *downloaditem({ payload }, { call, put }) {
        const response = yield call(downLoadItem, payload);
        yield put({
          type: 'saveDownLoad',
          payload: response,
        });
      },
      *getmjlink({ payload }, { call, put }) {
        const response = yield call(getMjLink, payload);
        yield put({
          type: 'item',
          payload: response,
        });
      },
      *seemjlink({ payload }, { call, put }) {
        const response = yield call(seeMjLink, payload);
        yield put({
          type: 'saveMjLink',
          payload: response,
        });
      },
      // 移除问题单
      *removeproblem({ payload, callback }, { call, put }) {
        const response = yield call(removeProblem, payload);
        yield put({
          type: 'item',
          payload: response,
        });
        if (callback) callback();
      },
      // 修改团员提交状态
      *change({ payload, callback }, { call, put }) {
        const response = yield call(changeStatus, payload);
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
    },
    saveDownLoad(state, action) {
      return {
        ...state,
        downLoadLink: action.payload
      }
    },
    saveMjLink(state, action) {
      return {
        ...state,
        mjLink: action.payload
      }
    },
    
  }
};
