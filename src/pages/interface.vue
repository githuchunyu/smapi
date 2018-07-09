<template>
    <div class="wrap">
        <div class="left">
            <Button type="text" long icon="plus" @click="showBlock(0)">新增功能块</Button>
            <ul>
              <li v-for="b in blocks" :key="b.id" :class="b.select?'select':''" @click="selectBlock(b)">
                <span>{{b.title}}</span>
                <div class="btns">
                  <Button type="text" icon="edit" size="small" @click="showBlock(b)"></Button>
                  <Button type="text" icon="close" size="small" @click="deleteBlock(b.id)"></Button>
                </div>
              </li>
            </ul>
        </div>
        <div class="middle">
          <Button type="text" long icon="plus" @click="showInterface(0)" v-if="block_id>0">新增接口</Button>
          <div class="none" v-if="block_id==0">还没有选择任何块</div>
          <div class="none" v-if="block_id>0 && interfaces.length==0">暂无数据</div>
          <ul>
            <li v-for="(i,index) in interfaces" :key="i.id" :class="i.select?'select':''" @click="selectInterface(index,i)">
              <span>{{i.title}}</span><span>{{i.type}}</span>
              <div class="btns">
                <Button type="text" icon="close" size="small"></Button>
              </div>
            </li>
          </ul>
        </div>
        <div class="right">
          <div class="none" v-if="interface_id==0">还没有选择任何接口</div>
          <div class="api" v-if="interface_id>0">
            <div class="api-title">
              <h1>{{detail.title}}<Button type="text" icon="edit" @click="showInterface(detail)">编辑基本信息</Button></h1>
              <Tag :color="detail.type=='GET'?'green':'blue'">{{detail.type}}</Tag>
            </div>
            <div class="api-auth">授权 <span v-if="detail.auth==''">开放</span><span v-if="detail.auth=='user'">用户</span><span v-if="detail.auth=='admin'">管理员>={{detail.admin_level}}</span><span v-if="detail.auth=='either'">登录</span></div>
            <div class="api-description">{{detail.description}}</div>
            <div class="api-url">https://api.sigmoid.cc/<span>{{detail.url}}t</span></div>
            <Request :api_id="detail.id" :data="detail.request"></Request>
            <Response :api_id="detail.id" :data="detail.response" :example="detail.example"></Response>
          </div>
        </div>

        <Modal v-model="blockForm.visible" :title="(blockForm.id==0?'新增':'编辑')+'功能块'" @on-ok="saveBlock">
          <Form :label-width="80">
            <FormItem label="功能块名称">
              <Input v-model="blockForm.name"></Input>
            </FormItem>
            <FormItem label="功能块标题">
              <Input v-model="blockForm.title"></Input>
            </FormItem>
          </Form>
        </Modal>

        <Modal v-model="interfaceForm.visible" :title="(interfaceForm.id==0?'新增':'编辑')+'接口基本信息'" @on-ok="saveInterface">
          <Form :label-width="80">
            <FormItem label="接口名称">
              <Input v-model="interfaceForm.name"></Input>
            </FormItem>
            <FormItem label="接口标题">
              <Input v-model="interfaceForm.title"></Input>
            </FormItem>
            <FormItem label="接口类型">
              <RadioGroup type="button" v-model="interfaceForm.type">
                  <Radio label="GET"></Radio>
                  <Radio label="POST"></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="修改分组">
              <Select v-model="interfaceForm.block_id" style="width:200px">
                  <Option v-for="item in blocks" :value="item.id" :key="item.id">{{ item.title }}</Option>
              </Select>
            </FormItem>
            <FormItem label="接口权限">
              <RadioGroup type="button" v-model="interfaceForm.auth">
                  <Radio label="">开放</Radio>
                  <Radio label="user">用户</Radio>
                  <Radio label="admin">管理员</Radio>
                  <Radio label="either">登录</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="权限级别">
              <InputNumber :max="10" :min="1" v-model="interfaceForm.admin_level"></InputNumber>
            </FormItem>
            <FormItem label="接口描述">
              <Input v-model="interfaceForm.description"></Input>
            </FormItem>
            <FormItem label="接口地址">
              <Input v-model="interfaceForm.url"></Input>
            </FormItem>
          </Form>
        </Modal>

    </div>
</template>

