<template>
  <div class="my-table">
    <div class="table-head">
      <div class="table-head-item" :style="{'width': selectWidth}" v-if="selectable">
        <i class="icon-checkbox"
        :class="{'checked': data.length !== 0 && checkedList.length === data.length}"
        @click="ToggleCheckAll()"></i>
      </div>
      <div class="table-head-item"
        v-for="(item, index) in head"
        :key="index"
        :style="{'width': item.width}">
        <span class="head-title">{{item.label}}</span>
        <i class="icon-sort" v-if="item.sortable"
        :class="{'icon-sort-asc': item.prop === sortField && sortType === 'asc', 'icon-sort-desc': item.prop === sortField && sortType === 'desc'}"
        @click="ToggleSort(item.prop, sortType)"></i>
      </div>
    </div>
    <div class="table-body"
      v-show="status==='succeed'&&data.length"
      :style="{'height': tableBodyHeight}">
      <div class="table-body-item"
        :class="{'active': checkedList.indexOf(item.id) !== -1, 'exist': item.exist}"
        v-for="(item, index) in data"
        :key="index">
        <div class="item-container"
          :style="{'width': selectWidth}"
          v-if="selectable">
          <i class="icon-checkbox"
          :class="{'checked': checkedList.indexOf(item.id) !== -1}"
          @click="ToggleCheck(item.id)"></i>
        </div>
        <div class="item-container"
          v-for="(headItem, headIndex) in head"
          :key="headIndex"
          :style="{'width': headItem.width}">
          <slot :name="headItem.prop" :row="item" :index="index">
            {{item[headItem.prop]}}
          </slot>
        </div>
      </div>
    </div>
    <!-- 初始时空白 -->
    <div class="empty-container"
      v-show="status==='initial'"
      :style="{'height': tableBodyHeight}">
    </div>
    <!-- 正在加载 -->
    <div class="loading-container"
      v-show="status==='loading'"
      :style="{'height': tableBodyHeight}">
      <div class="content">
        <img src="./img/loading.gif">
        <p class="tip-title">加载中...</p>
      </div>
    </div>
    <!-- 没有数据时显示内容 -->
    <div class="nodata-container"
      v-show="status==='succeed'&&!data.length"
      :style="{'height': tableBodyHeight}">
      <div class="content">
        <img src="./img/icon_blank.png">
        <p class="tip-title">暂无数据</p>
      </div>
    </div>
    <!-- 加载失败时显示内容 -->
    <div class="failed-container"
      v-show="status==='failed'"
      :style="{'height': tableBodyHeight}">
      <div class="content">
        <img src="./img/icon_blank.png">
        <p class="tip-title">加载失败,请点击<span class="reload-title" @click="Reload()">重试</span></p>
      </div>
    </div>
    <my-pagenation class="pagenation"
      v-if="status==='succeed'&&totalCount"
      :totalCount="totalCount"
      :pageSize="pageSize"
      :current="pageNo"
      @changePage="ChangePage"
      @changePageSize="ChangePageSize"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import MyPagenation from 'widget/MyPagenation/index.vue'

@Component({
  components: {
    MyPagenation
  }
})
export default class Table1 extends Vue {
  @Prop({ type: Boolean, default: true })
  selectable!: boolean

  @Prop({ type: String, default: '5%' })
  selectWidth!: string

  @Prop({ type: Array, default: () => [] })
  checkedList!: any[]

  @Prop({ type: String })
  sortField!: string

  @Prop({ type: String })
  sortType!: string

  @Prop({ type: Number, default: 0 })
  totalCount!: number

  @Prop({ type: Number, default: 10 })
  pageSize!: number

  @Prop({ type: Number, default: 1 })
  pageNo!: number

  @Prop({ type: Number })
  height!: number

  @Prop({ type: Array,
    default: () => [
      {
        prop: 'num1',
        label: '编号1',
        width: '20%',
        sortable: true
      }, {
        prop: 'num1',
        label: '编号2',
        width: '20%',
        sortable: true
      }
    ] })
  head!: any[]

  @Prop({ type: Array, default: () => [] })
  data!: any[]

  @Prop({ type: String, default: 'initial' })
  status!: string

  localSortType: string = ''
  localCheckedList: string[] = this.checkedList

  get tableBodyHeight () {
    let bodyFontSize: number = 60
    const computedStyle = window.getComputedStyle(document.body)
    if (computedStyle && computedStyle.fontSize) {
      bodyFontSize = Number(computedStyle.fontSize.replace('px', ''))
    }
    if (this.totalCount) {
      return `${this.height - bodyFontSize * 0.9 - bodyFontSize * 1}px`
    } else {
      return `${this.height - bodyFontSize * 0.9}px`
    }
  }

  mounted () {
    this.$on('toggleCheckAll', () => {
      this.ToggleCheckAll()
    })
    this.localSortType = this.sortType
  }

