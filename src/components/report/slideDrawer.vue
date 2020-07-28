<template>
  <div class="drawer-outer-container" v-if="show">
    <span class="btn-close" @click="ShowFalse"></span>
    <div class="drawer-inner-container">
      <div class="drawer-header">
        <div class="title">{{slideIndex}}</div>
        <div class="btn-group">
          <div class="btn-screenshot-container" :class="{'active': measureScreenshotStatus}" @click="ToggleMeasureScreenshot()">
            <div class="icon-screenshot"></div>
            <div class="btn-text">截图</div>
          </div>
          <div class="btn-measure-container" :class="{'active': measureDistanceStatus}" @click="ToggleMeasureDistance()">
            <div class="icon-measure"></div>
            <div class="btn-text">测距离</div>
          </div>
          <div class="btn-acreage-container" :class="{'active': measureAreaStatus}" @click="ToggleMeasureArea()">
            <div class="icon-acreage"></div>
            <div class="btn-text">测面积</div>
          </div>
        </div>
      </div>
      <div class="box-container">
        <div v-show="showScreenshot" class="shade"></div>
        <div v-show="showScreenshot">
        <div class="url-container">
          <img :src="screenshotUrl" alt="">
          <div class="outer-box">
            <input v-model="screenshotDetails" placeholder="添加截图描述（选填）" type="text">
            <div>
              <div @click="ClickSave">保存</div>
              <div @click="ClickCancel">取消</div>
            </div>
          </div>
        </div>
        </div>
        <div ref="screenshot" class="drawer-panel" id="origin"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'

import OpenSeadragon from 'openseadragon'
import Annotation from 'annotation'
import html2canvas from 'html2canvas' // 用于截图
import layer from 'layer'
import { ErrorHandler, tokenName } from 'common'
import Axios from 'axios'
import API from 'api'
import {
  GET_SLIDE_INFO,
  GET_SLIDE_DETAIL,
  GET_ANNOTATION_LIST,
  GET_SLIDE_MEASURE_DISTANCE_LIST,
  SAVE_SLIDE_MEASURE_AREA,
  SAVE_SLIDE_MESASURE_DISTANCE,
  DEL_SLIDE_MEASURE_AREA,
  DEL_SLIDE_MESASURE_DISTANCE
} from 'service'

