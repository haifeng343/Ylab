import Layout from '@/layout'
import store from '@/store'

const taskManagerRouter = {
  path: '/analyzer-manager',
  component: Layout,
  redirect: '/analyzer-manager/analyzer-list',
  name: 'AnalyzerManager',
  alwaysShow: true,
  meta: {
    title: () => '机器',
    icon: 'analyzerManager'
  },
  children: [
    {
      path: 'analyzer-list',
      component: () => import('@/views/analyzer-manager/analyzer-list'),
      name: 'AnalyzerList',
      meta: {
        title: () => '机器列表'
      }
    },
    {
      path: 'book-record',
      component: () => import('@/views/analyzer-manager/book-record'),
      name: 'BookRecord',
      meta: {
        title: () => '预订'
      }
    },
    {
      path: 'analyzer-create',
      component: () => import('@/views/analyzer-manager/analyzer-create'),
      hidden: true,
      meta: {
        title: () => '新建机器'
      }
    },
    {
      path: 'analyzer-detail',
      component: () => {
        if (store.getters.platform === 'enterprise') {
          return import('@/pages/enterprise/views/analyzer-manager/analyzer-detail')
        } else if (store.getters.platform === 'standard') {
          return import('@/pages/standard/views/analyzer-manager/analyzer-detail')
        }
      },
      name: 'AnalyzerDetail',
      hidden: true,
      meta: {
        title: () => '机器器详情',
        noCache: true
      }
    },
    {
      path: 'analyzer-settings',
      component: () => import('@/views/analyzer-manager/analyzer-settings'),
      name: 'AnalyzerSettings',
      hidden: true,
      meta: {
        title: () => '机器设置'
      }
    }
  ]
}

export default taskManagerRouter
