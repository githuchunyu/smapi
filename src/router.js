import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/',
  routes: [
  	{ path: '/', name:'main',redirect:'/home',component: resolve => require(['@/pages/interface'], resolve),children:[
      {path:'home',name:'home',component:resolve => require(['@/pages/interface'], resolve),meta:{requireAuth:true}}
    ]},
    {path:'/404',name:'NotFound',component:resolve => require(['@/pages/error/404'], resolve),},
    {path:'*', redirect:'/404'},  //404
  ]
})