  ToggleSort (prop: string, sortType: 'asc' | 'desc' | '') {
    this.$emit('update:sortField', prop)
    switch (sortType) {
      case 'asc':
        this.$emit('update:sortType', 'desc')
        break
      case 'desc':
        if (this.localSortType) {
          this.$emit('update:sortType', 'asc')
        } else {
          this.$emit('update:sortType', '')
        }
        break
      default:
        this.$emit('update:sortType', 'asc')
        break
    }
    this.$emit('sort')
  }

  ToggleCheckAll () {
    if (this.data.length === 0) {
      return false
    }
    if (this.localCheckedList.length === this.data.length) {
      this.localCheckedList = []
    } else {
      this.localCheckedList = []
      for (let i = 0, len = this.data.length; i < len; i++) {
        this.localCheckedList.push(this.data[i].id)
      }
    }
    this.$emit('update:checkedList', this.localCheckedList)
    this.$emit('check', this.localCheckedList)
  }

  ToggleCheck (id: string) {
    const index = this.localCheckedList.indexOf(id)
    if (index === -1) {
      this.localCheckedList.push(id)
    } else {
      this.localCheckedList.splice(index, 1)
    }
    this.$emit('update:checkedList', this.localCheckedList)
    this.$emit('check', this.localCheckedList)
  }

  ChangePage (pageNo: number) {
    this.$emit('update:pageNo', pageNo)
    this.$emit('changePage', pageNo)
  }
  ChangePageSize (pageSize: number) {
    this.$emit('update:pageNo', 1)
    this.$emit('update:pageSize', pageSize)
    this.$emit('changePageSize', pageSize)
  }
  Reload () {
    this.$emit('reload')
  }
}
</script>

<style lang="less" scoped>
.my-table{
  width: 100%;
  border-radius: 0.2rem;
  background-color: #fff;
  // overflow: hidden;

  .icon-checkbox{
    display: inline-block;
    width: 0.24rem;
    height: 100%;
    background-image: url('./img/icon_check.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% auto;
    cursor: pointer;
    &.checked{
      background-image: url('./img/icon_checked.png');
    }
  }
  .table-head{
    height: 0.9rem;
    background: #FAFAFA;
    user-select: none;
    border-radius: 0.2rem 0.2rem 0 0;

    .table-head-item{
      position: relative;
      float: left;
      padding-left: 0.5rem;
      height: 0.9rem;
      box-sizing: border-box;

      .head-title{
        float: left;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.9rem;
        color: #D57DA7;
      }
      //列表排序图标样式
      .icon-sort{
        float: left;
        margin-left: 0.1rem;
        height: 100%;
        width: 0.24rem;
        background-image: url('./img/icon_sort_default.png');
        background-repeat: no-repeat;
        background-position: 0 center;
        background-size: 100% 0.23rem;
        cursor: pointer;
      }
      // 列表升序图标样式
      .icon-sort-asc{
        background-image: url('./img/icon_sort_asc.png');
      }
      .icon-sort-desc{
        background-image: url('./img/icon_sort_desc.png');
      }
    }
  }
  .table-body{
    height: 8rem;
    // max-height: 10rem;
    overflow-y: auto;

    .table-body-item{
      height: 1rem;
      border-bottom: 0.02rem solid transparent;
      box-sizing: border-box;

      &:nth-child(even){
        background-color: #FAFAFA;
      }
      &:hover{
        background-color: #F0F0F0;
      }
      &.active{
        border-color: rgba(232,232,232,0.1);
        background-color: rgba(181,106,155,0.2);
        border-bottom: 1px solid rgba(198, 198, 198, 0.2);
        color: #F1F2F7 !important;
      }
      &.exist{
        border-color: rgba(232,232,232,0.3);
        background-color: #F9CDCD;
      }
      .item-container{
        position: relative;
        float: left;
        padding-left: 0.5rem;
        height: 100%;
        box-sizing: border-box;
        font-size: 0.22rem;
        font-weight: normal;
        text-align: left;
        line-height: 1rem;
        color: #333333;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        // &::after{
        //   position: absolute;
        //   top: 0;
        //   right:0;
        //   content: '';
        //   height: 50px;
        //   width: 1px;
        //   background: #f6f6f6;
        // }
      }
    }
  }
  .empty-container,
  .loading-container,
  .nodata-container,
  .failed-container{
    width: 100%;
    text-align: center;
    .content{
      position: relative;
      top: 40%;
      height: auto;
      width: auto;
      transform: translateY(-50%);
      .tip-title{
        margin: 0.3rem 0 0;
        font-size: 0.26rem;
        font-weight: normal;
        color:#666;
        .reload-title{
          cursor: pointer;
          color: #D57DA7;
          &:hover{
            color:#DE8DB4;
          }
          &:active{
            color:#B56A9B;
          }
        }
      }
    }
  }
  .loading-container{
    .content{
      img{
        height: 5rem;
      }
      .tip-title{
        margin: -1.2rem 0 0 0;
      }
    }
  }
  .nodata-container,
  .failed-container{
    .content{
      img{
        height: 2.48rem;
      }
    }
  }
}
</style>
