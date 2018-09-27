import Vue from 'vue';
import axios from 'axios';
import VueRouter from 'vue-router';
import routes from './routes';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.use(VueRouter);

window.router = new VueRouter({
    routes,
});

window.axios = require("axios");
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = 'https://api.vrchat.cloud/api/1';
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json';

library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon);

export default new VueRouter({
    routes,
});
