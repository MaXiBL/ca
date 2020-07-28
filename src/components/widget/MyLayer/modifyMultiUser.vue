<template>
  <my-layer class="layer-wrapper" ref="layer" :title="'修改医生信息'" @ok="ClickOk" >
    <form>
      <div class="form-item">
        <div class="input-wrapper">
          <span class="title">所属医院</span>
          <my-select class="select-input"
            :placeholder="'请选择所属医院'"
            :list="hospitalList"
            :current.sync="selectedHospital">
          </my-select>
        </div>
      </div>
      <div class="form-item">
        <div class="input-wrapper">
          <span class="title">用户角色</span>
          <my-select class="select-input"
            :placeholder="'请选择用户角色'"
            :list="roleList"
            :current.sync="selectedRole">
            <i class="icon-none"></i>
          </my-select>
        </div>
      </div>
    </form>
  </my-layer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import layer from 'layer'
import { UPDATE_USERS_INFO } from 'service'

import MyLayer from 'widget/MyLayer/index.vue'
import MySelect from 'widget/MySelect/index.2.vue'

@Component({
  components: {
    MyLayer,
    MySelect
  }
})
export default class LayerModifyMultiUser extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  userList: any[] = []
  selectedHospital: any = {}
  selectedRole: any = {}

  get hospitalList () {
    return this.$store.getters['getHospitalList']
  }
  get roleList () {
    return this.$store.getters['getRoleList']
  }

  mounted () {
    this.$on('pop', (userList: any[]) => {
      this.InitData(userList)
      this.$refs.layer.$emit('showLayer', '6.2rem;', '7rem')
    })
  }

  InitData (userList: any[]) {
    this.selectedHospital = {}
    this.selectedRole = {}
    this.userList = userList
  }
  ClickOk (layerIndex: number) {
    if (this.selectedHospital.id && this.selectedRole.id) {
      UPDATE_USERS_INFO({
        userIdList: this.userList.join(','),
        userType: this.selectedRole.id,
        companyId: this.selectedHospital.id
      }).then((res: AxiosRes) => {
        if (res.data.success) {
          layer.close(layerIndex)
          layer.msg(res.data.message)
          this.$emit('ok')
        } else {
          layer.msg(res.data.message)
        }
      })
    } else {
      layer.msg('必须选择医院和角色')
    }
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
      .input{
        float: left;
        padding: 0 0.5rem 0 0.1rem;
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
        &:focus{
          border-color: #D57DA7;
          outline: none;
        }
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
