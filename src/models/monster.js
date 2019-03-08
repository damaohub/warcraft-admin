import { queryMonster, removeMonster, addMonster, updateMonster, queryInstance, queryInstancemonsters } from '@/services/monster';

export default {
  namespace: 'monster',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    res: {},
    instanceList: [],
    monstersList: []
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMonster, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addMonster, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeMonster, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateMonster, payload);
      yield put({
        type: 'item',
        payload: response,
      });
      if (callback) callback();
    },
    *inList({ payload }, { call, put }) {
      const response = yield call(queryInstance, payload);
      yield put({
        type: 'instance',
        payload: response.data,
      });
    },
    *Instancemonsters({ payload }, { call, put }) {
      const response = yield call(queryInstancemonsters, payload);
      yield put({
        type: 'monsters',
        payload: response.data,
      });
    }
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
    instance(state, action) {
      return {
        ...state,
      instanceList: action.payload.list,
      }
    },
    monsters(state, action) {
      return {
        ...state,
        monstersList: action.payload.list
      }
    }
  },
};
