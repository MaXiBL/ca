<template>
  <div id="navbar">
    <img class="logo" src="../../assets/images/navbar/logo.png" alt="thoroughimages">
    <div class="nav-wrapper">
      <!-- 一级菜单 -->
      <div class="first-degree-menu">
        <div class="menu-item"
          v-for="(item, index) in menuList"
          :key="index">
          <div class="item-head"
            :class="{'active': $route.path === item.path || (!item.showChildren && $route.path.split('/')[2] === item.code.split('-')[1])}"
            @click.stop="clickMenu(item)">
            <i class="icon" :class="`icon-${item.code}`"></i>
            <span class="title">{{ item.name }}</span>
            <i class="icon-arrow-down"
              :class="{'icon-arrow-up': item.showChildren}"
              v-if="item.children"></i>
          </div>
          <!-- 二级菜单 -->
          <div class="second-degree-menu" v-show="item.showChildren">
            <div class="menu-item"
              v-for="(child, childIndex) in item.children"
              :key="childIndex">
              <div class="item-head"
                :class="{'active': $route.path === child.path}"
                @click.stop="clickMenu(child)">
                <i class="icon"></i>
                <span class="title">{{child.name}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <img class="logo-company" src="../../assets/images/common/img_company_logo.png" alt="thorough images">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { GET_ORGAN_LIST } from 'service'

interface Menu {
  name: string,
  code: string,
  path: string,
  showChildren?: boolean,
  children?: Menu[]
}
interface Organ {
  id: string,
  code: string,
  name: string
}

@Component
export default class Nav extends Vue {
  menuList: Menu[] = [
    {
      name: '病例管理',
      code: 'manage-case',
      path: '/manage/case'
    },
    {
      name: '用户管理',
      code: 'manage-user',
      path: '/manage/user'
    },
    {
      name: '标签管理',
      code: 'manage-label',
      path: ''
    }
  ]

  created () {
    this.GetOrganList()
  }

  // 显示/隐藏 二级菜单, 或跳转页面
  clickMenu (item: any) {
    if (item.children) {
      item.showChildren = !item.showChildren
    } else {
      this.$router.push(item.path)
    }
  }

  GetOrganList () {
    GET_ORGAN_LIST({
      category: 'organ',
      repeat: true
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        const list = res.data.data.organList
        if (list[0]) {
          this.menuList[2].path = `/manage/label/${list[0].type}/${list[0].id}`
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>
#navbar{
  padding-top: 0.01rem;
  height: 100%;
  position: relative;
  .logo{
    margin: 0.3rem auto 0.29rem;
    display: block;
    height: 0.71rem;
    width: 1.78rem;
  }
  .nav-wrapper{
    padding: 0;
    width: 100%;
    height: auto;
    box-sizing: border-box;

    .first-degree-menu{
      .menu-item{
        // margin: 0.15rem 0;
        cursor: pointer;

        .item-head{
          height: 0.9rem;
          background: none;
          &.active,
          &:hover{
            background-color: #D57DA7;
            .title{
              color: #fff
            }
            .icon-arrow-down{
              background-image: url('../../assets/images/navbar/icon_arrow_down_active.png');
              &.icon-arrow-up{
                background-image: url('../../assets/images/navbar/icon_arrow_up_active.png');
              }
            }
            .icon-manage-user{
              background-image: url('../../assets/images/navbar/icon_user_active.png');
            }
            .icon-manage-case{
              background-image: url('../../assets/images/navbar/icon_slide_active.png');
            }
            .icon-manage-slide{
              background-image: url('../../assets/images/navbar/icon_progress_active.png');
            }
            .icon-manage-label{
              background-image: url('../../assets/images/navbar/icon_label_active.png');
            }
          }
          .icon{
            float: left;
            margin-top: 0.25rem;
            margin-left: 0.4rem;
            width: 0.4rem;
            height: 0.4rem;
            background-repeat: no-repeat;
            background-size: contain;
          }
          .icon-manage-user{
            background-image: url('../../assets/images/navbar/icon_user.png');
          }
          .icon-manage-case{
              background-image: url('../../assets/images/navbar/icon_slide.png');
            }
          .icon-manage-slide{
            background-image: url('../../assets/images/navbar/icon_progress.png');
          }
          .icon-manage-label{
            background-image: url('../../assets/images/navbar/icon_label.png');
          }
          .title{
            float: left;
            margin-left: 0.15rem;
            font-size: 0.24rem;
            font-weight: normal;
            line-height: 0.9rem;
            color: #fff;
          }
          .icon-arrow-down{
            float: right;
            margin-top: 0.3rem;
            margin-right: 0.15rem;
            width: 0.3rem;
            height: 0.3rem;
            background-image: url('../../assets/images/navbar/icon_arrow_down.png');
            background-repeat: no-repeat;
            background-size: contain;
            &.icon-arrow-up{
              background-image: url('../../assets/images/navbar/icon_arrow_up.png');
            }
          }
        }
      }
    }
    .second-degree-menu{
      .menu-item{
        .item-head{
          height: 0.8rem;
          .icon{
            background: transparent;
          }
          .title{
            line-height: 0.8rem;
            color: #B6B6B6;
          }
          &.active,
          &:hover{
            .title{
              color: #fff;
            }
          }
        }
      }
    }
  }
  .logo-company {
    width: 1.87rem;
    height: 0.35rem;
    position:absolute;
    bottom: 0.41rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
