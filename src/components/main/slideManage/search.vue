<template>
  <div class="search-wrapper" id="slide-search">
    <div class="row">
      <div class="search-item-wrapper" style="width: 40%">
        <my-db-date
          :placeholder1="'开始上传日期'"
          :placeholder2="'截止上传日期'"
          :dateStart.sync="currentSelected.uploadDateFrom"
          :dateEnd.sync="currentSelected.uploadDateTo">
        </my-db-date>
      </div>
      <div class="search-item-wrapper" style="width: 15%">
        <my-input class="seach-input"
          :placeholder="'输入切片号'"
          :input.sync="currentSelected.slideNum">
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

import { ErrorHandler } from 'common'
import {
  GET_SLIDE_STATUS_LIST,
  GET_SLIDE_STATUS_COUNT
} from 'service'

import MyDbDate from 'widget/MyDbDate/index.vue'
import MyInput from 'widget/MyInput/index.vue'

interface SearchCondition {
  sortType?: string,
  sortField?: string,
  pageSize?: number,
  pageNo?: number,
  uploadDateFrom: string,
  uploadDateTo: string,
  slideNum: string
  [prop: string]: any
}

@Component({
  components: {
    MyDbDate,
    MyInput
  }
})
export default class SlideManageSearch extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  statusListOrigin: any[] = []
  statusList: any[] = []
  currentSelected: SearchCondition = {
    uploadDateFrom: '',
    uploadDateTo: '',
    slideNum: ''
  }

  @Watch('$route')
  onRouteChange () {
    this.InitPage()
  }

  mounted () {
    this.InitPage()
  }

  // 准备数据
  InitPage () {
    this.Search()
  }
  // 搜索
  Search () {
    // 判断搜索条件
    this.$emit('search', 'slide-manage', this.currentSelected)
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
    &.count-wrapper{
      padding-left: 0.2rem;
    }
    .count-title{
      position: relative;
      font-size: 0.2rem;
      font-weight: normal;
      line-height: 0.26rem;
      text-indent: 0.2rem;
      color: #666;
      &::before{
        position: absolute;
        top: 0.09rem;
        left: 0;
        display: block;
        width: 0.08rem;
        height: 0.08rem;
        border-radius: 50%;
        background-color: #D57DA7;
        content: '';
      }
    }
    .icon-config{
      background-image: url('../../../assets/images/common/icon_config.png') !important;
    }
    .icon-predict{
      background-image: url('../../../assets/images/common/icon_predict.png') !important;
    }
    .search-button{
      height: 100%;
      width: 100%;
      border-radius: 0.4rem;
      font-size: 0.24rem;
      font-weight: normal;
      text-align: center;
      line-height: 0.8rem;
      color: #fff;
      background-color: #D57DA7;
      cursor: pointer;
      &:hover{
        background-color: #DE8DB4;
      }
    }
    .seach-input{
      height: 100%;
      width: 100%;
    }
  }
}
</style>
