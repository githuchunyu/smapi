<template>
  <div class="sm-menu">

    <div class="sm-logo"><span><b>SIGMOID</b>管理后台</span></div>
    <div class="sm-menu-avatar">
      <img :src="userinfo.headimgurl" alt="">
    </div>
    <div class="sm-menu-nickname">{{userinfo.nickname}}</div>
    <div class="sm-menu-wrap">
    <Menu style='width:200px;' theme="dark" :active-name="activeName" :open-names="[openName]" @on-select="onClick">
      <Submenu v-for="r1 in rs" :name='r1.name' :key="r1.name">
        <template slot="title">
          <i :class="'fa fa-'+r1.icon"></i>
          <span>{{r1.title}}</span>
        </template>
        <MenuItem v-for="r2 in r1.children" :name="r2.name" :key="r2.name"><i :class="'fa fa-'+r2.icon"></i>{{r2.title}}</MenuItem>
      </Submenu>
    </Menu>
  </div>
  </div>
</template>

<script>

export default {
  name: 'Mmenu',
  props:{

  },
  data () {
    return {
        rs: [
          {name: 'data',title:'数据统计',icon: 'area-chart',children:[
              {path:'users',name:'data_users',title:'用户管理',icon:'users'},
              {path:'views',name:'data_views',title:'流量分析',icon:'eye'},
              {path:'shares',name:'data_shares',title:'分享统计',icon:'eye'},
              {path:'orders',name:'data_orders',title:'订单统计',icon:'shopping-cart'},
              {path:'recommend',name:'data_recommend',title:'推荐结果',icon:'check'},
              {path:'feedback',name:'data_feedback',title:'用户反馈',icon:'comments'},
          ]},
          {name: 'content',title:'内容发布',icon: 'paper-plane',children:[
              {path:'stocks',name:'content_stocks',title:'股票数据',icon:'th-list'},
              {path:'recommend',name:'content_recommend',title:'股票推荐',icon:'check-square'},
              {path:'article',name:'content_article',title:'精选推文',icon:'file'},
              {path:'broadcast',name:'content_broadcast',title:'广播通知',icon:'bullhorn'},
          ]},
          {name: 'xuan',title:'选股游戏',icon: 'gamepad',children:[
              {path:'data',name:'xuan_data',title:'游戏数据',icon:'th-list'},
              {path:'select',name:'xuan_select',title:'用户选择',icon:'check-square'},
              {path:'record',name:'xuan_record',title:'战绩查询',icon:'star'},
              {path:'prize',name:'xuan_prize',title:'奖品设置',icon:'tags'},
          ]},
          {name:'settings',title:'系统设置',icon:'cog',children:[
              {path:'product',name:'settings_product',title:'产品管理',icon:'briefcase'},
              {path:'discount',name:'settings_discount',title:'优惠促销',icon:'certificate'},
              {path:'wechat',name:'settings_wechat',title:'公众号',icon:'wechat'},
              {path:'admin',name:'settings_admin',title:'管理员',icon:'lock'},
          ]},
          {name:'monitor',title:'系统监控',icon:'desktop',children:[
              {path:'tasks',name:'monitor_tasks',title:'定时任务',icon:'clock-o'},
          ]},
          {name:'tech',title:'技术开发',icon:'desktop',children:[
              {path:'api',name:'tech_api',title:'接口文档',icon:'clock-o'},
          ]},
        ]
    }
  },
  computed:{
    openName(){
      return this.$route.name.split('_')[0];
    },
    activeName(){
      return this.$route.name;
    },
    userinfo(){
      return this.$store.state.userinfo;
    }
  },
  mounted: function () {

  },
  methods: {
    onClick(name){
      this.$router.push({name:name});
    }
  }
}
</script>

<style lang="less" scoped>
.sm-menu {
  position:fixed;
  z-index: 200;
  top:0;left:0;width:200px;bottom:0;
  background: #495060;
  text-align: left;
  overflow: hidden;
}
.sm-menu-avatar {
  width:96px;height:96px;
  img {
    height:96px;width:96px;
  }
  border-radius: 50%;
  overflow: hidden;
  margin:20px auto 10px auto;
}
.sm-menu-nickname {
  color:#FFF;
  text-align: center;padding:0 0 20px 0;
}
.sm-menu-wrap {
  position:absolute;
  z-index: 200;
  top:160px;left:0;width:220px;bottom:36px;
  overflow-y: scroll;
  overflow-x:hidden;
}
.sm-logo {
  position: absolute;bottom:0;
  height:36px;width:200px;line-height: 36px;
  color:#FFF;
  font-size: 16px;
  text-align: center;
  border-top:1px solid rgba(255,255,255,0.1);
}
.sm-menu .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item.ivu-menu-item-active {
    border-right: none;
    color: #fff;
    background: rgba(0,0,0,0.2)!important;
    border-left:3px solid #2d8cf0;
}
.sm-menu .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item {
    border-left:3px solid transparent;
    font-size: 13px;
    i {
      display: inline-block;width:24px;
      margin-right:8px;
      border-right:1px solid rgba(255,255,255,0.2);
      text-align: center;
    }
}
</style>
