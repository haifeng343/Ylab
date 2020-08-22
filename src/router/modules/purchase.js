import Layout from '@/layout'
import store from '@/store'

const purchaseManagerRouter = {
  path: '/purchase-manager',
  component: Layout,
  redirect: '/purchase-manager/purchase-list',
  name: 'PurchaseManager',
  meta: {
    title: () => '订货',
    icon: 'purchaseManager'
  },
  children: [
    {
      path: 'purchase-list',
      component: () => import('@/views/purchase-manager/purchase-list'),
      name: 'PurchaseList',
      meta: {
        title: () => '订货列表'
      }
    },
    {
      path: 'purchase-settings',
      component: () => import('@/views/purchase-manager/purchase-settings'),
      name: 'PurchaseSettings',
      hidden: true,
      meta: {
        title: () => '订货设置',
        noCache: true
      }
    },
    {
      path: 'supplier-list',
      component: () => import('@/views/purchase-manager/supplier-list'),
      name: 'SupplierList',
      meta: {
        title: () => '乙方'
      }
    },
    {
      path: 'product-list',
      component: () => import('@/views/purchase-manager/product-list'),
      name: 'ProductList',
      meta: {
        title: () => '物品'
      }
    },
    {
      path: 'purchase-create',
      component: () => import('@/views/purchase-manager/purchase-create'),
      hidden: true,
      meta: {
        title: () => '新建订货'
      }
    },
    {
      path: 'purchase-detail',
      component: () => {
        if (store.getters.platform === 'enterprise') {
          return import('@/pages/enterprise/views/purchase-manager/purchase-detail')
        } else if (store.getters.platform === 'standard') {
          return import('@/pages/standard/views/purchase-manager/purchase-detail')
        }
      },
      name: 'PurchaseDetail',
      hidden: true,
      meta: {
        title: () => '订货详情',
        noCache: true
      }
    },
    {
      path: 'supplier-create',
      component: () => import('@/views/purchase-manager/supplier-create'),
      hidden: true,
      meta: {
        title: () => '新建乙方'
      }
    },
    {
      path: 'supplier-detail',
      component: () => import('@/views/purchase-manager/supplier-detail'),
      name: 'SupplierDetail',
      hidden: true,
      meta: {
        title: () => '乙方详情',
        noCache: true
      }
    },
    {
      path: 'supplier-settings',
      component: () => import('@/views/purchase-manager/supplier-settings'),
      name: 'SupplierSettings',
      hidden: true,
      meta: {
        title: () => '乙方设置',
        noCache: true
      }
    }
  ]
}

export default purchaseManagerRouter
