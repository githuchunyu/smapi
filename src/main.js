import Vue from 'vue'
import App from './App'
import router from './router.js'
import store from './store'
import base from './base'

Vue.prototype.$base = base;

import iView from 'iview'
Vue.use(iView);

Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre,code');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block)
  })
})


router.beforeEach((to, from, next) => {
	iView.LoadingBar.start();

	// 如果需要授权，那么则判断是否登录了，且是否有token了，如果有则继续跳转，没有则回到登录页面
	if (to.meta.requireAuth) {
    next();
	}
	// 如果不需要授权，且处于登录页面，那么跳转到数据首页，其他情况直接跳转
	else {
		next();
	}

})

router.afterEach(route => {
    iView.LoadingBar.finish();
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
