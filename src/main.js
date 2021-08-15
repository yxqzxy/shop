import Vue from 'vue'
import router from './router'
import './plugins/element.js'
import App from './App.vue'
import './assets/fonts/iconfont.css'
//导入全局样式
import './assets/css/global.css'

import treeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', treeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
