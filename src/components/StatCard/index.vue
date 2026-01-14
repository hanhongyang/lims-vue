<template>
  <div class="stat-card">
    <img :src="iconSrc">
    <span>{{ title }}</span>
    <div>
      <count-to class="count-to" :start-val="0" :end-val="value" :duration="1500" />
      <span class="unit">条</span>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  name: 'StatCard',
  components: { CountTo },
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      default: 0
    },
    icon: {
      type: String,
      required: true
    }
  },
  computed: {
    iconSrc() {
      return require('@/assets/images/' + this.icon)
    }
  }
}
</script>

<style scoped>
.stat-card {
  width: 180px;
  text-align: center;
  padding: 16px 0;
}

.stat-card img {
  width: 50px;
  height: 50px;
  margin-bottom: 6px;
}

.stat-card span {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
}

.stat-card div {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
}

.stat-card div .count-to {
  font-size: 18px;
  font-weight: 600;
}

.stat-card div .unit {
  font-size: 16px;
  margin-right: 4px;
}
</style>
