<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <!--  -->
          <div
            style="height: 150px; background-size: cover; background-position: center"
            :style="{background: `url(${item.imageUrl})`}"
          >
            <!-- 放圖片 -->
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">分類</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{item.title}}</a>
            </h5>
            <p class="card-text">內容</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">{{item.origin_price}} 元</div>
              <del class="h6" v-if="item.price">原價 {{item.origin_price}} 元</del>
              <div class="h5" v-if="item.price">現在只要 {{item.price}} 元</div>
            </div>

          </div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click.prevent="showCard(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click.prevent="addtoCard(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id" ></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal start-->
    <div class="modal" id="productModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- 跳出視窗  -->
              
                <div class="card border-0 shadow-sm">
                  <div style="height: 150px; background-size: cover; background-position: center"
                    >
                  </div>
                  <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">分類</span>
                    <h5 class="card-title">
                      <a href="#" class="text-dark">標題</a>
                    </h5>
                    <p class="card-text">內容</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                      <div class="h5" v-if="!product.price">{{product.origin_price}} 元</div>
                      <del class="h6" v-if="product.price">原價 {{product.origin_price}} 元</del>
                      <div class="h5" v-if="product.price">現在只要 {{product.price}} 元</div>
                    </div>
                    <select name="" id="" v-model="product.num">
                      <option :value= "num" v-for="num in 10" :key="num" >
                       選購 {{num}}{{product.unit}}
                      </option>
                    </select>
                  </div>

                </div>
              
            <!--  -->
          </div>
          <div class="modal-footer">
            <!-- <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> -->
            <button type="button" class="btn btn-primary" @click.prevent="addtoCard(product.id , product.num)">加到購物車</button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal end -->

    <!-- cart start -->
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">商品名稱</th>
          <th scope="col">數量</th>
          <th scope="col">價錢</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
      </tbody>
    </table>
    <!-- cart end -->
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data() {
    return {
      // productActive:true,
      products: [],
      cartGoods:[],
      isLoading: false,
      product:{},
      status:{
        loadingItem:'',
      },
    }
  },
  created() {
    this.getProduct()
    this.getCart()
  },
  methods: {
    getProduct() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`
      console.log(api)
      this.isLoading = true
      this.$http.get(api).then(response => {
        console.log(response.data)
        this.isLoading = false
        this.products = response.data.products
        this.pagination = response.data.pagination
      })
    },
    getCart(){
      console.log('我得到購物車資料')
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
      this.$http.get(api).then(response => {
        this.cartGoods = response.data.data.carts
        console.log(response.data.data)
        console.log(this.cartGoods)
      })

    },
    showCard(e){
      console.log('到我惹')
      console.log(e)
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${e}`
      console.log(api)
      this.status.loadingItem = e
      this.$http.get(api).then(response => {
        $('#productModal').modal('show')
        console.log(response.data)
        this.status.loadingItem = ''
        this.product = response.data.product
        // console.log(this.product)
        this.pagination = response.data.pagination
      })
      
    },
    // qty 預設值為 1 
    addtoCard(id,qty=1){
      console.log('家道購物車')
      console.log(id)
      console.log(this.product.num)
      console.log(qty)
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
      const cart = { "product_id":id , "qty":qty }
      console.log(cart)
      this.$http.post(api,{data:cart}).then(response => {
        console.log(response.data)
        this.getCart()
        $('#productModal').modal('hide')
      })
    },

  },
}
</script>