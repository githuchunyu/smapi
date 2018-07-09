<template>
    <Card class="card">
        <h3>{{sname}}</h3>
        <div v-if="show!=0">
            <h4 v-if="need==2" style="color:#19be6b;">已更新</h4>
            <h4 v-if="need==0" style="color:#ed3f14;">未更新</h4>
            <h4 v-if="need==1" style="color:#ed3f14;"><i class="fa fa-spinner fa-pulse"></i> 更新中……</h4>
            <h5 v-if="start">{{start}} 至 {{end}}</h5>
            <div class="dates">
                <div class="date">
                    <p>更新日期</p>
                    <p>{{update}}</p>
                </div>
                <div v-if="predict" class="date">
                    <p>预测日期</p>
                    <p>{{predict}}</p>
                </div>
            </div>
        </div>
        <h4 v-else style="color:#ed3f14;">还没有上传过任何数据</h4>
        
        <Upload class="upload" :action="url" name="file" :format="['xlsx','xls','csv']" :on-success="upload" :show-upload-list="false" :before-upload="beforeUpload">
            <Button :disabled="need==1" type="primary" long icon="ios-cloud-upload-outline">上传文件</Button>
        </Upload>
    </Card>
</template>

<script scoped>
export default {
    name:'home',
    props:['sname','show','need','predict','update','start','end','url','upload'],
    data: function () {
        return {
        }
    },
    methods: {
        
        beforeUpload(){
            this.need=1;
        }
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
    margin-bottom: 15px;
    h3 {
        margin-bottom: 4px;
    }
    position: relative;
    .no {
        &:after {
            content:'';
            position: absolute;top:0;left:0;
            border:20px solid transparent;
            border-left:20px solid #ed3f14;
            border-top:20px solid #ed3f14;
            color:#FFF;
            z-index: -1;
        }
        position: absolute;top:0;left:0;z-index: 1;
        color:#FFF;font-weight: bold;
        height:24px;width:24px;line-height: 24px;
    }
}
.upload {
    display: inline-block;
}
.dates {
    display: flex;
    .date {
        flex:1;
        margin:15px 0;padding:0 15px;
        border-left:1px solid #EEE;
        width:120px;
        p {
            &:nth-child(1) {
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
