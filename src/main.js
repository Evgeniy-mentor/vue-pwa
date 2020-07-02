import Vue from 'vue'
import Notifications from 'vue-notification'
import Chart from 'chart.js'
import Chartkick from 'vue-chartkick'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/misc/register-service-worker'
import '@/misc/handle-network-status'
import '@/firebase/init'
import '@/firebase/authentication'
import '@/misc/handle-apple-install-prompt'
import 'pwacompat'
import vuetify from './plugins/vuetify'
import AppSectionLoader from "./components/AppSectionLoader/AppSectionLoader";
import PageTitleBar from "./components/PageTitleBar/PageTitleBar";
import AppCard from './components/AppCard/AppCard';


Vue.config.productionTip = false

Vue.component('appCard', AppCard);
Vue.component('appSectionLoader', AppSectionLoader);
Vue.component('pageTitleBar', PageTitleBar);
Vue.use(Notifications)


Vue.use(Chartkick.use(Chart))

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

