import { queryPlayer, queryTask, queryTeam, addScreen, removeScreen, finish} from '@/services/player';

export default {
  namespace: 'player',

  state: {
   list:[],
   teamList:[],
    res: {},
    task: {},
    team: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPlayer, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    *task({ payload }, { call, put }) {
      const response = yield call(queryTask, payload);
      yield put({
        type: 'saveTask',
        payload: response.data,
      });
    },

    *team({ payload }, { call, put }) {
      const response = yield call(queryTeam, payload);
      yield put({
        type: 'saveTeam',
        payload: response.data,
      });
    },

    *screenadd({ payload }, { call, put }) {
      const response = yield call(addScreen, payload);
      yield put({
        type: 'item',
        payload: response,
      });
    },

    *screendel({ payload }, { call, put }) {
      const response = yield call(removeScreen, payload);
      yield put({
        type: 'item',
        payload: response,
      });
    },

    *finish({ payload }, { call, put }) {
      const response = yield call(finish, payload);
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
        list: action.payload.list,
        teamList: action.payload.team_list,
      };
    },
    item(state, action) {
      return {
        ...state,
        res: action.payload
      }
    },
    saveTask(state, action) {
      return {
        ...state,
        task: action.payload,
      };
    },
    saveTeam(state, action) {
      return {
        ...state,
        team: action.payload,
      };
    }
  },
};
