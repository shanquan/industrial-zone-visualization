<template>
  <el-container class="map">
    <el-main style="overflow-x:hidden">
      <div v-if="user.type==1" class="subheader"><el-button style="top:62px" type="text" icon="el-icon-arrow-left" class="el-button-back" @click="$router.go(-1)">返 回</el-button>{{zone.name}} </div>
      <img v-show="!editMode" id="bgimg" @load="getImgsize()" usemap="#bgmap" :alt="zone.name" :src="zone.bgimg?$root.devserver+zone.bgimg:'/'+model+'s/'+zone.id+'.jpg'" width="100%"/>
      <div v-if="user.type==0" v-show="editMode" id="drawcav"></div>
      <map name="bgmap" id="bgmap">
        <area v-for="(building,index) in buildings" :key="index" shape="poly" :coords="building.shape" :href="'/v'+childModel+'/'+building.id+'?role='+user.type" :alt="building.name" :title="building.name">
      </map>
    </el-main>
    <el-button v-show="user.type==0&&!editMode" @click="swtichEdit()" class="float_btn" type="primary" circle icon="el-icon-edit"></el-button>
    <el-aside v-show="user.type==0&&editMode" style="width:230px">
      <el-card class="aside-card">
        <div slot="header">
          <span>{{zone.name}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-view" @click="swtichEdit()">预览</el-button>
        </div>
        <div><el-input v-model="newBuilding" size="mini" :placeholder="childModelLabel" style="width:130px"></el-input><el-button style="float:right" type="primary" circle icon="el-icon-plus" size="mini" @click="addbl()"></el-button></div>
        <div style="font-size:12px;margin-top:10px">Tips: {{currentRow?'点击图片区域开始绘制，双击鼠标完成绘制':'选中'+childModelLabel+'开始绘制位置'}}<el-button size="mini" class="btn-cancel" @click="setCurrent()">取消选择</el-button></div>
        <el-table
          ref="singleTable"
          :data="zone[childModelKey]"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%">
          <el-table-column
            property="name"
            :label="childModelLabel">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click.native.prevent="editbl(scope.$index,scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" circle  @click.native.prevent="onDel(scope.$index,scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-aside>
  </el-container>
</template>
<script>
import zrender from 'zrender'
let zr,naturalWidth,
group_polylines,//所有厂房形状
group_polygonEdit,//绘制多边形形成的点和线
points=[],//厂房绘制点
dashline;//绘制闭合虚线
const circleStyle = {
  fill: '#fff',
  stroke: '#409EFF',
  lineWidth: 2

}
const lineStyle = {
  stroke: '#409EFF',
  lineWidth: 2
}
const polylineStroke = {
  default: '#409EFF',
  current: '#E6A23C'
}
const polyLineStyle={
  stroke: polylineStroke.default,
  shadowBlur: 10,
  shadowColor: '#909399',
  shadowOffsetY: 5,
  shadowOffsetX: 5,
  lineWidth: 2,
  lineDash: [4]
}
export default {
  name: 'Map',
  computed:{
    user(){
      return this.$store.state.user
    },
    isCollapse(){
      return this.$store.state.menuCollapse
    },
    buildings(){
      if(this.zone[this.childModelKey]&&this.zone[this.childModelKey].length){
        let buildings = [];
        this.zone[this.childModelKey].forEach(bld=>{
          try{
            if(bld.shape){
              let shape = JSON.parse(bld.shape).map(point=>{
                return point[0]*this.ratio+','+point[1]*this.ratio
              })
              shape = shape.join(',');
              buildings.push({
                id: bld.id,
                name: bld.name,
                shape: shape
              });
            }
          }catch(e){
            // console.log(e)
          }
        })
        return buildings;
      }else{
        return []
      }
    }
  },
  watch:{
    isCollapse(){
      setTimeout(()=>{
        this.resetRatio();
      },500)
    }
  },
  props: ['zone','model','childModel','childModelKey','childModelLabel'],
  data(){
    return{
      ratio: null,
      editMode: false,
      currentRow: null,
      newBuilding: ""
    }
  },
  methods:{
    getImgsize(){
      // console.log(event.target.naturalHeight,event.target.naturalWidth)
      if(event.target.naturalWidth){
        naturalWidth = event.target.naturalWidth;
        this.ratio = event.target.width/naturalWidth;
      }
      if(this.user.type==0&&this.ratio!=null){
        // create canvas and init
        this.renderGraph(naturalWidth,event.target.naturalHeight);
      }
    },
    renderGraph(width,height){
      let dcv = document.getElementById('drawcav');
      zr = zrender.init(dcv,{
        width: width,
        height: height
      });
      let bgimg = new zrender.Image({
        style:{
          image: document.getElementById('bgimg'),
          x:0,
          y:0,
          width: width,
          height: height
        }
      })
      zr.add(bgimg);
      group_polylines = new zrender.Group();
      this.zone[this.childModelKey].forEach((el)=>{
        if(el.shape){
          try{
            let shape = JSON.parse(el.shape);
            shape.push(shape[0]);
            let polyline = new zrender.Polyline({
              style: polyLineStyle,
              shape: {
                points: shape
              },
              name: 'polyline'+el.id
            });
            group_polylines.add(polyline);
          }catch(e){
            // console.log(e)
          }
        }
      })
      zr.add(group_polylines);
    },
    resetRatio(){
      if(naturalWidth)
        this.ratio = document.getElementById('bgimg').parentNode.clientWidth/naturalWidth;
      if(this.editMode){
        zr.dom.style.zoom = this.ratio
      }
    },
    swtichEdit(){
      if(this.ratio!=null){
        this.editMode=!this.editMode;
        this.$emit('swtichEdit',this.editMode);
        //默认预览模式，模式切换后需要重新设置ratio值
        if(naturalWidth){
          this.$nextTick(()=>{
            this.resetRatio()
          })
        }
      }else{
        this.$message({
          showClose: true,
          message: '图片加载失败无法编辑，请先上传图片',
          type: 'warning'
        });
      }
    },
    editbl(index,id){
      event.stopPropagation();
      this.$emit('edit',{
        index: index,
        id: id
      })
    },
    onDel(index,id){
      event.stopPropagation();
      if(this.model=='floor'){
         this.deletebl(index,id);
      }else{
        API.getData(this.childModel,id).then(response=>{
        if(response.floors.length){
          this.$message({
            showClose: true,
            message: '请先删除厂房所有楼层数据后，再删除厂房',
            type: 'warning'
          });
        }else{
          this.deletebl(index,id)
        }
      })
      }
    },
    deletebl(index,id){
      this.$confirm(`将永久删除此${this.childModelLabel}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.deleteData(this.childModel,id).then(()=>{
          this.zone[this.childModelKey].splice(index,1);
          group_polylines.remove(group_polylines.childOfName('polyline'+id));
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      })
    },
    addbl(){
      //&shape=`+JSON.stringify(points)
      let id = this.model=='zone'?this.$route.params.id:this.$route.query.floor;
      if(this.newBuilding)
      API.postData(this.childModel,`name=${this.newBuilding}&${this.model}=${id}`).then(response=>{
        this.newBuilding = "";
        response.zone = this.$route.params.id;
        this.zone[this.childModelKey].push(response);
      })
    },
    handleCurrentChange(val){
      // console.log(val)
      this.currentRow = val;
      zr.on('click',this.drawPolygon);
      zr.on('dblclick',this.finishDraw);
      //修改选中框颜色
      group_polylines.eachChild(el=>{
        el.attr('style',{
          stroke: polylineStroke.default
        })
      })
      if(this.currentRow){
        let polyline = group_polylines.childOfName('polyline'+this.currentRow.id);
        if(polyline)
          polyline.attr('style',{
            stroke: polylineStroke.current
          })
      }
      group_polygonEdit = new zrender.Group();
      zr.add(group_polygonEdit);
    },
    setCurrent(row){
      //清理group_polygonEdit中的元素
      zr.remove(group_polygonEdit);
      points = [];
      this.currentRow = null;
      this.$refs.singleTable.setCurrentRow(row);
      zr.off('click',this.drawPolygon)
      zr.off('dblclick',this.finishDraw);
    },
    drawPolygon(e){
      let x = e.offsetX/this.ratio,y = e.offsetY/this.ratio;
      let circle = new zrender.Circle({
        style: circleStyle,
        shape: {
          cx: x,
          cy: y,
          r: 5
        },
        zlevel: 1
      })
      points.push([x,y]);
      group_polygonEdit.add(circle);
      if(points.length>1){
        group_polygonEdit.add(new zrender.Line({
          style: lineStyle,
          shape: {
            x1: points[points.length-2][0],
            y1: points[points.length-2][1],
            x2: x,
            y2: y
          }
        }))
        if(points.length==2){
          dashline = new zrender.Line({
            style: Object.assign({lineDash:[4]}, lineStyle),
            shape: {
              x1: x,
              y1: y,
              x2: points[0][0],
              y2: points[0][1]
            }
          })
          group_polygonEdit.add(dashline);
        }else if(points.length>2){
          dashline.attr('shape',{
            x1: x,
            y1: y,
            x2: points[0][0],
            y2: points[0][1]
          })
        }
      }
    },
    finishDraw(){
      // event.stopPropagation();
      if(points&&points.length>3){
        if(this.currentRow.shape){
          //提示是否替换保存
          this.$confirm('此厂房已经设置了位置, 是否覆盖原位置并保存?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.saveBuilding(true)
          })
        }else{
          this.saveBuilding(false)
        }
      }
    },
    saveBuilding(overwrite){
      API.updateData(this.childModel,this.currentRow.id,'shape='+JSON.stringify(points)).then(response=>{
        let index = this.zone[this.childModelKey].indexOf(this.currentRow);
        this.zone[this.childModelKey][index].shape = response.shape;
        points.push(points[0]);
        if(overwrite){
          group_polylines.childOfName('polyline'+this.currentRow.id).attr('shape',{
            points: points
          })
        }else{
          group_polylines.add(new zrender.Polyline({
            style: polyLineStyle,
            shape: {
              points: points
            },
            name: 'polyline'+this.currentRow.id
          }))
        }
        this.setCurrent();
      })
    }
  },
  mounted(){
    window.onresize = ()=>{
      this.resetRatio();
    }
  }
}
</script>
<style>
.map{height:100%;overflow:visible}
.map .el-main,.zone .el-aside,.zone .el-card{padding:0;overflow:visible}
.map .el-card__header span{margin-right:10px}
.map .btn-cancel{float: right;
    padding: 5px;
    position: relative;
    top: 36px;
    z-index: 2;}
</style>
