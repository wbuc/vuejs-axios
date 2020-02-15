import Vue from 'vue'
import App from './App.vue'
import globalAxios from 'axios'

import router from './router'
import store from './store/store'
import VuePageTransition from "vue-page-transition";


// need to register this on the global level - does not work on component registration.
Vue.use(VuePageTransition);

/* #region[dark]

******AXIOS CONFIG******

  - No need to setup Axios here like other components using Vie.use(..).
  - Import Axios directly from each components where needed.

    - axios.defaults global config for Axios. 
    - defaults.headers.common -> all requests.
    - defaults.headers.get -> only get requests.

  - axios.interceptors.response/request to highjack any call to/from the server and do any cutom things.
        > Need to return the func in parameter else the req/res will not execute.
  NOTE: Can setup these custom config per request, not only global.
*/

globalAxios.defaults.baseURL = 'https://vuejs-axios-b84f7.firebaseio.com';
globalAxios.defaults.headers.common['Authorization'] = 'blabla';
globalAxios.defaults.headers.get['Accepts'] = 'application/json';

const reqInterceptor = globalAxios.interceptors.request.use(config => {
  console.log('Request intercepted: ', config);
  return config;// prevent block.
});
const resInterceptor = globalAxios.interceptors.response.use(res => {
  res.headers['is-intercepted'] = true;
  console.log('Response intercepted: ', res);
  return res;//prevent block.
})

// use to cancel custom custom interceptor overwrite. NOT COMMONLY USED
//Axios.interceptors.request.eject(reqInterceptor);
//Axios.interceptors.response.eject(resInterceptor);

//#endregion


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
