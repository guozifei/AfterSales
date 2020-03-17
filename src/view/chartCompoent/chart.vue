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
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'doc',
  data () {
    return {
      iheight: 0,
      url: ''
    }
  },
  methods: {
    ...mapGetters(['getUserID', 'getUrl']),
    ...mapActions(['getNowUrl']),
    change () {
      this.iheight = document.body.clientHeight - 220
    },
    getuser () {
      let i
      this.getNowUrl().then((res) => {
        i = res
        this.url = i + '&fr_username=' + this.getUserID()
      })
    }
  },
  watch: {
    '$route' () { // 监听路由是否变化
      this.getuser()
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
