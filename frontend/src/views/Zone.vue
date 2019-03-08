<template>
  <div class="zone">
    <Map :zone="zone" model="zone" childModel="building" childModelKey="buildings" childModelLabel="厂房" @edit="editBuilding($event)"/>
    <el-dialog title="厂房编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="访问楼层" label-width="120px">
          <el-select :disabled="building.floors&&building.floors.length==0" v-model="form.floor" placeholder="请选择楼层">
            <router-link v-for="(item,index) in building.floors" :key="index" :to="'/vbuilding/'+building.id+'?floor='+item.id"><el-option :label="item.index" :value="item.index"></el-option></router-link>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="form.name"></el-input>
          <el-button type="primary" style="margin-left:10px" @click="saveName()">保 存</el-button>
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveName()">保 存</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
// @ is an alias to /src
import Map from '@/components/Map.vue'
let buildIndex = 0;
export default {
  name: 'zone',
  created(){
    this.getZone()
  },
  beforeRouteUpdate (to, from, next) {
    next();
    this.getZone()
  },
  data(){
    return{
      zone: {},
      dialogFormVisible: false,
      building:{},
      form:{
        name: "",
        floor: ""
      }
    }
  },
  components: {
    Map
  },
  methods:{
    getZone(){
      let zoneid = this.$route.params.id;
      API.getData('zone',zoneid).then(response=>{
        this.zone = response;
      })
    },
    editBuilding(data){
      buildIndex = data.index;
      API.getData('building',data.id).then(response=>{
        this.building= response;
        this.form.name = response.name;
        this.dialogFormVisible = true;
      })
    },
    saveName(){
      if(this.form.name!=this.building.name){
        API.updateData('building',this.building.id,`name=${this.form.name}`).then(response=>{
          this.building= response;
          this.zone.buildings[buildIndex].name = response.name;
          this.dialogFormVisible = false;
        })
      }
    }
  }
}
</script>
<style>
.zone .el-input{width:300px}
</style>
