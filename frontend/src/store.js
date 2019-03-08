import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    menuCollapse: true,
    user: {
      workid: 123,
      name: '管理员',
      type: 1
    },
    zones:[]
  },
  mutations: {
    changeMenu(state) {
      state.menuCollapse = !state.menuCollapse;
    },
    updateZones(state,zones){
      state.zones = zones;
    },
    setUserType(state,role){
      role = Number(role);
      switch(role){
        case 0: state.user.type=0;break;
        case 1: state.user.type=1;break;
        case 2: state.user.type=2;break;
      }
    }
  }
})
