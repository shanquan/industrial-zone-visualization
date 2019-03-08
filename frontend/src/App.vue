<template>
  <el-container id="app" style="height:100vh;border: 1px solid #eee">
    <el-header class="main">
      <router-link to="/"><img src="./assets/byd.png" alt="byd-logo" class="header-logo" /></router-link>
      <div class="title">
        电子事业群可视化系统
      </div>
      <div v-if="user.type!=1" style="width:76px;float:right">
        <span>{{user.name}}</span>
        <el-button type="text" style="color:#fff;margin-left:10px">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside v-if="user.type!=1" style="background-color: rgb(238, 241, 246);width:auto">
        <el-menu :router="true" :default-openeds="['1']" :default-active="'/'" class="admin-menu" :collapse="isCollapse">
          <el-menu-item index="" @click="menuChange()">
            <i class="el-icon-menu"></i>
            <span slot="title">导航</span>
          </el-menu-item>
          <el-menu-item index="/">
            <i class="el-icon-star-on"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">区域维护</span>
            </template>
            <el-menu-item-group>
              <span slot="title">地区</span>
              <el-menu-item v-for="(item,index) in zones" :key="index" :index="'/vzone/'+item.id">{{item.name}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/vfloors">
            <i class="el-icon-news"></i>
            <span slot="title">楼层管理</span>
          </el-menu-item>
          <el-menu-item index="/vprofit">
            <i class="el-icon-date"></i>
            <span slot="title">车间效益管理</span>
          </el-menu-item>
          <el-menu-item index="/vusers">
            <i class="el-icon-service"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-footer class="center">开发支持：电子事业群执行副总裁办公室&nbsp;&nbsp;V0.1</el-footer>
  </el-container>
</template>

<script>

export default {
  name: 'app',
  created(){
    if(this.$route.query.role!=undefined){
      this.$store.commit('setUserType',this.$route.query.role)
    }
    API.getData('zone').then(response=>{
      let zones = response.map(el=>{
        return el
      });
      this.$store.commit('updateZones',zones);
    })
  },
  computed:{
    user(){
      return this.$store.state.user
    },
    isCollapse(){
      return this.$store.state.menuCollapse
    },
    zones(){
      return this.$store.state.zones.map(el=>{
        return {
          id: el.id,
          name: el.name
        }
      })
    }
  },
  methods:{
    menuChange(){
      this.$store.commit('changeMenu');
    }
  }
}
</script>
<style>
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
    margin: 0;
    padding: 0
  }
a{text-decoration: none}
.el-main{padding:0;overflow-x:hidden}
  .el-header.main {
    font-size: 12px;
    background-color: rgb(64, 158, 255);
    color: #fff;
    line-height: 60px;
    padding-right:2px
  }

  .main .el-dropdown {
    color: #fff
  }

  .header-logo {
    display: inline-block;
    vertical-align: middle;
  }
  .el-header .title{
    font-size:18px;
    display:inline-flex;
    padding:0 10px;
    /* max-width: 160px; */
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-footer {
    line-height: 60px;
    font-size:14px;
    border-top:solid 1px #eaeefb;
  }
.center{
  text-align: center
}
.admin-menu:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
.subheader{border-bottom:solid 1px #eaeefb;padding:10px;font-size:16px;text-align: center;color:#409EFF}
.subheader .el-button-back{position: absolute;left: 12px;top: 12px;}
.float_btn{position:absolute;top:65px;right:5px;z-index:3}
.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-upload:hover {
  border-color: #409EFF;
}
.imgBox .el-icon-close{
  position:absolute;
  top:2px;
  right:2px;
  background-color: #fff
}
.form-bar{
  padding-top: 20px;
  padding-left: 10px;
  background-color: #f2f2f2;
}
.el-input__inner{min-width: 106px}
</style>
