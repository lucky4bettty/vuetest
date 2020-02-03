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
    <div  class="d-flex justify-content-center cartAll"  >
      <div class="d-flex flex-column" style="width:50% " id="cartAllThing">  
        <table class="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">品名</th>
              <th scope="col">數量</th>
              <th scope="col">單價</th>
            
            </tr>
          </thead>
          <tbody>
            <tr  v-for="item in cartGoods" :key="item.product.product_id">
              <!-- <th><i class="far fa-trash-alt"></i></!-->
              <th @click="cartDelete(item.id)"><i class="far fa-trash-alt"></i></th>
              <td>{{item.product.title}}<p v-if=" originPrice !== finalPrice">已套用優惠卷</p></td>
              <td>{{item.product.num}}</td>
              <td>{{item.product.price}}</td>
            </tr>
          </tbody>
        </table>
        <!-- 套入優惠卷  -->
        <div id="totalPrice">總計: {{originPrice}} </div>
        <div v-if=" originPrice !== finalPrice"> 折扣價: {{finalPrice}}</div>
        <div class="input-group mb-3 input-group-sm" >
          <input type="text" class="form-control" placeholder="請輸入優惠碼" >
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="addCouponCode()">
              套用優惠碼
            </button>
          </div>
        </div>

        <div>
        <form >
            <div class="form-group">
              <label for="useremail">Email</label>
              <input type="email" class="form-control" name="email" id="useremail"
                 placeholder="請輸入 Email"  v-model="form.user.email" required>
              <span class="text-danger"></span>
            </div>
          
            <div class="form-group">
              <label for="username">收件人姓名</label>
              <input type="text" class="form-control" name="name" id="username"
                 placeholder="輸入姓名"  v-model="form.user.name">
              <span class="text-danger"></span>
            </div>
          
            <div class="form-group">
              <label for="usertel">收件人電話</label>
              <input type="tel" class="form-control" id="usertel" v-model="form.user.tel"  placeholder="請輸入電話">
            </div>
          
            <div class="form-group">
              <label for="useraddress">收件人地址</label>
              <input type="text" class="form-control" name="address" id="useraddress" 
                placeholder="請輸入地址" v-model="form.user.address">
              <span class="text-danger">地址欄位不得留空</span>
            </div>
          
            <div class="form-group">
              <label for="comment">留言</label>
              <textarea name="" v-model="form.message" id="comment" class="form-control" cols="30" rows="10" ></textarea>
            </div>
            <div class="text-right">
              <button class="btn btn-danger" @click="addOrder()">送出訂單</button>
            </div>
          </form>
        </div>

      </div>  
    </div>
    <!-- END -->
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
      couponCode:'',
      originPrice:0,
      finalPrice:0,
      form:{
        user:{
          name:'',
          email:'',
          tel:'',
          address:'',
        }
      },
      status:{
        loadingItem:'',
      },
    }
  },
  created() {
    this.getProduct()
    this.getCart()
    // this.originPrice()
  },
  methods: {
    getProduct() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`
      console.log(api)
      this.isLoading = true
      this.$http.get(api).then(response => {
        // console.log(response.data)
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

        console.log(this.cartGoods)
        
        // if(this.cartGoods.length == 0){
        //   console.log('我無資料')
        //   // $('#cartAll').hide()
        //   // $('#totalPrice').hide()
        //   // $('#useCoupon').hide()
        //   // $('#cartAllThing').css('display','none')
        //   // $('.cartAll').css('display','none')
        // }
        
        
        // var originPrice = 0;
        // this.cartGoods.forEach(item =>{
        //   originPrice = originPrice + item.product.num * item.product.price
        // })
        this.originPrice = response.data.data.total
        this.finalPrice = response.data.data.final_total
        // console.log(this.originPrice)
      })
    },
    addOrder(){
      console.log('加訂單了喔')
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`
      var order = this.form
      this.$http.post(api,{data:order}).then(response => {
        console.log(response)
        // this.getCart()
      })

    },
    // originPrice(){
    //   console.log('總價計算')
    //   // console.log(this.cartGoods)
    // },
    cartDelete(id){
      console.log(id)
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`
       this.$http.delete(api).then(response => {
        console.log(response.data)
        this.getCart()
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
      console.log('加到購物車')
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
    addCouponCode(){
      console.log('加了優惠碼')
      console.log(this.couponCode)
      var coupon = {
      "code": this.couponCode
    }
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`
      this.$http.post(api,{data:coupon}).then(response => {
        this.finalPrice = Math.floor(response.data.data.final_total)
        console.log(response.data)

        // this.getCart()
        // $('#productModal').modal('hide')
      })

    },

  },
}
</script>