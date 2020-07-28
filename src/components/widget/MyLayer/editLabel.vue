<template>
  <my-layer class="layer-wrapper" ref="layer" :title="title" @ok="ClickOk" >
    <form>
      <div class="form-item" :class="{'warning': labelNumWarning}">
        <div class="input-wrapper">
          <span class="title">序号</span>
          <input type="text" class="input" placeholder="请输入序号"
            v-model.number="labelNum"
            @focus="labelNumWarning = false"
            @blur="TestLabelNum('blur')">
          <i class="icon-clear"
            v-show="labelNum.length"
            @click="labelNum = ''">
          </i>
        </div>
        <div class="warning-wrapper">
          <i class="warning-icon"></i>
          <span class="warning-info">{{labelNumWarningText}}</span>
        </div>
      </div>
      <div class="form-item" :class="{'warning': labelNameWarning}">
        <div class="input-wrapper">
          <span class="title">病种</span>
          <input type="text" class="input" placeholder="请输入病种"
            v-model="labelName"
            @focus="labelNameWarning = false"
            @blur="TestLabelName('blur')">
          <i class="icon-clear"
            v-show="labelName.length"
            @click="labelName = ''">
          </i>
        </div>
        <div class="warning-wrapper">
          <i class="warning-icon"></i>
          <span class="warning-info">{{labelNameWarningText}}</span>
        </div>
      </div>
      <div class="form-item" :class="{'warning': labelColorWarning}">
        <div class="input-wrapper">
          <span class="title">颜色</span>
          <input type="text" class="input color-input" placeholder="请输入颜色值或选择颜色"
            v-model="labelColor"
            @focus="labelColorWarning = false"
            @blur="TestLableColor('blur')">
          <span class="color-picker" @click="ShowColorPicker()" :style="{'background-color': labelColor}"></span>
          <i class="icon-clear color-clear"
            v-show="labelColor.length"
            @click="labelColor = ''">
          </i>
        </div>
        <div class="warning-wrapper">
          <i class="warning-icon"></i>
          <span class="warning-info">{{labelColorWarningText}}</span>
        </div>
      </div>
      <div class="form-item">
        <div class="input-wrapper">
          <span class="title">线型</span>
          <my-select class="select-input"
            :placeholder="'请选择线型'"
            :list="lineTypeList"
            :current.sync="labelLineType">
            <template slot="current" slot-scope="{ row }">
              <div class="line-wrapper">
                <div class="line" :style="{'border-style': row.value}"></div>
              </div>
            </template>
            <template slot="solid" slot-scope="{ row }">
              <div class="line-wrapper">
                <div class="line" :style="{'border-style': row.value}"></div>
              </div>
            </template>
            <template slot="dashed" slot-scope="{ row }">
              <div class="line-wrapper">
                <div class="line" :style="{'border-style': row.value}"></div>
              </div>
            </template>
          </my-select>
        </div>
      </div>
      <div class="form-item">
        <div class="input-wrapper">
          <span class="title">是否复原</span>
          <my-radio-input class="radio-input" :current.sync="labelcanUse"/>
        </div>
      </div>
      <div class="form-item">
        <div class="input-wrapper">
          <span class="title">是否默认</span>
          <my-radio-input class="radio-input" :current.sync="labelDefault"/>
        </div>
      </div>
    </form>
  </my-layer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import layer from 'layer'
import { GET_LINE_TYPE_LIST } from 'service'

import MyLayer from 'widget/MyLayer/index.vue'
import MyRadioInput from 'widget/MyRadioInput/index.vue'
import MySelect from 'widget/MySelect/index.2.vue'

