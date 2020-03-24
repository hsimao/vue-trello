<template>
  <div class="task"
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

</template>

<script>
export default {
  name: 'ColumnTask',
  props: {
    board: {
      type: Object,
      required: true
    },
    column: {
      type: Object,
      required: true
    },
    task: {
      type: Object,
      required: true
    },
    taskIndex: {
      type: Number,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    pickupTask(e, taskIndex, fromColumnIndex) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.setData('from-task-index', taskIndex)
      e.dataTransfer.setData('from-column-index', fromColumnIndex)
      e.dataTransfer.setData('type', 'task')
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
    goToTask(id) {
      this.$router.push({ name: 'task', params: { id } })
    },
    moveColumn(e, toColumnIndex) {
      const fromColumnIndex = e.dataTransfer.getData('from-column-index')

      this.$store.commit('MOVE_COLUMN', {
        fromColumnIndex,
        toColumnIndex
      })
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
    }
  }
}
</script>

<style lang="css">
.task {
  @apply flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white text-grey-darkest no-underline;
}
</style>
