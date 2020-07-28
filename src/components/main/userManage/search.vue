<template>
  <div class="search-wrapper" id="user-search">
    <div class="row">
      <div class="search-item-wrapper" style="width: 25%">
        <my-select
          :placeholder="'请选择医院'"
          :list="hospitalList"
          :current.sync="currentSelected.hospital"
          @select="Search()">
          <i class="icon icon-hospital"></i>
        </my-select>
      </div>
      <div class="search-item-wrapper" style="width: 25%">
        <my-select
          :placeholder="'请选择角色'"
          :list="roleList"
          :current.sync="currentSelected.role"
          @select="Search()">
          <i class="icon icon-role"></i>
        </my-select>
      </div>
      <div class="search-item-wrapper" style="width: 20%">
        <my-input class="seach-input"
          :placeholder="'请输入登录名或用户姓名'"
          :input.sync="currentSelected.userName">
        </my-input>
      </div>
      <div class="search-item-wrapper" style="width: 10%">
        <div class="search-button" @click="Search()">搜索</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'

import { GET_HOSPITAL_LIST, GET_ROLE_LIST } from 'service'

import MySelect from 'widget/MySelect/index.vue'
import MyInput from 'widget/MyInput/index.vue'
import { ErrorHandler } from '../../../assets/scripts/common'

interface SearchCondition {
  sortType?: string,
  sortField?: string,
  pageSize?: number,
  pageNo?: number,
  hospital: {
    id: string,
    value: string
  },
  role: {
    id: string,
    value: string
  },
  userName: string
  [prop: string]: any
}

@Component({
  components: {
    MySelect,
    MyInput
  }
})
export default class UserManageSearch extends Vue {
  currentSelected: SearchCondition = {
    hospital: {
      id: 'all',
      value: '全部医院'
    },
    role: {
      id: 'all',
      value: '全部角色'
    },
    userName: ''
  }
  get hospitalList () {
    const list = this.$store.getters['getHospitalList'].slice(0)
    list.unshift({
      id: 'all',
      value: '全部医院'
    })
    return list
  }
  get roleList () {
    const list = this.$store.getters['getRoleList'].slice(0)
    list.unshift({
      id: 'all',
      value: '全部角色'
    })
    return list
  }

  mounted () {
    this.$store.dispatch('requestHospitalList')
    this.$store.dispatch('requestRoleList')
    this.Search()
  }

  // 搜索
  Search () {
    // 判断搜索条件
    this.$emit('search', 'user-manage', this.currentSelected)
  }
}
</script>

<style lang="less" scoped>
.search-wrapper{
  width: auto;
  height: 1.1rem;
  .row{
    margin-bottom: 0.3rem;
    height: 0.8rem;
  }
  .search-item-wrapper{
    float: left;
    padding-right: 0.2rem;
    height: 0.8rem;
    box-sizing: border-box;

    .icon-hospital{
      background-image: url('../../../assets/images/common/icon_hospital.png') !important;
    }
    .icon-role{
      background-image: url('../../../assets/images/common/icon_user_4.png') !important;
    }
    .search-button{
      height: 100%;
      width: 1.36rem;
      border-radius: 0.4rem;
      font-size: 0.24rem;
      font-weight: normal;
      text-align: center;
      line-height: 0.8rem;
      background:rgba(213,125,167, .2);
      box-shadow:0px 1px 5px 0px rgba(170,77,138,0.54);
      color: #D57DA7;
      cursor: pointer;
      &:hover{
        background:rgba(213,125,167,1);
        box-shadow:0px 1px 5px 0px rgba(170,77,138,0.54);
        color:rgba(255,255,255,1);
      }
      &:active{
        background:rgba(181,106,155,1);
        box-shadow:0px 1px 5px 0px rgba(170,77,138,0.54);
        color:rgba(255,255,255,1);
      }
    }
    .seach-input{
      height: 100%;
      width: 100%;
    }
  }
}
</style>
