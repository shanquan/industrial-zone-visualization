<template>
  <el-row class="workshop" :gutter="10">
    <el-col :xs="24" :sm="12">
      <div class="subheader"><el-button type="text" icon="el-icon-arrow-left" class="el-button-back" @click="$router.go(-1)">返 回</el-button>车间信息</div>
      <el-form class="grid-content bg-purple-light" label-width="100px">
        <el-form-item label="车间名称">{{workshop.name}}</el-form-item>
        <el-form-item label="所属厂房">{{buildingName}}</el-form-item>
        <el-form-item label="所属楼层">#{{workshop.floor?workshop.floor.index:''}}</el-form-item>
        <el-form-item label="房间号">{{workshop.room}}</el-form-item>
        <el-form-item label="使用面积">{{workshop.area}}</el-form-item>
      </el-form>
    </el-col>
    <el-col :xs="24" :sm="12">
      <div class="subheader">车间效益</div>
      <el-form class="grid-content bg-purple-light" label-width="100px">
        <el-form-item label="月份">
          <el-date-picker
            v-model="month"
            type="month"
            :picker-options="{disabledDate:(dm)=>{
              return dm>new Date()
            }}"
            value-format="yyyy-MM"
            @change='getProfit()'
            placeholder="月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="效益">{{workshop.profit}}</el-form-item>
        <el-form-item label="效益面积比">{{workshop.area?workshop.profit/workshop.area:0 | fixed2}}</el-form-item>
        <el-form-item label="事业部">{{workshop.division}}</el-form-item>
        <el-form-item label="工厂/部门">{{workshop.facdept}}</el-form-item>
        <!-- <el-form-item label="法人">{{workshop.corporate}}</el-form-item> -->
      </el-form>
    </el-col>
  </el-row>
</template>
<script>

export default {
  name: 'workshop',
  created(){
    API.getData('workshop',this.$route.params.id).then(response=>{
      API.queryData('profit',`month=${this.month}&workshop=${response.id}`).then(profit=>{
        if(profit.length){
          response.profit = profit[0].profit;
        }
        this.workshop = response;
      })
    })
  },
  computed:{
    buildingName(){
      let name="";
      if(this.workshop.floor){
        this.$store.state.zones.forEach(zone=>{
          zone.buildings.forEach(el=>{
            if(el.id==this.workshop.floor.building){
              name = el.name;
            }
          })
        })
        return name;
      }else{
        return name
      }
    }
  },
  data(){
    return{
      workshop:{},
      month:this.todayMonth(),
      end:''
    }
  },
  methods:{
    todayMonth(){
      let td = new Date();
      let month = td.getMonth()+1;
      month = month.toString().length==1?'0'+month:month;
      return td.getFullYear()+'-'+month
    },
    getProfit(){
      API.queryData('profit',`month=${this.month}&workshop=${this.workshop.id}`).then(profit=>{
        if(profit.length){
          this.workshop.profit = profit[0].profit;
        }else{
          this.workshop.profit = undefined;
        }
      })
    }
  }
}
</script>
<style>
.workshop{padding:10px}
.el-col{margin-bottom:10px}
.bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
