<template>
  <div class="home">
  <div v-if="user.type==0">
    <el-form v-if="editMode" :inline="true" :model="formAddZone">
      <el-form-item>
        <el-input v-model="formAddZone.name" placeholder="地区" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addZone()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-button @click="switchEdit()" class="float_btn" type="primary" circle :icon="editMode?'el-icon-view':'el-icon-edit'"></el-button>
  </div>
  <el-row :gutter="10">
    <el-col v-for="(item,index) in zones" :key="index" :sm="12" :md="6" :lg="4" :xl="3">
      <router-link v-if="!editMode" :to="'/vzone/'+item.id"><el-card :body-style="{ padding: '0px'}" class="center">
        <div class="imgBox">
          <img :src="item.bgimg?$root.devserver+item.bgimg:'/zones/'+item.id+'.jpg'" class="image">
        </div>
        <div class="bottom">
          <span>{{item.name}}</span>
        </div>
      </el-card>
      </router-link>
      <el-card v-else :body-style="{ padding: '0px'}" class="center">
        <div v-if="item.bgimg" class="imgBox">
        <img :src="$root.devserver+item.bgimg">
        <i class="el-icon-close" @click="clearBgimg(index,item)"></i>
        </div>
        <el-upload v-else
          class="home-uploader"
          :action="$root.devserver+'/upload'"
          :data="{model:'zone',id:item.id}"
          name="image"
          :show-file-list="false"
          :on-success="handleImageSuccess"
          :before-upload="beforeImageUpload">
          <i class="el-icon-plus"></i>
        </el-upload>
        <div class="bottom" style="text-align:left;padding:0 10px;display:flex">
          <div style="flex:1" contenteditable="true" @blur="editZone(index,item)">{{item.name}}</div>
          <el-button type="text" icon="el-icon-delete" style="color:red" @click="delZone(index,item)"></el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
  </div>
</template>
<script>
var cacheBg = null;

export default {
  name: 'home',
  computed:{
    user(){
      return this.$store.state.user
    },
    zones(){
      return this.$store.state.zones
    }
  },
  data(){
    return{
      editMode: false,
      dialogVisible: false,
      dialogImageUrl: "",
      formAddZone:{
        name: ""
      }
    }
  },
  methods:{
    addZone(){
      if(this.formAddZone.name){
        API.postData('zone',`name=${this.formAddZone.name}`).then(response=>{
          this.zones.push(response);
          this.$store.commit('updateZones',this.zones);
        })
      }
    },
    editZone(index,zone){
      let newName = event.target.innerText;
      if(newName&&newName!=zone.name){
        API.updateData('zone',zone.id,'name='+newName).then(response=>{
          this.zones[index].name = response.name;
        })
      }else if(!newName){
        event.target.innerHTML = zone.name
      }
    },
    delZone(index,zone){
      if(zone.buildings&&zone.buildings.length){
        this.$message({
          showClose: true,
          message: '请先删除地区所有厂房数据后，再删除地区',
          type: 'warning'
        });
      }else{
        API.deleteData('zone',zone.id).then(response=>{
          this.zones.splice(index,1)
          this.$store.commit('updateZones',this.zones);
        })
      }
    },
    switchEdit(){
      this.editMode=!this.editMode;
      if(!this.editMode&&cacheBg!=null){
        this.zones[cacheBg.index].bgimg = cacheBg.url;
        cacheBg = null;
      }
    },
    clearBgimg(index,item){
      cacheBg = {
        index: index,
        url: item.bgimg
      }
      item.bgimg = '';
    },
    setBgImg(id,url){
      cacheBg = null;
      let zones = [];
      this.$store.state.zones.forEach(el=>{
        if(el.id==id){
          // el.bgimg  = res.url
          el.bgimg  = url;
        }
        zones.push(el);
      })
      this.$store.commit('updateZones',zones);
    },
    handleImageSuccess(res, file){
      // console.log(res,file) URL.createObjectURL(file.raw)
      this.setBgImg(res.id,res.url);
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      if(isJPG && isLt10M)
      return this.$confirm(`重新上传地区图片后所有厂房区域均需绘制, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      return false;
    }
  }
}
</script>
<style>
.home {padding:20px}
.home .imgBox{position:relative;height:200px}
.home .imgBox img{max-height:200px}
.home .el-card{margin-bottom:10px;}
.home .bottom{line-height: 40px;}
.bottom .el-button{float:right}
.home-uploader .el-upload{
  width:190px;
  height:200px;
  line-height: 200px;
}
.home-uploader .el-icon-plus {
  font-size: 40px;
  color: #8c939d;
}
</style>
