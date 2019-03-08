<template>
  <div class="building">
    <el-dropdown v-show="!editMode" :class="{ right: user.type==1 }">
      <el-button type="primary">
        楼层#{{floor.index}}<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <router-link :to="'/vbuilding/'+$route.params.id+'?floor='+item.id" v-for="(item,index) in building.floors" :key="index"><el-dropdown-item>#{{item.index}}</el-dropdown-item></router-link>
      </el-dropdown-menu>
    </el-dropdown>
    <Map :zone="floor" model="floor" childModel="workshop" childModelKey="workshops" childModelLabel="车间" @edit="editWorkshop($event)" @swtichEdit="editMode=$event"/>
    <el-dialog title="车间编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="楼层" label-width="120px">
          #{{floor.index}}
        </el-form-item>
        <el-form-item label="房间号" label-width="120px">
          <el-input v-model="form.room"></el-input>
        </el-form-item>
        <el-form-item label="面积" label-width="120px">
          <el-input type="number" v-model="form.area"></el-input>
        </el-form-item>
        <el-form-item label="工厂/部门" label-width="120px">
          <el-input v-model="form.facdept"></el-input>
        </el-form-item>
        <el-form-item label="事业部" label-width="120px">
          <el-input v-model="form.division"></el-input>
        </el-form-item>
        <el-form-item label="法人" label-width="120px">
          <el-input v-model="form.corporate"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveWorkshop()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Map from '@/components/Map.vue'
export default {
  name: 'building',
  created(){
    if(this.$route.query.role!=undefined){
      this.$store.commit('setUserType',this.$route.query.role)
    }
    this.getBuilding()
  },
  beforeRouteUpdate(to, from, next) {
    next();
    if(to.params.id!=from.params.id)
      this.getBuilding()
    if(to.query.floor!=from.query.floor)
      this.getFloor()
  },
  data(){
    return{
      user:this.$store.state.user,
      building:{},
      floor:{},
      dialogFormVisible: false,
      editMode:false,
      form:{
        name: "",
        room: "",
        division: "",
        corporate: "",
        area: 0
      }
    }
  },
  components: {
    Map
  },
  methods:{
    getBuilding(){
      API.getData('building',this.$route.params.id).then(response=>{
        this.building= response;
        if(this.building.floors.length==0){
          this.$message({
            message: '此厂房还未添加楼层数据',
            // duration:0,
            type: 'warning'
          });
        }else{
          if(!this.$route.query.floor)
          this.$route.query.floor = this.building.floors[0].id;
          this.getFloor();
        }
      })
    },
    getFloor(){
      if(this.$route.query.floor);
      API.getData('floor',this.$route.query.floor).then(response=>{
        this.floor = response;
        this.floor.name = this.building.name;
        if(this.floor.bgimg==''){
          this.$message({
            message: '此楼层未上传图片',
            type: 'warning'
          });
        }
      })
    },
    editWorkshop(data){
      this.form = this.floor.workshops[data.index];
      this.form.floorIndex = this.floor.index;
      this.dialogFormVisible = true;
    },
    saveWorkshop(){
      if(this.form.name&&!isNaN(this.form.area)){
        API.updateData('workshop',this.form.id,`name=${this.form.name}&area=${Number(this.form.area)}&facdept=${this.form.facdept}&division=${this.form.division}&corporate=${this.form.corporate}`).then(response=>{
          this.form = response;
          this.dialogFormVisible = false;
        })
      }
    }
  }
}
</script>
<style>
.building .el-dropdown{position:absolute;z-index: 3}
.el-dropdown-menu__item a{display:block;}
.building .right{right:0}
</style>