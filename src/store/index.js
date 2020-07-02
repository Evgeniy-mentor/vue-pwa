import Vue from 'vue'
import Vuex from 'vuex'
import authentication from './authentication'
import app from './app'
import clients from './clients'
import projects from './projects'
import users from './users'
import timesheets from './timesheets'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    authentication,
    app,
    clients,
    projects,
    users,
    timesheets
  }
})
