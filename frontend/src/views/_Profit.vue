<template>
  <div class="profit">
    <el-form :inline="true" label-position="right" :model="form" class="form-bar">
      <el-form-item>
        <el-input placeholder="请输入内容" v-model="form.query" clearable class="input-with-select">
          <el-select v-model="form.select" slot="prepend" placeholder="请选择">
            <el-option label="车间" value="name"></el-option>
            <el-option label="工厂/部门" value="facdept"></el-option>
            <!-- <el-option label="法人" value="corporate"></el-option> -->
            <el-option label="事业部" value="division"></el-option>
            <el-option label="地区" value="zoneName"></el-option>
            <el-option label="厂房" value="buildingName"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="月份">
        <el-date-picker
          v-model="month"
          type="month"
          :picker-options="{disabledDate:(dm)=>{
            return dm>new Date()
          }}"
          value-format="yyyy-MM"
          @change='monthChange()'
          placeholder="月份">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <el-table
      :data="filterWorkshops"
      stripe
      style="width: 100%">
      <el-table-column
        prop="zoneName"
        label="地区">
      </el-table-column>
      <el-table-column
        prop="buildingName"
        label="厂房">
      </el-table-column>
      <el-table-column
        prop="floor.index"
        label="楼层" width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="车间">
      </el-table-column>
      <el-table-column
        label="效益">
        <template slot-scope="scope">
          <div :contenteditable="month==todayMonth()&&user.type!=1" @blur="updateProfit(scope.$index,scope.row)">{{scope.row.profit}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="area"
        label="面积">
      </el-table-column>
      <el-table-column
        label="效益面积比">
        <template slot-scope="scope">
          {{scope.row.area?scope.row.profit/scope.row.area:0 | fixed2}}
        </template>
      </el-table-column>
      <el-table-column
        prop="facdept"
        label="工厂/部门" width="200">
      </el-table-column>
      <el-table-column
        prop="division"
        label="事业部">
      </el-table-column>
      <!-- <el-table-column
        prop="corporate"
        label="法人" width="200">
      </el-table-column> -->
    </el-table>
  </div>
</template>
<script>

export default {
  name: 'profit',
  created(){
    API.getData('workshop').then(response=>{
      let res = response.filter((el)=>{
        return el.floor!=null
      })
      res = res.map(el=>{
        this.$store.state.zones.forEach(zone=>{
          zone.buildings.forEach(building=>{
            if(building.id==el.floor.building){
              el.buildingName = building.name;
              el.zoneName = zone.name;
            }
          })
        })
        el.profit=0;
        return el;
      })
      this.getProfit(res);
    })
  },
  computed:{
    user(){
      return this.$store.state.user
    },
    filterWorkshops(){
      return this.workshops.filter(el=>{
        if(this.form.query==''){
          return true
        }else{
          return el[this.form.select].indexOf(this.form.query)!=-1
        }
      })
    }
  },
  data(){
    return{
      month: this.todayMonth(),
      form:{
        query: '',
        select: 'name'
      },
      workshops:[]
    }
  },
  methods:{
    todayMonth(){
      let td = new Date();
      let month = td.getMonth()+1;
      month = month.toString().length==1?'0'+month:month;
      return td.getFullYear()+'-'+month
    },
    monthChange(){
      let res = this.workshops.map(el=>{
        if(el.profitId){
          delete el.profitId
          el.profit = 0
        }
        return el;
      })
      this.getProfit(res);
    },
    getProfit(workshops){
      API.queryData('profit',`month=${this.month}`).then(response=>{
        this.workshops = workshops.map(el=>{
          response.forEach(resel=>{
            if(resel.workshop.id==el.id){
              el.profit = resel.profit;
              el.profitId = resel.id;
            }
          })
          return el;
        })
      })
    },
    updateProfit(index,row){
      let profit = Number(event.target.innerText);
      // console.log(profit,isNaN(profit),row.profit);
      if(isNaN(profit)){
        event.target.innerHTML = row.profit==undefined?'':row.profit;
        return false;
      }else if(event.target.innerText&&profit!=Number(row.profit)){
        if(!row.profitId){
          API.postData('profit',`workshop=${row.id}&profit=${profit}&month=${this.month}`).then(response=>{
            row.profit = profit;
            row.profitId = response.id;
          })
        }else{
          API.updateData('profit',row.profitId,`profit=${profit}`).then(()=>{
            row.profit = profit;
          })
        }
      }else{
        event.target.innerHTML = row.profit==undefined?'':row.profit
      }
    }
  }
}
</script>
