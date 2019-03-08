<template>
  <div class="floors">
    <el-form :inline="true" label-position="right" :model="form" class="form-bar">
      <el-form-item label="地区">
        <el-select v-model="form.zone" placeholder="地区" @change="form.building='x'">
          <el-option label="全选" value="x"></el-option>
          <el-option v-for="(zone,index) in zones" :key="index" :label="zone.name" :value="zone.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="厂房">
        <el-select v-model="form.building" placeholder="厂房">
          <el-option label="全选" value="x"></el-option>
          <el-option v-for="(building,index) in buildings" :key="index" :label="building.name" :value="building.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="filter()">查询</el-button>
      </el-form-item> -->
      <el-form-item label="楼层" v-if="user.type==0">
        <el-input-number :disabled="this.form.building=='x'" v-model="form.floorIndex" :min="-5" :max="10" label="楼层"></el-input-number>
      </el-form-item>
      <el-form-item v-if="user.type==0">
        <el-button type="primary" :disabled="this.form.building=='x'" @click="addFloor()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="filterFloors"
      stripe
      style="width: 100%">
      <el-table-column
        prop="building.zonename"
        label="地区"
        width="180">
      </el-table-column>
      <el-table-column
        prop="building.name"
        label="厂房"
        width="180">
      </el-table-column>
      <el-table-column
        label="楼层">
        <template slot-scope="scope">
          <div contenteditable="true" @blur="updateFloorIndex(scope.$index,scope.row)">{{scope.row.index}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="图片">
        <template slot-scope="scope">
          <div v-if="scope.row.bgimg" class="imgBox">
          <img :src="$root.devserver+scope.row.bgimg">
          <i  v-if="user.type==0" class="el-icon-close" @click="setBgImg(scope.row.id,'',scope.$index)"></i>
          </div>
          <el-upload v-else
            class="floors-uploader"
            :action="$root.devserver+'/upload'"
            :data="{model:'floor',id:scope.row.id}"
            name="image"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload">
            <i class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column
        prop="workshop"
        label="车间维护">
        <template slot-scope="scope">
          <router-link :to="'/vbuilding/'+scope.row.building.id+'?floor='+scope.row.id+'&role='+user.type">{{scope.row.workshops.length}}</router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="删除楼层"
        v-if="user.type==0"
        width="100">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" size="mini" circle  @click.native.prevent="delFloor(scope.$index,scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

export default {
  name: 'floors',
  created(){
    API.getData('floor').then(response=>{
      this.floors = response.map(el=>{
        if(el.building){
          this.zones.forEach(zone=>{
            if(zone.id==el.building.zone){
              el.building.zonename = zone.name
            }
          })
        }
        return el;
      })
    })
  },
  computed:{
    user(){
      return this.$store.state.user
    },
    zones(){
      return this.$store.state.zones
    },
    buildings(){
      let blArray = [];
      this.$store.state.zones.forEach(el=>{
        if(el.id==Number(this.form.zone)||this.form.zone=='x'){
          blArray = blArray.concat(el.buildings)
        }
      })
      return blArray;
    },
    filterFloors(){
      return this.floors.filter(floor=>{
        return this.form.zone=='x'||this.form.zone==floor.building.zone.toString()&&(this.form.building=='x'||this.form.building==floor.building.id.toString());
      })
    }
  },
  data(){
    return{
      form:{
        zone:"x",
        building: "x",
        floorIndex: 0
      },
      floors:[]
    }
  },
  methods:{
    addFloor(){
      API.postData('floor',`index=${this.form.floorIndex}&building=${this.form.building}`).then(response=>{
        this.zones.forEach(zone=>{
          if(zone.id==response.building.zone){
            response.building.zonename = zone.name
          }
        })
        this.floors.push(response);
      })
    },
    delFloor(index,row){
      if(row.workshops.length){
        this.$message({
          showClose: true,
          message: '请先删除楼层所有车间，再删除楼层',
          type: 'warning'
        });
      }else{
        this.$confirm(`将永久删除此楼层, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.deleteData('floor',row.id).then(()=>{
            this.floors.splice(index,1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        })
      }
    },
    updateFloorIndex(index,row){
      let newIndex = Number(event.target.innerText);
      if(isNaN(newIndex)){
        event.target.innerHTML = row.index;
        return false;
      }else if(newIndex<-5||newIndex>10){
        this.$message({
          showClose: true,
          message: '楼层请输入-5~10之间的数字',
          type: 'warning'
        });
        event.target.innerHTML = row.index;
        return false;
      }
      if(newIndex!=row.index){
        API.updateData('floor',row.id,'index='+newIndex).then(()=>{
          this.floors[index].index = newIndex;
        })
      }else{
        event.target.innerHTML = row.index
      }
    },
    setBgImg(id,url,index){
      if(index!=undefined){
        this.floors[index].bgimg = url;
      }else{
        this.floors = this.floors.map(floor=>{
          if(floor.id==id){
            floor.bgimg = url;
          }
          return floor
        })
      }
    },
    handleImageSuccess(res){
      // console.log(res,file)
      this.setBgImg(res.id,res.url);
    },
    beforeImageUpload(file) {
      if(this.user.type!=0){
        return false;
      }
      const isJPG = file.type === 'image/jpeg';
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      return isJPG && isLt10M;
    }
  }
}
</script>
<style>
.floors .imgBox{position:relative;height:48px;}
.floors .imgBox img{max-height:48px}
.floors-uploader{line-height:0}
.floors-uploader .el-upload{
  width:48px;
  height:48px;
  line-height: 48px;
}
.floors-uploader .el-icon-plus {
  font-size: 20px;
  color: #8c939d;
}
.floors .el-table td{
  padding:0
}
.cell a{
  display:block;
  width:100%;
  color:#409EFF
}
</style>