@Component({
  components: {
    MyLayer,
    MyRadioInput,
    MySelect
  }
})
export default class LayerAddNewUser extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  lineTypeList: any[] = [
    {
      value: 'solid',
      id: 1
    },
    {
      value: 'dashed',
      id: 2
    }
  ]
  editType: string = ''
  title: string = ''
  labelId: number | string = ''
  labelNum: number | string = ''
  labelName: string = ''
  labelColor: string = ''
  labelLineType: any = {}
  labelcanUse: any = { name: '是', value: 1 }
  labelDefault: any = { name: '是', value: 1 }

  labelNumWarning: boolean = false
  labelNumWarningText: string = ''

  labelNameWarning: boolean = false
  labelNameWarningText: string = ''

  labelColorWarning: boolean = false
  labelColorWarningText: string = ''

  mounted () {
    this.$on('pop', (type: string, label?: any) => {
      this.editType = type
      this.title = type === 'add' ? '添加病种类型' : '编辑病种类型'
      this.labelId = (label && label.labelId) || ''
      this.labelNum = (label && label.labelNum) || ''
      this.labelName = (label && label.labelName) || ''
      this.labelColor = (label && label.labelColor) || '#ff0000'
      this.labelcanUse = (label && label.labelCanUse) || { name: '是', value: 1 }
      this.labelDefault = (label && label.labelDefault) || { name: '是', value: 1 }

      if (label) {
        this.lineTypeList.forEach((item: any) => {
          if (label.labelLineType.id === item.id) {
            this.labelLineType = item
          }
        })
      }

      // 缺省值为列表第一个
      if (!this.labelLineType.value) {
        this.labelLineType = this.lineTypeList[0]
      }

      this.labelNumWarning = false
      this.labelNumWarningText = ''

      this.labelNameWarning = false
      this.labelNameWarningText = ''

      this.labelColorWarning = false
      this.labelColorWarningText = ''

      this.$refs.layer.$emit('showLayer', '6.2rem;', '9.4rem')
    })
    this.$on('pickColor', (color: string) => {
      this.labelColor = color
    })
  }
  ShowColorPicker () {
    this.$emit('showColorPicker')
  }
  TestLabelNum (type?: string) {
    if (type === 'blur' && this.labelNum === '') {
      return false
    }
    if (/^[1-9][0-9]{0,2}$/.test(this.labelNum.toString())) {
      this.labelNumWarning = false
      return true
    } else {
      this.labelNumWarning = true
      this.labelNumWarningText = '序号只能是1~999的数字,且不能为空'
      return false
    }
  }
  TestLabelName (type?: string) {
    if (type === 'blur' && this.labelName === '') {
      return false
    }
    if (this.labelName) {
      this.labelNameWarning = false
      return true
    } else {
      this.labelNameWarning = true
      this.labelNameWarningText = '病种不能为空'
      return false
    }
  }
  TestLableColor (type?: string) {
    if (type === 'blur' && this.labelColor === '') {
      return false
    }
    if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(this.labelColor)) {
      this.labelColorWarning = false
      return true
    } else {
      this.labelColorWarning = true
      this.labelColorWarningText = '颜色值范围#000000~#FFFFFF'
      return false
    }
  }
  ClickOk (layerIndex: number) {
    if (this.TestLabelNum() && this.TestLabelName() && this.TestLableColor()) {
      layer.close(layerIndex)
      this.$emit('finishEdit', {
        editType: this.editType,
        labelId: this.labelId,
        labelNum: this.labelNum,
        labelName: this.labelName,
        labelColor: this.labelColor,
        labelCanUse: this.labelcanUse,
        labelDefault: this.labelDefault,
        labelLineType: this.labelLineType
      })
    }
  }
}
</script>

<style lang="less" scoped>
.layer-wrapper{
  .form-item{
    height: 1.2rem;
    width: 100%;

    .input-wrapper{
      position: relative;
      width: 100%;
      height: 0.7rem;
      .title{
        float: left;
        height: 100%;
        width: 1.5rem;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.7rem;
        text-align: left;
        color: #666;
      }
      .input{
        float: left;
        padding: 0 0.1rem;
        height: 100%;
        width: calc(100% - 1.5rem);
        border: 0.02rem solid #efefef;
        border-radius: 0.04rem;
        box-sizing: border-box;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.7rem;
        text-align: left;
        color: #666;
        &::-webkit-input-placeholder{
          color: #999;
        }
        &:focus{
          border-color: #D57DA7;
          outline: none;
        }
        &.color-input{
          width: calc(100% - 1.5rem - 1rem);
        }
      }
      .color-picker{
        float: left;
        margin-left: 0.3rem;
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 0.08rem;
        cursor: pointer;
        background-color: #ff0000;
      }
      .radio-input{
        height: 100%;
        width: calc(100% - 1.5rem);
      }
      .select-input{
        float: left;
        padding: 0;
        height: 100%;
        width: calc(100% - 1.5rem);
        border: 0.02rem solid #efefef;
        border-radius: 0.04rem;
        box-sizing: border-box;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.7rem;
        text-align: left;
        color: #666;
        .line-wrapper{
          height: 100%;
          .line{
            position: relative;
            top: 50%;
            margin-left: 0.2rem;
            width: 70%;
            border: 0.01rem solid #333;
          }
        }
      }
      .textarea{
        float: left;
        padding: 0 0.1rem 0 0.1rem;
        height: 200%;
        width: calc(100% - 1.5rem);
        border: 0.02rem solid #efefef;
        border-radius: 0.04rem;
        box-sizing: border-box;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.4rem;
        text-align: left;
        color: #666;
        resize:none;
        &::-webkit-input-placeholder{
          color: #999;
        }
        &:focus{
          border-color: #D57DA7;
          outline: none;
        }
      }
      .icon-clear{
        display: block;
        position: absolute;
        top: 0.15rem;
        right: 0.1rem;
        width: 0.4rem;
        height: 0.4rem;
        background-image: url('./img/icon_clear.png');
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 0.25rem 0.25rem;
        cursor: pointer;
        &.color-clear{
          right: 1.1rem;
        }
      }
      .icon-pwd-hide{
        display: block;
        position:absolute;
        top: 0.15rem;
        right: 0.1rem;
        width: 0.4rem;
        height: 0.4rem;
        background-image: url('../../../assets/images/common/icon_eye_close.png');
        background-repeat: no-repeat;
        background-size: contain;
        cursor: pointer;
        &.icon-pwd-show{
          background-image: url('../../../assets/images/common/icon_eye_open.png');
        }
      }
    }
    .warning-wrapper{
      display: none;
      padding-left: 1.5rem;
      height: 0.4rem;
      width: 100%;
      box-sizing: border-box;
      .warning-icon{
        float: left;
        width: 0.4rem;
        height: 0.4rem;
        background-image: url('./img/icon_warning.png');
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 0.2rem 0.2rem;
      }
      .warning-info{
        float: left;
        font-size: 0.2rem;
        font-weight: normal;
        line-height: 0.4rem;
        color: red;
      }
    }
    &.warning{
      .input-wrapper{
        input{
          border-color: red;
        }
      }
      .warning-wrapper{
        display: block
      }
    }
  }
}
</style>
