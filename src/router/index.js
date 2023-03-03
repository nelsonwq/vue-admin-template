import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/system-state',
    children: [{
      path: '/system-state',
      name: 'SystemState',
      component: () => import('@/views/system-state/index'),
      meta: {
        title: '系统状态',
        icon: 'systemState'
      }
    }]
  },
  {
    path: '/current-job',
    component: Layout,
    children: [{
      path: 'index',
      name: 'CurrentJob',
      component: () => import('@/views/current-job/index'),
      meta: {
        title: '当前作业',
        icon: 'form'
      }
    }]
  },
  {
    path: '/view-monitor',
    component: Layout,
    children: [{
      path: 'index',
      name: 'ViewMonitor',
      component: () => import('@/views/view-monitor/index'),
      meta: {
        title: '查看监控',
        icon: 'monitor'
      }
    }]
  },
  {
    path: '/site-manage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'SiteManage',
        component: () => import('@/views/site-manage/index'),
        meta: {
          title: '站点管理',
          icon: 'convertingStation'
        }
      }
    ]
  },
  {
    path: '/ot-manage',
    component: Layout,
    redirect: '/ot-manage/ot-release',
    name: 'OtManage',
    meta: {
      title: '操作票管理',
      icon: 'documentation'
    },
    children: [{
        path: 'ot-release',
        component: () => import('@/views/ot-manage/ot-release/index'), // Parent router-view
        name: 'OtRelease',
        meta: {
          title: '操作票发布'
        },
      },
      {
        path: 'job-account',
        component: () => import('@/views/ot-manage/job-account/index'),
        name: 'JobAccount',
        meta: {
          title: '作业记录'
        }
      },
      {
        path: 'ot-template',
        component: () => import('@/views/ot-manage/ot-template/index'),
        name: 'OtTemplate',
        meta: {
          title: '操作票模板'
        }
      },
      {
        path: 'op-template',
        component: () => import('@/views/ot-manage/op-template/index'),
        name: 'OpTemplate',
        meta: {
          title: '操作项目模板'
        }
      }
    ]
  },
  {
    path: '/user-manage',
    component: Layout,
    redirect: '/user-manage/user-list',
    name: 'UserManage',
    meta: {
      title: '用户管理',
      icon: 'user'
    },
    children: [{
        path: 'user-list',
        component: () => import('@/views/user-manage/user-list/index'), // Parent router-view
        name: 'UserList',
        meta: {
          title: '用户列表'
        },
      },
      {
        path: 'user-recycle',
        component: () => import('@/views/user-manage/user-recycle/index'),
        name: 'UserRecycle',
        meta: {
          title: '用户回收站'
        }
      }
    ]
  },
  {
    path: '/system-manage',
    component: Layout,
    redirect: '/system-manage/user-manage',
    name: 'SystemManage',
    meta: {
      title: '系统管理',
      icon: 'system'
    },
    children: [
      {
        path: 'login-log',
        component: () => import('@/views/system-manage/login-log/index'),
        name: 'LoginLog',
        meta: {
          title: '登录日志'
        }
      },
      {
        path: 'system-backup',
        component: () => import('@/views/system-manage/system-backup/index'),
        name: 'SystemBackup',
        meta: {
          title: '系统备份'
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
