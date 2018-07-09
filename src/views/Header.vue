<template>
  <div class="sm-header">
    <div class="sm-header-left">
      <h2>{{routerTitle}}</h2>
    </div>
    <div class="sm-header-right">    
        <Avatar :src="require('../assets/logo.svg')" />
        <span class="sm-header-name">{{name}}</span>
        <Dropdown placement="bottom-end">
          <Button type="ghost" shape="circle" icon="android-settings"></Button>
          <DropdownMenu slot="list">
            <DropdownItem><Button type="text"><Icon class='sm-header-icon' type="person"></Icon>账号设置</Button></DropdownItem>
            <DropdownItem><Button type="text" @click='exitAccount'><Icon class='sm-header-icon' type="log-out"></Icon>退出登陆</Button></DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button type="ghost" shape="circle" icon='arrow-expand' @click='handleFullScreen'></Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sm-header',
  data () {
    return {
        avatar:'',
        name:'',
        isFullscreen:false,
    }
  },
  mounted: function () {
    // 全屏相关
    document.addEventListener('fullscreenchange', () => {
        this.isFullScreen = !this.isFullScreen;
    });
    document.addEventListener('mozfullscreenchange', () => {
        this.isFullScreen = !this.isFullScreen;
    });
    document.addEventListener('webkitfullscreenchange', () => {
        this.isFullScreen = !this.isFullScreen;
    });
    document.addEventListener('msfullscreenchange', () => {
        this.isFullScreen = !this.isFullScreen;
    });

  },
  computed:{
    routerTitle(){
      return this.$route.meta.title;
    },
  },
  methods: {

    exitAccount() {
      let that = this;
      this.$base.setCookie('islogin','false',-1);
      this.$router.push({name:'login'})
    },

    handleFullScreen () {
      let main = document.body;
        if (this.isFullScreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            if (main.requestFullscreen) {
               main.requestFullscreen();
            } else if (main.mozRequestFullScreen) {
                main.mozRequestFullScreen();
            } else if (main.webkitRequestFullScreen) {
                main.webkitRequestFullScreen();
            } else if (main.msRequestFullscreen) {
                main.msRequestFullscreen();
            }
        }
    },
  }
}
</script>

<style lang="less" scoped>
.sm-header {
  position:fixed;
  z-index: 200;
  top:0;left:200px;right:0;
  height:50px;
  border-bottom:1px solid #EEE;
  background: #FFF;
}
.sm-header-left {
  padding-left:10px;
  height:50px;line-height: 50px;
  float:left;
  display: flex;
  align-items: center;
  h2 {
    font-size: 14px;
    margin-left: 8px;
  }
}
.sm-header-right {
  padding:9px 10px;
  float:right;
}
.sm-header-right span {
  display: inline-block;
  height:32px;
  line-height:32px;
  vertical-align: top;
  font-size: 14px;
}
.sm-header-name {
  padding:0 12px;
  margin-right:10px;
  border-right:1px solid #EEE;
}
.sm-header-icon {
  display: inline-block;
  width:30px;
  text-align: center;
}
.ivu-dropdown-item {
  padding:0;
}
</style>

