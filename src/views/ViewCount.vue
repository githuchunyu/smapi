<template>
    <Card class="card">
        <h3>浏览量</h3>
        <div class="counts">
            <div class="count">
                <p>{{countShow}}</p>
                <p>显示</p>
            </div>
            <div class="count">
                <p>{{countReal}}</p>
                <p>真实</p>
            </div>
        </div>
    </Card>
</template>

<script scoped>
export default {
    name:'home',
    props:['countShow','countReal'],
    data: function () {
        return {
        }
    },
    methods: {
        
    },
    mounted(){

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.card {
    width:300px;
    background:#FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    h3 {
        margin-bottom: 4px;
    }
    position: relative;
}
.counts {
    display: flex;
    .count {
        flex:1;
        margin:15px 0;padding:0 15px;
        border-left:1px solid #EEE;
        width:120px;
        p {
            &:nth-child(1) {
                font-size: 20px;
                color:#333;
            }
            &:nth-child(2) {
                font-size: 12px;
                color:#999;
            }
        }
        &:nth-child(1) {
            border:none;
        }
    }
}
</style>
