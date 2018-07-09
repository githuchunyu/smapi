<template>

    <div class="api-request">
      <h2>响应</h2>
      <h3>
        <span>数据结构</span>
        <div class="btns">
          <Button type="text" icon="close" @click="reset" v-if="editing">重置</Button>
          <Button type="text" icon="checkmark" @click="save" v-if="editing">保存</Button>
          <Button type="text" icon="plus" @click="add">添加字段</Button>
        </div>
      </h3>
      <Table :columns="column" :data="list" style="width:962px;"></Table>

      <h3>
        <span>返回示例</span>
        <div class="btns">
          <Button type="text" icon="close" @click="resetExample" v-if="editingExample">重置</Button>
          <Button type="text" icon="checkmark" @click="saveExample" v-if="editingExample">保存</Button>
          <Button type="text" icon="edit" @click="editExample">编辑</Button>
        </div>
      </h3>
      <div class="example">
        <div class="code" v-highlight v-if="!editingExample">
          <pre v-html="exampleInput"></pre>
        </div>
        <Input type="textarea" :autosize="true" v-if="editingExample" v-model="exampleInput"></Input>
      </div>


      <Modal v-model="visible" :title="(ziduan.index>=0?'编辑':'新增')+'字段'" @on-ok="saveZiduan">
        <Form :label-width="80">
          <FormItem label="名称">
            <Input v-model="ziduan.field"></Input>
          </FormItem>
          <FormItem label="类型">
            <Input v-model="ziduan.type"></Input>
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
    props:['api_id','data','example'],
    data: function () {
      return {
        visible:false,
        editing:false,
        editingExample:false,
        list:JSON.parse(this.data),
        exampleInput:this.example,
        ziduan:{},
        column:[
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
                return h('div','')
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
        },

        editExample(){
          this.editingExample = true;
        },
        resetExample(){
          this.exampleInput = this.example;
          this.editingExample = false;
        },
        saveExample(){
          this.$base.cyPost({
            url:this.$store.state.apiUrl+'doc/example/save',
            data:{
              api_id:this.api_id,
              content:this.exampleInput,
            },
            success:()=>{
              this.editingExample = false;
            }
          })
        },

        // 请求数据添加字段
        add(){
          this.ziduan = {
            index:-1,
            field:'ziduan',
            type:'',
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
            url:this.$store.state.apiUrl+'doc/response/save',
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
  .code pre {
    margin:0;
  }
</style>
