<template>
  <div class="my-pagenation panel-wrapper" ref="page-panel">
    <div class="pagenation-wrapper">
      <span class="btn btn-prev"
        :class="{'disabled':current === 1}"
        @click="ChangePage(current - 1)">
      </span>
      <!-- totalCount 大于 7 -->
      <template v-if="pageCount > 7">
        <template v-if="current < 5">
            <span class="btn"
            v-for="n in pageNoGroup1"
            :key="n"
            :class="{'active':current === n}"
            @click="ChangePage(n)">
            {{n}}
            </span>
            <span class="btn btn-quick-next" @click="getMoreNext"></span>
            <span class="btn" @click="ChangePage(pageCount)">{{pageCount}}</span>
        </template>
        <template v-else-if="current >= 5 && current < pageCount -3">
            <span class="btn" @click="ChangePage(1)">1</span>
            <span class="btn btn-quick-prev" @click="getMorePrev"></span>
            <span class="btn"
            v-for="n in pageNoGroup2"
            :key="n"
            :class="{'active':current === n}"
            @click="ChangePage(n)">
            {{n}}
            </span>
            <span class="btn btn-quick-next" @click="getMoreNext"></span>
            <span class="btn" @click="ChangePage(pageCount)">{{pageCount}}</span>
        </template>
        <template v-else>
            <span class="btn" @click="ChangePage(1)">1</span>
            <span class="btn btn-quick-prev" @click="getMorePrev"></span>
            <span class="btn"
            v-for="n in pageNoGroup3"
            :key="n"
            :class="{'active':current === n}"
            @click="ChangePage(n)">
            {{n}}
            </span>
        </template>
      </template>
      <!-- totalCount 小于或等于 7 -->
      <template v-else>
        <span class="btn"
        v-for="n in pageNoGroup4"
        :key="n"
        :class="{'active':current === n}"
        @click="ChangePage(n)">
          {{n}}
        </span>
      </template>
      <span class="btn btn-next"
        :class="{'disabled':current === pageCount}"
        @click="ChangePage(current+1)">
      </span>
      <span class="totalCount">
        {{`共${totalCount}条`}}
      </span>
      <div class="select-pagesize-container"
        @click="TogglePanel()">
        <div class="current-select">{{`${pageSize}条/页`}}</div>
        <div class="select-list">
          <div class="list-item"
            :class="{'active': pageSize == item}"
            v-for="(item, index) in pageSizeList"
            :key="index"
            @click="ChagePageSize(item)">
            {{`${item}条/页`}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Pagenation extends Vue {
  @Prop({ type: Number, default: 1 })
  current!: number

  @Prop({ type: Number, default: 10 })
  totalCount!: number

  @Prop({ type: Number, default: 10 })
  pageSize!: number

  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  pageSizeList: number[] = [10, 20, 30, 50, 100, 200, 500]

  get pageNoGroup1 () {
    return [1, 2, 3, 4, 5]
  }
  get pageNoGroup2 () {
    const arr = []
    for (let i = 1; i < this.pageCount; i++) {
      if (i >= this.current - 2 && i <= this.current + 2) {
        arr.push(i)
      }
    }
    return arr
  }
  get pageNoGroup3 () {
    const arr = []
    for (let i = 1; i <= this.pageCount; i++) {
      if (i >= this.pageCount - 5) {
        arr.push(i)
      }
    }
    return arr
  }
  get pageNoGroup4 () {
    const arr = []
    for (let i = 1; i <= this.pageCount; i++) {
      arr.push(i)
    }
    return arr
  }
  get pageCount () {
    return Math.ceil(this.totalCount / this.pageSize)
  }

  ChangePage (page: number) {
    if (page < 1 || page > this.pageCount || page === this.current) {
      return false
    }
    this.$emit('update:current', page)
    this.$emit('changePage', page)
  }
  ChagePageSize (pageSize: number) {
    this.$emit('update:current', 1)
    this.$emit('update:pageSize', pageSize)
    this.$emit('changePageSize', pageSize)
  }
  TogglePanel () {
    // 判断是否存在 show-panel 类
    const classList = this.$refs['page-panel'].classList
    if (Array.prototype.indexOf.call(classList, 'show-panel') !== -1) {
      classList.remove('show-panel')
    } else {
      classList.add('show-panel')
    }
  }
  getMorePrev () {
    if (this.current > 5) {
      this.ChangePage(this.current - 5)
    } else {
      this.ChangePage(this.current - 1)
    }
  }
  getMoreNext () {
    if (this.current < this.pageCount - 5) {
      this.ChangePage(this.current + 5)
    } else {
      this.ChangePage(this.current + 1)
    }
  }
}
</script>

<style lang="less" scoped>
.my-pagenation{
  height: 1rem;
  text-align: center;
  user-select: none;
  border-top: 0.02rem solid #F4F4F4;
  box-sizing: border-box;

  .pagenation-wrapper{
    display: inline-block;
    transform: translateY(-50%);
    height: 0.44rem;
  }
  .btn{
    float: left;
    margin: 0 0.1rem;
    padding: 0 0.1rem;
    min-width: 0.43rem;
    height: 0.43rem;
    border: 0.01rem solid #E5E5E5;
    border-radius: 0.04rem;
    box-sizing: border-box;
    background: #FAFAFA;
    font-size: 0.22rem;
    font-weight: normal;
    line-height: 0.42rem;
    color: #999;
    cursor: pointer;
    &.active,
    &:hover{
      background-color: #D57DA7;
      color: #fff;
    }
    &.btn-prev{
      background-image: url('./img/icon_arrow_left.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: auto 0.22rem;
      &.disabled{
        display: none;
      }
      &.active,
      &:hover{
        background-image: url('./img/icon_btn_prev.png');
      }
    }
    &.btn-next{
      background-image: url('./img/icon_arrow_right.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: auto 0.22rem;
      &.disabled{
        display: none;
      }
      &.active,
      &:hover{
        background-image: url('./img/icon_btn_next.png');
      }
    }
    &.btn-quick-prev,
    &.btn-quick-next{
      background-image: url('./img/icon_more.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: auto 0.04rem;
    }
  }
  .totalCount{
    float: left;
    margin: 0 0.1rem;
    height: 0.43rem;
    font-size: 0.22rem;
    font-weight: normal;
    line-height: 0.41rem;
    color: #999;
  }
  .select-pagesize-container{
    position: relative;
    float: left;
    margin-left: 0.1rem;
    width: 1.5rem;
    height: 0.43rem;
    border-radius: 0.04rem;
    border: 0.01rem solid #E5E5E5;
    box-sizing: border-box;
    background: #FAFAFA;
    &::after{
      content: '';
      position: absolute;
      z-index: 2;
      top: 0.16rem;
      right: 0.12rem;
      border-style: solid;
      border-width: 0.12rem 0.07rem 0 0.07rem;
      border-color: #D57DA7 transparent transparent transparent;
    }
    .current-select{
      float: left;
      width: 1.5rem;
      height: 0.43rem;
      font-size: 0.22rem;
      font-weight: normal;
      line-height: 0.43rem;
      text-align: center;
      cursor: pointer;
    }
    .select-list{
      display: none;
      position: absolute;
      z-index: 9;
      bottom: -0.01rem;
      left: -0.01rem;
      width: 1.5rem;
      height: auto;
      max-height: 2rem;
      overflow-y: scroll;
      border-radius: 0.04rem;
      border: 0.01rem solid #E5E5E5;
      box-sizing: border-box;
      background-color: #fff;
      .list-item{
        width: auto;
        height: 0.43rem;
        font-size: 0.22rem;
        font-weight: normal;
        line-height: 0.43rem;
        cursor: pointer;
        &:hover,
        &.active{
          background-color: #D57DA7;
          color: #fff;
        }
      }
    }
  }
  &.show-panel{
    .select-list{
      display: block;
    }
  }
}
</style>
<style lang="less">
.select-pagesize-container{
  // 滚动条
  ::-webkit-scrollbar {
    width: 0.05rem !important;
  }
  /*滑块*/
  ::-webkit-scrollbar-thumb {
    background-color: #ECECEC !important;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #dcdcdc !important;
  }
}
</style>
