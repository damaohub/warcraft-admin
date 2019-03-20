import request from '@/utils/request';


export async function queryTeam(params) {
    return request('/api/team/list', {
      method: 'POST',
      body: params,
    });
  }

export async function addTeam(params) {
    return request('/api/team/add', {
      method: 'POST',
      body: params
    });
  }

  export async function removeTeam(params) {
    return request('/api/team/del', {
      method: 'POST',
      body: params
    });
  }
  
  export async function queryTeamInfo(params) {
      return request('/api/team/info', {
        method: 'POST',
        body: params
      });
}
  
export async function queryGroup(params) {
    return request('/api/team/getgroup', {
      method: 'POST',
      body: params
    });
}


export async function queryAccount(params) {
  return request('/api/team/getcanuseaccountlist', {
    method: 'POST',
    body: params
  });
}

export async function queryAccount1(params) {
  return request('/api/team/getcanuseaccountlist1', {
    method: 'POST',
    body: params
  });
}

export async function queryAccount2(params) {
  return request('/api/team/getcanuseaccountlist2', {
    method: 'POST',
    body: params
  });
}

export async function queryAccount3(params) {
  return request('/api/team/getcanuseaccountlist3', {
    method: 'POST',
    body: params
  });
}

export async function queryAccount4(params) {
  return request('/api/team/getcanuseaccountlist4', {
    method: 'POST',
    body: params
  });
}

export async function delAccount(params) {
  return request('/api/team/delaccount', {
    method: 'POST',
    body: params
  });
}

export async function addAccount(params) {
  return request('/api/team/addaccount', {
    method: 'POST',
    body: params
  });
}


export async function queryStaff(params) {
  return request('/api/team/cangiveuser', {
    method: 'POST',
    body: params
  });
}

export async function bindStaff(params) {
  return request('/api/team/give', {
    method: 'POST',
    body: params
  });
}

  export async function unbindStaff(params) {
    return request('/api/team/takeback', {
      method: 'POST',
      body: params
    });
}

export async function toCheck(params) {
  return request('/api/gamer/teamcheck', {
    method: 'POST',
    body: params
  });
}

export async function downLoad(params) {
  return request('/api/team/downloadimg', {
    method: 'POST',
    body: params
  });
}

