import Vue from 'vue'
import App from './App.vue'
import FundamentalVue from 'fundamental-vue';
import LuigiClient from '@kyma-project/luigi-client';


Vue.use(FundamentalVue);
Vue.config.productionTip = false

Vue.mixin({
 created() {
   this.luigiClient = LuigiClient;
 }
});

new Vue({
  render: h => h(App),
}).$mount('#app')

