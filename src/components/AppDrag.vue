<template>
  <div
    draggable
    @dragover.prevent
    @dragenter.prevent
    @dragstart.self="onDrag">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'AppDrag',
  props: {
    transferData: {
      type: Object,
      required: true
    }
  },
  methods: {
    onDrag(e) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.setData('payload', JSON.stringify(this.transferData))
    }
  }
}
</script>
