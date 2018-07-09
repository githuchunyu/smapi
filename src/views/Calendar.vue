<template>
  <div class="cy-calendar">
    <div class="cy-calendar-nav">
      <Button icon="chevron-left"></Button>
      <span>{{thisYear}}</span>
      <Button icon="chevron-right"></Button>
      <Button icon="chevron-left"></Button>
      <span>{{thisMonth}}</span>
      <Button icon="chevron-right"></Button>
    </div>

    <div class="cy-calendar-table">
      <table>
        <thead>
          <th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th>
        </thead>
        <tbody>
          <tr v-for="(w,i) in weeks" :key="'w'+i">
            <td v-for="(d,ii) in w" :key="'d'+ii" :class="d.tm+' '+d.td">
              <span>{{d.d}}</span>
              <!-- <div>{{d.info}}</div> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import base from "../base"
export default {
  name: 'chunyu-calender',
  data () {
    return {
      thisDate:'2018-01-01',
      thisYear:'2018',
      thisMonth:'01',
      thisDay:'01',
      weeks:[],
    }
  },
  mounted(){
    this.setWeeks();
  },
  computed:{
    
  },
  methods: {
    setWeeks(){
      // 判断第一天是周几
      let fd = new Date(this.thisYear,this.thisMonth-1,1).getDay()-1;
      fd=(fd==-1?6:fd);

      // 日历第一天的时间戳
      let ft = new Date(this.thisYear,this.thisMonth-1,1).getTime()-3600*24*1000*fd;

      let weeks=[];
      for (let i=0;i<6;i++) {
        let week = [];
        for (let j=0;j<7;j++) {
          let tt = ft+3600*1000*24*(7*i+j);
          let td = base.formatDate(tt/1000,'yyyy-MM-dd');
          console.log(td)
          week.push({
            date:td,
            y:this.getYear(td),
            m:this.getMonth(td),
            d:this.getDay(td),
            tm:this.getYear(td)==this.thisYear && this.getMonth(td)==this.thisMonth?'tomonth':'',
            td:td==this.thisDate?'today':''
          })
        }
        weeks.push(week);
      }
      this.weeks = weeks;

    },
    getYear(date){
      return date.substr(0,4);
    },
    getMonth(date){
      return date.substr(5,2);
    },
    getDay(date){
      return date.substr(8,2);
    }
  }


}
</script>

<style lang="less" scoped>
  .cy-calendar-table {
    table {
      border-collapse: collapse;
    }
    th {
      height:36px;
    }
    td {
      width:48px;padding:4px;height:48px;text-align: center;
      border:1px solid #EEE;
      color:#CCC;
      &.tomonth {
        color:#000;
        &:hover {
          background: #2d8cf0;color:#FFF;
        }
      }
      &.today {
        border-color:#2d8cf0;color:#2d8cf0;
      }
    }
  }
</style>

