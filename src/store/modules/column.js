import { setMyQuery } from '@/api/common'
import Vue from 'vue'
function setColumn(code, columnList) {
  setMyQuery({ code, name: 'checkedColumns', queryJson: columnList })
}

const state = {
  checkedColumns: {}
}

const mutations = {
  SET_CHECKED_COLUMNS: (state, data) => {
    Vue.set(state.checkedColumns, data.code, data.checkedColumns)
  }
}

const actions = {
  saveColumn({ commit }, data) {
    setColumn(data.code, data.checkedColumns)
    commit('SET_CHECKED_COLUMNS', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

