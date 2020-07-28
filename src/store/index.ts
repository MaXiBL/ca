import Vue from 'vue'
import Vuex from 'vuex'

import { ErrorHandler, tokenName } from 'common'
import {
  GET_HOSPITAL_LIST,
  GET_ROLE_LIST
} from 'service'

Vue.use(Vuex)

interface InterfaceState {
  user: object,
  slideStat: {
    caseCount: number,
    slideCount: number
  },
  diskStat: {
    total: number,
    used: number,
    free: number,
    usePercent: number
  },
  hospitalList: any[],
  roleList: any[]
}

const state = {
  // 登录用户信息
  user: {},
  // 切片统计信息
  slideStat: {
    caseCount: 0,
    slideCount: 0
  },
  // 磁盘使用信息
  diskStat: {
    total: 0,
    used: 0,
    free: 0,
    usePercent: 0
  },
  // 医院列表
  hospitalList: [],
  // 角色列表
  roleList: []
}

const getters = {
  getUser (state: InterfaceState) {
    return state.user
  },
  getHospitalList (state: InterfaceState) {
    return state.hospitalList
  },
  getRoleList () {
    return state.roleList
  }
}

const mutations = {
  setUser (state: InterfaceState, user: object) {
    state.user = user
  },
  setHospitalList (state: InterfaceState, list: any[]) {
    state.hospitalList = list
  },
  setRoleList (state: InterfaceState, list: any[]) {
    state.roleList = list
  },
  clearAll (state: InterfaceState) {
    state.user = {}
    state.slideStat = {
      caseCount: 0,
      slideCount: 0
    }
    state.hospitalList = []
    window.localStorage.removeItem(tokenName)
  }
}

const actions = {
  // 请求医院列表
  requestHospitalList (context: any) {
    if (state.hospitalList.length === 0) {
      GET_HOSPITAL_LIST()
        .then((res: AxiosRes) => {
          if (res.data.success) {
            const list = res.data.data.hospitalList
            // 数据处理
            list.forEach((item: any) => {
              item.value = item.name
            })
            context.commit('setHospitalList', list)
          } else {
            ErrorHandler(res)
          }
        })
    }
  },
  // 请求角色列表
  requestRoleList (context: any) {
    if (state.roleList.length === 0) {
      GET_ROLE_LIST()
        .then((res: AxiosRes) => {
          if (res.data.success) {
            const list = res.data.data.userType
            // 数据处理
            list.forEach((item: any) => {
              item.id = item.label
            })
            context.commit('setRoleList', list)
          } else {
            ErrorHandler(res)
          }
        })
    }
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store
