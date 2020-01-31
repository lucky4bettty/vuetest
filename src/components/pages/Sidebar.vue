<template>
    <div>
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
      <div class="sidebar-sticky">
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>管理功能</span>
          <a class="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul class="nav flex-column">
          <li class="nav-item" @click="linkStyle()">
            <router-link to='/admin/product' class="nav-link" :class="{'active':  urlnow !== pagenow[1] && urlnow !== pagenow[2] && urlnow !== pagenow[3]}"  href="#">
              <span data-feather="home"></span>
              產品列表 
              <!-- <span class="sr-only">(current)</span> -->
            </router-link>
          </li>
          <li class="nav-item" @click="linkStyle()">
            <router-link to='/admin/orderform' class="nav-link" :class="{'active':  urlnow == pagenow[1]}" href="#">
              <span data-feather="file"></span>
              訂單列表
            </router-link>
          </li>
          <li class="nav-item"  @click="linkStyle()">
            <router-link to='/admin/coupon' class="nav-link" :class="{'active':  urlnow == pagenow[2]}" href="#">
              <span data-feather="shopping-cart"></span>
              優惠卷
            </router-link>
          </li>
        </ul>

        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>模擬功能</span>
          <a class="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item" @click="linkStyle()">
            <router-link  to='/customer' class="nav-link" :class="{'active':  urlnow == pagenow[3]}" href="#">
              <span data-feather="file-text"></span>
              模擬訂單
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    </div>
</template>

<script>
export default {
  
data(){
        return{
            // productActive:true,
            pagenow:['product' ,'orderform' ,'coupon' ,'customer'],
            urlnow:"",
        }
    },
      methods:{
        linkStyle(e){
          let url = this.$route.path
          url = url.split('/')[2]
          this.urlnow = url;
        },
      },
}
</script>