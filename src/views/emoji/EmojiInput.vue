<template>
    <div class="input">
        <Input ref="input" v-model="input" @on-focus="showEmoji" @on-blur="hideEmoji"></Input>
        <div class="emoji" v-if="visibleEmoji">
            <div class="emoji-title">绘文字-Emoji</div>
            <div class="emoji-con">
                <div class="item" v-for="(e,key) in emoji" @click="inputEmoji(e.char)">
                    <img :src="'http://img.sigmoid.cc/emoji/'+key+'.png'" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script scoped>
import base from "../../base"
import emoji from "./data.js"
export default {
    name:'home',
    model: {
      prop: 'val',
      event: 'changeValue'
    },
    props:['val','maxlength'],
    data: function () {
        return {
            input:this.val,
            visibleEmoji:false,
            emoji:emoji,
        }
    },
    watch: {
        val(val) {
            this.input = val;
        },
        input(v){
            this.$emit("changeValue",v);
        }
    },

    methods: {
        showEmoji(){
            this.visibleEmoji = true;
        },
        hideEmoji(){
            setTimeout(()=>{
                this.visibleEmoji = false;
            },200)
        },
        inputEmoji(c){
            console.log(c)
            let s = this.$refs.input.$refs.input.selectionStart;
            let e = this.$refs.input.$refs.input.selectionEnd;
            let i = this.input;
            i = i.substr(0,s)+c+i.substr(e,i.length-e);
            this.input = i;
        },
    },
    mounted(){

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.input {
    position: relative;
}
.emoji {
    position:absolute;top:34px;left:0;width:390px;z-index: 999;
    background:#FFF;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    .emoji-title {
        padding:4px;
        position: relative;
        background: #666;color:#FFF;
    }
    .emoji-con {
        margin:12px;
        padding:4px;
        height:200px;
        overflow-y: auto;
        background: #FFF;
    }
    .item {
        img {
            position: absolute;top:0;left:0;
            width:24px;height:24px;
            transition: all 0.2s;
        }
        position: relative;
        display: inline-block;
        margin:2px;
        width:24px;height:24px;text-align: center;line-height: 22px;
        overflow:visible;
        &:hover {
            img {
                width:36px;height:36px;
                top:-6px;left:-6px;
            }
        }
    }
}
</style>
