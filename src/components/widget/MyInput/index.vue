<template>
  <div class="my-input">
    <input type="text"
      :placeholder="placeholder"
      :readonly="focus ? false : 'readonly'"
      v-model="localInput"
      @focus="focus = true"
      @input="Change()">
    <i class="icon-clear" v-show="localInput !== ''" @click="Clear()"></i>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Input extends Vue {
  @Prop({ type: String, default: '' })
  input!: string

  @Prop({ type: String, default: '请输入' })
  placeholder!: string

  localInput: string = this.input
  focus: boolean = false

  Change () {
    this.localInput = this.localInput.replace(/(^\s*)|(\s*$)/g, '')
    this.$emit('update:input', this.localInput)
    this.$emit('change', this.localInput)
  }
  Clear () {
    this.localInput = ''
    this.$emit('update:input', this.localInput)
    this.$emit('change', this.localInput)
  }
}
</script>

<style lang="less" scoped>
.my-input{
  position: relative;
  padding: 0 0.3rem;
  width: 3rem;
  border-radius: 0.4rem;
  background-color: #fff;
  box-sizing: border-box;

  input{
    float: left;
    padding: 0;
    height: 100%;
    width: 80%;
    border: none;
    outline: none;
    font-size: 0.24rem;
    font-weight: normal;
    background: transparent;
    &::-webkit-input-placeholder {
      color: #999;
    }
  }
  .icon-clear{
    position: absolute;
    top: 50%;
    right: 0.2rem;
    display: block;
    content:'';
    margin-top: -0.16rem;
    width: 0.32rem;
    height: 0.32rem;
    background-image: url('./img/icon_clear.png');
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;
  }
}
</style>
