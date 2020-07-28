<template>
  <div class="image-render" ref="image-render">
    <div class="image-container" ref="image-container"
      :style="{
        'width': `${breadth}`,
        'height': `100%`,
        'left': `${treeDiagram}`,
        'transform': `scale(${displacement})`}"
      @mousedown="StartMove($event)"
      @mousemove="Move($event)"
      @mouseup="EndMove($event)"
      @mouseleave="EndMove($event)">
      <!-- 答题图原始图 -->
      <img src="" alt="" ref="case-recovery-image-origin" class="origin-image" @load="GetImageSize()">
      <!-- 显示刀痕,复原结果,测距的图 -->
      <img src="" alt="" ref="case-recovery-image"
        :style="{
          width: `${imageActualSize.width}px`,
          height: `${imageActualSize.height}px`
        }">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox='0 0 100 100' preserveAspectRatio="none"
        :width="`${imageActualSize.width}px`"
        :height="`${imageActualSize.height}px`"
        v-show="!showMeasureMarks">
        <polyline class="line"
          v-for="(line, lineIndex) in recoveryMarks" :key="lineIndex"
          :points="line.pointsString"
          :stroke-width="imageZoomRatio * 8"
          @click="ClickLine(line)"/>
      </svg>
    </div>
    <template v-if="showOperation">
      <div class="btn-measure" :class="{'active': showMeasureMarks}" @click="ToggleMeasureMarks()"></div>
      <div class="bottom-right-group">
        <i class="btn-switch" :class="{'switch-on': showKnifeMarks}" @click="ToggleKnifeMarks()"></i>
        <i class="btn-zoom-in" @click="Zoom('zoomIn')"></i>
        <span class="zoomlevel">{{`${(Math.round(imageZoomRatio * 100))}%`}}</span>
        <i class="btn-zoom-out" @click="Zoom('zoomOut')"></i>
      </div>
    </template>
    <img src="~assets/images/report/bg_1.png" alt="" ref="button_bg_1" v-show="false">
    <img src="~assets/images/report/bg_2.png" alt="" ref="button_bg_2" v-show="false">
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

import API from 'api'
import { getImage, tokenName, ErrorHandler } from 'common'
import { GET_KNIFE_MARKS, GET_RECOVERY_MARKS, GET_MEASURE_MARKS } from 'service'

@Component
export default class ImageRender extends Vue {
  @Prop({ type: String, default: '' })
  caseNum!: string

  @Prop({ type: Boolean, default: true })
  showOperation!: boolean

  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  showKnifeMarks: boolean = false
  showMeasureMarks: boolean = false
  // 刀痕列表
  knifeMarks: any[] = []
  // 复原列表
  recoveryMarks: any[] = []
  // 测距数据
  measureMarks: any = {}
  // 图片容器最小尺寸
  containerMinSize: any = { width: 0, height: 0 }
  // 图片容器实际尺寸
  containerActualSize: any = { width: 0, height: 0 }
  // 图片实际尺寸
  imageActualSize: any = { width: 0, height: 0 }
  // 图片原始尺寸
  imageNaturalSize: any = { width: 0, height: 0 }
  // 图片缩放比例
  imageZoomRatio: number = 0
  // 记录原始比例
  recordScale: number = 0
  // 移动的初始坐标
  startPoint: { x: number, y: number } = { x: 0, y: 0 }
  // 移动前的偏移量
  startOffset: { left: number, top: number } = { left: 0, top: 0 }
  // 移动状态
  moveStatus: boolean = false
  // 缩放比例
  displacement: any = 1
  // 谱系图
  treeDiagram: string = '33%'
  breadth: string = '6.68rem'

  @Watch('caseNum')
  onCaseNumChange () {
    this.GetCaseRecoveryImage()
  }

