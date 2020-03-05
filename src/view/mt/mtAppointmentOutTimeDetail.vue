<template>
  <div>
    <Card>
      <iframe width="100%"
      :height="iheight"
      id='ifd'
      src="http://di.gree.com:8083/webroot/decision/view/report?viewlet=数据分析/售后重构分析/预约不及时明细.cpt"
      frameborder="0"></iframe>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'doc',
  data () {
    return {
      iheight: 0
    }
  },
  methods: {
    change () {
      this.iheight = document.body.clientHeight - 220
    }
  },
  mounted () {
    this.iheight = document.body.clientHeight - 220
    window.addEventListener('resize', () => {
      this.change()
    })
  }
}
</script>

<style>

</style>
