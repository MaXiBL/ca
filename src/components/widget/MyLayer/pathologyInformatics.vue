<template>
  <div class="ball-pathology" v-show="showPathology">
    <div class="case-edit">
      <div class="case-edit-top">
        <div>病例信息</div>
        <div class="case-head fork" @click='CancelPathology()'></div>
      </div>
      <div class="case-edit-middle">
        <div>
          <div>
            <span class="icon-red">*</span>
            <span>病理号</span>
          </div>
          <input disabled @blur="removeInput('medicalRecordNumber')" v-model.trim="CaseList.medicalRecordNumber" placeholder="请输入病理号" type="text">
        </div>
        <section v-show="errMedicalRecordNumber" class='errrorColor'>! 病理号不能为空或者超过20位</section>
        <div>
          <div>
            <span class="icon-red">*</span>
            <span>姓名</span>
          </div>
          <input @blur="removeInput('name')" v-model.trim="CaseList.name" placeholder="请输入姓名" type="text">
        </div>
        <section v-show="errName" class='errrorColor'>! 姓名不能为空,不能有特殊符号数字,不能超过20位</section>
        <div>
          <div>
            <span class="icon-red">*</span>
            <span>年龄</span>
          </div>
          <input @blur="removeInput('age')" v-model.trim.number="CaseList.age" placeholder="请输入年龄" type="text">
        </div>
        <section v-show="errAge" class='errrorColor'>! 年龄不能为空或者最多是三位数的数字</section>
        <div class="select-location">
          <div>
            <span>科室</span>
          </div>
          <input @blur="removeInput('department')" v-model.trim="CaseList.department" placeholder="请输入科室" type="text">
        </div>
        <section v-show="errDepartment" class='errrorColor'>! 科室不能超过20位</section>
        <div>
          <div>
            <span>住院号</span>
          </div>
          <input @blur="removeInput('hospitalNumber')" v-model.trim="CaseList.hospitalNumber" placeholder="请输入住院号" type="text">
        </div>
        <section v-show="errHospitalNumber" class='errrorColor'>! 住院号不能超过20位</section>
        <div>
          <div>
            <span>门诊号</span>
          </div>
          <input @blur="removeInput('outpatientServiceNumber')" v-model.trim="CaseList.outpatientServiceNumber" placeholder="请输入门诊号" type="text">
        </div>
        <section v-show="errOutpatientServiceNumber" class='errrorColor'>! 门诊号不能超过20位</section>
        <div class="select-location">
          <div>
            <span>送检日期</span>
          </div>
          <my-date class="data-stl"
            :placeholder="'选择开始入库日期'"
            :date="CaseList.inspectionTime"
            @select-date='SelectDate'>
          </my-date>
        </div>
      </div>
      <div class="case-edit-floor">
        <div class="case-head" @click="SavePathology()">确认</div>
        <div class="case-head" @click='CancelPathology()'>取消</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import layer from 'layer'
import {
  SAVE_PATHOLOGICAL_INFORMATION
} from 'service'

import MyDate from 'widget/MyDate/index.vue'

interface CaseList {
  medicalRecordNumber: string, // 病例号
  name: string, // 姓名
  age: any, // 年龄
  department: string, // 科室
  hospitalNumber: string, // 住院号
  outpatientServiceNumber: string, // 门诊号
  inspectionTime: string // 送检时间
}

