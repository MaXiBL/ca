<template>
  <div class="report-preview">
    <div class="report-content">
      <div class="header" v-if="!printStatus">
        <i class="btn-back" @click="goBack()"></i>
        <span class="btn-generate-report" @click="PrintReport()">下载 pdf</span>
      </div>
      <div class="body" id="report-main-content">
        <div class="body-header">
          <div class="title-container">
            <img src="~assets/images/report/peking-icon.png" alt="">
            <div class="total-title">
              <p>北京大学第一医院</p>
              <p class="title">宫颈锥切病理报告单</p>
            </div>
            <qrcode-vue class="qrcode" :value='qrcodeUrl' :size='89'></qrcode-vue>
            <!-- <img src="~assets/images/report/qr-code.png" alt=""> -->
            <img src="~assets/images/navbar/logo2.png" alt="" class="logo">
          </div>
          <span class="inspect-date">送检日期: {{inspectionTime}}</span>
          <span class="caseNum">病理号: {{caseNum}}</span>
        </div>
        <div class="basic-information">
          <div>
            <span class="basics-top">姓名: {{name}}</span>
            <span class="basics-bottom">{{`院别: 本院`}}</span>
          </div>
          <div>
            <span class="basics-top">{{`性别: 女`}}</span>
            <span class="basics-bottom">科室: {{department}}</span>
          </div>
          <div>
            <span class="basics-top">年龄: {{age}}</span>
          </div>
          <div>
            <span class="basics-top">住院号: {{hospitalNumber}}</span>
            <span class="basics-bottom">门诊号: {{outpatientServiceNumber}}</span>
          </div>
        </div>
        <div class="body-content">
          <div class="pedigree-chart-container">
            <h4 class="title">谱系图:</h4>
            <div class="image-container">
              <image-render ref="image-render" :caseNum="caseNum" :showMarks="false" :showOperation="false"></image-render>
            </div>
          </div>
          <div class="preview-container">
            <h4 class="title">切片概览:</h4>
            <div class="image-list">
              <div class="list-item"
                v-for="(item, index) in slideImageGroupList"
                :key="index">
                <div class="img-group-container" :class="{'warn': item.some(slideImage => slideImage.isCancer === 1)}">
                  <div class="img-container"  v-for="(child, childIndex) in item" :key="childIndex">
                    <img src="" alt="" :id="`preview-${index}-${childIndex}`">
                  </div>
                </div>
                <div class="text-group-container">
                  <div class="text-container" v-for="(child, childIndex) in item" :key="childIndex">
                    <span class="img-index">{{child.index}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="diseased-slide-container">
            <h4 class="title">截图:</h4>
            <div class="image-list">
              <div class="list-item"
                v-for="(item) in screenshotList"
                :key="item.id">
                <div class="img-container">
                  <img :src="`${screenshotUrl}?path=${item.path}`" alt="" :id="item.id">
                </div>
                <div class="text-container">
                  <span class="img-index_t">{{item.slideNumber}}</span>
                  <span class="img-index_f">{{item.message}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="diagnosis-container">
            <h4 class="title">病理诊断:</h4>
            <div class="content-container">
              <div class="text-row" v-for="(item, index) in diagnosisList" :key="index">
                {{item}}
              </div>
              <div :style="{'width': '100%', 'height': reservedHeiget}"></div>
            </div>
          </div>
          <div v-if="clickPrint" class="body-footer">
            <div class="report-date_l">诊断日期: {{reportDate}}</div>
            <div class="report-date_m">{{`(1/${pageNumber})`}}</div>
            <div class="report-date_r">诊断医生: {{getDoctor}}</div>
          </div>
            <div v-if="!clickPrint" class="diagnosis-container">
              <h4 class="title">免疫组化:</h4>
              <div class="content">{{immunohistochemical}}</div>
            </div>
            <div v-if="!clickPrint" class="diagnosis-container">
              <h4 class="title">备注:</h4>
              <div class="content">{{remark}}</div>
            </div>
          <div v-if="clickPrint">
            <div class="body-header">
              <div class="title-container">
                <img src="~assets/images/report/peking-icon.png" alt="">
                <div class="total-title">
                  <p>北京大学第一医院</p>
                  <p class="title">宫颈锥切病理报告单</p>
                </div>
                <qrcode-vue class="qrcode" :value='qrcodeUrl' :size='89'></qrcode-vue>
                <!-- <img src="~assets/images/report/qr-code.png" alt=""> -->
                <img src="~assets/images/navbar/logo2.png" alt="" class="logo">
              </div>
              <span class="inspect-date">送检日期: {{inspectionTime}}</span>
              <span class="caseNum">病理号: {{caseNum}}</span>
            </div>
            <div class="basic-information">
            <div>
              <span class="basics-top">姓名: {{name}}</span>
              <span class="basics-bottom">{{`院别: 本院`}}</span>
            </div>
            <div>
              <span class="basics-top">{{`性别: 女`}}</span>
              <span class="basics-bottom">科室: {{department}}</span>
            </div>
            <div>
              <span class="basics-top">年龄: {{age}}</span>
            </div>
            <div>
              <span class="basics-top">住院号: {{hospitalNumber}}</span>
              <span class="basics-bottom">门诊号: {{outpatientServiceNumber}}</span>
            </div>
          </div>
            <div class="diagnosis-container">
              <!-- <h4 class="title">病理诊断:</h4> -->
              <div class="content-container">
                <div class="text-row" v-for="(item, index) in tmpArray" :key="index">
                  {{item}}
                </div>
              </div>
            </div>
            <div v-if="pageNumber === 2" class="diagnosis-container">
              <h4 class="title">免疫组化:</h4>
              <div class="content">{{immunohistochemical}}</div>
            </div>
            <div v-if="pageNumber === 2" class="diagnosis-container">
              <h4 class="title">备注:</h4>
              <div class="content">{{remark}}</div>
            </div>
            <div :style="{'margin-top': secondBottom}" class="body-footer">
              <div class="report-date_l">诊断日期: {{reportDate}}</div>
              <div class="report-date_m">{{`(2/${pageNumber})`}}</div>
              <div class="report-date_r">诊断医生: {{getDoctor}}</div>
            </div>
          </div>
          <div v-if="clickPrint && pageNumber === 3">
            <div class="body-header">
              <div class="title-container">
                <img src="~assets/images/report/peking-icon.png" alt="">
                <div class="total-title">
                  <p>北京大学第一医院</p>
                  <p class="title">宫颈锥切病理报告单</p>
                </div>
                <!-- <img src="~assets/images/report/qr-code.png" alt=""> -->
                <qrcode-vue class="qrcode" :value='qrcodeUrl' :size='89'></qrcode-vue>
                <img src="~assets/images/navbar/logo2.png" alt="" class="logo">
              </div>
              <span class="inspect-date">送检日期: {{inspectionTime}}</span>
              <span class="caseNum">病理号: {{caseNum}}</span>
            </div>
            <div class="basic-information">
            <div>
              <span class="basics-top">姓名: {{name}}</span>
              <span class="basics-bottom">{{`院别: 本院`}}</span>
            </div>
            <div>
              <span class="basics-top">{{`性别: 女`}}</span>
              <span class="basics-bottom">科室: {{department}}</span>
            </div>
            <div>
              <span class="basics-top">年龄: {{age}}</span>
            </div>
            <div>
              <span class="basics-top">住院号: {{hospitalNumber}}</span>
              <span class="basics-bottom">门诊号: {{outpatientServiceNumber}}</span>
            </div>
          </div>
            <div class="diagnosis-container">
              <!-- <h4 class="title">病理诊断:</h4> -->
              <div class="content-container">
                <div class="text-row" v-for="(item, index) in tmpThreeArray" :key="index">
                  {{item}}
                </div>
              </div>
            </div>
            <div class="diagnosis-container">
              <h4 class="title">免疫组化:</h4>
              <div class="content">{{immunohistochemical}}</div>
            </div>
            <div class="diagnosis-container">
              <h4 class="title">备注:</h4>
              <div class="content">{{remark}}</div>
            </div>
            <div :style="{'margin-top': thirdlyBottom}" class="body-footer">
              <div class="report-date_l">诊断日期: {{reportDate}}</div>
              <div class="report-date_m">{{`(3/${pageNumber})`}}</div>
              <div class="report-date_r">诊断医生: {{getDoctor}}</div>
            </div>
          </div>
        </div>
        <div id="flag" v-if="!clickPrint" class="body-footer">
          <div class="report-date_l">诊断日期: {{reportDate}}</div>
          <div class="report-date_r">诊断医生: {{getDoctor}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'

import { ErrorHandler, getImage, tokenName } from 'common'
import QrcodeVue from 'qrcode.vue'
import API from 'api'
import {
  GET_CASE_INFO,
  GET_USER_INFO,
  GET_PATHOLOGICAL_INFORMATION,
  GET_SCREENSHOT_LIST,
  GET_CASEAREA_INFO
} from 'service'

import imageRender from './imageRender.vue'

@Component({
  components: {
    imageRender,
    QrcodeVue
  }
})
export default class PreviewReport extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  @Prop({ type: String, default: '' })
  caseNum!: string

  @Prop({ type: Array, default: () => [] })
  slideImageGroupList!: any[]

  @Prop({ type: Array, default: () => [] })
  slideDiseasedImageList!: any[]

  diagnosisList: string[] = []
  immunohistochemical: string = ''
  remark: string = ''
  printStatus: boolean = false

  getDoctor: string = '' // 诊断医生
  medicalRecordNumber: string = '' // 病例号
  name: string = '' // 姓名
  age: string = '' // 年龄
  department: string = '' // 科室
  hospitalNumber: string = '' // 住院号
  outpatientServiceNumber: string = '' // 门诊号
  inspectionTime: string = '' // 送检时间

  screenshotList: any = [] // 截图列表
  clickPrint: boolean = false // 第二页数据的显示否
  tmpArray: any = [] // 超出病理信息显示
  tmpThreeArray: any = [] // 超出病理信息显示
  reservedHeiget: any = '' // 病理信息条数比较小时预留的空间
  screenshotUrl: string = API.GET_SCREENSHOT_DETAILS
  saveOldList: any = ''
  secondBottom: string = '' // 第二张地步高度
  thirdlyBottom: any = '' // 第三张地步高度
  pageNumber: any = 1 // 打印页数
  qrcodeUrl: string = '202012345678' // 二维码地址
  // 报告日期
  get reportDate () {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}.${month}.${day}`
  }

  @Watch('caseNum')
  onCaseNumChange () {
    this.GetCaseRecoveryImage()
    this.GetCaseReportDiagnosis()
  }
  @Watch('slideImageGroupList')
  onSlideImageGroupList (newVal: any, oldVal: any) {
    this.$nextTick(() => {
      this.RenderSlideImage()
    })
  }

  @Watch('slideDiseasedImageList')
  onSlideDiseasedImageList (newVal: any, oldVal: any) {
    this.$nextTick(() => {
      this.RenderSlideDiseasedImage()
    })
  }

  mounted () {
    this.RenderSlideImage()
    this.RenderSlideDiseasedImage()
    this.GetCaseRecoveryImage()
    this.GetCaseReportDiagnosis()

    this.GetUser()
    this.GetScreenshotList()
  }

  monitor () {
    this.clickPrint = false
    this.diagnosisList = this.saveOldList
    this.reservedHeiget = '0'
  }

  // 打印相关信息
  async GetUser () {
    const user = await GET_USER_INFO()
    this.getDoctor = user.data.data.name
    const res = await GET_PATHOLOGICAL_INFORMATION({
      medicalRecordNumber: this.caseNum
    })
    const data = res.data.data.info
    this.medicalRecordNumber = data.medicalRecordNumber // 病例号
    this.name = data.name // 姓名
    this.age = data.age // 年龄
    this.department = data.department // 科室
    this.hospitalNumber = data.hospitalNumber // 住院号
    this.outpatientServiceNumber = data.outpatientServiceNumber // 门诊号
    if (data.inspectionTime) {
      const time = new Date(data.inspectionTime)
      this.inspectionTime = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}` // 送检时间
    }
  }
  // 获取截屏列表
  GetScreenshotList () {
    this.$nextTick(async () => {
      const res = await GET_SCREENSHOT_LIST({
        medicalRecordNumber: this.caseNum
      })
      this.screenshotList = res.data.data.picDetail
    })
  }
  goBack () {
    this.$router.go(-1)
  }
  // 渲染所有切片缩略图
  RenderSlideImage () {
    this.slideImageGroupList.forEach((group: any, groupIndex: number) => {
      group.forEach((child: any, childIndex: number) => {
        const url = `${API.IMAGE_STREAM}?path=${child.path}`
        const token = window.localStorage.getItem(tokenName) || ''
        const el = document.getElementById(`preview-${groupIndex}-${childIndex}`)
        getImage(url, '', token, el)
      })
    })
  }
  RenderSlideDiseasedImage () {
    this.slideDiseasedImageList.forEach((item: any, index: number) => {
      const url = `${API.IMAGE_STREAM}?path=${item.path}`
      const token = window.localStorage.getItem(tokenName) || ''
      const el = document.getElementById(`diseased-${index}`)
      getImage(url, '', token, el)
    })
  }
  // 获取复原图
  GetCaseRecoveryImage () {
    const url = `${API.CASE_RECOVERY_IMAGE}?medicalRecordNumber=19-2505`
    const token = window.localStorage.getItem(tokenName) || ''
    const el = this.$refs['case-recovery-image']
    getImage(url, '', token, el)
  }
  // 获取病例报告文字内容(标本诊断,免疫组化,备注)
  GetCaseReportDiagnosis () {
    GET_CASEAREA_INFO({
      medicalRecordNumber: this.caseNum
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const caseInfo = res.data.data
        if (caseInfo) {
          let diagnosis = caseInfo.specimen.trim() || '无'
          if (diagnosis) {
            diagnosis = diagnosis.replace(/, /g, '')
            this.diagnosisList = diagnosis.split('\n')
          } else {
            this.diagnosisList = ['暂无诊断结果']
          }
          this.immunohistochemical = caseInfo.immunohistochemical || '无'
          this.remark = caseInfo.remark || '无'
        }
      } else {
        ErrorHandler(res)
      }
    })
  }

  // 打印报告
  PrintReport () {
    if ($('#flag').get(0).offsetTop + $('.body-footer').get(0).offsetHeight + 520 > 2740) {
      this.pageNumber = 3
    } else {
      this.pageNumber = 2
    }
    // 1335px 35px
    this.clickPrint = true
    if (this.pageNumber === 2) {
      this.tmpArray = []
      for (let i = 0; i < this.diagnosisList.length; i++) {
        if ($('.text-row').eq(i).get(0).offsetTop + $('.text-row').eq(i).get(0).offsetHeight + 160 > 1370) {
          this.tmpArray.push($('.text-row').eq(i).get(0).innerText)
        }
      }
      this.saveOldList = [...this.diagnosisList]
      this.diagnosisList.length = this.diagnosisList.length - this.tmpArray.length
      if (this.tmpArray.length > 0) {
        if (this.diagnosisList.length === 0) {
          this.reservedHeiget = 1370 - ($('.text-row').eq(0).get(0).offsetTop + 160) + 'px'
        } else {
          this.reservedHeiget = 1370 - ($('.text-row').eq(this.diagnosisList.length - 1).get(0).offsetTop + $('.text-row').eq(this.diagnosisList.length - 1).get(0).offsetHeight + 160) + 'px'
        }
      } else {
        this.reservedHeiget = 1370 - ($('.text-row').eq(this.diagnosisList.length - 1).get(0).offsetTop + $('.text-row').eq(this.diagnosisList.length - 1).get(0).offsetHeight + 160) + 'px'
      }
      this.secondBottom = 2740 - ($('.text-row').eq(this.saveOldList.length - 1).get(0).offsetTop + $('.text-row').eq(this.saveOldList.length - 1).get(0).offsetHeight + $('.diagnosis-container').eq(1).get(0).offsetHeight + $('.diagnosis-container').eq(2).get(0).offsetHeight + 680 + (this.reservedHeiget.substr(0, this.reservedHeiget.length - 2) - 0)) + 'px'
    }

    if (this.pageNumber === 3) {
      this.tmpArray = []
      this.tmpThreeArray = []
      for (let i = 0; i < this.diagnosisList.length; i++) {
        if ($('.text-row').eq(i).get(0).offsetTop + $('.text-row').eq(i).get(0).offsetHeight + 780 > 2740) {
          this.tmpThreeArray.push($('.text-row').eq(i).get(0).innerText)
          continue
        }
        if ($('.text-row').eq(i).get(0).offsetTop + $('.text-row').eq(i).get(0).offsetHeight + 160 > 1370) {
          this.tmpArray.push($('.text-row').eq(i).get(0).innerText)
        }
      }
      this.saveOldList = [...this.diagnosisList]
      this.diagnosisList.length = this.diagnosisList.length - this.tmpArray.length - this.tmpThreeArray.length
      if (this.tmpArray.length > 0) {
        if (this.diagnosisList.length === 0) {
          this.reservedHeiget = 1370 - ($('.text-row').eq(0).get(0).offsetTop + 160) + 'px'
        } else {
          this.reservedHeiget = 1370 - ($('.text-row').eq(this.diagnosisList.length - 1).get(0).offsetTop + $('.text-row').eq(this.diagnosisList.length - 1).get(0).offsetHeight + 160) + 'px'
        }
      } else {
        this.reservedHeiget = 1370 - ($('.text-row').eq(this.diagnosisList.length - 1).get(0).offsetTop + $('.text-row').eq(this.diagnosisList.length - 1).get(0).offsetHeight + 160) + 'px'
      }

      if (this.tmpThreeArray.length === 0) {
        this.secondBottom = 2740 - ($('.text-row').eq(this.saveOldList.length - 1).get(0).offsetTop + $('.text-row').eq(this.saveOldList.length - 1).get(0).offsetHeight + 628 + (this.reservedHeiget.substr(0, this.reservedHeiget.length - 2) - 0)) + 'px'
        this.thirdlyBottom = 4110 - 2740 - 230 - 130 - 150 - ($('.diagnosis-container').eq(1).get(0).offsetHeight + $('.diagnosis-container').eq(2).get(0).offsetHeight) + 'px'
      } else {
        this.secondBottom = 2740 - ($('.text-row').eq(this.diagnosisList.length + this.tmpArray.length - 1).get(0).offsetTop + $('.text-row').eq(this.diagnosisList.length + this.tmpArray.length - 1).get(0).offsetHeight + 628 + (this.reservedHeiget.substr(0, this.reservedHeiget.length - 2) - 0)) + 'px'
        this.thirdlyBottom = 4110 - 2740 - 230 - 130 - 420 - ($('.diagnosis-container').eq(1).get(0).offsetHeight + $('.diagnosis-container').eq(2).get(0).offsetHeight) + 'px'
      }
    }

    this.printStatus = true
    const pageTitle = document.title
    document.title = `病理报告-${this.caseNum}-${this.reportDate}`
    this.$nextTick(() => {
      // this.$refs['image-render'].$emit('StartPrint', 'scroll')
      window.print()
      this.monitor()
      this.printStatus = false
      document.title = pageTitle
    })
  }
}
</script>

