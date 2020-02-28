<template>
  <div>
    <Card>
      <h2>iview-admin文档</h2>
      <iframe width="100%"
      :height="iheight"
      id='ifd'
      src="https://lison16.github.io/iview-admin-doc/#/"
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
    this.iheight = document.body.clientHeight - 220
    window.addEventListener('resize', () => {
      this.change()
    })
  }
}
</script>

<style>

</style>
