import Layout from '@/layout'
import store from '@/store'
const recordManagerRouter = {
  path: '/system-manager',
  component: Layout,
  redirect: '/system-manager/user',
  name: 'systemManager',
  meta: {
    title: () => '设置',
    icon: 'systemManager'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/system-manager/user'),
      name: 'user',
      meta: {
        title: () => '成员'
      }
    },
    {
      path: 'role',
      component: () => {
        if (store.getters.platform === 'enterprise') {
          return import('@/pages/enterprise/views/system-manager/role')
        } else if (store.getters.platform === 'standard') {
          return import('@/pages/standard/views/system-manager/role')
        }
      },
      name: 'role',
      meta: {
        title: () => '人员'
      }
    },
    {
      path: 'approval-list',
      component: () => import('@/pages/enterprise/views/system-manager/approval-list'),
      name: 'approvalList',
      disable: () => store.getters.platform !== 'enterprise',
      meta: {
        title: () => '审核'
      }
    }
  ]
}

export default recordManagerRouter