<script scoped>
import Request from './views/Request'
import Response from './views/Response'
export default {
    name:'home',
    components:{
      Request,
      Response,
    },
    data: function () {
      return {
        requestVisible:false,
        responseVisible:false,
        blockForm:{},
        interfaceForm:{},
        blocks:[],
        block_id:0,
        interfaces:[],
        interface_id:0,
        interface_index:-1,
        detail:{},

        responseColumn:[
          {
            title:'名称',
            key:'field',
            width:160,
            render: (h, params) => {
              let f = params.row.field.split('.');
              return h('div', {
                style:{
                  'font-weight':'bold',
                  'padding-left':16*(f.length-1)+'px',
                }
              },f[f.length-1]);
            }
          },
          {
            title:'类型',
            key:'type',
            width:200,
            render: (h, params) => {
              return h('div', {
                style:{
                  'font-style':'italic'
                }
              },params.row.type);
            }
          },
          {
            title:'描述',
            key:'description',
            width:260
          },
          {
            title:'示例值',
            key:'options',
            render: (h, params) => {
              if (params.row.optional) {
                return h('div',
                  params.row.example.map((item)=>{
                    return h('div',{
                      style:{
                        display:"flex",
                        margin:'4px 0',
                        alignItems:'center'
                      }
                    },[
                      h('span',{
                        style:{
                          width:'24px',
                          marginRight:'4px',
                          background:'#2d8cf0',
                          color:'#FFF',
                          padding:'2px 4px',
                          borderRadius:'4px'
                        }
                      },item.option),
                      h('span',item.label)
                    ])
                  })
                );
              } else {
                return h('div','')
              }

            }
          },
        ],
      }
    },
    computed:{

    },
    methods: {
        // 获取功能块
        listBlock(){
            this.$base.cyGet({
                url:this.$store.state.apiUrl+"doc/block/list",
                success:(data)=>{
                    for (let i = data.length-1;i>=0;i--) {
                      data[i].select = false;
                    }
                    this.blocks = data;
                }
            })
        },

        // 获取接口列表
        listInterface(){
            return this.$base.cyGet({
                url:this.$store.state.apiUrl+"doc/interface/list",
                data:{
                  block_id:this.block_id,
                },
                success:(data)=>{
                    for (let i = data.length-1;i>=0;i--) {
                      data[i].select = false;
                    }
                    this.interfaces = data;
                }
            })
        },

        // 获取接口详情
        detailInterface(id){
            this.$base.cyGet({
                url:this.$store.state.apiUrl+"doc/interface/detail",
                data:{
                  id:id,
                },
                success:(data)=>{
                    this.interface_id = id;
                    this.detail = data;
                }
            })
        },

        // 显示功能块编辑
        showBlock(block){
          if (block==0) {
            this.blockForm = {
              visible:true,
              id:0,
              name:'',
              title:'',
            }
          } else {
            this.blockForm = {
              visible:true,
              id:block.id,
              name:block.name,
              title:block.title,
            }
          }
        },

        // 保存功能块
        saveBlock(){
          this.$base.cyPost({
            url:this.$store.state.apiUrl+"doc/block/save",
            data:{
              id:this.blockForm.id,
              name:this.blockForm.name,
              title:this.blockForm.title,
            },
            success:()=>{
              this.listBlock();
            }
          })
        },

        // 删除功能块
        deleteBlock(id){
          this.$base.cyPost({
            url:this.$store.state.apiUrl+"doc/block/delete",
            data:{
              id:id,
            },
            success:()=>{
              this.listBlock();
            }
          })
        },

        // 选择功能块
        selectBlock(b){
          for (let i =this.blocks.length-1;i>=0;i--) {
            this.blocks[i].select = false;
          }
          b.select = true;
          this.block_id = b.id;
          this.interface_id = 0;
          this.interface_index = 0;
          this.listInterface();
        },
        // 选择接口
        selectInterface(i,b){
          for (let i =this.interfaces.length-1;i>=0;i--) {
            this.interfaces[i].select = false;
          }
          b.select = true;
          this.interface_index = i;
          this.detailInterface(b.id);
        },

        // 显示接口编辑
        showInterface(o){
          if (this.interfaces.block_id==0) {
            alert('请先选择功能块');
            return;
          }
          if (o==0) {
            this.interfaceForm = {
              visible:true,
              id:0,
              block_id:this.block_id,
              name:'',
              title:'',
              description:'',
              type:'GET',
              url:'',
              auth:'',
              admin_level:0,
            }
          } else {
            this.interfaceForm = {
              visible:true,
              id:o.id,
              block_id:this.block_id,
              name:o.name,
              title:o.title,
              description:o.description,
              type:o.type,
              url:o.url,
              auth:o.auth,
              admin_level:o.admin_level,
            }
          }
        },

        // 保存接口基本信息
        saveInterface(){
          this.$base.cyPost({
            url:this.$store.state.apiUrl+"doc/interface/save",
            data:{
              id:this.interfaceForm.id,
              block_id:this.interfaceForm.block_id,
              type:this.interfaceForm.type,
              url:this.interfaceForm.url,
              auth:this.interfaceForm.auth,
              admin_level:this.interfaceForm.admin_level,
              title:this.interfaceForm.title,
              name:this.interfaceForm.name,
              description:this.interfaceForm.description,
            },
            success:()=>{
              if (this.interface_index>=0) {
                this.interfaces[this.interface_index].title = this.interfaceForm.title;
                this.interfaces[this.interface_index].type = this.interfaceForm.type;
              }
              // 如果变更了block_id呢？
              if (this.interfaceForm.block_id!=this.block_id) {
                this.changeBlock(this.interfaceForm.block_id,this.interfaceForm.id);
              }
            }
          })
        },

        // 更换了block
        changeBlock(block_id,id){
          this.block_id = block_id;
          this.blocks.map((v,i)=>{
            v.select = v.id==block_id;
          });
          this.listInterface().then(()=>{
            this.interfaces.map((v,i)=>{
              v.select = v.id==id;
            });
          })
        },
        // 请求数据添加字段
        addRequest(){
          this.requestJsonEdit.push({
            field:'',
            type:'String',
            required:false,
            default:'',
            description:'',
            example:'',
          })
          console.log(this.requestJson)
        }


    },
    mounted(){
        this.listBlock();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.wrap {
    height:100%;overflow-y: hidden;
    display: flex;
    background: #FFF;

}
.none {
  text-align: center;
  padding:24px 0;
  color:#CCC;
}
.left {
  width:200px;height:100%;overflow-x:visible;
  border-right:1px solid #DDD;
  ul {
    li {
      padding:0 20px;height:48px;
      font-size: 16px;font-weight: bold;
      display: flex;justify-content: space-between;align-items: center;
      position: relative;
      overflow-x:visible;
      user-select: none;
      &.select {
        border-top:1px solid #DDD;border-bottom:1px solid #DDD;
        border-right:1px solid #FFF;
        margin-right:-1px;
      }
      .btns {
        display: none;background: #FFF;
        position: absolute;top:0;bottom:0;right:0px;z-index: 999;
      }
      &:hover .btns {
        display: flex;
      }
    }
  }
}
.middle {
  width:240px;height:100%;
  overflow: auto;
  border-right:1px solid #EEE;
  ul {
    li {
      padding:0 20px;height:36px;
      font-size: 14px;
      display: flex;justify-content: space-between;align-items: center;
      position: relative;
      user-select: none;
      &.select {
        color:#2d8cf0;font-weight: bold;
      }
      .btns {
        display: none;background: rgba(255,255,255,0.9);
        position: absolute;right:0;top:0;bottom:0;
      }
      &:hover .btns {
        display: flex;
      }
    }
  }
}
.right {
  flex:1;height:100%;overflow-y: auto;
}
.api {
  width:1002px;padding:20px;
  &-title {
    display: flex;justify-content: space-between;align-items: center;
  }
  &-auth {
    color:#999;
    span {
      color:#333;
    }
  }
  &-description {
    font-size: 16px;color:#666;
  }
  &-url {
    background: #333;color:#CCC;
    padding:8px;
    font-size:16px;
    border-radius: 4px;
    span {
      font-weight: bold;
      color:#ff9900;
      margin-left:4px;
    }
  }
  &-request {
    margin:20px 0;
    h2 {
      color:#666;
    }
    h3 {
      display: flex;justify-content: space-between;
    }
  }
  &-response {
    margin:20px 0;
    h2 {
      color:#666;
    }
    h3 {
      display: flex;justify-content: space-between;
    }
  }
}
</style>