<style lang="less" scoped>
.report-preview{
  width: 100%;
  height: auto;
  background-color: #F1F2F7;
  .report-content{
    position: relative;
    margin: 0 auto;
    padding:0;
    width: 960px;
    height: auto;
    box-sizing: border-box;
    background-color: #fff;
    .header{
      position: fixed;
      z-index: 999;
      top: 20px;
      // left: 0;
      padding: 0 15px;
      width: 960px;
      height: 35px;
      box-sizing: border-box;
      .btn-back{
        float: left;
        width:28px;
        height:28px;
        background:rgba(232,232,232,1);
        box-shadow:0px 1px 9px 0px rgba(181,106,155,0.1);
        border-radius: 50%;
        background-repeat: no-repeat;
        background-size: 7px 13px;
        background-position: 10px center;
        background-image: url('~assets/images/report/icon_arrow_left.png');
        cursor: pointer;
        &:hover{
          background-color: #D57DA7;
          background-image: url('~assets/images/report/icon_arrow_left_active.png');
        }
        &:active{
          background-color: #B56A9B;
        }
      }
      .btn-generate-report{
        float: right;
        width: 85px;
        height: 35px;
        border-radius: 18px;
        font-size: 13px;
        font-weight:400;
        color: #D57DA7;
        line-height: 35px;
        text-align: center;
        cursor: pointer;
        background:rgba(255,255,255,1);
        border:1px solid rgba(213,125,167,1);
        box-shadow:0px 1px 9px 0px rgba(213,125,167,0.31);
        &:hover{
          background-color: #D57DA7;
          box-shadow:0px 1px 10px 0px rgba(170,77,138,0.54);
          color:rgba(255,255,255,1);
        }
        &:active{
          background-color: #B56A9B;
          box-shadow:0px 1px 10px 0px rgba(170,77,138,0.54);
          color:rgba(255,255,255,1);
        }
      }
    }
    .body{
      padding: 0 25px;
      width: 100%;
      height: auto;
      box-sizing: border-box;
      // background-color: skyblue;
      .body-header{
        position: relative;
        padding: 1px 0 0 0;
        width: auto;
        height: 230px;
        box-sizing: border-box;
        border-bottom: 1px solid #E5E5E5;
        // background-color: skyblue;
        .title-container{
          margin: 35px auto 0;
          padding: 0;
          width: 686px;
          height: 135px;
          // position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          // transform: translateX(-86px);
          img, .qrcode {
            // float: left;
            display: flex;
            // position: absolute;
            align-items: center;
            justify-content: center;
            // top: 15px;
          }
          & img:nth-child(1) {
            width: 105px;
            height: 105px;
            // top: 7px;
          }
          & img:nth-child(3) {
            width: 89px;
            height: 89px;
            // top: 1px;
          }
          & img:nth-child(4) {
            width: 84px;
            height: 92px;
            // top: 11px;
          }
          .total-title {
            // position: absolute;
            width: 325px;
            height: 100%;
            // justify-content: ceenter;
            p {
              width: 100%;
              height: 50%;
              margin: 0;
              text-align: center;
              font-family:Kaiti SC;
            }
            :first-child {
              font-size: 36px;
              color: #990000;
              padding-top: 7%;
            }
            :last-child {
              line-height: 0;
              font-size: 30px;
              color: rgba(51,51,51,1);
            }
          }
          .logo{
            float: left;
            margin-right: 21px;
            width: 151px;
            height: 59px;
          }
          .title{
            float: left;
            margin: 0;
            padding: 0;
            font-size: 28px;
            font-weight:500;
            color:rgba(51,51,51,1);
            line-height: 59px;
          }
        }
        .caseNum{
          position: absolute;
          bottom: 22px;
          right: 0;
          width: auto;
          height: 17px;
          font-size: 17px;
          // font-weight:500;
          color:rgba(51,51,51,1);
          line-height: 17px;
        }
        .inspect-date{
          position: absolute;
          bottom: 22px;
          left: 0;
          width: auto;
          height: 17px;
          font-size: 17px;
          // font-weight:500;
          color:rgba(51,51,51,1);
          line-height: 17px;
        }
      }
      .basic-information {
        position: relative;
        padding: 1px 0 0 0;
        width: auto;
        height: 130px;
        box-sizing: border-box;
        border-bottom: 1px solid #E5E5E5;
        display: flex;
        font-size: 21px;
        color: #333333;
        & > div {
          flex: 1;
          display: flex;
          flex-direction: column;
          .basics-top {
            flex: 1;
            margin-top: 23.94px;
            // line-height: 75px;
          }
          .basics-bottom {
            flex: 1;
            margin-bottom: 5px;
            // line-height: 30px;
          }
        }
      }
      .body-content{
        padding-bottom: 0.5rem;
        width: 100%;
        height: auto;
        // background-color: grey;
        &::after{
          content: '';
          display: block;
          clear: both;
        }
        .pedigree-chart-container{
          float: left;
          width: 448px;
          height: 386px;
          .title{
            margin: 0;
            padding: 10px 0 0 0;
            font-size: 23px;
            font-weight: 500;
            color:rgba(51,51,51,1);
            line-height: 45px;
          }
          .image-container{
            position: relative;
            width: 100%;
            height: 338px;
            border: 2px solid #dcdcdc;
            border-radius: 5px;
            box-sizing: border-box;
            // background-color: skyblue;
            img{
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              display: block;
              width: auto;
              height: auto;
              max-width: 100%;
              max-height: 100%;
            }
          }
        }
        .preview-container{
          float: right;
          width: 448px;
          height: 386px;
          .title{
            margin: 0;
            padding: 10px 0 0 0;
            font-size: 23px;
            font-weight: 500;
            color:rgba(51,51,51,1);
            line-height: 45px;
          }
          .image-list{
            padding: 13px 15px 0;
            width: 100%;
            height: 338px;
            border: 2px solid #dcdcdc;
            border-radius: 5px;
            box-sizing: border-box;

            .list-item{
              float: left;
              margin: 0 6px;
              padding: 0;
              height: auto;
              width: 126px;

              .img-group-container{
                width: 100%;
                height: 126px;
                border: 1px solid #E5E5E5;
                box-sizing: border-box;
                &.warn{
                  border-color: #FF5961;
                }
                .img-container{
                  float: left;
                  position: relative;
                  width: 50%;
                  height: 100%;
                  background-color: #F4F4F4;
                  cursor: pointer;
                  img{
                    display: block;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    max-width: 100%;
                    max-height: 100%;
                  }
                }
              }
              .text-group-container{
                width: auto;
                height: auto;
                // border-left: 0.02rem solid #E5E5E5;
                // border-right: 0.02rem solid #E5E5E5;
                // box-sizing: border-box;

                .text-container{
                  float: left;
                  margin: 0;
                  padding: 0;
                  width: 50%;
                  height: 100%;
                  .img-index{
                    display: block;
                    margin: auto;
                    width: 0.5rem;
                    height: 100%;
                    font-size: 17px;
                    font-weight:500;
                    color:rgba(51,51,51,1);
                    line-height: 30px;
                    text-align: center;
                  }
                }
              }
            }
          }
        }
        .diseased-slide-container{
          clear: both;
          width: 100%;
          height: auto;
          .title{
            margin: 0;
            padding: 10px 0 0 0;
            font-size: 23px;
            font-weight: 500;
            color:rgba(51,51,51,1);
            line-height: 45px;
          }
          .image-list{
            padding: 20px 19px 0;
            width: 100%;
            height: auto;
            min-height: 234px;
            // border: 2px solid #dcdcdc;
            border-radius: 5px;
            box-sizing: border-box;
            &::after{
              content: '';
              display: block;
              clear: both;
            }
            .list-item{
              float: left;
              margin: 0 9px;
              padding: 0;
              width: 199px;
              height: auto;
              border-radius: 5px 5px;
              background: rgba(251,251,251,1);
              .img-container{
                position: relative;
                width: 100%;
                height: 145px;
                background-color: rgba(251,251,251,1);
                cursor: pointer;
                &.warn{
                  border-color: #FF5961;
                }
                img{
                  display: block;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  max-width: 100%;
                  max-height: 100%;
                }
              }
              .text-container{
                margin: 0;
                padding: 0;
                width: 100%;
                height: 70px;
                display: flex;
                flex-direction: column;
                .img-index_t {
                  font-size: 17px;
                  color: #333333;
                  margin-top: 11px;
                  margin-bottom: 7px;
                  margin-left: 10px;
                }
                .img-index_f {
                  font-size: 14px;
                  color: #656565;
                  margin-left: 10px;
                }
                .img-index{
                  display: block;
                  margin: 0 auto;
                  width: 0.5rem;
                  height: 100%;
                  font-size: 25px;
                  font-weight: 500;
                  color:rgba(51,51,51,1);
                  line-height: 60px;
                  text-align: center;
                }
              }
            }
          }
        }
        .diagnosis-container{
          margin-top: 20px;
          clear: both;
          width: 100%;
          height: auto;
          .title{
            margin: 0;
            padding: 10px 0 0 0;
            font-size: 23px;
            font-weight: 500;
            color:rgba(51,51,51,1);
            line-height: 45px;
          }
          .content-container{
            width: 100%;
            height: auto;
            .text-row{
              position: relative;
              margin-bottom: 10px;
              padding-left: 12px;
              width: 100%;
              height: auto;
              box-sizing: border-box;
              font-size: 23px;
              font-weight:400;
              color:rgba(51,51,51,1);
              line-height: 35px;
              &::before{
                content: '';
                position: absolute;
                top: 16px;
                left: 0;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background-color: #D57DA7;
              }
            }
          }
          .content{
            font-size: 23px;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height: 35px;
            word-wrap:break-word;
          }
        }
      }
      .body-footer{
        position: relative;
        width: 100%;
        height: 108px;
        border-top: 2px dashed #dedede;
        margin-top: 50px;
        div {
          position: absolute;
          font-size: 17px;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height: 17px;
        }
        .report-date_l{
          top: 28px;
          left: 0;
        }
        .report-date_m {
          top: 28px;
          left: 50%;
          transform: translate(-50%);
        }
        .report-date_r{
          top: 28px;
          right: 0;
        }
      }
    }
  }
}

.page {
  page-break-after: always;
}
// @page {
//   margin: 20mm
// }
// .page-header {
//   position: fixed !important;
//   left: 50%;
//   transform: translateX(-50%);
//   top: 0mm;
//   margin-bottom: 200px !important;
// }
</style>
