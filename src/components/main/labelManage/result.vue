<template>
  <div class="result-wrapper">
    <div class="table-wrapper">
      <!-- 表格 -->
      <my-table class="table"
        ref="label-table"
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
        <template slot="labelColor" slot-scope="{ row }">
          <span class="label-color" :style="{'background-color': row.labelColor}"></span>
        </template>
        <template slot="labelCanUse" slot-scope="{ row }">
          <span>{{row.labelCanUse.name}}</span>
        </template>
        <template slot="labelDefault" slot-scope="{ row }">
          <span>{{row.labelDefault.name}}</span>
        </template>
        <template slot="labelLineType" slot-scope="{ row }">
          <div class="line-wrapper">
            <div class="line" :style="{'border-style': row.labelLineType.value}"></div>
          </div>
        </template>
        <template slot="operation" slot-scope="{ row, index }">
          <i class="icon icon-edit" title="标签修改" @click="ReadyEditLabel('update', row)"></i>
          <i class="icon icon-delete" title="删除标签" @click="ReadyDelLabel(true, index, row)"></i>
        </template>
      </my-table>
      <!-- 操作 -->
      <div class="operation-container" id="label-operation">
        <div class="button-wrapper">
          <span class="btn-select-all"
            :class="{'active': checkedAll}"
            @click="ToggleCheckAll()">
            全选
          </span>
          <span class="btn btn-1" @click="ReadyEditLabel('add')">添加</span>
          <span class="btn btn-2" @click="ReadyDelLabel(false)">删除</span>
        </div>
      </div>
    </div>
    <!-- 增加或更新标签 弹窗 -->
    <layer-edit-label ref="edit-label"
      @showColorPicker="showColorPicker()"
      @finishEdit="FinishEdit"/>
    <!-- 删除标签 确认弹窗 -->
    <layer-del-label ref="del-label" @ok="AffirmDelLabel"/>
    <!-- 操作等待弹窗 -->
    <layer-onprocessing ref="onProcessing"/>
    <!-- 颜色选择器 -->
    <layer-color-picker ref="color-picker" @pickColor="pickColor"/>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'

import layer from 'layer'
import { ErrorHandler, dateFormatter } from 'common'
import {
  GET_LABEL_LIST,
  UPDATE_LABEL,
  ADD_LABEL,
  DEL_LABEL
} from 'service'

