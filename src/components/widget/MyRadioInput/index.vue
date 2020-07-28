<template>
  <div class="my-radio-input">
    <div class="content-wrapper">
      <span class="input-title" v-if="title">{{`${title}:`}}</span>
      <div class="select-list">
        <div class="list-item"
          :class="{'active': current && current.value === item.value}"
          v-for="(item, index) in optionList"
          :key="index"
          @click="ToggleSelect(item)">
          <i class="icon-circle"></i>
          <span class="item-title">{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

interface OptionItem {
  name: string,
  value: number
}

@Component
export default class RadioInpu extends Vue {
  @Prop({ type: String })
  title!: string

  @Prop({ type: Array, default: () => [{ name: '是', value: 1 }, { name: '否', value: 0 }] })
  optionList!: OptionItem[]

  @Prop({ type: Boolean, default: false })
  canBeNull!: boolean

  @Prop({ type: Object, default: () => ({ name: '是', value: 1 }) })
  current!: OptionItem

  ToggleSelect (obj: OptionItem) {
    if (this.current && this.current.value === obj.value) {
      if (this.canBeNull) {
        this.$emit('update:current', null)
      }
    } else {
      this.$emit('update:current', obj)
    }
  }
}
</script>

<style lang="less" scoped>
.my-radio-input{
  // position: relative;
  // padding: 0 0.3rem;
  // width: 3rem;
  // border-radius: 0.4rem;
  float: left;
  background-color: #fff;
  // box-sizing: border-box;

  .content-wrapper{
    position: absolute;
    top: 50%;
    margin-top: -0.2rem;
    height: 0.4rem;
    width: auto;

    .input-title{
      float: left;
      margin-right: 0.3rem;
      height: 0.4rem;
      width: auto;
      border: none;
      font-size: 0.24rem;
      font-weight: normal;
      line-height: 0.4rem;
      background: transparent;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .select-list{
      float: left;
      height: 0.4rem;
      width: auto;

      .list-item{
        float: left;
        margin-right: 0.3rem;
        height: 100%;
        width: auto;
        &.active{
          .icon-circle{
            background-image: url('./img/icon_circle_active.png');
          }
        }
        .icon-circle{
          float: left;
          display: block;
          margin-top: 0.05rem;
          height: 0.3rem;
          width: 0.3rem;
          background-image: url('./img/icon_circle.png');
          background-repeat: no-repeat;
          background-size: contain;
          cursor: pointer;
        }
        .item-title{
          float: left;
          margin-left: 0.1rem;
          font-size: 0.24rem;
          font-weight: normal;
          line-height: 0.4rem;
        }
      }
    }
  }
}
</style>
