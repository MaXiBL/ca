<template>
  <div class="result-wrapper">
    <div class="table-wrapper">
      <!-- 表格 -->
      <my-table class="table"
        ref="case-table"
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
        :selectable="false"
        @sort="GetNewData()"
        @changePage="GetNewData()"
        @changePageSize="GetNewData()"
        @reload="GetNewData()">
        <template slot="operation" slot-scope="{ row }">
          <span class="icon btn-report disable"  v-if="row.caseStatus === 0">查看报告</span>
          <span class="icon btn-report" v-else @click="GetReport(row.caseNum)">查看报告</span>
        </template>
      </my-table>
      <!-- 操作 -->
      <!-- <div class="operation-container" id="case-operation">
        <div class="button-wrapper">
          <span class="btn-select-all"
            :class="{'active': checkedAll}"
            @click="ToggleCheckAll()">
            全选
          </span>
          <span class="btn btn-2" @click="ReadyDelCase()">删除</span>
        </div>
      </div> -->
    </div>
    <!-- 操作等待弹窗 -->
    <layer-onprocessing ref="onProcessing"/>
    <!-- 报告弹窗 -->
    <layer-report ref="report"/>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'

import layer from 'layer'
import { ErrorHandler, dateFormatter } from 'common'
import {
  GET_CASE_LIST,
  GET_CASE_REPORT
} from 'service'

import MyTable from 'widget/MyTable/index.vue'
import MyPagenation from 'widget/MyPagenation/index.vue'
import LayerOnprocessing from 'widget/MyLayer/onProcessing.vue'
import LayerReport from 'widget/MyLayer/report.vue'

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
  reviewStatus?: {
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
    LayerOnprocessing,
    LayerReport
  }
})
export default class CaseManageResult extends Vue {
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
      prop: 'caseNum',
      label: '病理号',
      width: '20%',
      sortable: true
    }, {
      prop: 'createDate',
      label: '入库时间',
      width: '15%',
      sortable: true
    }, {
      prop: 'finishDate',
      label: '完成时间',
      width: '15%',
      sortable: true
    }, {
      prop: 'markCount',
      label: '刀痕数',
      width: '15%',
      sortable: true
    }, {
      prop: 'riskRatio',
      label: '风险比例',
      width: '15%',
      sortable: false
    }, {
      prop: 'operation',
      label: '操作',
      width: '15%'
    }
  ]
  tableData: any[] = []
  totalCount: number = 0
  checkedList: any[] = []
  tableHeight: number = -1
  tableStatus: string = 'initial'
  searchCondition: SearchCondition = {
    sortType: 'desc',
    sortField: 'caseNum',
    pageSize: 10,
    pageNo: 1
  }
  timer: number = 0
  onProcessing: boolean = true

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
      this.GetCaseList(this.searchCondition)
    })
  }
  mounted () {
    this.WindowResize()
    window.onresize = this.WindowResize
    this.GetCaseList(this.searchCondition)
  }

  // 页面响应式
  WindowResize () {
    const bodyViewHeight: number = document.body.clientHeight
    // 计算列表之外的dom高度
    let headHeight: number = 0
    let searchHeight: number = 0
    let operationHeight: number = 0
    const headElement = document.getElementById('header')
    const searchElement = document.getElementById('case-search')
    const operationElement = document.getElementById('case-operation')
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
  GetCaseList (obj: SearchCondition) {
    let timer: number = 0
    // let statusId
    let orderName

    // if (obj.reviewStatus && obj.reviewStatus.id !== 'all') {
    //   statusId = obj.reviewStatus.id
    // } else {
    //   statusId = ''
    // }

    if (obj.sortType) {
      switch (obj.sortField) {
        case 'caseNum':
          orderName = 'medicalRecordNumber'
          break
        case 'createDate':
          orderName = 'createDate'
          break
        case 'finishDate':
          orderName = 'updateDate'
          break
        case 'markCount':
          orderName = 'knifeMarkCount'
          break
        default:
          orderName = ''
      }
    } else {
      orderName = ''
    }
    GET_CASE_LIST({
      medicalRecordNumber: obj.caseNum,
      createDate: obj.uploadDateFrom,
      createEndDate: obj.uploadDateTo,
      order: obj.sortType,
      orderName,
      pageNo: obj.pageNo,
      pageSize: obj.pageSize
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        window.clearTimeout(timer)
        this.tableStatus = 'succeed'
        const list = res.data.data.photoList
        if (!list.length && this.searchCondition.pageNo > 1) {
          this.searchCondition.pageNo--
          this.GetNewData()
        }
        // 数据处理
        list.forEach((item: any) => {
          item.caseId = item.id
          item.caseNum = item.medicalRecordNumber
          item.markCount = item.knifeMarkCount
          item.createDate = dateFormatter(item.createDate)
          item.finishDate = dateFormatter(item.updateDate)
          item.status = item.statusName
          item.riskRatio = item.risk
          item.organ = item.organName || '暂无'
        })
        this.tableData = list
        this.totalCount = res.data.data.total
        this.checkedList.splice(0)
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
    this.GetCaseList(this.searchCondition)
  }
  // 切换页码
  ChangePage (pageNo: number) {
    this.searchCondition.pageNo = pageNo
    this.GetNewData()
  }
  // 全选/取消全选
  ToggleCheckAll () {
    this.$refs['case-table'].$emit('toggleCheckAll')
  }
  // 查看报告
  GetReport (caseNum: string) {
    this.$router.push(`/report/${caseNum}/edit`)
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
      .case-num-wrapper{
        margin: 0 auto;
        width: 100%;
        height: 100%;
        .case-num-text{
          float: left;
          width: auto;
          max-width: calc(100% - 0.5rem);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .case-num-input{
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
      .icon-smart{
        background-image: url('../../../assets/images/common/icon_smart.png');
        &:hover{
          background-image: url('../../../assets/images/common/icon_smart_active.png');
        }
        &:active{
          background-image: url('../../../assets/images/common/icon_smart_active.png');
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
      .icon-file{
        background-image: url('../../../assets/images/common/icon_file.png');
        &:hover{
          background-image: url('../../../assets/images/common/icon_file_active.png');
        }
        &:active{
          background-image: url('../../../assets/images/common/icon_file_active.png');
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
      .icon-report{
        background-image: url('../../../assets/images/common/icon_report.png');
        &:hover{
          background-image: url('../../../assets/images/common/icon_report_hover.png');
        }
        &:active{
          background-image: url('../../../assets/images/common/icon_report_active.png');
        }
      }
      .btn-report{
        width: 1.3rem;
        height: 0.6rem;
        border-radius: 0.1rem;
        background-color: #D57DA7;
        box-shadow:0rem 0rem 0.16rem 0.02rem rgba(170,77,138,0.54);
        font-size:0.22rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:0.6rem;
        text-align: center;
        cursor: pointer;
        &.disable{
          background-color: #DADDE1;
          box-shadow:0rem 0rem 0.16rem 0.02rem rgba(218,221,225,0.54);
          cursor: not-allowed;
          &:hover,
          &:active{
            background-color: #DADDE1;
          }
        }
        &:hover{
          background-color: #ED95BF;
        }
        &:active{
          background-color: #B56A9B;
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
