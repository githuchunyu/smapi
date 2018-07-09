import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/* 全局数据*/
const state = {
	isLogin:false,
	apiUrl:"xxx",
	userinfo:{},
};

export default new Vuex.Store({
  	state,
  	mutations:{
  		login(state,info){
  			state.isLogin = true;
				state.userinfo = info;
  		},
  		logout(state){
  			state.isLogin = false;
  		}
  	}
})