import MyTable from 'widget/MyTable/index.vue'
import MyPagenation from 'widget/MyPagenation/index.vue'
import MyProgressbar from 'widget/MyProgressbar/index.vue'
import LayerDelLabel from 'widget/MyLayer/delLabel.vue'
import LayerOnprocessing from 'widget/MyLayer/onProcessing.vue'
import LayerEditLabel from 'widget/MyLayer/editLabel.vue'
import LayerColorPicker from 'widget/MyLayer/colorPicker.vue'

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
    LayerDelLabel,
    LayerOnprocessing,
    LayerEditLabel,
    LayerColorPicker
  }
})
export default class LabelManageResult extends Vue {
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
      prop: 'labelNum',
      label: '序号',
      width: '15%',
      sortable: false
    }, {
      prop: 'labelName',
      label: '病种',
      width: '15%',
      sortable: false
    }, {
      prop: 'labelColor',
      label: '颜色',
      width: '15%',
      sortable: false
    }, {
      prop: 'labelCanUse',
      label: '是否复原',
      width: '10%',
      sortable: false
    }, {
      prop: 'labelDefault',
      label: '是否默认',
      width: '10%',
      sortable: false
    }, {
      prop: 'labelLineType',
      label: '线型',
      width: '10%',
      sortable: false
    }, {
      prop: 'operation',
      label: '操作',
      width: '20%'
    }
  ]
  tableData: any[] = []
  totalCount: number = 0
  checkedList: any[] = []
  tableHeight: number = -1
  tableStatus: string = 'initial'
  searchCondition: SearchCondition = {
    sortType: 'desc',
    sortField: 'labelNum',
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
      this.GetLabelList(this.searchCondition)
    })
  }

  mounted () {
    this.WindowResize()
    window.onresize = this.WindowResize
    // this.GetLabelList(this.searchCondition)
  }

  // 页面响应式
  WindowResize () {
    const bodyViewHeight = document.body.clientHeight
    // 计算列表之外的dom高度
    let headHeight: number = 0
    let searchHeight: number = 0
    let operationHeight: number = 0
    const headElement = document.getElementById('header')
    const searchElement = document.getElementById('label-search')
    const operationElement = document.getElementById('label-operation')
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
  GetLabelList (searchCondition: SearchCondition) {
    let timer: number = 0

    GET_LABEL_LIST({
      diseaseId: searchCondition.organ.id,
      organType: searchCondition.organ.type,
      subType: searchCondition.labelType.classify
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        window.clearTimeout(timer)
        this.tableStatus = 'succeed'
        const list = res.data.data.organList
        // 数据处理
        const lineDict: any = {
          '1': {
            value: 'solid',
            id: 1
          },
          '2': {
            value: 'dashed',
            id: 2
          }
        }
        list.forEach((item: any) => {
          item.labelId = item.id
          item.labelNum = item.sort
          item.labelName = item.name
          item.labelColor = item.rgb
          item.labelLineType = lineDict[item.line] || {}
          item.labelCanUse = item.isRecovery ? { name: '是', value: 1 } : { name: '否', value: 0 }
          item.labelDefault = item.isDefault ? { name: '是', value: 1 } : { name: '否', value: 0 }
        })
        this.tableData = list
        // this.totalCount = res.data.data.total
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
    this.GetLabelList(this.searchCondition)
  }
  // 切换页码
  ChangePage (pageNo: number) {
    this.searchCondition.pageNo = pageNo
    this.GetNewData()
  }
  // 全选/取消全选
  ToggleCheckAll () {
    this.$refs['label-table'].$emit('toggleCheckAll')
  }
  // 准备[编辑标签]
  ReadyEditLabel (type: string, label?: any) {
    if (type === 'add') {
      this.$refs['edit-label'].$emit('pop', 'add')
    } else {
      this.$refs['edit-label'].$emit('pop', 'update', label)
    }
  }
  // 完成[完成编辑]
  FinishEdit (obj: any) {
    if (obj.editType === 'add') {
      ADD_LABEL({
        id: this.$route.params['organId'],
        sort: obj.labelNum,
        name: obj.labelName,
        rgb: obj.labelColor,
        isRecovery: obj.labelCanUse.value,
        isDefault: obj.labelDefault.value,
        subType: this.searchCondition.labelType.classify,
        line: obj.labelLineType.id
      }).then((res: AxiosRes) => {
        if (res.data.success) {
          layer.msg('添加成功')
          this.GetNewData()
        } else {
          ErrorHandler(res)
        }
      })
    } else {
      UPDATE_LABEL({
        id: obj.labelId,
        sort: obj.labelNum,
        name: obj.labelName,
        rgb: obj.labelColor,
        isRecovery: obj.labelCanUse.value,
        isDefault: obj.labelDefault.value,
        subType: this.searchCondition.labelType.classify,
        line: obj.labelLineType.id
      }).then((res: AxiosRes) => {
        if (res.data.success) {
          layer.msg('更新成功')
          this.GetNewData()
        } else {
          ErrorHandler(res)
        }
      })
    }
  }
  // 准备[删除切片]
  ReadyDelLabel (singleFlag: boolean, index?: number, item?: any) {
    if (singleFlag) {
      this.$refs['del-label'].$emit('pop', [item.id])
    } else {
      if (this.checkedList.length) {
        this.$refs['del-label'].$emit('pop', this.checkedList)
      } else {
        layer.msg('没有选择标签')
      }
    }
  }
  // 确认删除
  AffirmDelLabel (ids: any[]) {
    let timer: number = 0
    DEL_LABEL({
      diseaseIds: ids.join(',')
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
  showColorPicker () {
    this.$refs['color-picker'].$emit('pop')
  }
  pickColor (color: string) {
    this.$refs['edit-label'].$emit('pickColor', color)
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
      .label-color{
        display: inline-block;
        vertical-align: middle;
        height: 0.36rem;
        width: 0.84rem;
        border-radius: 0.06rem;
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
      .line-wrapper{
        height: 100%;
        .line{
          position: relative;
          top: 50%;
          width: 70%;
          border: 0.005rem solid #333;
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
