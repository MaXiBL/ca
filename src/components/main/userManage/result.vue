<template>
  <div class="result-wrapper">
    <div class="table-wrapper">
      <!-- 表格 -->
      <my-table class="table"
        :head="tableHead"
        :data="tableData"
        :totalCount="totalCount"
        :checkedList.sync="checkedList"
        :pageSize.sync="searchCondition.pageSize"
        :pageNo.sync="searchCondition.pageNo"
        :height="tableHeight"
        :status="tableStatus"
        @sort="GetNewData()"
        @changePage="GetNewData()"
        @changePageSize="GetNewData()"
        @reload="GetNewData()">
        <template slot="operate" slot-scope="{row, index}">
          <i class="icon icon-edit" @click="ReadyModifyUser(row, index)"></i>
          <i class="icon icon-delete" @click="ReadyDelUser(true, row, index)"></i>
          <i class="icon icon-pwd" @click="ReadyModifyUserPwd(row, index)"></i>
        </template>
      </my-table>
      <!-- 操作 -->
      <div class="operation-container" id="user-operation">
        <div class="button-wrapper-left">
          <span class="btn btn-3" @click="ReadyAddNewUser()">添加用户</span>
        </div>
        <div class="button-wrapper-right">
          <span class="btn btn-1" @click="ReadyModifyUsers()">修改</span>
        </div>
      </div>
    </div>
    <!-- 修改单个用户信息 弹窗 -->
    <layer-modify-user ref="modify-user" @ok="GetNewData()"/>
    <!-- 修改多个用户信息 弹窗 -->
    <layer-modify-users ref="modify-users"  @ok="GetNewData()"/>
    <!-- 修改用户密码 弹窗 -->
    <layer-modify-user-pwd ref="modify-user-pwd" @ok="AffirmModifyUserPwd"/>
    <!-- 删除用户 弹窗 -->
    <layer-del-user ref="del-user" @ok="AffirmDelUser"/>
    <!-- 增加用户 弹窗 -->
    <layer-add-new-user ref="add-new-user"  @ok="GetNewData()"/>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'

import layer from 'layer'
import { ErrorHandler } from 'common'
import {
  GET_USER_LIST,
  DEL_USER,
  UPDATE_USER_PWD
} from 'service'

import MyTable from 'widget/MyTable/index.vue'
import MyPagenation from 'widget/MyPagenation/index.vue'
import LayerDelUser from 'widget/MyLayer/delUser.vue'
import LayerModifyUser from 'widget/MyLayer/modifySingleUser.vue'
import LayerModifyUsers from 'widget/MyLayer/modifyMultiUser.vue'
import LayerModifyUserPwd from 'widget/MyLayer/modifyUserPwd.vue'
import LayerAddNewUser from 'widget/MyLayer/addNewUser.vue'

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
  hospital?: {
    id: string,
    value: string
  },
  role?: {
    id: string,
    value: string
  },
  userName?: string

  [prop: string]: any
}

