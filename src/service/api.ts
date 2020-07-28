import Vue from 'vue'

// 测试
// Vue.prototype.host = 'http://192.168.31.102:8080'
Vue.prototype.host = 'http://192.168.31.114:8080'

const API_BASE_PATH = `${Vue.prototype.host}`

const fullPath = (url: string): string => {
  return `${API_BASE_PATH}/${url}`
}

/**
 * API 请求地址
 */

export default {
  LOGIN: fullPath('uaa/oauth/login'), // 登录
  LOGOUT: fullPath('uaa/oauth/logout'), // 退出
  USER_INFO: fullPath('uaa/user/getUser'), // 登录用户信息
  VERIFICATION: fullPath('uaa/oauth/captcha'), // 验证码
  MODIFY_PASSWORD: fullPath('uaa/user/modifyPassword'), // 更新用户密码
  CASE_LIST: fullPath('recovery/doctorPhoto/adminPlatformPhotoLists'), // 病理列表
  CASE_IMAGE: fullPath('recovery/photo/getPhotoByMedicalNumber'), // 病例相关图片
  IMAGE_STREAM: fullPath('recovery/image/imageStream'), // 图片流
  MARK_LABEL_LIST: fullPath('recovery/photo/getGroupInfoByMedicalNumber'), // 刀痕标注列表
  RESULT_LABEL_LIST: fullPath('recovery/recoveryLabel/labelList'), // 复原结果标注列表
  PHOTO_ID: fullPath('recovery/photo/getPhotoByMedicalNumber'), // 通过病理号获取图片ID
  SLIDE_LIST: fullPath('recovery/image/getImageListNoCondition'), // 切片列表
  USER_LIST: fullPath('uaa/user/userList'), // 用户列表
  ROLE_LIST: fullPath('uaa/dict/list?type=sys_user_type'), // 用户角色列表
  HOSPITAL_LIST: fullPath('uaa/office/hospitalList'), // 医院列表
  ADD_NEW_USER: fullPath('uaa/user/addUser'), // 增加新用户
  DEL_USER: fullPath('uaa/user/deleteUser'), // 删除用户
  UPDATE_USER_INFO: fullPath('uaa/user/updateUser'), // 更新单个用户信息
  UPDATE_USERS_INFO: fullPath('uaa/user/updateUserBatch'), // 更新多个用户信息
  UPDATE_USER_PWD: fullPath('uaa/user/modifyPwd'), // 更新用户密码
  VERIFY_PWD: fullPath('uaa/user/validateUser'), // 验证密码
  DEL_SLIDES: fullPath('recovery/image/deleteImageByImageId'), // 删除切片
  ORGAN_LIST: fullPath('recovery/disease/getAllOrganList'), // 器官列表
  LABEL_LIST: fullPath('recovery/disease/getSingleOrganList'), // 标签列表
  UPDATE_LABEL: fullPath('recovery/disease/updateNewClassification'), // 更新标签
  ADD_LABEL: fullPath('recovery/disease/saveNewClassification'), // 添加标签
  DEL_LABEL: fullPath('recovery/disease/deleteBatchDiseaseData'), // 删除标签
  LINE_TYPE_LIST: fullPath('recovery/disease/getAllLines'), // 线型列表
  CASE_REPORT: fullPath('recovery/report/getMedicalMeasurementReport'), // 病理报告
  CASE_AREA_REPORT: fullPath('recovery/image/slideAreaIncludeSerialMarking'), // 病理报告附带面积
  CASE_REPORT_IMAGE: fullPath('recovery/image/imageStream'), // 病理报告中的图片
  CASE_RECOVERY_IMAGE: fullPath('recovery/image/pathByPolygon'), // 大体图
  SLIDE_PREVIEW_IMAGE: fullPath('recovery/image/slideDiagram'), // 切片预览图
  CASE_INFO: fullPath('recovery/doctorPhoto/getPhotoInfoByMedicalNumber'), // 病例信息
  REPORT_DIAGNOSIS: fullPath('recovery/image/slideSpecimen'), // 报告诊断结果
  UPDATE_CASE_REPORT_TEXT: fullPath('recovery/doctorPhoto/updatePhotoCervix'), // 更新病例报告文字内容
  SLIDE_INFO: fullPath('recovery/image/imageDetail'), // 切片信息
  SLIDE_DETAIL: fullPath('thoslide/detail'), // 切片详情
  DEEP_ZOOM_IMAGE: fullPath('thoslide'), // 切片 Tile 图
  KNIFE_MARKS: fullPath('path/group/getGroupDetailByMedicalNumber'), // 获取刀痕坐标数据
  RECOVERY_MARKS: fullPath('recovery/recoveryLabel/getNewRecoveryLabelList'), // 复原结果
  MEASURE_MARKS: fullPath('recovery/image/polygon'), // 获取大体图测距数据
  ANNOTATION_LIST: fullPath('recovery/slideLabel/listbypc'), // 标注数据
  SAVE_SLIDE_MEASURE_AREA: fullPath('recovery/slideLabel/multiSaveManualFromPc'), // 测量切片中区域面积
  DEL_SLIDE_MEASURE_AREA: fullPath('recovery/slideLabel/deleteByGuId'), // 删除切片测面积标记
  SLIDE_MEASURE_DISTANCE_LIST: fullPath('recovery/slideLabel/getAllDistanceFromPc'), // 获取切片中测距的数据
  SAVE_SLIDE_MESASURE_DISTANCE: fullPath('recovery/slideLabel/saveDistanceFromPc'), // 保存测距数据
  DEL_SLIDE_MESASURE_DISTANCE: fullPath('recovery/slideLabel/deleteDistanceFromPc'), // 删除测距数据
  GET_PATHOLOGICAL_INFORMATION: fullPath('recovery/patient/getPatientInfoByMedicalNumber'), // 查询病理信息
  SAVE_PATHOLOGICAL_INFORMATION: fullPath('recovery/patient/insertMorePatient'), // 保存病理信息
  GET_SCREENSHOT_LIST: fullPath('path/upload/queryPathByMRNumber'), // 获取截屏列表
  DEL_SCREENSHOT_ITEM: fullPath('path/upload/deletePicByPath'), // 删除单项截图
  GET_SCREENSHOT_DETAILS: fullPath('recovery/image/imageStream'), // 获取单个截图地址
  UPLOADING_SCREENSHOT_URL: fullPath('path/upload/uploadPic') // 上传截图地址
}
