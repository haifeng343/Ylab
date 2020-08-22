import { logout } from '@/api/login'
import { getSession, getQRCode } from '@/api/user'
import { resetRouter } from '@/router'
import { getNotMsg } from '@/api/message'
import { MessageBox } from 'element-ui'
const state = {
  name: '',
  avatar: '',
  roles: [],
  permissions: [],
  buttonPermissions: [],
  msgTip: false,
  inviteDialog: false, // 是否显示邀请人员链接
  inviteLimitDialog: false,
  id: 0,
  phone: 0,
  companyList: [],
  company: {},
  lastTime: 1,
  showUpLoad: false
}

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMISSIONS: (state, value) => {
    state.permissions = value
  },
  SET_BUTTONPERMISSIONS: (state, value) => {
    state.buttonPermissions = value
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MSGTIP: (state, { msgTip }) => {
    state.msgTip = msgTip
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_COMPANYLIST: (state, companyList) => {
    state.companyList = companyList
  },
  SET_COMPANY: (state, company) => {
    state.company = company
  },
  SET_LASTTIME: (state, expireNotice) => {
    state.lastTime = expireNotice
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 模拟
      resolve()
      // login({ username: username.trim(), password: password }).then(response => {
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // get user info
  async getInfo({ commit, state }) {
    const QRcode = await getQRCode()

    return new Promise((resolve, reject) => {
      getSession().then(response => {
        // if (!data) {
        //   reject('Verification failed, please Login again.')
        // }
        // const { roles, name, avatar } = data
        // roles must be a non-empty array
        const { roles, user, company, companyList, expireNotice } = response.data
        const index = window.location.href.search('/html')
        const href = window.location.href.substr(0, index)
        if (company.version === 1 && window.location.href.search('/standard.html') < 0) {
          window.open(`${href}/html/standard.html#/dashboard`, '_self')
        }
        if (company.version === 2 && window.location.href.search('/enterprise.html') < 0) {
          window.open(`${href}/html/enterprise.html#/dashboard`, '_self')
        }
        if (!user) {
          reject('登录过期,请重新登录')
        } else if (roles.length <= 0) {
          reject('该用户还未分配权限')
        }
        // console.log(window.location.href)
        // 判断是否弹出公众号二维码
        if (!user.wxIsFollow && !window.name) {
          setTimeout(() => {
            if (window.location.href.search('401') < 0 && window.location.href.search('404') < 0) {
              MessageBox.confirm(`<img src="http://${QRcode.data}" width="200px">`, '关注我们公众号,随时查看工作事项', {
                showCancelButton: false,
                showConfirmButton: false,
                dangerouslyUseHTMLString: true,
                center: true
              })
            }
          }, 200)
        }
        window.name = '不弹了'
        const needPermissions = response.data.allMenu.filter(item => { return item.isMenu }).map(item => item.name)
        const permissions = response.data.permissions.filter(item => { return item.isMenu }).map(item => item.name)
        const buttonPermissions = response.data.permissions.filter(item => { return !item.isMenu }).map(item => item.id)
        commit('SET_ROLES', roles)
        commit('SET_NAME', user.name)
        commit('SET_ID', user.id)
        commit('SET_PHONE', user.phone)
        commit('SET_PERMISSIONS', permissions)
        commit('SET_BUTTONPERMISSIONS', buttonPermissions)
        commit('SET_COMPANYLIST', companyList)
        commit('SET_COMPANY', company)
        commit('SET_LASTTIME', expireNotice)
        commit('SET_AVATAR', user.avatar)
        resolve({ needPermissions, permissions })
      }).catch(error => {
        reject(error)
      })
    })
  },
  // async getUser({ commit, state }) {
  //   const QRcode = await getQRCode()

  //   return new Promise((resolve, reject) => {
  //     getSession().then(response => {
  //       const { roles, user } = response.data
  //       if (!user) {
  //         reject('登录过期,请重新登录')
  //       } else if (roles.length <= 0) {
  //         reject('该用户还未分配权限')
  //       }
  //       // 判断是否弹出公众号二维码
  //       if (!user.wxIsFollow) {
  //         MessageBox.confirm(`<img src="http://${QRcode.data}" width="200px">`, '关注我们公众号,随时查看工作事项', {
  //           showCancelButton: false,
  //           showConfirmButton: false,
  //           dangerouslyUseHTMLString: true,
  //           center: true
  //         })
  //       }
  //       const permissions = response.data.permissions.filter(item => { return item.isMenu }).map(item => item.name)
  //       commit('SET_ROLES', roles)
  //       commit('SET_NAME', user.name)
  //       commit('SET_ID', user.id)
  //       commit('SET_PERMISSIONS', permissions)
  //       commit('SET_AVATAR', 'https://static.dingtalk.com/media/lADPDgQ9qgxE8pLNAlvNAls_603_603.jpg')
  //       resolve({ permissions })
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 模拟
      logout().then(() => {
        commit('SET_ROLES', [])
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  async getMsgTip({ commit }) {
    const result = await getNotMsg()
    if (result.code === 200) {
      const msgTip = !!result.data
      commit('SET_MSGTIP', { msgTip })
    }
  }
}

const getters = {
  showOutTime(state) {
    if (state.lastTime === 0) {
      return true
    } else {
      return false
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
