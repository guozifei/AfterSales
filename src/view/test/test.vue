<template>
  <div>
    <Card>
      <h2>regergr</h2>
    </Card>
  </div>
</template>

<script>
import * as datarequest from '@/api/data'
export default {
  name: 'test9',
  data () {
    return {

    }
  },
  methods: {
  },
  mounted () {
    datarequest.getDragList(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    // datarequest.getTableData().then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   console.log(err)
    // })
  }
}
</script>

<style>

</style>
