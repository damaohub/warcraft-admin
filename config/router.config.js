export default [
  //login
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      { path: './', component: '/Login' },
      
    ]
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      //gameRole
      {
        path: '/gamerole',
        icon: 'table',
        name: 'gameRole',
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
        component: './Monster'
       
      },
      //equip
      {
        path: '/equip',
        icon: 'table',
        name: 'equip',
        component: './Equip'
       
      },
      //rr
      {
        path: '/rr',
        icon: 'table',
        name: 'rr',
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
        icon: 'staff',
        name: 'staff',
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
          }
        ]
      },
      
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
     
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
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
     
      {
        component: '404',
      },
    ],
  },
];