@Component({
  components: {
    MyTable,
    MyPagenation,
    LayerDelUser,
    LayerModifyUser,
    LayerModifyUsers,
    LayerModifyUserPwd,
    LayerAddNewUser
  }
})
export default class UserManageResult extends Vue {
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
      prop: 'userID',
      label: '用户编号',
      width: '15%'
    },
    {
      prop: 'hospital',
      label: '医院',
      width: '15%'
    }, {
      prop: 'loginName',
      label: '登录名',
      width: '15%'
    }, {
      prop: 'userName',
      label: '用户姓名',
      width: '10%'
    }, {
      prop: 'role',
      label: '用户角色',
      width: '10%'
    }, {
      prop: 'remark',
      label: '备注信息',
      width: '15%'
    }, {
      prop: 'operate',
      label: '操作',
      width: '15%'
    }
  ]
  tableData: any[] = []
  checkedList: any[] = []
  tableHeight: number = -1
  tableStatus: string = 'initial'
  totalCount: number = 0
  searchCondition: SearchCondition = {
    sortType: 'asc',
    sortField: 'loginName',
    pageSize: 10,
    pageNo: 1
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
      this.GetUserList(this.searchCondition)
    })
  }
  mounted () {
    this.WindowResize()
    window.onresize = this.WindowResize
  }

  // 页面响应式
  WindowResize () {
    const bodyViewHeight = document.body.clientHeight
    // 计算列表之外的dom高度
    let headHeight: number = 0
    let searchHeight: number = 0
    let operationHeight: number = 0
    const headElement = document.getElementById('header')
    const searchElement = document.getElementById('user-search')
    const operationElement = document.getElementById('user-operation')
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
  // 获取[用户列表]
  GetUserList (obj: SearchCondition) {
    let timer: number = 0
    let orderName
    let hospitalId
    let userType
    const userName = obj.userName

    if (obj.sortType) {
      switch (obj.sortField) {
        case 'loginName':
          orderName = 'loginName'
          break
        case 'userName':
          orderName = 'name'
          break
        default:
          orderName = ''
      }
    } else {
      orderName = ''
    }

    if (obj.hospital && obj.hospital.id !== 'all') {
      hospitalId = obj.hospital.id
    } else {
      hospitalId = ''
    }

    if (obj.role && obj.role.id !== 'all') {
      userType = obj.role.id
    } else {
      userType = ''
    }

    GET_USER_LIST({
      order: obj.sortType,
      orderName,
      pageNo: obj.pageNo,
      pageSize: obj.pageSize,
      name: userName,
      userType,
      companyId: hospitalId
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        window.clearTimeout(timer)
        this.tableStatus = 'succeed'
        const list = res.data.data.list
        // 数据处理
        list.forEach((item: any) => {
          item.userID = item.userId
          item.id = item.userId
          item.hospital = item.hospitalName
          item.userName = item.name
          item.role = item.userTypeName
          item.remark = item.remarks
        })
        this.tableData = list
        this.totalCount = res.data.data.count
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
    this.GetUserList(this.searchCondition)
  }
  // 准备 [增加用户]
  ReadyAddNewUser () {
    this.$refs['add-new-user'].$emit('pop')
  }
  // 准备 [修改单个用户信息]
  ReadyModifyUser (item: any, index: number) {
    this.$refs['modify-user'].$emit('pop', item)
  }
  // 准备 [修改多个用户信息]
  ReadyModifyUsers () {
    if (this.checkedList.length) {
      this.$refs['modify-users'].$emit('pop', this.checkedList)
    } else {
      layer.msg('没有选择用户')
    }
  }
  // 准备 [删除用户]
  ReadyDelUser (singleFlag: boolean, item: any, index: number) {
    if (singleFlag) {
      this.$refs['del-user'].$emit('pop', [item.id])
    } else if (this.checkedList.length) {
      this.$refs['del-user'].$emit('pop', this.checkedList)
    }
  }
  // 确认 [删除用户]
  AffirmDelUser (obj: any) {
    // 处理参数
    const userIds = obj.userIds.join(',')
    DEL_USER({
      userId: userIds,
      password: obj.userPwd
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        layer.closeAll()
        layer.msg(res.data.message)
        this.GetUserList(this.searchCondition)
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 准备 [修改用户密码]
  ReadyModifyUserPwd (item: any, index: number) {
    this.$refs['modify-user-pwd'].$emit('pop', item.id)
  }
  // 确认 [修改用户密码]
  AffirmModifyUserPwd (obj: any) {
    UPDATE_USER_PWD({
      userId: obj.userId,
      newPassword: obj.newPwd
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
.result-wrapper{
  width: 100%;
  height: 2rem;

  .table-wrapper{
    position: relative;
    width: 100%;
    height: auto;
    border-radius: 0.1rem;
    box-shadow: 0 0.04rem 0.35rem rgba(149,129,196,0.18);
    background-color: #fff;

    .table{
      .icon{
        display: inline-block;
        margin-right:0.15rem;
        height: 1rem;
        width: 0.4rem;
        background-color: transparent;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100% auto;
        cursor: pointer;
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
      .icon-pwd{
        background-image: url('../../../assets/images/common/icon_pwd.png');
        &:hover{
          background-image: url('../../../assets/images/common/icon_pwd_active.png');
        }
        &:active{
          background-image: url('../../../assets/images/common/icon_pwd_active.png');
        }
      }
    }
    .operation-container{
      height: 1.1rem;
      border-top: 0.02rem solid #F4F4F4;
      box-sizing: border-box;

      .btn{
        float: left;
        margin-right: 0.76rem;
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
      .button-wrapper-left{
        float:left;
        margin-top: 0.2rem;
        margin-left: 0.3rem;
        .btn-3{
          color: #fff;
          background-color: #D57DA7;
          background-image: url('../../../assets/images/common/icon_add.png');
          background-repeat: no-repeat;
          background-position:  0.2rem center;
          background-size: 0.4rem 0.4rem;
          text-align: left;
          text-indent: 0.6rem;
          &:hover{
            color: #fff;
            background-color: #DE8DB4;
          }
          &:active{
            color: #fff;
            background-color: #B56A9B;
          }
        }
      }
      .button-wrapper-right{
        float:right;
        margin-top: 0.2rem;

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
