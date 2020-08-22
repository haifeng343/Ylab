import Layout from '@/layout'
import store from '@/store'

const taskManagerRouter = {
  path: '/paying-manager',
  component: Layout,
  redirect: '/paying-manager/paying-list',
  name: 'PayingrManager',
  disable: () => store.getters.platform !== 'enterprise',
  alwaysShow: true,
  meta: {
    title: () => '开支',
    icon: 'paying'
  },
  children: [
    {
      path: 'paying-list',
      component: () => import('@/views/paying-manager/paying-list'),
      name: 'PayingList',
      meta: {
        title: () => '开支列表'
      }
    },
    {
      path: 'paying-detail',
      component: () => import('@/views/paying-manager/paying-detail'),
      name: 'PayingDetail',
      hidden: true,
      meta: {
        title: () => '开支详情',
        noCache: true
      }
    },
    {
      path: 'paying-settings',
      component: () => import('@/views/paying-manager/paying-settings'),
      name: 'PayingSettings',
      hidden: true,
      meta: {
        title: () => '开支设置'
      }
    }
  ]
}

export default taskManagerRouter
