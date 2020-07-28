<template>
  <div class="search-wrapper" id="label-search">
    <div class="row">
      <div class="search-item-wrapper" style="width: 100%">
        <span class="btn-label-type"
          v-for="(item, index) in labelTypeList"
          :key="index"
          :class="{'active': currentSelected.labelType === item}"
          @click="SelectLabelType(item)">
            {{item.name}}
          </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'

import { ErrorHandler } from 'common'
import {
  GET_SLIDE_STATUS_LIST,
  GET_SLIDE_STATUS_COUNT,
  GET_ORGAN_LIST
} from 'service'

import MyDbDate from 'widget/MyDbDate/index.vue'
import MyInput from 'widget/MyInput/index.vue'

interface SearchCondition {
  sortType?: string,
  sortField?: string,
  pageSize?: number,
  pageNo?: number,
  labelType: any,
  organ: any
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
  labelTypeList: any[] = [
    {
      id: '1',
      name: '分化类型'
    },
    {
      id: '2',
      name: '其他类型'
    }
  ]
  organList: any[] = []
  currentSelected: SearchCondition = {
    labelType: null,
    organ: null
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
    const organId = this.$route.params['organId']
    const organType = this.$route.params['organType']
    GET_ORGAN_LIST({
      category: 'organ'
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        this.organList = res.data.data.organList
        this.currentSelected.organ = this.organList.filter((organ: any) => Number(organId) === Number(organ.id))[0]
        if (!this.currentSelected.organ) {
          this.$router.replace('/404')
        } else {
          this.labelTypeList = this.currentSelected.organ.subType
          if (this.labelTypeList) {
            this.SelectLabelType(this.labelTypeList[0])
          }
        }
      }
    })
  }
  SelectLabelType (label: any) {
    this.currentSelected.labelType = label
    this.Search()
  }
  // 搜索
  Search () {
    // 判断搜索条件
    this.$emit('search', 'label-manage', this.currentSelected)
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
    .btn-label-type{
      margin-right: 0.4rem;
      float: left;
      display: block;
      height: 0.8rem;
      width: 2.46rem;
      border-radius: 0.4rem;
      box-shadow: 0rem 0rem 0.2rem 0.02rem rgba(181,106,155,0.1);
      background-color: #fff;
      font-size: 0.24rem;
      font-weight: normal;
      line-height: 0.8rem;
      color: #999;
      text-align: center;
      cursor: pointer;

      &:hover,
      &.active{
        background-color: #D57DA7;
        color: #fff;
        box-shadow:0rem 0rem 0.2rem 0.02rem rgba(170,77,138,0.54);
      }
    }
  }
}
</style>
