<template>
  <div class="result-wrapper">
    <div class="table-wrapper">
      <!-- 表格 -->
      <my-table class="table"
        ref="slide-table"
        :head="tableHead"
        :data="tableData"
        :totalCount="totalCount"
        :checkedList.sync="checkedList"
        :sortType.sync="searchCondition.sortType"
        :sortField.sync="searchCondition.sortField"
        :pageSize.sync="searchCondition.pageSize"
        :pageNo.sync="searchCondition.pageNo"
        :height="tableHeight"
        :status="tableStatus"
        :selectable="true"
        @sort="GetNewData()"
        @changePage="GetNewData()"
        @changePageSize="GetNewData()"
        @reload="GetNewData()">
        <template slot="predictStatus" slot-scope="{row}">
          <my-progressbar class="progressbar" v-if="row.predictCode === 2"
            :width="'100%'"
            :height="'0.1rem'"
            :percent="`${row.progress}%`"
            :innerColor="'#D57DA7'"
            :status="`已预测 ${row.progress}%`"/>
          <span class="process-status" v-else>
            {{row.predictStatus}}
          </span>
        </template>
        <template slot="operation" slot-scope="{ row, index }">
          <i class="icon icon-delete" title="删除切片" @click="ReadyDelSlide(true, index, row)"></i>
        </template>
      </my-table>
      <!-- 操作 -->
      <div class="operation-container" id="slide-operation">
        <div class="button-wrapper">
          <span class="btn-select-all"
            :class="{'active': checkedAll}"
            @click="ToggleCheckAll()">
            全选
          </span>
          <span class="btn btn-2" @click="ReadyDelSlide(false)">删除</span>
        </div>
      </div>
    </div>
    <!-- 删除切片 确认弹窗 -->
    <layer-del-slide ref="del-slide" @ok="AffirmDelSlide"/>
    <!-- 操作等待弹窗 -->
    <layer-onprocessing ref="onProcessing"/>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'

import layer from 'layer'
import { ErrorHandler, dateFormatter } from 'common'
import {
  GET_SLIDE_LIST,
  UPDATE_SLIDE_NUM,
  PREDICT_SLIDE,
  CANCEL_PREDICT,
  GET_PREDICTING_PROGRESS,
  UPDATE_SLIDE_INFO,
  DEL_SLIDES
} from 'service'

import MyTable from 'widget/MyTable/index.vue'
import MyPagenation from 'widget/MyPagenation/index.vue'
import MyProgressbar from 'widget/MyProgressbar/index.vue'
import LayerDelSlide from 'widget/MyLayer/delSlide.vue'
import LayerOnprocessing from 'widget/MyLayer/onProcessing.vue'

interface TableHeadItem {
  prop: string,
  label: string,
  width: string,
  sortable?: boolean,
  textAlign?: string,
  textIndent?: string
}
interface SearchCondition {
  sortType: string,
  sortField: string,
  pageSize: number,
  pageNo: number,
  status?: {
    id: string,
    value: string
  },
  uploadDateFrom?: string,
  uploadDateTo?: string,
  caseNum?: string
  [prop: string]: any
}

