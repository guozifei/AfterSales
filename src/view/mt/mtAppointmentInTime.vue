<template>
  <div>
    <Card>
      <iframe width="100%"
      :height="iheight"
      id='ifd'
      :src="url"
      frameborder="0"></iframe>
    </Card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'doc',
  data () {
    return {
      iheight: 0,
      url: 'http://di.gree.com:8083/webroot/decision/view/report?viewlet=数据分析/售后重构分析/预约及时率.cpt&__bypagesize__=false&fr_username='
    }
  },
  methods: {
    ...mapGetters(['getUserID']),
    change () {
      this.iheight = document.body.clientHeight - 220
    },
    getuser () {
      this.url = this.url + this.getUserID()
    }
  },
  mounted () {
    this.iheight = document.body.clientHeight - 220
    this.getuser()
    window.addEventListener('resize', () => {
      this.change()
    })
  }
}
</script>

<style>

</style>
