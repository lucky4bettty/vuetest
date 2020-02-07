<template>
    <div>
      <loading :active.sync="isLoading" ></loading>
        <!-- <div class="text-right">
            <button class="btn btn-primary" @click="openModal(true)">建立新優惠卷</button>
        </div> -->
        <table class="table mt-4">
            <thead>
                <!-- <th width="120" >分類</th> -->
                <th>購買時間</th>
                <th>email</th>
                <th>購買款項</th>
                <th>應付金額</th>
                <th>是否付款</th>
                <th>取消訂單</th>
            </thead>
            <tbody>
                <tr v-for="(item , key) in products" :key="item.id">
                    <!-- <td>{{item.category}} </td> -->
                    <td>{{item.create_at}}</td>
                    <td>{{item.user.email}}</td>
                    <!-- 要使html標籤有效 一定要使用 v-html -->
                    <td v-html="$options.filters.productItem(item.products)"></td>
                    <td>{{item.total}}</td>
                    <td v-bind:class="{ 'text-success': item.is_paid }" >{{item.is_paid | isPay}}</td>
                    <td>
                        <!-- <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button> -->
                        <button class="btn btn-outline-primary btn-sm" @click="deleteProduct(item)">刪除</button>
                    </td>
                </tr>
            </tbody>

        </table>
<!-- 分頁 -->
        <nav aria-label="Page navigation example">
            <ul class="pagination">
              <li class="page-item" :class="{'disabled' : !pagination.has_pre}">
                <a class="page-link" href="#" aria-label="Previous" 
                @click.prevent="getProducts(pagination.current_page -1)">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li class="page-item" v-for=" page in pagination.total_pages " :key="page" 
              :class="{'active':pagination.current_page == page }">
                <a class="page-link" href="#" @click.prevent="getProducts(page)">{{page}}</a>
              </li>
              <li class="page-item" :class="{'disabled' : !pagination.has_next}">
                <a class="page-link" href="#" aria-label="Next"
                @click.prevent="getProducts(pagination.current_page +1)">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
        </nav>
        <!-- 編輯 + 新增 視窗 -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <span>新增優惠卷</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                    <div class="col-sm-12">
                        <div class="form-group">
                        <label for="title">標題</label>
                        <input type="text" class="form-control" id="title"
                            placeholder="請輸入標題" v-model="tempProduct.title">
                        </div>
                        <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="category">有幾張</label>
                            <input type="text" class="form-control" id="category"
                            placeholder="請輸入張數" v-model="tempProduct.is_enabled">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="price">打折折數</label>
                            <input type="unit" class="form-control" id="unit"
                            placeholder="請輸入打折數" v-model="tempProduct.percent">
                        </div>
                        </div>

                        <div class="form-row">
                        <div class="form-group col-md-6">
                        <label for="origin_price">截止日期</label>
                            <input type="number" class="form-control" id="origin_price"
                            placeholder="請輸入截止日期" v-model="tempProduct.due_date">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="price">折扣代碼</label>
                            <input type="text" class="form-control" id="price"
                            placeholder="請輸入折扣代碼" v-model="tempProduct.code">
                        </div>
                        </div>
                        <hr>

                    </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="updateProdect">確認</button>
                </div>
                </div>
            </div>
        </div>
        <!-- 刪除視窗 -->
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span>刪除產品</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" >取消</button>
                <button type="button" class="btn btn-danger" @click="deleteApi()" >確認刪除</button>
            </div>
            </div>
        </div>
        </div>
        <!--  -->
    </div>
</template>

