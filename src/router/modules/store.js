import Layout from '@/layout'
import store from '@/store'

const storeManagerRouter = {
  path: '/store-manager',
  component: Layout,
  redirect: '/store-manager/store-list',
  name: 'StoreManager',
  meta: {
    title: () => '仓库',
    icon: 'storeManager'
  },
  children: [
    {
      path: 'store-list',
      component: () => import('@/views/store-manager/store-list'),
      name: 'StoreList',
      meta: {
        title: () => '仓库列表'
      }
    },
    {
      path: 'receive-list',
      component: () => {
        if (store.getters.platform === 'enterprise') {
          return import('@/pages/enterprise/views/store-manager/receive-list')
        } else if (store.getters.platform === 'standard') {
          return import('@/pages/standard/views/store-manager/receive-list')
        }
      },
      name: 'ReceiveList',
      meta: {
        title: () => '取货'
      }
    },
    {
      path: 'in-store-list',
      component: () => import('@/views/store-manager/in-store-list'),
      name: 'InStoreList',
      meta: {
        title: () => '进货'
      }
    },
    {
      path: 'out-store-list',
      component: () => {
        if (store.getters.platform === 'enterprise') {
          return import('@/pages/enterprise/views/store-manager/out-store-list')
        } else if (store.getters.platform === 'standard') {
          return import('@/pages/standard/views/store-manager/out-store-list')
        }
      },
      name: 'OutStoreList',
      meta: {
        title: () => '出货'
      }
    },
    {
      path: 'out-store-detail',
      component: () => {
        if (store.getters.platform === 'enterprise') {
          return import('@/pages/enterprise/views/store-manager/out-store-detail')
        } else if (store.getters.platform === 'standard') {
          return import('@/pages/standard/views/store-manager/out-store-detail')
        }
      },
      name: 'OutStoreDetal',
      hidden: true,
      meta: {
        title: () => '取货详情'
      }
    },
    {
      path: 'store-create',
      component: () => import('@/views/store-manager/store-create'),
      hidden: true,
      meta: {
        title: () => '新建库存'
      }
    },
    {
      path: 'store-detail',
      component: () => {
        if (store.getters.platform === 'enterprise') {
          return import('@/pages/enterprise/views/store-manager/store-detail')
        } else if (store.getters.platform === 'standard') {
          return import('@/pages/standard/views/store-manager/store-detail')
        }
      },
      // component: () => import('@/views/store-manager/store-detail'),
      name: 'StoreDetail',
      hidden: true,
      meta: {
        title: () => '仓库详情',
        noCache: true
      }
    },
    {
      path: 'store-settings',
      component: () => import('@/views/store-manager/store-settings'),
      name: 'StoreSettings',
      hidden: true,
      meta: {
        title: () => '仓库设置'
      }
    },
    {
      path: 'batch',
      component: () => import('@/views/batch/data-import'),
      hidden: true,
      meta: {
        title: () => '导入数据'
      }
    }
  ]
}

export default storeManagerRouter
