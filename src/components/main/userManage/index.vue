<template>
  <div id="user-manage" class="content">
    <!-- 搜索条件 -->
    <search-user-manage @search="Search"/>
    <!-- 搜索结果 -->
    <result-user-manage ref="result-user-manage"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import searchUserManage from './search.vue'
import resultUserManage from './result.vue'

@Component({
  components: {
    searchUserManage,
    resultUserManage
  }
})
export default class UserManageIndex extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }

  Search (type: string, obj: object) {
    this.$refs['result-user-manage'].$emit('search', obj)
  }
}
</script>

<style lang="less" scoped>
.content{
  padding: 0 0.3rem;
}
</style>