<script>
// 載入jquery
import $ from 'jquery'
export default {
    data(){
        return{
            // productActive:true,
            products:[],
            pagination:{},
            tempProduct:{},
            deleteId:'',
            isNew: false ,
            isLoading:false,
            status:{
              fileUploading:false,
            },
        }
    },
    created(){
        this.getProducts() ;
        // console.log('路由')  
    },
    methods:{
        // 列表
        getProducts(page = 1){
            const api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
                console.log(api)
                this.isLoading = true
                // const api = 'https://vue-course-api.hexschool.io/api/lucky4betty/products'
                this.$http.get(api).then((response) => {
                this.isLoading = false  
                this.products = response.data.orders
                this.pagination = response.data.pagination
                
                var productsKey = Object.keys(response.data.orders[0].products)
                // console.log(response.data.orders[0].products[productsKey].id)

            })
        },
        // 刪除
        deleteProduct(item){
            $('#delProductModal').modal('show')
            console.log('刪除')
            console.log(item.id)
            this.deleteId = item.id
            // const api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${item.id}`;
            //     console.log(api)
            //     // const api = 'https://vue-course-api.hexschool.io/api/lucky4betty/products'
            //     this.$http.delete(api).then((response) => {
            //     this.getProducts()
            //     console.log(response)
            // })
        },
        // 刪除API功能
        deleteApi(){
            const api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${this.deleteId}`;
                console.log(api)
                // const api = 'https://vue-course-api.hexschool.io/api/lucky4betty/products'
                this.$http.delete(api).then((response) => {
                this.getProducts()
                console.log(response)
                $('#delProductModal').modal('hide')
            })
        },
        openModal(isNew , item){
        //新增 isNew = true
        //編輯 isNew = false  
            if(isNew){
                // this.tempProduct={}
                console.log('新增')
                // console.log(this.tempProduct)
                this.isNew = true
            }else{
                console.log('編輯')
                this.tempProduct= Object.assign({},item)
                console.log(item)
                this.isNew = false
            }

            $('#productModal').modal('show');

        },
        // 新增 + 編輯
        updateProdect(){
            // 新增商品之 API
            let api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
            let httpMethod ='post'
            // 若為編輯
            if(!this.isNew){
            // 下面的 id 是 openModal 裡存的 tempProduct 的 id
            // 修改商品之 API
            api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${this.tempProduct.id}`;
            // console.log(this.tempProduct)
            httpMethod ='put'
            }
            console.log(api)
            // const api = 'https://vue-course-api.hexschool.io/api/lucky4betty/products'
            this.$http[httpMethod](api,{data:this.tempProduct}).then((response) => {
            console.log(this.tempProduct)
            console.log(response.data)
            if(response.data.success){
                $('#productModal').modal('hide');
                this.getProducts()
            }else{
                $('#productModal').modal('hide');
                this.getProducts()
                console.log('新增失敗')
            }
            })
        },
        // 上傳圖片(共用)
        uploadfile(){
            console.log(this)
            const uploadFile = this.$refs.files.files[0];
            const formData = new FormData();
            formData.append('file-to-upload' ,uploadFile )
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`
            this.status.fileUploading = true ;
            this.$http.post(url,formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            }).then((response)=>{
                console.log(response.data);
                this.status.fileUploading = false
                if(response.data.success){
                    // this.tempProduct.imageUrl = response.data.imageUrl
                    console.log(response.data.imageUrl)
                    console.log(this.tempProduct)
                    // this.$set(this.tempProduct , 'imageUrl' ,response.data.imageUrl )
                    // 雙向綁定功能
                    this.$set(this.tempProduct, 'imageUrl', response.data.imageUrl)
                }else{
                  this.$bus.$emit('message:push' , response.data.message , 'danger');
                }
            })
        }
    },
    filters:{
        isPay: function (e){
            // console.log(e)
            var pay = ''
            if(e){
            pay = "已付款"
            }else{
            pay = "未付款"
            }
            return pay
        },
        productItem:function(e){
            console.log(e)
            var productName =Object.keys(e)
            // console.log(productName)
            // console.log(productName.length)
            var final = "";
            var name ="";
            var qty = 0 ;

            for(var i=0 ; i<productName.length ; i++ ){
                qty = e[productName[i]].qty
                name = e[productName[i]].product.title
                var word = name + '*' + qty +"<br/>"
                final = final + word
            }
            console.log(final)
            return final
        }
    },

};
</script>