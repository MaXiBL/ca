<template>
  <div class="search-wrapper" id="case-search">
    <div class="row">
      <div class="search-item-wrapper" style="width: 40%">
        <my-db-date
          :placeholder1="'选择开始入库日期'"
          :placeholder2="'选择截止入库日期'"
          :dateStart.sync="currentSelected.uploadDateFrom"
          :dateEnd.sync="currentSelected.uploadDateTo">
        </my-db-date>
      </div>
      <div class="search-item-wrapper" style="width: 15%">
        <my-input class="seach-input"
          :placeholder="'输入病理号'"
          :input.sync="currentSelected.caseNum">
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

import MySelect from 'widget/MySelect/index.vue'
import MyMulSelect from 'widget/MyMulSelect/index.vue'
import MyDbDate from 'widget/MyDbDate/index.vue'
import MyInput from 'widget/MyInput/index.vue'

interface SearchCondition {
  sortType?: string,
  sortField?: string,
  pageSize?: number,
  pageNo?: number,
  reviewStatus: {
    id: string,
    value: string
  },
  uploadDateFrom: string,
  uploadDateTo: string,
  caseNum: string
  [prop: string]: any
}

@Component({
  components: {
    MySelect,
    MyMulSelect,
    MyDbDate,
    MyInput
  }
})
export default class CaseManageSearch extends Vue {
  currentSelected: SearchCondition = {
    reviewStatus: {
      id: 'all',
      value: '全部病例状态'
    },
    uploadDateFrom: '',
    uploadDateTo: '',
    caseNum: ''
  }

  get slideStat () {
    return this.$store.getters['getSlideStat']
  }
  get diskStat () {
    return this.$store.getters['getDiskStat']
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
    this.$emit('search', 'case-manage', this.currentSelected)
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
    .icon-review{
      background-image: url('../../../assets/images/common/icon_review.png') !important;
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
