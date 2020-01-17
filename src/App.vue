<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    const api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`;
    console.log(api)
    // const api = 'https://vue-course-api.hexschool.io/api/lucky4betty/products'
    this.$http.get(api).then((response) => {
  console.log(response.data)
})
  }
}
</script>

<style lang="scss">
@import "./assets/all.scss";
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
</style>
