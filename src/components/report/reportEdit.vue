<template>
  <div class="report-edit">
    <div class="header">
      <i class="btn-back" @click="goBack()"></i>
      <span class="caseNum">病理号: {{caseNum}}</span>
      <span class="btn-generate-report" @click="PreviewReport()">预览报告</span>
      <span class="btn-case-message" @click="PathologicalInformation()">病例信息</span>
    </div>
    <div class="content">
      <div class="left-content">
        <div class="img-wrapper">
          <div class="header">
            <div class="title">病理图</div>
          </div>
          <div class="middle">
            <image-render :caseNum="caseNum" @clickRecoveryLine="SelectSlideFromRecoveryLine"></image-render>
          </div>
        </div>
        <div class="preview-image-list-container">
          <div class="header">
            <div class="title">切片预览</div>
            <div class="tip">病变切片</div>
          </div>
          <div class="preview-image-list" id="preview-image-list">
            <div class="list-item"
              v-for="(item, index) in slideImageGroupList"
              :key="index"
              @click="SelectSlide(item)">
              <div class="outer-shade">
                <div class="shade"></div>
                <div class="img-group-container" :class="{'warn': item.some(slideImage => slideImage.isCancer === 1)}">
                  <div class="img-container"  v-for="(child, childIndex) in item" :key="childIndex">
                    <img src="" alt="" :id="`preview-${index}-${childIndex}`">
                  </div>
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
        <div :class="tmpHeight ? 'tmpHeight' : ''" class="preview-image-list-container">
          <div class="header">
            <div class="title">截图</div>
          </div>
          <div class="preview-image-list" id="preview-image-list">
            <div class="screenshot-list"
              v-for="(item, index) in screenshotList"
              :key="index"
              @click="ClickScreen(item)">
              <div class="img-group-container">
                <div class="img-container">
                  <div class="shade"></div>
                  <img class="screenImg" :src="`${screenshotUrl}?path=${item.path}`" alt="" >
                  <img @click.stop="DeleteScreen(index)" class="del-img" src="" alt="">
                </div>
                <div class="floor-div">
                  <span>{{ item.slideNumber }}</span>
                  <span>{{ item.message }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-content">
        <div class="text-wrapper-1" :class="{'active': editingFieldName === 'firstField'}">
          <div class="header">
            <div class="title">宫颈锥切标本</div>
            <!-- <i class="btn-edit" @click="StartEdit('firstField')"></i> -->
          </div>
          <div class="middle" @click="Touch">
            <textarea class="text-input" placeholder="请手动输入诊断结果"
              v-model="firstFieldText"
              @blur="FinishEdit()"
              v-if="editingFieldName === 'firstField'">
            </textarea>
            <div class="format-text" v-else>
              <div class="text-row" v-for="(text, index) in formatFirstFieldText"
                :key="index">
                {{text}}
              </div>
            </div>
          </div>
        </div>
        <div class="text-wrapper-2"
          :class="{'active': editingFieldName === 'secondField'}">
          <div class="header">
            <div class="title">免疫组化</div>
          </div>
          <div class="middle">
            <textarea class="text-input"
              placeholder="填写免疫组化信息"
              @blur="FinishEdit()"
              @focus="StartEdit('secondField')"
              v-model="secondFieldText">
            </textarea>
          </div>
        </div>
        <div class="text-wrapper-3"
          :class="{'active': editingFieldName === 'thirdField'}">
          <div class="header">
            <div class="title">备注</div>
          </div>
          <div class="middle">
            <textarea class="text-input"
              placeholder="填写备注信息"
              @blur="FinishEdit()"
              @focus="StartEdit('thirdField')"
              v-model="thirdFieldText">
            </textarea>
          </div>
        </div>
      </div>
    </div>
    <layer-pathology-informatics ref="pathology-informatics" :pathologhItem='CaseList' />
    <layer-screen-delete @deldeteSucceed='GetScreenshotList' ref="screen-delete"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import MySelect from 'widget/MySelect/index.2.vue'
import LayerScreenDelete from 'widget/MyLayer/screenDelete.vue'
import LayerPathologyInformatics from 'widget/MyLayer/pathologyInformatics.vue'
import layer from 'layer'
import { ErrorHandler, getImage, tokenName } from 'common'
import API from 'api'
import {
  GET_SLIDE_PREVIEW_IMAGE,
  UPDATE_CASE_REPORT_TEXT,
  GET_CASE_INFO,
  GET_PATHOLOGICAL_INFORMATION,
  SAVE_PATHOLOGICAL_INFORMATION,
  GET_SCREENSHOT_LIST,
  DEL_SCREENSHOT_ITEM,
  GET_CASEAREA_INFO
} from 'service'

import imageRender from './imageRender.vue'

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
    imageRender,
    MySelect,
    LayerScreenDelete,
    LayerPathologyInformatics
  }
})
export default class EitReport extends Vue {
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

