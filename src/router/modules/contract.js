import Layout from '@/layout'
import store from '@/store'

const contractManagerRouter = {
  path: '/contract-manager',
  component: Layout,
  redirect: '/contract-manager/contract-list',
  name: 'ContractManager',
  alwaysShow: true,
  meta: {
    title: () => '内部',
    icon: 'contractManager'
  },
  children: [
    {
      path: 'contract-list',
      component: () => {
        if (store.getters.platform === 'enterprise') {
          return import('@/pages/enterprise/views/contract-manager/contract-list')
        } else if (store.getters.platform === 'standard') {
          return import('@/pages/standard/views/contract-manager/contract-list')
        }
      },
      name: 'ContractList',
      meta: {
        title: () => '项目列表'
      }
    },
    {
      path: 'contract-create',
      component: () => {
        if (store.getters.platform === 'enterprise') {
          return import('@/pages/enterprise/views/contract-manager/contract-create')
        } else if (store.getters.platform === 'standard') {
          return import('@/pages/standard/views/contract-manager/contract-create')
        }
      },
      hidden: true,
      meta: {
        title: () => '新建项目'
      }
    },
    {
      path: 'contract-detail',
      component: () => {
        if (store.getters.platform === 'enterprise') {
          return import('@/pages/enterprise/views/contract-manager/contract-detail')
        } else if (store.getters.platform === 'standard') {
          return import('@/pages/standard/views/contract-manager/contract-detail')
        }
      },
      name: 'ContractDetail',
      hidden: true,
      meta: {
        title: () => '项目详情',
        noCache: true
      }
    },
    {
      path: 'join-contract-detail',
      component: () => import('@/views/contract-manager/join-contract-detail'),
      name: 'JoinContractDetail',
      hidden: true,
      meta: {
        title: () => '合作项目详情',
        noCache: true
      }
    },
    {
      path: 'cooperate-contract',
      component: () => import('@/views/contract-manager/cooperate-contract'),
      name: 'Cooperate-contract',
      hidden: true,
      meta: {
        title: () => '合作项目详情',
        noCache: true
      }
    },
    {
      path: 'contract-settings',
      component: () => import('@/views/contract-manager/contract-settings'),
      name: 'ContractSettings',
      hidden: true,
      meta: {
        title: () => '项目设置'
      }
    },
    {
      path: 'batch',
      component: () => import('@/views/batch/data-import'),
      hidden: true,
      meta: {
        title: () => '导入数据'
      }
    },
    {
      path: 'experiment-list',
      component: () => import('@/pages/enterprise/views/task-manager/experiment-list'),
      name: 'ExperimentList',
      disable: () => store.getters.platform !== 'enterprise',
      meta: {
        title: () => '实验列表'
      }
    },
    {
      path: 'task-list',
      component: () => {
        if (store.getters.platform === 'enterprise') {
          return import('@/pages/enterprise/views/task-manager/task-list')
        } else if (store.getters.platform === 'standard') {
          return import('@/pages/standard/views/task-manager/task-list')
        }
      },
      name: 'TaskList',
      meta: {
        title: () => '任务列表'
      }
    },
    {
      path: 'task-create',
      component: () => import('@/pages/standard/views/task-manager/task-create'),
      disable: () => store.getters.platform === 'enterprise',
      hidden: true,
      meta: {
        title: () => '新建任务'
      }
    },
    {
      path: 'task-detail',
      component: () => {
        if (store.getters.platform === 'enterprise') {
          return import('@/pages/enterprise/views/task-manager/task-detail')
        } else if (store.getters.platform === 'standard') {
          return import('@/pages/standard/views/task-manager/task-detail')
        }
      },
      name: 'TaskDetail',
      hidden: true,
      meta: {
        title: () => '任务详情',
        noCache: true
      }
    },
    {
      path: 'cooperate-task-detail',
      component: () => import('@/pages/standard/views/task-manager/cooperate-task-detail'),
      name: 'CooperateTaskDetail',
      hidden: true,
      meta: {
        title: () => '合作任务详情'
      }
    },
    {
      path: 'record-list',
      component: () => import('@/pages/standard/views/task-manager/record-list'),
      name: 'RecordList',
      disable: () => store.getters.platform === 'enterprise',
      meta: {
        title: () => '实验记录'
      }
    },
    {
      path: 'record-detail',
      component: () => import('@/pages/standard/views/task-manager/record-detail'),
      name: 'RecordDetail',
      disable: () => store.getters.platform === 'enterprise',
      hidden: true,
      meta: {
        title: () => '实验记录详情',
        noCache: true
      }
    },
    {
      path: 'cooperate-record-detail',
      component: () => import('@/pages/standard/views/task-manager/cooperate-record-detail'),
      name: 'CooperateRecordDetail',
      hidden: true,
      meta: {
        title: () => '合作实验记录详情'
      }
    },
    {
      path: 'record-create',
      component: () => import('@/pages/standard/views/task-manager/record-create'),
      hidden: true,
      disable: () => store.getters.platform === 'enterprise',
      meta: {
        title: () => '新建实验记录'
      }
    },
    {
      path: 'task-settings',
      component: () => {
        if (store.getters.platform === 'enterprise') {
          return import('@/pages/enterprise/views/task-manager/task-settings')
        } else if (store.getters.platform === 'standard') {
          return import('@/pages/standard/views/task-manager/task-settings')
        }
      },
      name: 'TaskSettings',
      hidden: true,
      meta: {
        title: () => '任务设置'
      }
    },
    {
      path: 'experiment-settings',
      component: () => import('@/pages/enterprise/views/task-manager/experiment-settings'),
      name: 'ExperimentSettings',
      disable: () => store.getters.platform !== 'enterprise',
      hidden: true,
      meta: {
        title: () => '实验设置'
      }
    },
    {
      path: 'experiment-detail',
      component: () => import('@/pages/enterprise/views/task-manager/experiment-detail'),
      name: 'ExperimentDetail',
      hidden: true,
      meta: {
        title: () => '实验详情',
        noCache: true
      }
    },
    {
      path: 'data-report-list',
      component: () => import('@/pages/enterprise/views/task-manager/dataReportList'),
      name: 'DataReportList',
      disable: () => store.getters.platform !== 'enterprise',
      meta: {
        title: () => '结果'
      }
    },
    {
      path: 'process-list',
      component: () => import('@/pages/enterprise/views/process-manager/process-list'),
      name: 'ProcessList',
      disable: () => store.getters.platform !== 'enterprise',
      meta: {
        title: () => '多任务'
      }
    },
    {
      path: 'process-detail',
      component: () => import('@/pages/enterprise/views/process-manager/process-detail'),
      name: 'ProcessDetail',
      hidden: true,
      meta: {
        title: () => '多任务详情',
        noCache: true
      }
    },
    {
      path: 'process-template',
      component: () => import('@/pages/enterprise/views/process-manager/process-template'),
      name: 'ProcessTemplate',
      disable: () => store.getters.platform !== 'enterprise',
      meta: {
        title: () => '模板',
        noCache: true
      }
    },
    {
      path: 'template-detail',
      component: () => import('@/pages/enterprise/views/process-manager/template-detail'),
      name: 'TemplateDetail',
      hidden: true,
      meta: {
        title: () => '模板详情',
        noCache: true
      }
    }
  ]
}

export default contractManagerRouter
