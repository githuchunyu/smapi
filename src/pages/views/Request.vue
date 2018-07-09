<template>

    <div class="api-request">
      <h2>请求</h2>
      <h3>
        <span>数据结构</span>
        <div class="btns">
          <Button type="text" icon="close" @click="reset" v-if="editing">重置</Button>
          <Button type="text" icon="checkmark" @click="save" v-if="editing">保存</Button>
          <Button type="text" icon="plus" @click="add">添加字段</Button>
        </div>
      </h3>
      <Table :columns="column" :data="list" style="width:962px;"></Table>

      <Modal v-model="visible" :title="(ziduan.index>=0?'编辑':'新增')+'字段'" @on-ok="saveZiduan">
        <Form :label-width="80" v-model="ziduan">
          <FormItem label="名称">
            <Input v-model="ziduan.field"></Input>
          </FormItem>
          <FormItem label="类型">
            <Input v-model="ziduan.type"></Input>
          </FormItem>
          <FormItem label="必须">
            <i-switch v-model="ziduan.required"></i-switch>
          </FormItem>
          <FormItem label="默认值">
            <Input v-model="ziduan.default"></Input>
          </FormItem>
          <FormItem label="描述">
            <Input v-model="ziduan.description"></Input>
          </FormItem>
          <FormItem label="可选">
            <i-switch v-model="ziduan.optional"></i-switch>
          </FormItem>
          <FormItem label="范例" v-if="!ziduan.optional">
            <Input v-model="ziduan.example"></Input>
          </FormItem>
          <FormItem label="选项" v-if="ziduan.optional">
            <div style="display:flex;margin-bottom:4px;" v-for="(o,i) in ziduan.options" :key="i"><span>值</span><Input style="width:60px;margin:0 12px 0 4px;" v-model="o.option"></Input><span>说明</span><Input style="flex:1;margin-left:4px;" v-model="o.label"></Input></div>
            <Button type="text" icon="plus" @click="addOption">添加选项</Button>
          </FormItem>
        </Form>
      </Modal>
    </div>

</template>

<script scoped>
export default {
    name:'home',
    props:['api_id','data'],
    data: function () {
      return {
        visible:false,
        editing:false,
        list:JSON.parse(this.data),
        ziduan:{},
        column:[
          {
            title:'名称',
            key:'field',
            width:120,
          },
          {
            title:'类型',
            key:'type',
            width:80,
          },
          {
            title:'必须',
            key:'require',
            width:80,
            align:'center',
            render: (h, params) => {
              if (params.row.required) {
                return h('div', [
                    h('Icon', {
                        props: {
                            type: 'checkmark-round',
                            color:"#19be6b"
                        }
                    }),
                ]);
              } else {
                return h('div')
              }
            }
          },
          {
            title:'默认值',
            key:'default',
            width:100,
          },
          {
            title:'描述',
            key:'description',
            width:220,
          },
          {
            title:'范例',
            key:'example',
            width:160,
            render: (h, params) => {
              if (params.row.optional) {
                return h('div',
                  params.row.options.map((item)=>{
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
                return h('div',params.row.example)
              }
            }
          },
          {
            title:'操作',
            key:'require',
            width:200,
            align:'center',
            render: (h, params) => {
              return h('ButtonGroup', [
                  h('Button', {
                      props: {
                          type: 'default',
                          size:'small'
                      },
                      on:{
                        click:()=>{
                          this.edit(params.index);
                        }
                      }
                  },'编辑'),
                  h('Button', {
                      props: {
                          type: 'default',
                          size:'small'
                      }
                  },'删除'),
                  h('Button', {
                      props: {
                          type: 'default',
                          icon:'arrow-up-a',
                          size:'small',
                          disabled:params.index==0,
                      },
                      on:{
                        click:()=>{
                          this.up(params.index);
                        }
                      }
                  }),
                  h('Button', {
                      props: {
                          type: 'default',
                          icon:'arrow-down-a',
                          size:'small',
                          disabled:params.index==this.list.length-1,
                      },
                      on:{
                        click:()=>{
                          this.down(params.index);
                        }
                      }
                  }),
              ]);
            }
          },
        ],
      }
    },
    computed:{

    },
    methods: {

        // 显示请求编辑
        edit(index){
          this.visible = true;
          let ziduan = this.list[index];
          ziduan.index = index;
          if (ziduan.optional) {
            ziduan.options = JSON.parse(ziduan.example);
          }
          this.ziduan = ziduan;
        },

        // 请求数据添加字段
        add(){
          this.ziduan = {
            index:-1,
            field:'ziduan',
            type:'',
            required:false,
            default:'',
            description:'',
            example:'',
            optional:false,
            options:[],
          };
          this.visible = true;
        },

        // 删除数据字段
        delete(index){
          this.list.splice(index,1);
        },

        // 上移数据字段
        up(index){
          let ii = this.list[index];
          this.list.splice(index,1)
          this.list.splice(index-1,0,ii);
        },
        down(index){
          let ii = this.list[index];
          this.list.splice(index,1)
          this.list.splice(index+1,0,ii);
        },

        // 添加选项
        addOption(){
          this.ziduan.options.push({
            option:'',label:'',
          })
        },

        reset(){
          this.list = JSON.parse(this.data);
          console.log(this.list);
          this.editing = false;
        },

        save(){
          let content = JSON.stringify(this.list);
          this.$base.cyPost({
            url:this.$store.state.apiUrl+'doc/request/save',
            data:{
              api_id:this.api_id,
              content:content,
            },
            success:()=>{
              this.editing = false;
            }
          })

        },

        saveZiduan(){
          let ziduan = Object.assign(this.ziduan);
          if (ziduan.optional) {
            ziduan.example = JSON.stringify(ziduan.options);
          }
          if (this.ziduan.index>=0) {
            this.list[this.ziduan.index] = ziduan;
          } else {
            this.list.push(ziduan);
          }
          this.editing = true;
        }


    },
    mounted(){

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  h3 {
    height:36px;
    display: flex;justify-content: space-between;align-items: center;
  }
</style>
