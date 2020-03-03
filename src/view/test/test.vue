<template>
  <div>
    <Card>
      <h2>测试数据</h2>
      <iframe width="100%"
      :height="iheight"
      id='ifd'
      src="http://10.2.11.3:7080/webroot/decision/view/report?viewlet=数据分析/售后重构分析/预约及时率报表.cpt"
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
    // console.log(document.body.clientHeight)
    console.log(BASE_URL)
    this.iheight = document.body.clientHeight - 220
    window.addEventListener('resize', () => {
      this.change()
    })
  }
}
</script>

<style>

</style>