@Component({
  components: {
    MyDate
  }
})
export default class LayerAddNewUser extends Vue {
  @Prop({ type: Object, default: {} })
  pathologhItem!: any

  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }

  showPathology: boolean = false
  errMedicalRecordNumber: boolean = false
  errName: boolean = false
  errAge: boolean = false
  errDepartment: boolean = false
  errHospitalNumber: boolean = false
  errOutpatientServiceNumber: boolean = false
  unableSubmit: boolean = false // 是否可以提交

  CaseList: CaseList = {
    medicalRecordNumber: '', // 病例号
    name: '', // 姓名
    age: '', // 年龄
    department: '', // 科室
    hospitalNumber: '', // 住院号
    outpatientServiceNumber: '', // 门诊号
    inspectionTime: '' // 送检时间
  }

  mounted () {
    this.$on('ShowPathology', () => {
      this.$nextTick(() => {
        this.CaseList = { ...this.pathologhItem }
        this.initError()
        this.showPathology = true
      })
    })
  }
  // 点击病例信息取消
  CancelPathology () {
    this.showPathology = false
  }
  // 点击保存病例信息
  async SavePathology () {
    this.removeInput()
    if (this.unableSubmit) {
      const res = await SAVE_PATHOLOGICAL_INFORMATION({
        ...this.CaseList
      })
      if (res.data.success) {
        layer.msg('保存成功')
        this.showPathology = false
      } else {
        layer.msg('保存失败')
      }
    }
  }
  // 初始化错误信息
  initError () {
    this.errMedicalRecordNumber = false
    this.errName = false
    this.errAge = false
    this.errDepartment = false
    this.errHospitalNumber = false
    this.errOutpatientServiceNumber = false
  }
  // 验证
  removeInput (val?: string) {
    this.initError()
    this.unableSubmit = false
    let num = 0
    if (this.CaseList.medicalRecordNumber.length > 20 || this.CaseList.medicalRecordNumber === '') {
      this.errMedicalRecordNumber = true
      num++
    }
    if ((this.CaseList.name.length > 20 || this.CaseList.name === '' || this.CharacterCheck(this.CaseList.name))) {
      this.errName = true
      num++
    }
    if ((this.CaseList.age === '' || this.CaseList.age > 999 || !(/^[0-9]*$/).test(this.CaseList.age))) {
      this.errAge = true
      num++
    }
    if (this.CaseList.department.length > 20) {
      this.errDepartment = true
      num++
    }
    if (this.CaseList.hospitalNumber.length > 20) {
      this.errHospitalNumber = true
      num++
    }
    if (this.CaseList.outpatientServiceNumber.length > 20) {
      this.errOutpatientServiceNumber = true
      num++
    }
    if (num === 0) {
      this.initError()
      this.unableSubmit = true
    }
  }
  // 特殊字符校验
  CharacterCheck (newName: any) {
    const regEn = /[`~1234567890_!@#$%^&*()_+<>?:"{},./;'[\]]/im
    const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
    if (regEn.test(newName) || regCn.test(newName)) {
      return true
    }
    return false
  }
  // 选择日期
  SelectDate (val: string) {
    this.CaseList.inspectionTime = val
  }
}
</script>

<style lang="less" scoped>
.ball-pathology {
  position: fixed;
  margin: -0.3rem;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0 ,0, 0.35);
  z-index: 2;
  .case-edit-middle .errrorColor {
    padding-left: 1.2rem;
    height: 0.3rem;
    line-height: 0.3rem;
    font-size: 0.12rem;
    color: red;
  }
  .case-edit {
    width: 6.20rem;
    height: auto;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .case-head {
      cursor: pointer;
    }
    .fork {
      background: url('./img/icon_close.png');
      width: 0.22rem;
      height: 0.22rem;
      background-size: 100% 100%;
    }
    .case-edit-top {
      font-size: 0.28rem;
      color: #333333;
      height: 1rem;
      margin: 0 0.4rem;
      border-bottom: 0.02rem solid #EFEFEF;
      div {
        float: left;
      }
      :first-child {
        line-height: 1rem;
      }
      :last-child {
        float: right;
        margin-top: 0.35rem;
        color: #B5B5B5;
        font-size: 0.3rem;
      }
    }
    .case-edit-middle {
      width: 5.4rem;
      height: auto;
      margin: 0 0.4rem;
      .select-location {
        position: relative;
      }
      & > div {
        width: 5.4rem;
        height: 0.7rem;
        font-size: 0.24rem;
        color: #666666;
        margin: 0.3rem 0;
        & > div {
          float: left;
          line-height: 0.75rem;
          vertical-align: middle;
          .icon-red {
            color: #D57DA7;
          }
        }
        input {
          float: right;
          height: 0.7rem;
          width: 4.1rem;
          border: 0.02rem solid #EFEFEF;
          padding-left: 0.22rem;
          outline: none;
          // color: #999;
        }
        input::-webkit-input-placeholder { /* WebKit browsers 适配谷歌 */
          color: #999999;
          font-size: 0.24rem;
        }
        input:-moz-placeholder { /* Mozilla Firefox 4 to 18 适配火狐 */
            color: #999999;
            font-size: 0.24rem;
        }
        input::-moz-placeholder { /* Mozilla Firefox 19+ 适配火狐 */
            color: #999999;
            font-size: 0.24rem;
        }
        input:-ms-input-placeholder { /* Internet Explorer 10+  适配ie*/
            color: #999999;
            font-size: 0.24rem;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
            display: inline-block;
            width: 15px;
            height: 15px;
            position: absolute;
          //  top: 12px;
            right: 0.15rem;
          // border: 1px solid #D57DA7;
          // border-radius: 2px;
          // box-shadow: inset 0 1px #D57DA7, 0 1px #eee;
          // background-color: #D57DA7;
          // /* background:url('../images/icon.png') -188px -99px; */
          background-image: url('~assets/images/report/data-icon.png');
          // color: red;
        }
        input[type="date"]::-webkit-datetime-edit {
          color: #999999;
          font-size: 0.24rem;
        }
        .data-stl {
          float: right;
          padding-left: 0rem;
          height: 100%;
          width: 4.38rem;
          border: 0.02rem solid #efefef;
          border-radius: 0.04rem;
          // box-sizing: border-box;
          font-size: 0.24rem;
          font-weight: normal;
          line-height: 0.7rem;
          text-align: left;
          color: #666;
        }
        select {
          width: 4.39rem;
          height: 0.7rem;
          float: right;
          border: 0.02rem solid #EFEFEF;
          outline: none;
          padding-left: 0.18rem;
          appearance:none;
          -moz-appearance:none;
          -webkit-appearance:none;
        }
      }
    }
    .case-edit-floor {
      width: 100%;
      height: 1rem;
      margin-top: 0.4rem;
      & > div {
        width: 1.8rem;
        height: 0.66rem;
        float: left;
        font-size: 0.26rem;
        text-align: center;
        line-height: 0.66rem;
        border-radius: 1rem;
        margin-top: 0rem;
      }
      :first-child {
        margin: 0 0rem 0 0.94rem;
        background-color: #D57DA7;
        color: #fff;
        &:hover{
          background-color: #DF92B7;
          box-shadow: 0 0.02rem 0.2rem rgba(223,146,183,0.53);
        }
        &.active{
          background-color: #D6709D;
        }
      }
      :last-child {
        color: #666666;
        border: 0.01rem solid #E5E5E5;
        margin-left: 0.8rem;
        &:hover{
          background-color: #E5E5E5;
          box-shadow: 0 0.02rem 0.2rem  rgba(194, 194, 194, 0.35);
        }
        &:active{
          background-color: #D0CFCF;
        }
      }
    }
  }
}
</style>
