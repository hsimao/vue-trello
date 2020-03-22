import Vue from 'vue'
import Vuex from 'vuex'
import { saveStatePlugin } from './utils'
import defaultBoard from './default-board'

Vue.use(Vuex)

const board = JSON.parse(localStorage.getItem('boards')) || defaultBoard

export default new Vuex.Store({
  plugins: [saveStatePlugin],
  state: {
    board
  },
  mutations: {},
  getters: {
    getTask(state) {
      return id => {
        for (const column of state.board.columns) {
          for (const task of column.tasks) {
            if (task.id === id) return task
          }
        }
      }
    }
  }
})
