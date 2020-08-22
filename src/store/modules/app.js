import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'small',
  platform: '',
  buttonPermission: {
    standard: {
      // 项目
      contractSetting: 21,
      newContract: 22,
      stopContract: 23,
      deleteContract: 24,
      // 任务
      taskSetting: 36,
      newTask: 37,
      deleteTask: 38,
      stopTask: 39,
      // 采购
      purchaseSetting: 52,
      deletePurchase: 54,
      editPrice: 55,
      inStore: 56,
      // 库存
      storeNew: 85,
      storeSetting: 86,
      // 仪器
      newAnalyzer: 106,
      stopAnalyzer: 107,
      deleteAnalyzer: 114,
      setting: 115
    },
    enterprise: {
      // 项目
      contractSetting: 249,
      newContract: 250,
      stopContract: 251,
      deleteContract: 252,
      // 实验  ========（标准版任务）
      taskSetting: 259,
      newTask: 260,
      experimentEdit: 383,
      deleteTask: 261,
      stopTask: 262,
      // 采购
      purchaseSetting: 270,
      deletePurchase: 271,
      editPrice: 272,
      inStore: 273,
      // 库存
      storeNew: 282,
      storeSetting: 283,
      // 仪器
      newAnalyzer: 299,
      stopAnalyzer: 300,
      deleteAnalyzer: 307,
      setting: 308,
      // 任务
      enterpriseTaskSetting: 374,
      enterpriseTaskEdit: 375,
      enterpriseTaskStop: 376,
      enterpriseTaskExeption: 377,
      // 流程编辑
      processTree: 388
    }
  }
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_PLATFORM: (state, platform) => {
    state.platform = platform
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
