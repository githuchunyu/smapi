<template>
    <Modal
                v-model="visible"
                :width="1120"
                title="股票行情">

                <div class="title" slot="header">
                    <h1>{{stockName}}</h1>
                    <h2>{{stockCode}}</h2>
                </div>

                <div style="display:flex;">
                    
                    <div style="width:900px;position:relative;text-align:center;padding-top:24px;margin:0 auto;">
                        <div style="margin-bottom:8px;position:absolute;top:24px;z-index:999;">
                            <RadioGroup v-model="front" type="button" @on-change="changeFront">
                                <Radio label="不复权"></Radio>
                                <Radio label="前复权"></Radio>
                                <Radio label="后复权"></Radio>
                            </RadioGroup>
                        </div>
                        
                        <div class="chart" ref="chart" style="width:900px;height:550px;"></div>
                            
                    </div>
                </div>

                <div slot="footer">
                    <Button type="primary" @click="()=>{this.visible=false;}">确定</Button>
                </div>
                
            </Modal>
</template>

<script scoped>
export default {
    name:'quotation',
    model: {
      prop: 'show',
      event: 'changeShow'
    },
    props:['show','stockCode','stockName'],
    data: function () {
        return {
            visible:this.show,
            front:'前复权',
        }
    },
    watch:{
        show(value) {
          this.visible = value;
          if (value) {
            this.getKline();
          }
        },
        visible(value) {this.$emit('changeShow', value)},
    },
    computed:{
        type(){
            switch (this.front) {
                case "前复权":
                    return "fa";
                case "后复权":
                    return "ba";
                default:
                    return "";
            }
        }
    },
    methods: {

        changeFront(){
            if (this.front == "不复权") {
                this.getKline('no');
            } else {
                this.getKline('front');
            }
        },

        iniChart(){
            this.chart = echarts.init(this.$refs.chart);
        },

        setChart(data,title){
            let upColor = '#ec0000';
            let upBorderColor = '#8A0000';
            let downColor = '#00da3c';
            let downBorderColor = '#008F28';
            let dates0 = data.dates.slice(20,100)
            let data0 = data.values.slice(20,100)

            let calculateMA = (dayCount)=> {
                let result = [];
                for (let i = 20, len = data.values.length; i < len; i++) {
                    if (i < dayCount) {
                        result.push('-');
                        continue;
                    }
                    let sum = 0;
                    for (let j = 0; j < dayCount; j++) {
                        sum += data.values[i - j][1];
                    }
                    result.push((sum / dayCount).toFixed(2));
                }
                return result;
            }

            let option = {
                // title: {
                //     text: title,
                //     left: 0
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data: ['日K', 'MA5', 'MA10', 'MA20'],
                    left:'right'
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '15%',
                    top:'15%'
                },
                xAxis: {
                    type: 'category',
                    data: dates0,
                    scale: true,
                    boundaryGap : false,
                    axisLine: {onZero: false},
                    splitLine: {show: false},
                    splitNumber: 20,
                    min: 'dataMin',
                    max: 'dataMax'
                },
                yAxis: {
                    scale: true,
                    splitArea: {
                        show: true
                    }
                },
                dataZoom: [
                    {
                        type: 'inside',
                        start: 0,
                        end: 100
                    },
                    {
                        show: true,
                        type: 'slider',
                        y: '90%',
                        start: 0,
                        end: 100
                    }
                ],
                series: [
                    {
                        name: '日K',
                        type: 'candlestick',
                        data: data0,
                        itemStyle: {
                            normal: {
                                color: upColor,
                                color0: downColor,
                                borderColor: upBorderColor,
                                borderColor0: downBorderColor
                            }
                        },
                        markPoint: {
                            label: {
                                normal: {
                                    formatter: function (param) {
                                        return param != null ? param.value.toFixed(2) : '';
                                    }
                                }
                            },
                            data: [
                                {
                                    name: 'XX标点',
                                    coord: ['2013/5/31', 2300],
                                    value: 2300,
                                    itemStyle: {
                                        normal: {color: 'rgb(41,60,85)'}
                                    }
                                },
                                {
                                    name: 'highest value',
                                    type: 'max',
                                    valueDim: 'highest'
                                },
                                {
                                    name: 'lowest value',
                                    type: 'min',
                                    valueDim: 'lowest'
                                }
                            ],
                            tooltip: {
                                formatter: function (param) {
                                    return param.name + '<br>' + (param.data.coord || '');
                                }
                            }
                        },
                        markLine: {
                            symbol: ['none', 'none'],
                            data: [
                                [
                                    {
                                        name: 'from lowest to highest',
                                        type: 'min',
                                        valueDim: 'lowest',
                                        symbol: 'circle',
                                        symbolSize: 10,
                                        label: {
                                            normal: {show: false},
                                            emphasis: {show: false}
                                        }
                                    },
                                    {
                                        type: 'max',
                                        valueDim: 'highest',
                                        symbol: 'circle',
                                        symbolSize: 10,
                                        label: {
                                            normal: {show: false},
                                            emphasis: {show: false}
                                        }
                                    }
                                ],
                                {
                                    name: 'min line on close',
                                    type: 'min',
                                    valueDim: 'close'
                                },
                                {
                                    name: 'max line on close',
                                    type: 'max',
                                    valueDim: 'close'
                                }
                            ]
                        }
                    },
                    {
                        name: 'MA5',
                        type: 'line',
                        data: calculateMA(5),
                        smooth: true,
                    },
                    {
                        name: 'MA10',
                        type: 'line',
                        data: calculateMA(10),
                        smooth: true,
                    },
                    {
                        name: 'MA20',
                        type: 'line',
                        data: calculateMA(20),
                        smooth: true,
                    },

                ]
            };
            this.chart.setOption(option);

        },

        getKline(type){
            this.chart.clear();
            this.$base.cyGet({
                url:this.$store.state.apiUrl+"master/stocks/full",
                data:{
                    code:this.stockCode.toLowerCase(),
                    type:this.type,
                    day_offset:-70,
                    day_count:70
                },
                success:(data)=>{
                    this.setChart(data,this.stockName+'（'+this.stockCode.replace(/SH|SZ/,'')+'）')
                }
            })
        },
    },
    mounted(){
        this.iniChart();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .title {
        text-align: center;
        h2 {
            color:#999;
            margin-top:4px;
            font-weight: normal;
        }
    }
</style>