@Component
export default class SlideDrawer extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }

  show: boolean = false
  slideNumber: string = '19-2505-1'
  slideIndex: string = '(1点-2点)'
  slideInfo: any = {}
  originViewer: any = null
  annotationDrawer: any = null
  annotationList: any[] = []
  markerLineList: any[] = []
  measureDistanceStatus: boolean = false
  measureAreaStatus: boolean = false
  // 点击截图后得样式切换
  measureScreenshotStatus: boolean = false
  // 截图地址
  screenshotUrl: string = ''
  // 截图框
  showScreenshot: boolean = false
  // 截图描述信息
  screenshotDetails: string = ''
  // 截图数量
  screenshotNum: number = 0
  @Watch('annotationList')
  onAnnotationChange (newVal: any[]) {
    this.RenderAnnotation(newVal)
  }

  @Watch('markerLineList')
  onMarkerLineListChange (newVal: any[]) {
    this.RenderMarkerLine(newVal)
  }

  mounted () {
    this.$on('openSlide', (slide: any) => {
      // 预览得时候点击病理信息，显示病理信息别的关闭
      if (slide === 'close') {
        this.show = false
        this.$emit('monitorRefresh')
        this.ClickCancel()
        return
      }
      // 记录截图数量
      this.screenshotNum = slide.screenshotNum
      this.measureScreenshotStatus = false
      this.show = true
      this.slideNumber = slide.slideNumber
      this.slideIndex = slide.slideIndex
      this.slideInfo = {}
      this.originViewer = null
      this.annotationDrawer = null
      this.annotationList = []
      this.markerLineList = []
      this.measureDistanceStatus = false
      this.measureAreaStatus = false
      this.GetSlideInfo()
    })
  }
  // 创建viewer
  CreateViewer (slide: any, format: string, el: string, navFlag: boolean, oldViewer: any) {
    /**
     * @params:{ url, format, tileSize, height, width }
     */
    if (!slide.width) {
      return oldViewer
    }
    const ImageConfig = {
      xmlns: 'http://schemas.microsoft.com/deepzoom/2008',
      Url: slide.url,
      Format: format,
      Overlap: 0,
      TileSize: slide.tileSize,
      minLevel: 10,
      Size: {
        Height: slide.height,
        Width: slide.width
      }
    }
    let viewer
    if (!oldViewer) {
      viewer = OpenSeadragon({
        id: el,
        // navigatorId: 'navigator-origin',
        showNavigator: navFlag,
        // maxZoomLevel: 40,
        degrees: 0,
        showRotationControl: false,
        showZoomControl: false,
        showHomeControl: false,
        showFullPageControl: false,
        gestureSettingsTouch: {
          pinchRotate: true
        },
        gestureSettingsMouse: {
          dblClickToZoom: true,
          clickToZoom: false,
          scrollToZoom: true
        },
        crossOriginPolicy: 'Anonymous',
        loadTilesWithAjax: true,
        ajaxHeaders: {
          'Authorization': window.localStorage.getItem(tokenName)
        },
        imageLoaderLimit: 5
      })
    } else {
      viewer = oldViewer
    }
    viewer.open({
      Image: ImageConfig
    })
    return viewer
  }
  // 获取切片信息
  GetSlideInfo () {
    GET_SLIDE_INFO({
      slideNumber: this.slideNumber
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const slideInfo = res.data.data.image
        if (slideInfo) {
          this.slideInfo = slideInfo
          return GET_SLIDE_DETAIL({
            path: slideInfo.path
          })
        } else {
          layer.msg('咱无切片信息')
        }
      } else {
        ErrorHandler(res)
      }
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const slideDetail = res.data.data
        slideDetail.url = `${API.DEEP_ZOOM_IMAGE}/`
        this.slideInfo = Object.assign(this.slideInfo, slideDetail)
        this.RenderSlide(slideDetail)
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 渲染切片
  RenderSlide (slide: any) {
    const viewer = this.CreateViewer(slide, `jpeg?path=${slide.path}`, 'origin', false, null)
    this.annotationDrawer = this.InitAnnotation(viewer, slide)
    if (this.annotationDrawer) {
      this.measureDistanceStatus = false
      this.measureAreaStatus = false
      this.annotationDrawer.onStopDraw()
    }
    this.annotationDrawer.setAddMarkersCallback((annotation: any) => {
      if (annotation[1].type === 'measureArea') {
        this.MeasureArea(annotation)
      } else {
        this.MeasureDistance(annotation)
      }
    })
    this.annotationDrawer.setDelMarkersCallback((annotation: any[]) => {
      if (annotation[1].type === 'measureArea') {
        this.DelMeasureAreaAnnotation(annotation[1].annotationId)
      } else {
        this.DelMeasureDistanceAnnotation(annotation[1].annotationId)
      }
    })
    this.originViewer = viewer
    this.GetAnnotationList(this.slideNumber)
    this.GetMeasureDistanceList()
  }
  GetAnnotationList (slideNumber: string) {
    GET_ANNOTATION_LIST({
      imageId: this.slideInfo.strid
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        // 防止标注和切片对不上
        if (this.slideInfo.slideNumber !== slideNumber) {
          return false
        }
        const list = res.data.data.stamps
        list.forEach((item: any) => {
          if (item.area) {
            this.markerLineList.push(item)
          } else {
            this.annotationList.push(item)
          }
        })
      } else {
        ErrorHandler(res)
      }
    })
  }
  GetMeasureDistanceList () {
    GET_SLIDE_MEASURE_DISTANCE_LIST({
      imageId: this.slideInfo.strid
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const list = res.data.data.data
        if (list.length) {
          this.markerLineList = this.markerLineList.concat(list)
        }
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 初始化标注绘制对象
  InitAnnotation (viewer: object, slide: any) {
    return Annotation.init({
      viewer,
      imageHeight: slide.height,
      imageWidth: slide.width,
      pixelRatio: slide.pixelSize
    })
  }
  // 服务器获取的数据格式化成页面需要的数据
  FormatAnnotationToPage (annotationSever: any, slide: any) {
    const arrTemp = []
    const content = JSON.parse(annotationSever.content)
    const rgb = annotationSever.rgb || 'red'
    switch (annotationSever.shapeType) {
      case 'Ellipse':
        const rx = Number.prototype.toFixed.call((Number(content.endPoint.x) - Number(content.startPoint.x)) / 2 / Number(slide.width) * 100, 2)
        const ry = Number.prototype.toFixed.call((Number(content.endPoint.y) - Number(content.startPoint.y)) / 2 / Number(slide.height) * 100, 2)
        const cx = Number.prototype.toFixed.call(Number(content.startPoint.x) / Number(slide.width) * 100 + Number(rx), 2)
        const cy = Number.prototype.toFixed.call(Number(content.startPoint.y) / Number(slide.height) * 100 + Number(ry), 2)
        arrTemp.push('ellipse', {
          id: `ellipse_${annotationSever.guid}`,
          annotationId: annotationSever.guid,
          cx,
          cy,
          rx,
          ry,
          stroke: rgb,
          fill: 'none',
          'stroke-width': Number(content.width) * 0.5
        })
        break
      case 'Rectangle':
        const x = Number.prototype.toFixed.call(Number(content.startPoint.x) / Number(slide.width) * 100, 2)
        const y = Number.prototype.toFixed.call(Number(content.startPoint.y) / Number(slide.height) * 100, 2)
        const width = Number.prototype.toFixed.call((Number(content.endPoint.x) - Number(content.startPoint.x)) / Number(slide.width) * 100, 2)
        const height = Number.prototype.toFixed.call((Number(content.endPoint.y) - Number(content.startPoint.y)) / Number(slide.height) * 100, 2)
        arrTemp.push('rect', {
          id: `rect_${annotationSever.guid}`,
          annotationId: annotationSever.guid,
          x,
          y,
          width,
          height,
          stroke: rgb,
          fill: 'none',
          'stroke-width': Number(content.width) * 0.5
        })
        break
      case 'Curve':
      default:
        const points = content.points.map((item: any) => {
          const x = Number.prototype.toFixed.call(Number(item.x) / Number(slide.width) * 100, 2)
          const y = Number.prototype.toFixed.call(Number(item.y) / Number(slide.height) * 100, 2)
          return [x, y]
        })
        arrTemp.push('polyline', {
          id: `polyline_${annotationSever.guid}`,
          annotationId: annotationSever.guid,
          points: points.join(' '),
          stroke: rgb,
          fill: 'none',
          opacity: 1,
          'stroke-width': Number(content.width) * 0.5
        })
    }
    return arrTemp
  }
  // 把标注渲染到切片上
  RenderAnnotation (annotations: any[]) {
    if (annotations.length > 0) {
      const annotationObj: { [prop: string]: any } = {}
      annotations.forEach((item: any) => {
        const annotation: any = this.FormatAnnotationToPage(item, this.slideInfo)
        annotationObj[annotation[1].annotationId] = annotation
      })
      this.annotationDrawer.setAnnotations(annotationObj)
    } else {
      if (this.annotationDrawer) {
        this.annotationDrawer.cleanAnnotations()
      }
    }
  }
  // 把测距,测面积标注渲染到切片上
  RenderMarkerLine (markerLineList: any[]) {
    if (markerLineList.length > 0) {
      const markerLines: { [prop: string]: any } = {}
      const markers = this.annotationDrawer.getMarkers()
      markerLineList.forEach((item: any) => {
        if (item.area) {
          const content = JSON.parse(item.content)
          const annotationId = content.guid
          const points = content.points.map((item: any) => {
            const x = Number.prototype.toFixed.call(Number(item.x) / Number(this.slideInfo.width) * 100, 2)
            const y = Number.prototype.toFixed.call(Number(item.y) / Number(this.slideInfo.height) * 100, 2)
            return [x, y]
          })
          markerLines[annotationId] = [
            'polygon',
            {
              id: `measureArea_${annotationId}`,
              annotationId,
              type: 'measureArea',
              points: points.join(' '),
              stroke: content.color || '#498FF9',
              fill: 'none',
              'stroke-width': 3
            }
          ]
          if (!markers[annotationId]) {
            markers[annotationId] = []
          }
          markers[annotationId].push([
            'span',
            {
              id: `tip_${annotationId}`,
              annotationId,
              class: 'measure-tip',
              style: {
                top: `${points[0][1]}%`,
                left: `${points[0][0]}%`,
                transform: 'translate(20px, -2px)',
                'background-color': '#498FF9'
              }
            },
            `${Number(item.area).toFixed(2)}μm²`
          ])
        } else {
          const content = JSON.parse(item.slideDistance)
          const annotationId = content.guid
          const points = content.points.map((item: any) => {
            const x = Number.prototype.toFixed.call(Number(item.x) / Number(this.slideInfo.width) * 100, 2)
            const y = Number.prototype.toFixed.call(Number(item.y) / Number(this.slideInfo.height) * 100, 2)
            return [x, y]
          })
          markerLines[annotationId] = [
            'line',
            {
              id: `meameasureDistance_${annotationId}`,
              annotationId,
              type: 'measureDistance',
              x1: points[0][0],
              y1: points[0][1],
              x2: points[1][0],
              y2: points[1][1],
              stroke: content.color || '#F9793B',
              'stroke-width': 3
            }
          ]
          if (!markers[annotationId]) {
            markers[annotationId] = []
          }
          const center = {
            x: (Number(points[0][0]) + Number(points[1][0])) / 2,
            y: (Number(points[0][1]) + Number(points[1][1])) / 2
          }
          markers[annotationId].push([
            'span',
            {
              id: `tip_${annotationId}`,
              annotationId,
              class: 'measure-tip',
              style: {
                top: `${center.y}%`,
                left: `${center.x}%`,
                'background-color': content.color || '#F9793B'
              }
            },
            content.distance
          ])
        }
      })
      this.annotationDrawer.setMarkerLines(markerLines)
      this.annotationDrawer.setMarkers(markers)
    } else {
      if (this.annotationDrawer) {
        this.annotationDrawer.cleanMarkers()
      }
    }
  }
  // 点击截屏
  ToggleMeasureScreenshot () {
    if (this.measureScreenshotStatus) {
      return
    }
    this.measureScreenshotStatus = !this.measureScreenshotStatus
    $('#svg_wrapper').css('display', 'none')
    if (this.measureScreenshotStatus) {
      html2canvas(this.$refs['screenshot'], {
        removeContainer: true
      }).then((canvas: any) => {
        $('#svg_wrapper').css('display', 'block')
        const tmpUrl = canvas.toDataURL()
        this.screenshotUrl = tmpUrl
        this.showScreenshot = !this.showScreenshot
      })
    }
  }
  // base64 图转 文件格式
  base64ToFile (data: any) {
    const binary = atob(data.split(',')[1])
    const mime = data.split(',')[0].match(/:(.*?);/)[1]
    const array = []
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i))
    }
    const fileData = new Blob([new Uint8Array(array)], {
      type: mime
    })
    const file = new File([fileData], `${new Date().getTime()}.png`, { type: mime })
    return file
  }
  // 点击截图框取消
  ClickCancel () {
    this.measureScreenshotStatus = !this.measureScreenshotStatus
    this.showScreenshot = false
    this.screenshotDetails = ''
  }
  // 点击截图框保存
  ClickSave () {
    if (this.screenshotDetails.length >= 30) {
      layer.msg('字数不能超过30哦！')
    } else if (this.screenshotNum === 4) {
      layer.msg('最多四张截图哦')
    } else {
      const file = this.base64ToFile(this.screenshotUrl)
      // const file = this.screenshotUrl
      const formData = new FormData()
      const slideNumber = this.slideNumber.substring(0, this.slideNumber.lastIndexOf('-'))
      formData.append('file', file)
      formData.append('medicalRecordNumber', slideNumber)
      formData.append('message', this.screenshotDetails)
      formData.append('slideNumber', this.slideNumber)
      Axios.post(`${API.UPLOADING_SCREENSHOT_URL}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        if (res.data.success) {
          this.screenshotNum++
          layer.msg('保存成功！')
          this.$emit('monitorRefresh')
          this.ClickCancel()
        }
      })
    }
  }
  // 右上角叉号
  ShowFalse () {
    // 初始化某些配置项
    this.$emit('monitorRefresh')
    this.ClickCancel()
    this.show = false
  }
  // 测距/移动
  ToggleMeasureDistance () {
    if (!this.measureDistanceStatus) {
      this.annotationDrawer.onStartDraw({ type: 'measureDistance', color: '#F9793B' })
      this.measureDistanceStatus = true
      this.measureAreaStatus = false
      this.measureScreenshotStatus = false
      this.showScreenshot = false
    } else {
      this.annotationDrawer.onStopDraw()
      this.measureDistanceStatus = false
    }
  }
  // 测距/移动
  ToggleMeasureArea () {
    if (!this.measureAreaStatus) {
      this.annotationDrawer.onStartDraw({ type: 'measureArea', color: '#498FF9' })
      this.measureAreaStatus = true
      this.measureDistanceStatus = false
      this.measureScreenshotStatus = false
      this.showScreenshot = false
    } else {
      this.annotationDrawer.onStopDraw()
      this.measureAreaStatus = false
    }
  }
  // 测量区域中某个区域的面积
  MeasureArea (annotation: any) {
    const points: any = []
    const annotationPoints = annotation[1].points.split(' ')
    if (annotationPoints.length) {
      annotationPoints.forEach((pointString: any) => {
        const point = pointString.split(',')
        points.push({
          x: Math.round(Number(point[0]) * this.slideInfo.width) / 100,
          y: Math.round(Number(point[1]) * this.slideInfo.height) / 100
        })
      })
    }
    // 增加面积显示和删除按钮
    const annotationId = annotation[1].annotationId
    const markers = this.annotationDrawer.getMarkers()
    const markerLines = this.annotationDrawer.getMarkerLines()
    SAVE_SLIDE_MEASURE_AREA({
      imageId: this.slideInfo.strid,
      guid: annotation[1].annotationId,
      source: 'pc',
      points,
      color: annotation[1].stroke
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const area = res.data.data.slideArea.areaActual
        markers[annotationId].push([
          'span',
          {
            id: `tip_${annotationId}`,
            annotationId,
            class: 'measure-tip',
            style: {
              top: markers[annotationId][0][1].style.top,
              left: markers[annotationId][0][1].style.left,
              transform: 'translate(20px, -2px)',
              'background-color': '#498FF9'
            }
          },
          `${Number(area).toFixed(2)}μm²`
        ])
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 删除测面积的标注
  DelMeasureAreaAnnotation (annotationId: string) {
    DEL_SLIDE_MEASURE_AREA({
      guid: annotationId
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        layer.msg(res.data.message)
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 测距
  MeasureDistance (annotation: any) {
    const points: any = [
      {
        x: Math.round(Number(annotation[1].x1) * this.slideInfo.width) / 100,
        y: Math.round(Number(annotation[1].y1) * this.slideInfo.height) / 100
      },
      {
        x: Math.round(Number(annotation[1].x2) * this.slideInfo.width) / 100,
        y: Math.round(Number(annotation[1].y2) * this.slideInfo.height) / 100
      }
    ]
    // 增加面积显示和删除按钮
    const annotationId = annotation[1].annotationId
    const markers = this.annotationDrawer.getMarkers()
    SAVE_SLIDE_MESASURE_DISTANCE({
      imageId: this.slideInfo.strid,
      guid: annotation[1].annotationId,
      source: 'pc',
      points,
      color: annotation[1].stroke,
      distance: markers[annotationId][0][2]
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        layer.msg(res.data.message)
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 删除测距的标注
  DelMeasureDistanceAnnotation (annotationId: string) {
    DEL_SLIDE_MESASURE_DISTANCE({
      guid: annotationId
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        layer.msg(res.data.message)
      } else {
        ErrorHandler(res)
      }
    })
  }
}
</script>

<style lang="less" scoped>
.drawer-outer-container{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999999;
  padding: 1.2rem 0.3rem 0.3rem;
  width: calc(100% - 0.3rem - 0.2rem - 6.64rem);
  height: 100%;
  box-sizing: border-box;
  background-color: rgba(46,46,53,0.6);
  .btn-close{
    position: absolute;
    top: 0;
    right: 0;
    width: 0.57rem;
    height: 0.52rem;
    background-image: url('~assets/images/report/btn_close.png');
    background-size: 0.92rem 0.92rem;
    background-position: 0 -0.4rem;
    cursor: pointer;
    &:hover{
      background-image: url('~assets/images/report/btn_close_hover.png');
    }
    &:active{
      background-image: url('~assets/images/report/btn_close_active.png');
    }
  }
  .drawer-inner-container{
    width: 100%;
    height: 100%;
    border-radius: 0.1rem;
    overflow: hidden;
    background-color: #fff;
    position: relative;
    .drawer-header{
      position: relative;
      padding-left: 0.3rem;
      width: 100%;
      height: 1rem;
      box-sizing: border-box;
      background-color: #F4F4F4;
      .title{
        padding-left: 0.36rem;
        float: left;
        position: relative;
        font-size:0.28rem;
        font-weight:500;
        color:rgba(213,125,167,1);
        line-height: 1rem;
        &::after{
          content: '';
          position: absolute;
          top: 0.45rem;
          left: 0;
          display: block;
          width: 0.1rem;
          height: 0.1rem;
          border-radius: 50%;
          background-color: rgba(213,125,167,1);
        }
      }
      .btn-group{
        position: absolute;
        top: 0.2rem;
        right: 0.2rem;
        z-index: 999;
        width: auto;
        height: 0.6rem;

        .btn-measure-container{
          float: left;
          width: 1.4rem;
          height: 0.6rem;
          border-radius: 0.3rem;
          background-color: rgba(254,118,95,0.2);
          cursor: pointer;
          &.active{
            background-color: #F9793B;
            .icon-measure{
              background-image: url('~assets/images/report/icon_measure_active.png');
            }
            .btn-text{
              color: #fff;
            }
          }
          &:hover{
            background-color: #F9793B;
            .icon-measure{
              background-image: url('~assets/images/report/icon_measure_active.png');
            }
            .btn-text{
              color: #fff;
            }
          }
          .icon-measure{
            float: left;
            margin: 0.13rem 0.06rem 0.13rem 0.14rem;
            width: 0.34rem;
            height: 0.34rem;
            background-image: url('~assets/images/report/icon_measure.png');
            background-size: 100%;
          }
          .btn-text{
            font-size:0.22rem;
            font-weight:400;
            color:#F9793B;
            line-height:0.6rem;
          }
        }
        .btn-acreage-container{
          float: left;
          margin-left: 0.3rem;
          width: 1.4rem;
          height: 0.6rem;
          border-radius: 0.3rem;
          background-color:rgba(73,143,249,0.2);
          cursor: pointer;
          &.active{
            background:rgba(73,143,249,1);
            .icon-acreage{
              background-image: url('~assets/images/report/icon_acreage_active.png');
            }
            .btn-text{
              color: #fff;
            }
          }
          &:hover{
            background:rgba(73,143,249,1);
            .icon-acreage{
              background-image: url('~assets/images/report/icon_acreage_active.png');
            }
            .btn-text{
              color: #fff;
            }
          }
          .icon-acreage{
            float: left;
            margin: 0.13rem 0.06rem 0.13rem 0.14rem;
            width: 0.34rem;
            height: 0.34rem;
            background-image: url('~assets/images/report/icon_acreage.png');
            background-size: 100%;
          }
          .btn-text{
            font-size:0.22rem;
            font-weight:400;
            color:#498FF9;
            line-height:0.6rem;
          }
        }
        .btn-screenshot-container {
          float: left;
          margin-right: 0.3rem;
          width: 1.4rem;
          height: 0.6rem;
          border-radius: 0.3rem;
          background-color: #959595;
          cursor: pointer;
          &.active{
            background-color: #44444B;
          }
          &:hover{
            background-color: #44444B;
          }
          .icon-screenshot{
            float: left;
            margin: 0.13rem 0.06rem 0.13rem 0.23rem;
            width: 0.34rem;
            height: 0.34rem;
            background-image: url('~assets/images/report/icon-screenshot.png');
            background-size: 100%;
          }
          .btn-text{
            font-size:0.22rem;
            font-weight:400;
            color:#fff;
            line-height:0.6rem;
          }
        }
      }
    }
    .drawer-panel{
      width: 100%;
      height: calc(100% - 1rem);
      background-color: #fff;
    }
    .box-container {
      // position: relative;
      height: calc(100% - 1rem);
      .shade {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0);
        position: absolute;
        z-index: 999;
      }
      .url-container {
        width: 10.2rem;
        height: 8.9rem;
        border: 0.09rem solid;
        border-color: rgba(2E, 2E, 35, .4);
        border-radius: 0.20rem;
        position: absolute;
        z-index: 999;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        overflow: hidden;
        img {
          width: 100%;
          height: 7rem;
        }
        .outer-box {
          font-size: 0.22rem;
          background: #fff;
          width: 100%;
          height: 1.9rem;
          text-align: center;
          margin-top: -0.2rem;
          input {
            margin: 0.19rem 0;
            width: 9.6rem;
            height: 0.7rem;
            border: 0.01rem solid #E5E5E5;
            border-radius: 0.1rem;
            padding-left: 0.2rem;
            outline: none;
          }
          input-placeholder {
            color: #999;
            font-size: 0.2rem;
          }
          & > div{
            height: 0.8rem;
            display: flex;
            margin-top: -0.1rem;
            align-items: center;
            justify-content: center;
            div {
              width: 1.3rem;
              height: 0.6rem;
              align-items: center;
              justify-content: center;
              text-align: center;
              line-height: 0.6rem;
              cursor: pointer;
            }
            :first-child {
              margin-right: 1.8rem;
              color: #fff;
              background-color: #D57DA7;
              border-radius: 1rem;
              &:hover{
                background-color: #DF92B7;
                box-shadow: 0 0.02rem 0.2rem rgba(223,146,183,0.53);
              }
              &.active{
                background-color: #D6709D;
              }
            }
            :last-child {
              // background-color: #D57DA7;
              // border: 0.01rem solid #D57DA7;
              color: #666666;
              border-radius: 1rem;
              border: 0.01rem solid #E5E5E5;
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
    }
  }
}
</style>
<style lang="less">
  .openseadragon-canvas{
    &:focus{
      outline: none !important;
    }
  }
</style>
