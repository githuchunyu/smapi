<template>
  <div class="page-other">
    <div class="mz-con">
        <div class="other-tip">没有找到页面</div>
    </div>
  </div>
</template>

<script scoped>
export default {
  components: {

  },
  name:'o404',
  data () {
    return {
      
    }
  },
  methods:{

  },
  mounted:function(){
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .page-other {
        height:600px;
        display: flex;
        justify-content:center;
        align-items:center;
    }
    .mz-con {
        flex:1;
        display: inline-block;
        text-align: center;
    }
    .other-tip {
        color:#999;
    }
</style>