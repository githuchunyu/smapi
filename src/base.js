import Vue from 'vue'

// 获取文件的临时地址
function getObjectURL(file){
    if(file==undefined){return ""}
    var url = null;
    if (window.createObjectURL!=undefined){ // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined){ // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined){ // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}

// 获取cookie
function getCookie(c_name){
  if (document.cookie.length>0)
    {
    let c_start=document.cookie.indexOf(c_name + "=");
    let c_end='';
    if (c_start!=-1)
      {
      c_start=c_start + c_name.length+1
      c_end=document.cookie.indexOf(";",c_start)
      if (c_end==-1) c_end=document.cookie.length
      return unescape(document.cookie.substring(c_start,c_end))
      }
    }
  return "";
}
// 设置cookie
function setCookie(c_name,value,expiredays){
  var exdate=new Date()
  exdate.setDate(exdate.getDate()+expiredays)
  document.cookie=c_name+ "=" +escape(value)+
  ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())+";path=/";
}

// 数字转为千分位形式
function toQFW(str){
    str = str+'';
    var re=/(?=(?!(\b))(\d{3})+$)/g;
    str = str.replace(re,",");
    return str;
}

// 组装get
function cyGet(settings){
  settings.data = settings.data || {};
  let usertoken = getCookie('usertoken');
  settings.data.usertoken = usertoken;
  let c = [];
  for (let i in settings.data) {
    c.push(i+'='+settings.data[i]);
  }
  return $.get(settings.url+"?"+c.join('&'),(data)=>{
    let d = JSON.parse(data);
    if (d.code!=0) {
      if (typeof settings.warn === 'function') {
        settings.warn();
      }
    }
    switch (d.code) {
      case 0:
        settings.success(d.data);
        break;
      case 99:
        new Vue().$Message.error(settings.title+':'+d.message);
        break;
      case 2:
        // 修改state的登录状态
        Vue.$store.commit('logout');
        break;
      case 3:
        new Vue().$Message.warning(settings.title+':'+d.message);
        break;
      case 5:
        // 前往操作维护界面
        break;
    }
  })
}
// 提交数据表格
function cyPost(settings){
    if (typeof settings.beforePost === 'function') {settings.beforePost();}
    let usertoken = getCookie('usertoken');
    settings.data.usertoken = usertoken;
    return $.ajax({
      url: settings.url,
      type: 'POST',
      data: settings.data,

    }).then(function(response){
      response = JSON.parse(response);
        if (response.code == 0) {
          if (typeof settings.success === 'function') {
            settings.success(response.data);
          }
        } else {
          new Vue().$Message.warning({content:response.message});
          if (typeof settings.warn === 'function') {
            settings.warn();
          }
        }
    }).catch(function(err) {
    	console.log(err)
        new Vue().$Message.error({content:'系统错误'});
        if (typeof settings.error === 'function') {
          settings.error();
        }
    })
}

function assign(obj){
  let c = new Object();
  for (let x in obj) {
    c[x] = obj[x];
  }
  return c;
}
function assign2(obj1,obj2){
  for (let x in obj2) {
    obj1[x] = obj2[x];
  }
  return obj1;
}
function copyArray(arr) {
  let a = new Array();
  for (let i=0,len=arr.length;i<len;i++) {
    a.push(arr[i]);
  }
  return a;
}

// 计算时间和当前时间的差距
function timeDiff(t){
  let d = new Date(t);
  let n = new Date();
  let diff = d.getTime()-n.getTime();
  let diffAppend = '';
  if (diff>=0) {diffAppend='后'}
  else {diffAppend='前';diff=-1*diff}
  let days=Math.floor(diff/(24*3600*1000))
  let leave1=diff%(24*3600*1000)    //计算天数后剩余的毫秒数
  let hours=Math.floor(leave1/(3600*1000))
  let leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
  let minutes=Math.floor(leave2/(60*1000))
  let leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
  return (days==0?'':days+'天')+(hours==0?'':hours+'小时')+(minutes==0?'':minutes+'分钟')+diffAppend;
}

function formatTime(diff){
  let diffAppend = ''
  let days=Math.floor(diff/(24*3600))
  let leave1=diff%(24*3600)    //计算天数后剩余的毫秒数
  let hours=Math.floor(leave1/(3600))
  let leave2=leave1%(3600)        //计算小时数后剩余的毫秒数
  let minutes=Math.floor(leave2/(60))
  let leave3=leave2%(60)      //计算分钟数后剩余的毫秒数
  return (days==0?'':days+'天')+(hours==0?'':hours+'小时')+(minutes==0?'':minutes+'分钟');
}

function removeByValue(arr, val,key) {
  for(var i=0; i<arr.length; i++) {
    if (typeof arr[i] === 'object') {
      if(arr[i][key] == val) {
        arr.splice(i, 1);
        break;
      }
    } else {
      if(arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  }
}
function pushNoSame(arr, val,key) {
  for(var i=0; i<arr.length; i++) {
    if (typeof val === 'object') {
      if(arr[i][key] == val[key]) {
        return;
      }
    } else {
      if(arr[i] == val) {
        return;
      }
    }
  }
  arr.push(val)
}
function toTime(time){
  time = parseInt(time)
  var s = '0'+time%60;
  s = s.substr(s.length-2,2);
  var m = '0'+parseInt(time/60);
  m = m.substr(m.length-2,2);
  var t = m+':'+s;
  return t;
}
function toPer(time){
  let b = '';

  let now = new Date();
  let t = new Date();

  t.setTime(time*1000);
  let diff = parseInt((now-t)/1000);
  if (diff<10) {b='刚刚'}
  else if (diff<60) {b=diff+'秒前'}
  else if (diff<60*60) {b=parseInt(diff/60)+'分钟前'}
  else if (diff<60*60*24) {b=parseInt(diff/60/60)+'小时前'}
  else if (diff<60*60*24*30) {b=parseInt(diff/60/60/24)+'天前'}
  else if (diff<60*60*24*365) {b=parseInt(diff/60/60/24/30)+'个月前'}
  else {b=t.getFullYear()+'年'+(t.getMonth()+1)+'月'+t.getDate()+'日'}
  return b;
}

function formatDate(m,fmt) { //author: meizz
    let date = new Date(m*1000);
    let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//native 转换 utf8
function Native2UTF8(code) {
  return code.replace(/[^\u0000-\u00FF]/g, function ($0) { return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;") });
}

//UTF-8 转换 Native
function UTF82Native(code) {
  return unescape(code.replace(/&#x/g, '%u').replace(/;/g, ''));
}


const base = {
  getObjectURL: getObjectURL,
  getCookie: getCookie,
  setCookie: setCookie,
  toQFW:toQFW,
  assign:assign,
  assign2:assign2,
  copyArray:copyArray,
  timeDiff:timeDiff,
  removeByValue:removeByValue,
  pushNoSame:pushNoSame,
  cyGet:cyGet,
  cyPost:cyPost,
  toTime:toTime,
  toPer:toPer,
  getObjectURL:getObjectURL,
  formatDate:formatDate,
  formatTime:formatTime,
  Native2UTF8:Native2UTF8,
  UTF82Native:UTF82Native,
}
export default base;
