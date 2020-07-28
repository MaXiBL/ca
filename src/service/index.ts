// 请求后端各种数据封装成函数
import API from 'api'
import http from 'myAxios'
import { ErrorHandler } from 'common'

// 获取数据
export const GET_JSON = async (url: string, params: object) => {
  return http.get(url, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 登录
export const LOGIN = async (params: object) => {
  return http.post(API.LOGIN, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 退出登录
export const LOGOUT = async () => {
  return http.post(API.LOGOUT).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取登录用户的信息
export const GET_USER_INFO = async () => {
  return http.get(API.USER_INFO).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取验证码
export const GET_VERIFICATION = async (params: object) => {
  return http.get(API.VERIFICATION, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 修改密码
export const MODIFY_PASSWORD = async (params: object) => {
  return http.post(API.MODIFY_PASSWORD, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取病例列表
export const GET_CASE_LIST = async (params: object) => {
  return http.get(API.CASE_LIST, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取刀痕标注列表
export const GET_MARK_LABEL_LIST = async (params: object) => {
  return http.get(API.MARK_LABEL_LIST, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取复原结果标注列表
export const GET_RESULT_LABEL_LIST = async (params: object) => {
  return http.get(API.RESULT_LABEL_LIST, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取图片ID
export const GET_PHOTO_ID = async (params: object) => {
  return http.get(API.PHOTO_ID, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取切片列表
export const GET_SLIDE_LIST = async (params: object) => {
  return http.get(API.SLIDE_LIST, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取用户列表
export const GET_USER_LIST = async (params: object) => {
  return http.get(API.USER_LIST, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取用户角色列表
export const GET_ROLE_LIST = async (params: object) => {
  return http.get(API.ROLE_LIST, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取医院列表
export const GET_HOSPITAL_LIST = async (params: object) => {
  return http.get(API.HOSPITAL_LIST, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 增加新用户
export const ADD_NEW_USER = async (params: object) => {
  return http.post(API.ADD_NEW_USER, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 删除用户
export const DEL_USER = async (params: object) => {
  return http.post(API.DEL_USER, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 更新单个用户信息
export const UPDATE_USER_INFO = async (params: object) => {
  return http.post(API.UPDATE_USER_INFO, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 更新多个用户信息
export const UPDATE_USERS_INFO = async (params: object) => {
  return http.post(API.UPDATE_USERS_INFO, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 更新用户密码
export const UPDATE_USER_PWD = async (params: object) => {
  return http.post(API.UPDATE_USER_PWD, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 验证密码
export const VERIFY_PWD = async (params: object) => {
  return http.post(API.VERIFY_PWD, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 删除切片
export const DEL_SLIDES = async (params: object) => {
  return http.post(API.DEL_SLIDES, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取器官列表
export const GET_ORGAN_LIST = async (params: object) => {
  return http.get(API.ORGAN_LIST, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取标签列表
export const GET_LABEL_LIST = async (params: object) => {
  return http.get(API.LABEL_LIST, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 更新标签
export const UPDATE_LABEL = async (params: object) => {
  return http.post(API.UPDATE_LABEL, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 添加标签
export const ADD_LABEL = async (params: object) => {
  return http.post(API.ADD_LABEL, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 删除标签
export const DEL_LABEL = async (params: object) => {
  return http.post(API.DEL_LABEL, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取线型列表
export const GET_LINE_TYPE_LIST = async (params: object) => {
  return http.get(API.LINE_TYPE_LIST, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取病理报告
export const GET_CASE_REPORT = async (params: object) => {
  return http.get(API.CASE_REPORT, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取切片预览图
export const GET_SLIDE_PREVIEW_IMAGE = async (params: object) => {
  return http.get(API.SLIDE_PREVIEW_IMAGE, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取病例诊断结果
export const GET_CASE_DIAGNOSIS_RESULT = async (params: object) => {
  return http.get(API.CASE_DIAGNOSIS_RESULT, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取病例信息
export const GET_CASE_INFO = async (params: object) => {
  return http.get(API.CASE_INFO, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 更新病例报告文字内容
export const UPDATE_CASE_REPORT_TEXT = async (params: object) => {
  return http.post(API.UPDATE_CASE_REPORT_TEXT, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取报告诊断结果
export const GET_REPORT_DIAGNOSIS = async (params: object) => {
  return http.get(API.REPORT_DIAGNOSIS, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取切片信息
export const GET_SLIDE_INFO = (params: object) => {
  return http.get(API.SLIDE_INFO, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取切片详细信息
export const GET_SLIDE_DETAIL = (params: object) => {
  return http.get(API.SLIDE_DETAIL, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取刀痕
export const GET_KNIFE_MARKS = (params: object) => {
  return http.get(API.KNIFE_MARKS, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取复原结果
export const GET_RECOVERY_MARKS = (params: object) => {
  return http.get(API.RECOVERY_MARKS, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取大体图测距结果
export const GET_MEASURE_MARKS = (params: object) => {
  return http.get(API.MEASURE_MARKS, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 获取切片的标注数据
export const GET_ANNOTATION_LIST = (params: object) => {
  return http.get(API.ANNOTATION_LIST, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 测量切片中区域的面积
export const SAVE_SLIDE_MEASURE_AREA = (params: object) => {
  return http.post(API.SAVE_SLIDE_MEASURE_AREA, params, {
    transformRequest: (data: object) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 删除切片中测面积的标注
export const DEL_SLIDE_MEASURE_AREA = (params: object) => {
  return http.post(API.DEL_SLIDE_MEASURE_AREA, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 保存切片中测距的标注
export const SAVE_SLIDE_MESASURE_DISTANCE = (params: object) => {
  return http.post(API.SAVE_SLIDE_MESASURE_DISTANCE, params, {
    transformRequest: (data: object) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

export const DEL_SLIDE_MESASURE_DISTANCE = (params: object) => {
  return http.post(API.DEL_SLIDE_MESASURE_DISTANCE, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}

export const GET_SLIDE_MEASURE_DISTANCE_LIST = (params: object) => {
  return http.get(API.SLIDE_MEASURE_DISTANCE_LIST, { params }).catch((err: AxiosErr) => { ErrorHandler(err) })
}

// 查询病理信息
export const GET_PATHOLOGICAL_INFORMATION = (params: object) => {
  return http.post(API.GET_PATHOLOGICAL_INFORMATION, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}
// 保存病理信息
export const SAVE_PATHOLOGICAL_INFORMATION = (params: object) => {
  return http.post(API.SAVE_PATHOLOGICAL_INFORMATION, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}
// 获取截屏列表
export const GET_SCREENSHOT_LIST = (params: object) => {
  return http.post(API.GET_SCREENSHOT_LIST, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}
// 删除截屏单项
export const DEL_SCREENSHOT_ITEM = (params: object) => {
  return http.post(API.DEL_SCREENSHOT_ITEM, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}
// 获取病例信息, 附带面积
export const GET_CASEAREA_INFO = async (params: object) => {
  return http.post(API.CASE_AREA_REPORT, params).catch((err: AxiosErr) => { ErrorHandler(err) })
}