  // 正在编辑的文本字段名
  editingFieldName: string = ''
  // 标本
  firstFieldText: string = ''
  // 免疫组化
  secondFieldText: string = ''
  // 备注
  thirdFieldText: string = ''
  // 科室选项
  roomSelect: any = '0'
  // 下拉框颜色
  selectChange: boolean = false
  tmpHeight: boolean = false
  // 病例信息表单数据
  CaseList: CaseList = {
    medicalRecordNumber: '', // 病例号
    name: '', // 姓名
    age: '', // 年龄
    department: '', // 科室
    hospitalNumber: '', // 住院号
    outpatientServiceNumber: '', // 门诊号
    inspectionTime: '' // 送检时间
  }
  // 截图列表
  screenshotList: any = []
  screenshotUrl: string = API.GET_SCREENSHOT_DETAILS
  // 处理文本
  get formatFirstFieldText () {
    return this.firstFieldText.trim().replace(/\n+/, '\n').split('\n')
  }

  @Watch('caseNum')
  onCaseNumChange () {
    this.GetCaseReportText()
  }
  @Watch('slideImageGroupList')
  onSlideImageGroupList (newVal: any, oldVal: any) {
    this.$nextTick(() => {
      this.RenderSlideImage()
    })
  }
  @Watch('roomSelect')
  onSelectChange (val: any) {
    if (val) {
      this.selectChange = true
    }
  }

