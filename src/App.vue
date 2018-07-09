<template>
    <div class="container" id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import base from "./base"
export default {
    name: 'app',
    components: {

    },
    data: function () {
        return {

        }
    },
    computed:{
      isLogin(){
        return this.$store.state.isLogin;
      }
    },
    methods:{

    },
    watch:{
      isLogin(v){
        if (!v) {
          this.$router.push({name:'login'})
        }
      }
    },
    mounted(){
    }
}
</script>

<style lang="less">
// @import './iview.less';
@import './index.less';
  // normalize
html,body {
    margin: 0;padding: 0;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    background: #FFF;
    -webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;
    height:100%;
    color:#333;
}
input {
    outline: none;
    box-sizing: border-box;
    font-size: 14px;
    font-family: 'PingFangSC', 'Microsoft Yahei';
}
ul,li {
    margin: 0;padding: 0;
    list-style: none;
}
a {
    text-decoration: none;
    color: #000;
}
a:hover {
    color:@primary;
}
.container {
    width:100%;height:100%;
}
</style>
<style>
    .ivu-tabs {
        display: flex;width:100%;
        flex-direction: column;
    }
    .ivu-tabs-content {
        flex:1;width:100%;
        display: flex;
    }
    .ivu-tabs-tabpane {
        overflow-x: auto;
    }
</style>
