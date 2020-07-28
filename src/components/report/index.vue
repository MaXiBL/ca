<template>
  <div class="report-container">
    <report-edit
      v-if="reportStatus === 'edit'"
      ref="report-edit"
      :caseNum="caseNum"
      :slideImageGroupList="slideImageGroupList"
      @slideChanged="OpenSlide"
      @showScreenshotItem='showScreenshotItem'>
    </report-edit>
    <report-preview
      v-else
      :caseNum="caseNum"
      :slideImageGroupList="slideImageGroupList"
      :slideDiseasedImageList="slideDiseasedImageList">
    </report-preview>
    <slide-drawer @monitorRefresh='monitorRefresh' ref="slide-drawer" v-show="reportStatus === 'edit'"></slide-drawer>
    <check-screenshot ref="check-screenshot"></check-screenshot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import ReportEdit from './reportEdit.vue'
import ReportPreview from './reportPreview.vue'
import { ErrorHandler } from 'common'
import {
  GET_SLIDE_PREVIEW_IMAGE
} from 'service'

import slideDrawer from './slideDrawer.vue'
import checkScreenshot from './checkScreenshot.vue'

@Component({
  components: {
    ReportEdit,
    ReportPreview,
    slideDrawer,
    checkScreenshot
  }
})
export default class Report extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  caseNum: string = ''
  slideImageList: any[] = []

  get reportStatus () {
    return this.$route.params.reportStatus
  }
  // 按切片号分组后的列表
  get slideImageGroupList () {
    const imageGruopDict: {
      [prop: string]: any[]
    } = {}
    const imageGroupList: any[] = []
    this.slideImageList.forEach((item: { slideNumber: string, diseaseFlag: boolean, isCancer: boolean }) => {
      item.diseaseFlag = item.isCancer
      if (!imageGruopDict[item.slideNumber]) {
        imageGruopDict[item.slideNumber] = [item]
      } else {
        imageGruopDict[item.slideNumber].push(item)
      }
    })

    for (const slideNumber in imageGruopDict) {
      if (imageGruopDict.hasOwnProperty(slideNumber)) {
        imageGroupList.push(imageGruopDict[slideNumber])
      }
    }
    return imageGroupList
  }
  // 获取带有有病变的图片
  get slideDiseasedImageList () {
    return this.slideImageList.filter((item: any, index: number) => {
      return item.diseaseFlag === 1
    })
  }

  mounted () {
    this.caseNum = this.$route.params.caseNum
    this.GetSlideImageList()
  }
  // 获取切片的缩略图
  GetSlideImageList () {
    GET_SLIDE_PREVIEW_IMAGE({
      medicalRecordNumber: this.caseNum
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const list = res.data.data.paths
        list.forEach((item: any) => {
          item.diseaseFlag = item.isCancer
        })
        this.slideImageList = list
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 打开切片详情
  OpenSlide (slide: {slideNumber: string, slideIndex: string}) {
    this.$refs['slide-drawer'].$emit('openSlide', slide)
  }
  // 显示查看截图
  showScreenshotItem (item: object) {
    this.$refs['check-screenshot'].$emit('showScreenshotItem', item)
  }
  // 通知重新获取截图列表
  monitorRefresh () {
    this.$refs['report-edit'].$emit('monitorRefresh')
  }
}
</script>

<style lang="less" scoped>
.report-container{
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 700px;
}
</style>