  mounted () {
    this.GetCaseReportText()
    this.RenderSlideImage()
    this.GetScreenshotList()

    this.$on('monitorRefresh', () => {
      this.GetScreenshotList()
    })
  }
  // 渲染切片缩略图
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
  // 开始编辑文本内容
  StartEdit (field: string) {
    this.editingFieldName = field
  }
  // 结束编辑文本内容,并保存
  FinishEdit () {
    this.editingFieldName = ''
    this.UpdateCaseReportText()
  }
  // 返回上一页
  goBack () {
    this.$router.go(-1)
  }
  // 展示完整报告
  async PreviewReport () {
    if (this.screenshotList.length < 2) {
      layer.msg('需要两张截图哦')
      return
    }
    const res = await this.GetCase()
    if (res.data.data.status === 0) {
      layer.msg('请先添加病理信息！')
      this.CaseList.medicalRecordNumber = this.CaseList.medicalRecordNumber || this.caseNum
      this.$refs['pathology-informatics'].$emit('ShowPathology')
    } else {
      this.$emit('showScreenshotItem', 'close')
      this.$router.push(`/report/${this.caseNum}/preview`)
    }
  }
  // 获取病理信息
  async GetCase () {
    const res = await GET_PATHOLOGICAL_INFORMATION({
      medicalRecordNumber: this.caseNum
    })
    return res
  }
  // 点击病例信息
  async PathologicalInformation () {
    this.$emit('slideChanged', 'close')
    this.$emit('showScreenshotItem', 'close')
    const res = await this.GetCase()
    if (res.data.success) {
      if (res.data.data.info) {
        if (res.data.data.info.inspectionTime) {
          const time = new Date(res.data.data.info.inspectionTime)
          res.data.data.info.inspectionTime = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
        }
        this.CaseList = res.data.data.info
      } else {
        this.CaseList = {
          medicalRecordNumber: '',
          name: '',
          age: '',
          department: '',
          hospitalNumber: '',
          outpatientServiceNumber: '',
          inspectionTime: ''
        }
      }
      this.CaseList.medicalRecordNumber = this.CaseList.medicalRecordNumber || this.caseNum
      this.$refs['pathology-informatics'].$emit('ShowPathology')
    }
  }
  // 截图列表点击删除图片
  DeleteScreen (id: any) {
    this.$refs['screen-delete'].$emit('pop', this.screenshotList[id])
  }
  // 点击截图单项
  ClickScreen (item: object) {
    this.$emit('showScreenshotItem', item)
  }
  // 获取截屏列表
  GetScreenshotList () {
    this.$nextTick(async () => {
      const res = await GET_SCREENSHOT_LIST({
        medicalRecordNumber: this.caseNum
      })
      this.screenshotList = res.data.data.picDetail
      if (this.screenshotList.length === 0) {
        this.tmpHeight = true
      }
    })
  }
  Touch () {
    this.StartEdit('firstField')
  }
  // 获取病例报告文字内容(标本诊断,免疫组化,备注)
  GetCaseReportText () {
    GET_CASEAREA_INFO({
      medicalRecordNumber: this.caseNum
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const caseInfo = res.data.data
        if (caseInfo) {
          if (caseInfo.specimen) {
            this.firstFieldText = caseInfo.specimen.replace(/, /g, '')
          } else {
            this.firstFieldText = ''
          }
          // this.firstFieldText = caseInfo.specimen.replace(/, /g, '') || ''
          this.secondFieldText = caseInfo.immunohistochemical || ''
          this.thirdFieldText = caseInfo.remark || ''
        }
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 更新病例报告文字内容(标本诊断,免疫组化,备注)
  UpdateCaseReportText () {
    UPDATE_CASE_REPORT_TEXT({
      medicalRecordNumber: this.caseNum,
      specimen: this.formatFirstFieldText.join('\n'),
      immunohistochemical: this.secondFieldText,
      remark: this.thirdFieldText
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        // do nothing
      }
    })
  }
  // 选择切片
  SelectSlide (imageList: any[]) {
    const slide = {
      slideNumber: imageList[0].slideNumber,
      slideIndex: `(${imageList[0].index}点-${imageList[1].index}点)`,
      screenshotNum: this.screenshotList.length
    }
    this.$emit('slideChanged', slide)
  }
  // 从复原结果选择切片
  SelectSlideFromRecoveryLine (slideNumber: any) {
    this.slideImageGroupList.forEach((imageGroup: any[]) => {
      if (slideNumber === imageGroup[0].slideNumber) {
        this.SelectSlide(imageGroup)
      }
    })
  }
}
</script>

<style lang="less" scoped>
  .report-edit{
    display: flex;
    flex-direction: column;
    padding: 0.3rem;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #F1F2F7;
    overflow: auto;
    .tmpHeight {
      height: 3.5rem !important;
    }
    .hint {
      .hint_head {
        position: fixed;
        top: 0;
        margin-left: -0.3rem;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0 ,0, 0.3);
        z-index: 2;
      }
      .hint_floor {
        z-index: 3;
        width: 300px;
        height: 250px;
        background-color: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 5px;
        & > div:nth-child(1) {
          height: 150px;
          font-size: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        & > div:nth-child(2) {
          cursor: pointer;
          font-size: 18px;
          display: flex;
          justify-content: space-around;
          div {
            width: 80px;
            height: 35px;
            // border: 1px solid red;
            border-radius: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          :first-child {
            color: #fff;
            background-color: #D57DA7;
          }
          :last-child {
            border: 1px solid #ccc;
          }
        }
      }
    }
    .header{
      flex-grow: 0;
      flex-shrink: 0;
      width: 100%;
      height: 0.9rem;
      .btn-back{
        float: left;
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background-color: #fff;
        background-repeat: no-repeat;
        background-size: 0.15rem 0.26rem;
        background-position: center center;
        background-image: url('~assets/images/report/icon_arrow_left.png');
        box-shadow:0rem 0rem 0.2rem 0.02rem rgba(181,106,155,0.1);
        cursor: pointer;
        &:hover{
          background-color: #D57DA7;
          background-image: url('~assets/images/report/icon_arrow_left_active.png');
        }
        &:active{
          background-color: #B56A9B;
        }
      }
      .caseNum{
        float: left;
        margin-left: 0.2rem;
        padding: 0 0.2rem;
        height: 0.6rem;
        width: auto;
        border-radius: 0.3rem;
        background-color: #fff;
        font-size:0.22rem;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:0.6rem;
      }
      .btn-generate-report{
        float: right;
        width: 1.5rem;
        height: 0.6rem;
        border-radius: 0.3rem;
        background-color: #D57DA7;
        box-shadow:0rem 0rem 0.2rem 0.02rem rgba(170,77,138,0.54);
        font-size:0.22rem;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:0.6rem;
        text-align: center;
        cursor: pointer;
        &:hover{
          background-color: #DF92B7;
        }
        &:active{
          background-color: #B56A9B;
        }
      }
      .btn-case-message {
        float: right;
        width: 1.5rem;
        height: 0.6rem;
        border-radius: 0.3rem;
        background-color: rgba(112,112,112,1);
        margin-right: 0.3rem;
        box-shadow:0rem 0rem 0.2rem 0.02rem rgba(89,89,89,0.54);
        font-size:0.22rem;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:0.6rem;
        text-align: center;
        cursor: pointer;
        &:hover{
          background-color: #959595;
        }
        &:active{
          background-color: #2E2E35;
        }
      }
    }
    .content{
      flex-grow: 1;
      flex-shrink: 1;
      display: flex;
      flex-direction: row;
      width: 100%;
      height: calc(100% - 1rem);
      .left-content{
        position: relative;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: 11.76rem;
        height: 100%;
        overflow: auto;
        border-radius: 0.1rem 0.2rem 0.1rem 0.1rem;
        .img-wrapper{
          position: relative;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          padding: 0;
          width: 100%;
          height: 6.68rem;
          border-radius: 0.1rem;
          box-sizing: border-box;
          background-color: #fff;
          .header{
            position: absolute;
            top: 0.2rem;
            padding-left: 0.2rem;
            width: 100%;
            height: 0.28rem;
            box-sizing: border-box;
            .title{
              font-size:0.28rem;
              font-weight:500;
              color:rgba(51,51,51,1);
              line-height:0.28rem;
            }
          }
          .middle{
            flex-grow: 1;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
        }
        .preview-image-list-container{
          position: relative;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          margin-top: 0.2rem;
          padding: 0.2rem;
          width: 100%;
          height: auto;
          border-radius: 0.1rem;
          box-sizing: border-box;
          background-color: #fff;
          .header{
            width: 100%;
            height: 0.28rem;
            // background-color: skyblue;
            .title{
              float: left;
              font-size:0.28rem;
              font-weight:500;
              color:rgba(51,51,51,1);
              line-height:0.28rem;
            }
            .tip{
              float: right;
              position: relative;
              padding-left: 0.2rem;
              width: auto;
              height: 0.22rem;
              font-size:0.22rem;
              font-weight:400;
              color:rgba(255,89,97,1);
              line-height:0.28rem;
              &::before{
                content: '';
                position: absolute;
                top: 0.09rem;
                left: 0;
                display: block;
                width: 0.1rem;
                height: 0.1rem;
                border-radius: 50%;
                background-color: rgba(255,89,97,1);
              }
            }
          }
          .preview-image-list{
            display: flex;
            flex-grow: 1;
            margin-top: 0.24rem;
            width: 100%;
            height: auto;
            overflow: hidden;
            // background-color: skyblue;
            .list-item{
              display: flex;
              flex-direction: column;
              flex-grow: 1;
              height: 100%;
              width: auto;
              .outer-shade {
                position: relative;
                cursor: pointer;
              }
              .shade {
                width: 100%;
                height: 2.22rem;
                box-sizing: border-box;
                background: rgba(0, 0, 0, 0);
                position: absolute;
                top: 0;
                z-index: 1;
                &:hover {
                  background: rgba(0,0,0, .1);
                }
              }
              .img-group-container{
                display: flex;
                flex-direction: row;
                flex-grow: 1;
                flex-shrink: 1;
                width: auto;
                height: 2.22rem;
                border: 0.02rem solid #E5E5E5;
                box-sizing: border-box;
                &.warn{
                  border-color: #FF5961;
                }
                .img-container{
                  flex-grow: 1;
                  flex-shrink: 1;
                  position: relative;
                  width: 100%;
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
                display: flex;
                flex-direction: row;
                flex-grow: 0;
                flex-shrink: 0;
                width: auto;
                height: 0.5rem;
                border-left: 0.02rem solid #E5E5E5;
                border-right: 0.02rem solid #E5E5E5;
                box-sizing: border-box;

                .text-container{
                  flex-grow: 1;
                  flex-shrink: 1;
                  width: auto;
                  height: 100%;
                  .img-index{
                    display: block;
                    margin: auto;
                    width: 0.5rem;
                    height: 100%;
                    font-size:0.26rem;
                    font-weight:500;
                    color:rgba(51,51,51,1);
                    line-height:0.5rem;
                    text-align: center;
                  }
                }
              }
            }
            .screenshot-list {
            width: 4.5rem;
            height: auto;
            margin-right: 0.21rem;
            border: 0.01rem solid #E5E5E5;
            border-radius: 0.1rem;
            cursor: pointer;
            background: rgba(251,251,251,1);
            .img-container {
              height: 1.96rem;
              width: 100%;
              position: relative;
              .screenImg {
                height: 100%;
                margin: 0 auto;
                display: block;
              }
              .del-img {
                display: none;
              }
              .shade {
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0);
                position: absolute;
                top: 0;
                // z-index: 1;
                &:hover {
                  background: rgba(0,0,0, .1);
                }
              }
            }
            .floor-div {
              height: auto;
              span {
                display: block;
                margin-left: 0.12rem;
              }
              & span:first-child {
                margin-top: 0.13rem;
                font-size: 0.22rem;
                color: rgba(51,51,51,1);
              }
              & span:last-child {
                margin-top: 0.09rem;
                margin-bottom: 0.19rem;
                font-size: 0.18rem;
                color: rgba(102,102,102,1);
                word-wrap: break-word;
              }
            }
            &:hover {
              .del-img {
                display: block;
                position: absolute;
                width: 0.5rem;
                height: 0.5rem;
                opacity:0.5;
                background-image: url('~assets/images/report/delete_default.png');
                background-repeat: no-repeat;
                top: 0;
                right: 0;
                background-size: 100% 100%;
                &:hover{
                  background-image: url('~assets/images/report/delete_hover.png');
                }
                &:active{
                  background-image: url('~assets/images/report/delete_active.png');
                }
              }
            }
          }
          }
        }
      }
      .right-content{
        display: flex;
        flex-direction: column;
        flex-grow: 0;
        flex-shrink: 0;
        margin-left: 0.2rem;
        width:6.64rem;
        height: auto;
        .text-wrapper-1{
          flex-grow: 2;
          width: 100%;
          height: 6.68rem;
          .header{
            position: relative;
            .btn-edit{
              position: absolute;
              top: 0;
              right: 0;
              width: 0.6rem;
              height: 0.6rem;
              background-repeat: no-repeat;
              background-size: 100% 100%;
              background-image: url('~assets/images/report/icon_edit.png');
              cursor: pointer;
              &:hover{
                background-image: url('~assets/images/report/icon_edit_hover.png');
              }
              &:active{
                background-image: url('~assets/images/report/icon_edit_active.png');
              }
            }
          }
          .middle{
            .format-text{
              width: 100%;
              height: 100%;
              // background-color: #f1f1f1;
              overflow: auto;
              .text-row{
                position: relative;
                font-size:0.24rem;
                font-weight:400;
                color:#333333;
                line-height:0.36rem;
                text-indent: 0.3rem;
                &::before{
                  content: '';
                  position: absolute;
                  top: 0.16rem;
                  left: 0;
                  width: 0.1rem;
                  height: 0.1rem;
                  border-radius: 50%;
                  background-color: #D57DA7;
                }
              }
            }
          }
        }
        .text-wrapper-2{
          flex-grow: 1;
          margin-top: 0.2rem;
          width: 100%;
          height: 1.7rem;
        }
        .text-wrapper-3{
          flex-grow: 1;
          margin-top: 0.2rem;
          width: 100%;
          height: 1.7rem;
        }
        .text-wrapper-1,
        .text-wrapper-2,
        .text-wrapper-3{
          display: flex;
          flex-direction: column;
          padding: 0.2rem;
          box-sizing: border-box;
          border-radius: 0.1rem;
          border: 0.02rem solid #fff;
          background-color: #fff;
          box-shadow:0rem 0rem 0.35rem 0.04rem rgba(173,171,176,0.18);

          &.active{
            border-color: #d57da7;
          }
          .header{
            width: 100%;
            height: 0.28rem;
            // background-color: skyblue;
            .title{
              font-size:0.28rem;
              font-weight:500;
              color:rgba(51,51,51,1);
              line-height:0.28rem;
            }
          }
          .middle{
            flex-grow: 1;
            margin-top: 0.3rem;
            width: 100%;
            height: auto;
            max-height: calc(100% - 0.58rem);

            .text-input{
              display: block;
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              resize: none;
              font-size:0.24rem;
              font-weight:400;
              color:#333333;
              line-height:0.36rem;
              border: none;
              // background-color: #f1f1f1;
              &:focus{
                outline: none;
              }
            }
            textarea::-webkit-input-placeholder {
              color: #999;
            }
            textarea:-moz-placeholder {
              color: #999;
            }
            textarea::-moz-placeholder {
              color: #999;
            }
            textarea::-ms-input-placeholder {
              color: #999;
            }
          }
        }
      }
    }
  }
</style>
