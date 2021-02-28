import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.use(VueRouter)

window.router = new VueRouter({
  routes
})

library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

export default new VueRouter({
  routes
})
