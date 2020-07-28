<template>
  <my-layer class="layer-wrapper" ref="layer" :title="'修改切片信息'" @ok="ClickOk" >
    <form>
      <div class="form-item">
        <div class="input-wrapper">
          <span class="title">配置项</span>
          <my-mul-select class="select-input" ref="config-select"
            :placeholder="'选择器官/染色方式/分类'"
            :listHead="selectHead"
            :listData="selectData"
            @select="SelectData">
          </my-mul-select>
        </div>
      </div>
    </form>
  </my-layer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import layer from 'layer'
import {
  GET_ORGAN_LIST,
  GET_CONFIG_LIST
} from 'service'
import { ErrorHandler } from 'common'

import MyLayer from 'widget/MyLayer/index.vue'
import MySelect from 'widget/MySelect/index.2.vue'
import MyMulSelect from 'widget/MyMulSelect/index.2.vue'

interface SelecHeadItem {
  prop: string,
  label: string,
  width: string
}
interface SelectData {
  organ: any[],
  dye: any[],
  region: any[]
}
interface SelectCondition {
  organ: any,
  dye: any,
  region: any
}

@Component({
  components: {
    MyLayer,
    MySelect,
    MyMulSelect
  }
})
export default class LayerModifySlide extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  selectHead: SelecHeadItem[] = [
    {
      prop: 'organ',
      label: '器官',
      width: '30%'
    }, {
      prop: 'dye',
      label: '染色方式',
      width: '30%'
    }, {
      prop: 'region',
      label: '分类',
      width: '30%'
    }
  ]
  selectData: SelectData = {
    organ: [],
    dye: [],
    region: []
  }
  currentSelected: SelectCondition = {
    organ: null,
    dye: null,
    region: null
  }
  slideIds: string[] = []

  mounted () {
    this.$on('pop', (obj: object) => {
      this.InitData(obj)
      this.$refs.layer.$emit('showLayer', '6.2rem;', '5rem')
    })
  }

  InitData (obj: any) {
    this.ClearSelect()
    this.slideIds = obj.slideIds
    this.GetOrgan()
  }
  // 清空选择
  ClearSelect () {
    this.currentSelected.organ = null
    this.currentSelected.dye = null
    this.currentSelected.region = null
    this.$refs['config-select'].$emit('clear')
  }
  // 获取[器官列表]
  GetOrgan () {
    GET_ORGAN_LIST({
      parentId: '',
      category: 'organ'
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const list = res.data.data.pathOrgan
        // 数据处理
        list.forEach((item: any) => {
          item.value = item.name
        })
        this.selectData.organ = list
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 获取[染色方式]
  GetDye (pid: string) {
    GET_CONFIG_LIST({
      parentId: pid,
      category: 'dyeing'
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const list = res.data.data.children
        // 数据处理
        list.forEach((item: any) => {
          item.value = item.name
        })
        this.selectData.dye = list
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 获取[二级分类]
  GetRegion (pid: string) {
    GET_CONFIG_LIST({
      parentId: pid,
      category: 'region'
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const list = res.data.data.children
        // 数据处理
        list.forEach((item: any) => {
          item.value = item.name
        })
        this.selectData.region = list
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 多级下拉选择选择框选择事件
  SelectData (type: string, obj: any) {
    /**
     * 下拉选择,type值:
     * 器官: organ,
     * 染色: dye,
     * 分类: region
     */
    switch (type) {
      case 'organ':
        this.currentSelected.organ = obj
        this.currentSelected.dye = null
        this.currentSelected.region = null
        this.GetDye(obj.id)
        break
      case 'dye':
        this.currentSelected.dye = obj
        this.currentSelected.region = null
        this.GetRegion(obj.id)
        break
      case 'region':
        this.currentSelected.region = obj
        break
    }
  }
  ClickOk (layerIndex: number) {
    // 条件判断
    if (!this.currentSelected.region) {
      layer.msg('必须选择配置项')
      return false
    }
    layer.close(layerIndex)
    this.$emit('ok', {
      slideIds: this.slideIds,
      diseaseId: this.currentSelected.region.id
    })
  }
}
</script>

<style lang="less" scoped>
.layer-wrapper{
  .form-item{
    height: 1.4rem;
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