@Component({
  components: {
    MyTable,
    MyPagenation,
    MyProgressbar,
    LayerDelSlide,
    LayerOnprocessing
  }
})
export default class SlideManageResult extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  // 数据初分配 表格
  tableHead: TableHeadItem[] = [
    {
      prop: 'slideNum',
      label: '切片号',
      width: '20%',
      sortable: true
    }, {
      prop: 'organ',
      label: '器官',
      width: '15%',
      sortable: true
    }, {
      prop: 'markCount',
      label: '刀痕数',
      width: '15%',
      sortable: true
    }, {
      prop: 'uploadDate',
      label: '上传日期',
      width: '15%',
      sortable: true
    }, {
      prop: 'predictStatus',
      label: '预测状态',
      width: '20%'
    }, {
      prop: 'operation',
      label: '操作',
      width: '10%'
    }
  ]
  tableData: any[] = []
  totalCount: number = 0
  checkedList: any[] = []
  tableHeight: number = -1
  tableStatus: string = 'initial'
  searchCondition: SearchCondition = {
    sortType: 'desc',
    sortField: 'slideNum',
    pageSize: 10,
    pageNo: 1
  }
  timer: any = {}

  get checkedAll () {
    return this.tableData.length !== 0 && this.checkedList.length === this.tableData.length
  }

  beforeMount () {
    // 监听搜索事件
    this.$on('search', (obj: SearchCondition) => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          this.searchCondition[key] = obj[key]
        }
      }
      this.searchCondition.pageNo = 1
      this.GetSlideList(this.searchCondition)
    })
  }
  mounted () {
    this.WindowResize()
    window.onresize = this.WindowResize
  }
  beforeDestroy () {
    this.ClearTimer()
  }

  // 页面响应式
  WindowResize () {
    const bodyViewHeight = document.body.clientHeight
    // 计算列表之外的dom高度
    let headHeight: number = 0
    let searchHeight: number = 0
    let operationHeight: number = 0
    const headElement = document.getElementById('header')
    const searchElement = document.getElementById('slide-search')
    const operationElement = document.getElementById('slide-operation')
    if (headElement) {
      headHeight = headElement.scrollHeight
    }
    if (searchElement) {
      searchHeight = searchElement.scrollHeight
    }
    if (operationElement) {
      operationHeight = operationElement.scrollHeight
    }
    this.tableHeight = bodyViewHeight - headHeight - searchHeight - operationHeight - 30
  }
  // 获取[切片列表]
  GetSlideList (obj: SearchCondition) {
    let timer: number = 0
    let orderName

    if (obj.sortType) {
      switch (obj.sortField) {
        case 'slideNum':
          orderName = 'slideNumber'
          break
        case 'markCount':
          orderName = 'knifeMarkCount'
          break
        case 'uploadDate':
          orderName = 'updateDate'
          break
        default:
          orderName = ''
      }
    } else {
      orderName = ''
    }
    GET_SLIDE_LIST({
      slideNumber: obj.slideNum,
      updateDate: obj.uploadDateFrom,
      updateEndDate: obj.uploadDateTo,
      order: obj.sortType,
      orderName,
      pageNo: obj.pageNo,
      pageSize: obj.pageSize
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        window.clearTimeout(timer)
        this.tableStatus = 'succeed'
        const list = res.data.data.list
        if (!list.length && this.searchCondition.pageNo > 1) {
          this.searchCondition.pageNo--
          this.GetNewData()
        }
        // 数据处理
        list.forEach((item: any) => {
          item.id = item.stringId
          item.slideNum = item.slideNumber
          item.organ = item.organName
          item.markCount = item.knifeMarkCount
          item.uploadDate = dateFormatter(item.updateDate)
          item.predictCode = item.aiPredictSlide
          item.predictStatus = item.aiPredictSlideName
        })
        this.tableData = list
        this.totalCount = res.data.data.total
        this.checkedList.splice(0)
        this.GetPredictingProgress()
      } else {
        window.clearTimeout(timer)
        this.tableStatus = 'failed'
        ErrorHandler(res)
      }
    }).catch(() => {
      window.clearTimeout(timer)
      this.tableStatus = 'failed'
    })
    // 超过 0.5 秒没有获取到数据显示 loading
    timer = window.setTimeout(() => {
      this.tableStatus = 'loading'
      this.totalCount = 0
      this.tableData = []
    }, 500)
  }
  // 获取新数据
  GetNewData () {
    this.GetSlideList(this.searchCondition)
  }
  // 切换页码
  ChangePage (pageNo: number) {
    this.searchCondition.pageNo = pageNo
    this.GetNewData()
  }
  // 请求切片自动预测进度
  GetPredictingProgress () {
    this.ClearTimer()
    if (!this.tableData.length) {
      return false
    }
    this.tableData.forEach((item: any) => {
      if (item.predictCode === 2) {
        this.InitTimer(item)
      }
    })
  }
  // 创建定时器获取切片预测进度
  InitTimer (slide: any) {
    this.timer[slide.id] = setTimeout(() => {
      GET_SLIDE_LIST({
        slideNumber: slide.slideNum
      }).then((res: AxiosRes) => {
        if (res.data.success) {
          slide.progress = res.data.data.list[0].progress
          if (slide.progress === 100) {
            this.GetNewData()
          } else {
            this.InitTimer(slide)
          }
        } else {
          ErrorHandler(res)
        }
      })
    }, 1000)
  }
  // 清除定时器
  ClearTimer () {
    for (const timerItem in this.timer) {
      if (this.timer.hasOwnProperty(timerItem)) {
        window.clearTimeout(this.timer[timerItem])
      }
    }
    this.timer = {}
  }
  // 全选/取消全选
  ToggleCheckAll () {
    this.$refs['slide-table'].$emit('toggleCheckAll')
  }
  // 准备[删除切片]
  ReadyDelSlide (singleFlag: boolean, index?: number, item?: any) {
    if (singleFlag) {
      this.$refs['del-slide'].$emit('pop', [item.id])
    } else {
      if (this.checkedList.length) {
        this.$refs['del-slide'].$emit('pop', this.checkedList)
      } else {
        layer.msg('没有选择切片')
      }
    }
  }
  // 确认删除
  AffirmDelSlide (ids: any[]) {
    let timer: number = 0
    DEL_SLIDES({
      imageIds: ids.join(',')
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        window.clearTimeout(timer)
        layer.closeAll()
        layer.msg(res.data.message)
        this.GetNewData()
      } else {
        ErrorHandler(res)
      }
    })
    // 超过 0.5 秒没有响应,显示正在处理图标
    timer = window.setTimeout(() => {
      this.$refs['onProcessing'].$emit('pop')
    }, 500)
  }
}
</script>

