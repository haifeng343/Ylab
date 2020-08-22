import Layout from '@/layout'
// import store from '@/store'

const saleManagerRouter = {
  path: '/sale-manager',
  component: Layout,
  redirect: '/sale-manager/sale-list',
  name: 'SaleManager',
  alwaysShow: true,
  meta: {
    title: () => '销售',
    icon: 'saleManager'
  },
  children: [
    {
      path: 'sale-list',
      component: () => import('@/pages/enterprise/views/sale-manager/sale-list'),
      name: 'SaleList',
      meta: {
        title: () => '合同'
      }
    },
    {
      path: 'sale-create',
      component: () => import('@/pages/enterprise/views/sale-manager/sale-create'),
      hidden: true,
      meta: {
        title: () => '新建合同'
      }
    },
    {
      path: 'sale-detail',
      component: () => import('@/pages/enterprise/views/sale-manager/sale-detail'),
      name: 'SaleDetail',
      hidden: true,
      meta: {
        title: () => '合同详情'
      }
    },
    {
      path: 'sale-settings',
      component: () => import('@/pages/enterprise/views/sale-manager/sale-setting'),
      name: 'SaleSetting',
      hidden: true,
      meta: {
        title: () => '合同设置'
      }
    }
  ]
}

export default saleManagerRouter
