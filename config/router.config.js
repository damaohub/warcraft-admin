export default [
  //login
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      { path: './', component: './Login' },
      
    ]
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard' },
      {
        path: '/dashboard',
        name: 'dashboard.workplace',
        icon: 'dashboard',
        component: './Dashboard/Workplace',
       
      },
      //gameRole
      {
        path: '/gamerole',
        icon: 'table',
        name: 'gameRole',
        authority: ['1'],
        routes: [
          {
            path: '/gamerole/races',
            name: 'races',
            component: './GameRole/Races',
          },
          {
            path: '/gamerole/profession',
            name: 'profession',
            component: './GameRole/Profession',
          },
          {
            path: '/gamerole/talent',
            name: 'talent',
            component: './GameRole/Talent',
          }
        ]
      },
      //monster
      {
        path: '/monster',
        icon: 'table',
        name: 'monster',
        authority: ['1'],
        component: './Monster'
       
      },
      //equip
      {
        path: '/equip',
        icon: 'table',
        name: 'equip',
        authority: ['1'],
        component: './Equip'
       
      },
      //rr
      {
        path: '/rr',
        icon: 'table',
        name: 'rr',
        authority: ['1'],
        routes: [
           //rule
          {
            path: '/rr/rule',
            icon: 'table',
            name: 'rule',
            component: './Rule'
          },
          //role
          {
            path: '/rr/role',
            icon: 'table',
            name: 'role',
            component: './Role'
          },
          //rights
          {
            path: '/rr/rights',
            icon: 'table',
            name: 'rights',
            component: './Rights'
          },
        ]
      },
      //staff
      {
        path: '/staff',
        icon: 'table',
        name: 'staff',
        authority: ['1','4'],
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/staff',
            name: 'list',
            component: './Staff'
          },
          {
            path: '/staff/setting',
            name: 'setting',
            component: './Staff/Setting'
          },
          {
            path: '/staff/center',
            name: 'center',
            component: './Staff/Center'
          }
        ]
      },
      //订单管理
      {
        path: '/order',
        icon: 'table',
        name: 'order',
        authority: ['1','4'],
        routes: [
          {
            path: '/order/list',
            name: 'list',
            component: './Order/List'
          },
          {
            path: '/order/add',
            name: 'add',
            component: './Order/Add'
          },
          {
            path: '/order/list/detail',
            name: 'detail',
            hideInMenu: true,
            component: './Order/Detail'
          }
        ]
      },
      // 排团
      {
        path: '/team',
        icon: 'table',
        name: 'team',
        authority: ['1','2'],
        routes: [
          {
            path: '/team/list',
            name: 'list',
            component: './Team/List'
            
          },
          {
            path: '/team/list/detail',
            name: 'detail',
            hideInMenu: true,
            component: './Team/Detail'
          },
         
          {
            path: '/team/add',
            name: 'add',
            hideChildrenInMenu: true,
            component: './Team/Add',
            routes: [
              {
                path: '/team/add',
                redirect: '/team/add/info',
              },
              {
                path: '/team/add/info',
                name: 'info',
                component: './Team/Add/Step1',
              },
              {
                path: '/team/add/confirm',
                name: 'confirm',
                component: './Team/Add/Step2',
              },
              {
                path: '/team/add/result',
                name: 'result',
                component: './Team/Add/Step3',
              },
            ]
          },
        ]
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      //个人中心
      {
        path: '/user',
        icon: 'table',
        name: 'user',
        component: './User',
        routes: [
          {
            path: '/user/',
            redirect: '/user/salary',
          },
          {
            path: '/user/salary',
            component: './User/Salary',
          }
        ],
      },
      //游戏账号
      {
        path: '/account',
        icon: 'table',
        name: 'account',
        authority: ['1','2','4'],
        component: "./Account"
      },
      // 可用游戏账号
      {
        path: '/player',
        icon: 'table',
        name: 'player',
        authority: ['1','2','3'],
        component: "./Player"
      },
        // 团队操作
        {
          path: '/dashboard/player-team',
          icon: 'table',
          name: 'player-team',
          authority: ['3'],
          hideInMenu: true,
          component: "./Player/Team"
        },
      //团员
      {
        path: '/group',
        icon: 'table',
        name: 'group',
        authority: ['2'],
        component: "./Group"
      },
      {
        component: '404',
      },
    ],
  },
];