<style lang="less" scoped>
.result-wrapper{
  width: 100%;
  height: auto;

  .table-wrapper{
    position: relative;
    width: 100%;
    height: auto;
    border-radius: 0.1rem;
    box-shadow: 0 0.04rem 0.35rem rgba(149,129,196,0.18);
    background-color: #fff;

    .table{
      .slide-num-wrapper{
        margin: 0 auto;
        width: 100%;
        height: 100%;
        .slide-num-text{
          float: left;
          width: auto;
          max-width: calc(100% - 0.5rem);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .slide-num-input{
          display: inline-block;
          width: 100%;
          height: 0.4rem;
          border: 0.01rem solid #B56A9B;
          border-radius: 0.04rem;
          box-sizing: border-box;
          &:focus{
            outline: none;
          }
          &.warning{
            border: 0.01rem solid red;
          }
        }
        .icon-edit-2{
          float: left;
          height: 100%;
          width: 0.5rem;
          cursor: pointer;
          background-color: transparent;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 0.4rem 0.4rem;
          background-image: url('../../../assets/images/common/icon_edit_2.png');
          &:hover{
            background-image: url('../../../assets/images/common/icon_edit_2_hover.png');
          }
          &:active{
            background-image: url('../../../assets/images/common/icon_edit_2_active.png');
          }
        }
      }
      .progressbar{
        margin: 0.4rem auto 0;
      }
      .icon{
        display: inline-block;
        margin-right: 0.2rem;
        height: 1rem;
        width: 0.4rem;
        background-color: transparent;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100% auto;
        cursor: pointer;
      }
      .icon-predict{
        background-image: url('../../../assets/images/common/icon_smart.png');
        &:hover{
          background-image: url('../../../assets/images/common/icon_smart_hover.png');
        }
        &:active{
          background-image: url('../../../assets/images/common/icon_smart_active.png');
        }
      }
      .icon-cancel{
        background-image: url('../../../assets/images/common/icon_cancel_2.png');
        &:hover{
          background-image: url('../../../assets/images/common/icon_cancel_2_hover.png');
        }
        &:active{
          background-image: url('../../../assets/images/common/icon_cancel_2_active.png');
        }
      }
      .icon-edit{
        background-image: url('../../../assets/images/common/icon_edit.png');
        &:hover{
          background-image: url('../../../assets/images/common/icon_edit_active.png');
        }
        &:active{
          background-image: url('../../../assets/images/common/icon_edit_active.png');
        }
      }
      .icon-delete{
        background-image: url('../../../assets/images/common/icon_delete.png');
        &:hover{
          background-image: url('../../../assets/images/common/icon_delete_hover.png');
        }
        &:active{
          background-image: url('../../../assets/images/common/icon_delete_active.png');
        }
      }
      .icon-image{
        background-image: url('../../../assets/images/common/icon_image.png');
        &:hover{
          background-image: url('../../../assets/images/common/icon_image_hover.png');
        }
        &:active{
          background-image: url('../../../assets/images/common/icon_image_active.png');
        }
      }
    }
    .operation-container{
      height: 1.1rem;
      border-top: 0.02rem solid #F4F4F4;
      box-sizing: border-box;

      .button-wrapper{
        float:right;
        margin-top: 0.2rem;

        .btn{
          float: left;
          margin-right: 0.3rem;
          width: 1.76rem;
          height: 0.66rem;
          border-radius: 0.33rem;
          border: 0.02rem solid #D57DA7;
          font-size: 0.24rem;
          font-weight: normal;
          color: #D57DA7;
          text-align: center;
          line-height: 0.66rem;
          cursor: pointer;
        }
        .btn-select-all{
          float: left;
          margin-right: 0.3rem;
          width: 1.3rem;
          height: 0.66rem;
          background-repeat: no-repeat;
          background-size: 0.24rem 0.24rem;
          background-position: 0.5rem center;
          background-image: url('../../../assets/images/common/icon_check.png');
          font-size: 0.24rem;
          font-weight: normal;
          line-height: 0.66rem;
          text-align: right;
          color: #999;
          cursor: pointer;
          &.active{
            background-image: url('../../../assets/images/common/icon_checked.png')
          }
        }

        .btn-1{
          &:hover{
            color: #fff;
            background-color: #D57DA7;
          }
          &:active{
            color: #fff;
            background-color: #B56A9B;
          }
        }
        .btn-2{
          color: #FF5961;
          border: 0.02rem solid #FF5961;
          &:hover{
            color: #fff;
            background-color: #FF5961;
          }
          &:active{
            color: #fff;
            background-color: #E5484F;
          }
        }
      }
    }
  }
}
</style>
