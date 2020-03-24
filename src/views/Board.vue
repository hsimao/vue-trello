<template>
  <div class="board">
    <div class="flex flex-row items-start">
      <div class="column"
        v-for="(column, columnIndex) in board.columns"
        :key="columnIndex"
        draggable
        @drop="moveTaskOrColumn($event, column.tasks, columnIndex)"
        @dragover.prevent
        @dragenter.prevent
        @dragstart.self="pickupColumn($event, columnIndex)">

        <div class="flex items-center mb-2 font-bold">
          {{ column.name }}
        </div>

        <div class="list-reset">
          <div class="task"
            v-for="(task, taskIndex) in column.tasks"
            :key="task.id"
            draggable
            @dragover.prevent
            @dragenter.prevent
            @dragstart="pickupTask($event, taskIndex, columnIndex)"
            @drop.stop="moveTaskOrColumn($event, column.tasks, columnIndex, taskIndex)"
            @click="goToTask(task.id)">
            <span class="w-full flex-no-shrink font-bold">
              {{ task.name }}
            </span>
            <p v-if="task.description"
              class="w-full flex-no-shrink mt-1 text-sm">
              {{ task.description }}
            </p>
          </div>

          <input type="text"
            class="block p-2 w-full bg-transparent"
            placeholder="+ Enter new task"
            @keyup.enter="createTask($event, column.tasks)">
        </div>
      </div>

      <div class="column flex">
        <input type="text"
          class="p-2 mr-2 flex-grow"
          placeholder="New Column Name"
          v-model="newColumnName"
          @keyup.enter="createColumn">
      </div>
    </div>

    <div v-if="isTaskOpen"
      class="task-bg"
      @click.self="close">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BoardPage',
  data() {
    return {
      newColumnName: ''
    }
  },
  computed: {
    ...mapState(['board']),
    isTaskOpen() {
      return this.$route.name === 'task'
    }
  },
  methods: {
    goToTask(id) {
      this.$router.push({ name: 'task', params: { id } })
    },
    close() {
      this.$router.push({ name: 'board' })
    },
    createColumn() {
      this.$store.commit('CREATE_COLUMN', {
        name: this.newColumnName
      })
      this.newColumnName = ''
    },
    createTask(e, tasks) {
      this.$store.commit('CREATE_TASK', {
        tasks,
        name: e.target.value
      })
      e.target.value = ''
    },
    pickupTask(e, taskIndex, fromColumnIndex) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.setData('from-task-index', taskIndex)
      e.dataTransfer.setData('from-column-index', fromColumnIndex)
      e.dataTransfer.setData('type', 'task')
    },
    pickupColumn(e, fromColumnIndex) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.setData('from-column-index', fromColumnIndex)
      e.dataTransfer.setData('type', 'column')
    },
    moveTaskOrColumn(e, toTasks, toColumnIndex, toTaskIndex) {
      const type = e.dataTransfer.getData('type')
      if (type === 'task') {
        // 判斷如果 toTaskIndex 沒有接收到參數，表示是拖曳 task 到 column layout 上, 沒有放到 task 內, 將預設擺放到最後面
        const currentToTaskIndex =
          toTaskIndex !== undefined ? toTaskIndex : toTasks.length

        this.moveTask(e, toTasks, currentToTaskIndex)
      } else {
        this.moveColumn(e, toColumnIndex)
      }
    },
    moveTask(e, toTasks, toTaskIndex) {
      const fromColumnIndex = e.dataTransfer.getData('from-column-index')
      const fromTaskIndex = e.dataTransfer.getData('from-task-index')
      const fromTasks = this.board.columns[fromColumnIndex].tasks

      this.$store.commit('MOVE_TASK', {
        fromTasks,
        fromTaskIndex,
        toTasks,
        toTaskIndex
      })
    },
    moveColumn(e, toColumnIndex) {
      const fromColumnIndex = e.dataTransfer.getData('from-column-index')

      this.$store.commit('MOVE_COLUMN', {
        fromColumnIndex,
        toColumnIndex
      })
    }
  }
}
</script>

<style lang="css">
.task {
  @apply flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white text-grey-darkest no-underline;
}

.column {
  @apply bg-grey-light p-2 mr-4 text-left shadow rounded;
  min-width: 350px;
}

.board {
  @apply p-4 bg-teal-dark h-full overflow-auto;
}

.task-bg {
  @apply pin absolute;
  background: rgba(0, 0, 0, 0.5);
}
</style>