  mounted () {
    if (this.caseNum) {
      this.GetCaseRecoveryImage()
    }
    // 计算容器原始尺寸
    const renderContainer = this.$refs['image-render']
    this.containerMinSize = {
      width: renderContainer.clientWidth,
      height: renderContainer.clientHeight
    }
    this.containerActualSize = {
      width: renderContainer.clientWidth,
      height: renderContainer.clientHeight
    }

    // if (this.$route.path.substr(this.$route.path.lastIndexOf('/') + 1) === 'preview' && window.screen.availWidth > 1500) {
    //   this.treeDiagram = '-2%'
    // } else if (this.$route.path.substr(this.$route.path.lastIndexOf('/') + 1) === 'preview' && window.screen.availWidth < 1500) {
    //   this.treeDiagram = '13%'
    // }

    if (this.$route.path.substr(this.$route.path.lastIndexOf('/') + 1) === 'preview') {
      this.treeDiagram = '0%'
      this.breadth = '100%'
    }
  }
  // 计算复原图原始尺寸和实际尺寸
  GetImageSize () {
    const image = this.$refs['case-recovery-image-origin']
    const actualSize = {
      width: image.clientWidth,
      height: image.clientHeight
    }
    this.imageActualSize = actualSize
    const naturalSize = {
      width: image.naturalWidth,
      height: image.naturalHeight
    }
    this.imageNaturalSize = naturalSize
    if (naturalSize.width) {
      this.imageZoomRatio = Number((actualSize.width / naturalSize.width).toFixed(3))
      this.recordScale = this.imageZoomRatio
    }
    this.GetRecoveryMarks()
  }
  // 缩放
  Zoom (type: string) {
    const zoomRatio = 1.1
    if (type === 'zoomIn') {
      if (this.containerActualSize.width / zoomRatio > this.containerMinSize.width) {
        this.containerActualSize = {
          width: this.containerActualSize.width / zoomRatio,
          height: this.containerActualSize.height / zoomRatio
        }
        this.imageActualSize = {
          width: this.imageActualSize.width / zoomRatio,
          height: this.imageActualSize.height / zoomRatio
        }
        this.imageZoomRatio /= zoomRatio
      }
    } else {
      if (this.containerActualSize.width * zoomRatio < this.containerMinSize.width * 5) {
        this.containerActualSize = {
          width: this.containerActualSize.width * zoomRatio,
          height: this.containerActualSize.height * zoomRatio
        }
        this.imageActualSize = {
          width: this.imageActualSize.width * zoomRatio,
          height: this.imageActualSize.height * zoomRatio
        }
        this.imageZoomRatio *= zoomRatio
      }
    }

    this.displacement = (this.imageZoomRatio / this.recordScale).toFixed(2)
  }
  // 获取大体图
  GetCaseRecoveryImage () {
    const url = `${API.CASE_RECOVERY_IMAGE}?medicalRecordNumber=${this.caseNum}`
    const token = window.localStorage.getItem(tokenName) || ''
    const originImage = this.$refs['case-recovery-image-origin']
    const recoveryImage = this.$refs['case-recovery-image']
    getImage(url, '', token, originImage, () => {
      this.GetKnifeMarks()
      // this.GetRecoveryMarks()
      this.GetMeasureMarks()
    })
    getImage(url, '', token, recoveryImage)
  }
  // 获取大体图上的刀痕
  GetKnifeMarks () {
    GET_KNIFE_MARKS({
      medicalRecordNumber: this.caseNum
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const markGroupList = res.data.data.groupList || []
        const markList: any = []
        markGroupList.forEach((group: any) => {
          group.knifeMarkLabelList.forEach((mark: any) => {
            markList.push(mark)
          })
        })
        this.knifeMarks = markList
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 获取复原结果
  GetRecoveryMarks () {
    GET_RECOVERY_MARKS({
      medicalRecordNumber: this.caseNum
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const marks = res.data.data.recoveryLabelList
        marks.forEach((mark: any) => {
          const points = JSON.parse(mark.points)
          const newPoints: string[] = []
          if (points.length && this.imageNaturalSize.width) {
            points.forEach((point: any) => {
              newPoints.push(`${point.x * 100 / this.imageNaturalSize.width}, ${point.y * 100 / this.imageNaturalSize.height}`)
            })
          }
          mark.points = points
          mark.pointsString = newPoints.join(' ')
        })
        this.recoveryMarks = marks
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 获取测距结果
  GetMeasureMarks () {
    GET_MEASURE_MARKS({
      medicalRecordNumber: this.caseNum
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const marks = res.data.data.data[0].value || null
        // 各病灶距内口距离
        const innerMouth: any = []
        // 各病灶距外口距离
        const outerMouth: any = []
        // 各病灶区域
        const polygonCoords: any = []
        // 各病灶区域最长轴
        const polygonAxes: any = []
        if (marks) {
          if (marks.inner_mouth) {
            for (const index in marks.inner_mouth) {
              if (marks.inner_mouth.hasOwnProperty(index)) {
                const item = marks.inner_mouth[index]
                innerMouth.push({
                  distance: `${Number(item[0]).toFixed(2)}μm`,
                  points: [
                    {
                      x: item[1][0][0],
                      y: item[1][0][1]
                    },
                    {
                      x: item[1][1][0],
                      y: item[1][1][1]
                    }
                  ]
                })
              }
            }
          }
          if (marks.outer_mouth) {
            for (const index in marks.outer_mouth) {
              if (marks.outer_mouth.hasOwnProperty(index)) {
                const item = marks.outer_mouth[index]
                outerMouth.push({
                  distance: `${Number(item[0]).toFixed(2)}μm`,
                  points: [
                    {
                      x: item[1][0][0],
                      y: item[1][0][1]
                    },
                    {
                      x: item[1][1][0],
                      y: item[1][1][1]
                    }
                  ]
                })
              }
            }
          }
          if (marks.polygon_axes) {
            for (const index in marks.polygon_axes) {
              if (marks.polygon_axes.hasOwnProperty(index)) {
                const item = marks.polygon_axes[index]
                polygonAxes.push({
                  distance: `${Number(item.axis_length).toFixed(2)}μm`,
                  points: [
                    {
                      x: item.major_axis[0][0],
                      y: item.major_axis[0][1]
                    },
                    {
                      x: item.major_axis[1][0],
                      y: item.major_axis[1][1]
                    }
                  ]
                })
              }
            }
          }
          if (marks.polygon_coords) {
            for (const index in marks.polygon_coords) {
              if (marks.polygon_axes.hasOwnProperty(index)) {
                const item = marks.polygon_coords[index]
                const points: any = []
                if (item.length) {
                  item.forEach((child: any) => {
                    points.push({
                      x: child[0],
                      y: child[1]
                    })
                  })
                }
                polygonCoords.push({
                  area: `${Number(marks.polygon_size[index]).toFixed(2)}μm²`,
                  points
                })
              }
            }
          }
        }
        this.measureMarks = {
          innerMouth,
          outerMouth,
          polygonCoords,
          polygonAxes
        }
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 绘制刀痕和复原
  DrawMarks (type: string) {
    // 绘制刀痕和复原
    const image: any = this.$refs['case-recovery-image-origin']
    const imageWidth: number = image.naturalWidth
    const imageHeight: number = image.naturalHeight
    const canvas = document.createElement('canvas')
    canvas.width = imageWidth
    canvas.height = imageHeight
    let ctx
    if (canvas) {
      ctx = canvas.getContext('2d')
    }
    if (ctx) {
      ctx.drawImage(image, 0, 0)
      if (type === 'knife') {
        // 绘制刀痕
        this.knifeMarks.forEach((mark: any) => {
          this.DrawLine('knife', canvas, mark.points, mark.knifeMarkLabel, 6, '#77FF4E')
        })
        const proceedImage = canvas.toDataURL('image/png')
        this.$refs['case-recovery-image'].src = proceedImage
      } else if (type === 'measure') {
        // 绘制测距
        // 先绘制复原结果
        this.recoveryMarks.forEach((mark: any) => {
          this.DrawLine('recovery', canvas, mark.points, '', 6, '#A52A2A')
        })
        // 绘制测距内容**************开始**************
        // 1.各病灶距内口的距离
        this.measureMarks.innerMouth.forEach((mark: any) => {
          this.DrawLine('innerMouth', canvas, mark.points, mark.distance, 6, 'rgb(255, 255, 255, 0.6)')
        })
        // 2.各病灶距外口的距离
        this.measureMarks.outerMouth.forEach((mark: any) => {
          this.DrawLine('outerMouth', canvas, mark.points, mark.distance, 6, 'rgb(255, 255, 255, 0.6)')
        })
        // 3.各病灶占据区域
        this.measureMarks.polygonCoords.forEach((mark: any) => {
          this.DrawLine('polygonCoords', canvas, mark.points, mark.area, 6, 'rgb(255, 255, 255, 0.6)')
        })
        // 4.各病灶区域最长轴
        this.measureMarks.polygonAxes.forEach((mark: any) => {
          this.DrawLine('polygonAxes', canvas, mark.points, mark.distance, 6, 'rgb(255, 255, 255, 0.6)')
        })
        const proceedImage = canvas.toDataURL('image/png')
        this.$refs['case-recovery-image'].src = proceedImage
      } else {
        const proceedImage = canvas.toDataURL('image/png')
        this.$refs['case-recovery-image'].src = proceedImage
      }
    }
  }
  // 通过点在canvas上画线
  DrawLine (type: string, canvas: any, points: any[], markLabel: string, lineWidth?: number, lineColor?: string) {
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = lineWidth || 10
    ctx.strokeStyle = lineColor || 'rgba(255,0,0)'
    // 刀痕,绘制刀痕序号
    if (type === 'knife') {
      // 判断两个点,哪个在上面(小)
      if (points[0].y > points[1].y) {
        const temp = points[0]
        points[0] = points[1]
        points[1] = temp
      }
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      ctx.lineTo(points[1].x, points[1].y)
      ctx.stroke()
      // 把刀痕编号放置到刀痕线的顺延线上,所以通过两个点计算 y = kx + b 中的k 和 b
      const k = (points[1].y - points[0].y) / (points[1].x - points[0].x)
      const b = points[0].y - k * points[0].x
      const markLabelPosition = {
        x: points[1].x,
        y: points[1].y
      }
      // 根据不同的斜率,来确定偏移主轴
      if (k > 0 && k < 1) {
        markLabelPosition.x = points[1].x + 50
        markLabelPosition.y = (points[1].x + 50) * k + b
      } else if (k > -1 && k < 0) {
        markLabelPosition.x = points[1].x - 50
        markLabelPosition.y = (points[1].x - 50) * k + b
      } else {
        markLabelPosition.x = (points[1].y + 50 - b) / k
        markLabelPosition.y = points[1].y + 50
      }
      ctx.font = '90px bold 黑体'
      ctx.fillStyle = lineColor || '#333'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(markLabel, markLabelPosition.x, markLabelPosition.y)
    } else if (type === 'recovery') {
      ctx.beginPath()
      points.forEach((point: any, index: number) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })
      ctx.stroke()
    } else if (type === 'innerMouth' || type === 'outerMouth' || type === 'polygonAxes') {
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      ctx.lineTo(points[1].x, points[1].y)
      ctx.stroke()
      // 绘制两个端点
      // 第一个端点
      ctx.beginPath()
      ctx.arc(points[0].x, points[0].y, 6, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fillStyle = '#fff'
      ctx.fill()
      // 第二个端点
      ctx.beginPath()
      ctx.arc(points[1].x, points[1].y, 6, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fillStyle = '#fff'
      ctx.fill()
      // 绘制距离文字
      const center = {
        x: (points[0].x + points[1].x) / 2,
        y: (points[0].y + points[1].y) / 2
      }
      // 绘制背景图片
      const bgImage = this.$refs['button_bg_1']
      const imageActualSize: any = {
        width: 110,
        height: 38
      }
      ctx.drawImage(bgImage, center.x - imageActualSize.width / 2, center.y - imageActualSize.height / 2, imageActualSize.width, imageActualSize.height)
      ctx.font = '20px bold 黑体'
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(markLabel, center.x, center.y)
    } else if (type === 'polygonCoords') {
      ctx.beginPath()
      points.forEach((point: any, index: number) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })
      ctx.stroke()
    }
  }
  // 显示/隐藏刀痕
  ToggleKnifeMarks () {
    if (!this.showKnifeMarks) {
      this.DrawMarks('knife')
      this.showMeasureMarks = false
    } else {
      this.DrawMarks('clear')
      if (this.showMeasureMarks) {
        this.DrawMarks('measure')
      }
    }
    this.showKnifeMarks = !this.showKnifeMarks
  }
  // 显示测距数据
  ToggleMeasureMarks () {
    if (!this.showMeasureMarks) {
      this.DrawMarks('measure')
      this.showKnifeMarks = false
    } else {
      if (this.showKnifeMarks) {
        this.DrawMarks('knife')
      }
      this.DrawMarks('clear')
    }
    this.showMeasureMarks = !this.showMeasureMarks
  }
  // 点击复原结果线
  ClickLine (line: any) {
    this.$emit('clickRecoveryLine', line.slideNumber)
  }
  // 开始移动
  StartMove (e: any) {
    this.moveStatus = true
    this.startPoint = {
      x: e.clientX,
      y: e.clientY
    }
    this.startOffset = {
      left: e.currentTarget.offsetLeft,
      top: e.currentTarget.offsetTop
    }
  }
  Move (e: any) {
    if (this.moveStatus) {
      const newPoint = {
        x: e.clientX,
        y: e.clientY
      }
      const newOffset = {
        left: newPoint.x - (this.startPoint.x - this.startOffset.left),
        top: newPoint.y - (this.startPoint.y - this.startOffset.top)
      }
      const imageContainer = this.$refs['image-container']
      imageContainer.style.left = `${newOffset.left}px`
      imageContainer.style.top = `${newOffset.top}px`
    }
  }
  EndMove (e: Event) {
    this.moveStatus = false
  }
}
</script>

<style lang="less" scoped>
  .image-render{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .image-container{
      position: absolute;
      width: 100%;
      height: 100%;
      user-select: none;
      &:active{
        cursor: move;
      }
      img{
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
        &.orgin-image{
          opacity: 0;
        }
      }
      svg{
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
        // background-color: rgba(255,255,255, 0.5);
        .line{
          fill:none;
          // stroke-width: 2;
          stroke: #A52A2A;
          cursor: pointer;
          &:hover{
            stroke: red;
          }
        }
      }
    }
    .btn-measure{
      position: absolute;
      top: 0.2rem;
      right: 0.2rem;
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 50%;
      background-color: #fff;
      background-image: url('~assets/images/report/icon_measure_1.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      &:hover,
      &.active{
        background-image: url('~assets/images/report/icon_measure_1_active.png');
      }
    }
    .bottom-right-group{
      position: absolute;
      bottom: 0.3rem;
      right: 0.2rem;
      float: right;
      width: auto;
      height: 0.35rem;
      .btn-switch{
        float: left;
        margin-top: 0.025rem;
        width: 0.54rem;
        height: 0.3rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url('~assets/images/report/icon_switch_off.png');
        cursor: pointer;
        &.switch-on{
          background-image: url('~assets/images/report/icon_switch_on.png');
        }
      }
      .btn-zoom-in{
        float: left;
        margin-left: 0.3rem;
        width: 0.35rem;
        height: 0.35rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url('~assets/images/report/icon_zoom_in.png');
        cursor: pointer;
        &:hover{
          background-image: url('~assets/images/report/icon_zoom_in_active.png');
        }
      }
      .btn-zoom-out{
        float: left;
        width: 0.35rem;
        height: 0.35rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url('~assets/images/report/icon_zoom_out.png');
        cursor: pointer;
        &:hover{
          background-image: url('~assets/images/report/icon_zoom_out_active.png');
        }
      }
      .zoomlevel{
        float: left;
        width: 0.8rem;
        height: 0.35rem;
        font-size:0.22rem;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:0.35rem;
        text-align: center;
      }
    }
  }
</style>
