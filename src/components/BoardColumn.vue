<template>
  <div class="column"
    draggable
    @drop="moveTaskOrColumn($event, column.tasks, columnIndex)"
    @dragover.prevent
    @dragenter.prevent
    @dragstart.self="pickupColumn($event, columnIndex)">

    <div class="flex items-center mb-2 font-bold">
      {{ column.name }}
    </div>

    <div class="list-reset">
      <ColumnTask
        v-for="(task, taskIndex) in column.tasks"
        :key="task.id"
        :task="task"
        :board="board"
        :taskIndex="taskIndex"
        :columnIndex="columnIndex"
        :column="column" />
      <input type="text"
        class="block p-2 w-full bg-transparent"
        placeholder="+ Enter new task"
        @keyup.enter="createTask($event, column.tasks)">
    </div>
  </div>
</template>

<script>
import ColumnTask from '@/components/ColumnTask'

export default {
  name: 'BoardColumn',
  components: {
    ColumnTask
  },
  props: {
    column: {
      type: Object,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    },
    board: {
      type: Object,
      required: true
    }
  },
  methods: {
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
    },
    pickupColumn(e, fromColumnIndex) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.setData('from-column-index', fromColumnIndex)
      e.dataTransfer.setData('type', 'column')
    },
    createTask(e, tasks) {
      this.$store.commit('CREATE_TASK', {
        tasks,
        name: e.target.value
      })
      e.target.value = ''
    }
  }
}
</script>

<style lang="css">
.column {
  @apply bg-grey-light p-2 mr-4 text-left shadow rounded;
  min-width: 350px;
}
</style>
