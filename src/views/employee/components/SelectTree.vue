<template>
  <el-cascader
    :value="value"
    :props="props"
    size="mini"
    :options="options"
    separator="-"
    @change="detailChange"
  />

</template>

<script>
import { getDepartmentService } from '@/api/department'
import { transListToTreeData } from '@/utils/index'
export default {

  props: {
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      options: [],
      props: {
        label: 'name',
        value: 'id'
      }
    }
  },

  created() {
    this.getDepartment()
  },

  methods: {
    async getDepartment() {
      const res = transListToTreeData(await getDepartmentService(), 0)
      // console.log(res)
      this.options = res
    },
    detailChange(id) {
      // console.log(id)
      if (id.length > 0) {
        this.$emit('input', id[id.length - 1])
      } else {
        this.$emit('input', null)
      }
    }
  }

}
</script>

<style>

</style>
