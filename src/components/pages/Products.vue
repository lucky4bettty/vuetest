<template>
    <div>
      <loading :active.sync="isLoading" ></loading>
        <div class="text-right">
            <button class="btn btn-primary" @click="openModal(true)">建立新產品</button>
        </div>
        <table class="table mt-4">
            <thead>
                <th width="120" >分類</th>
                <th>產品名稱</th>
                <th width="120">原價</th>
                <th width="120">售價</th>
                <th width="100">是否啟用</th>
                <td width="160">編輯</td>
            </thead>
            <tbody>
                <tr v-for="(item , key) in products" :key="item.id">
                    <td>{{item.category}} </td>
                    <td>{{item.title}}</td>
                    <!-- currency 涵式 -> 於全域啟用 -->
                    <td class="text-right">{{item.origin_price | currency}}</td>
                    <td class="text-right">{{item.price | currency}}</td>
                    <td>
                        <span v-if="item.is_enabled" class="text-success">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
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
        <!-- modal -->
        <!-- <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
                </div>
            </div>
        </div>     -->
        <!-- 編輯 + 新增 視窗 -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>新增產品</span>
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label for="image">輸入圖片網址</label>
              <input type="text" class="form-control" id="image"
              v-model="tempProduct.imageUrl"
                placeholder="請輸入圖片連結">
            </div>
            <div class="form-group">
              <label for="customFile">或 上傳圖片
                <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                <!-- <i class="fas fa-spinner fa-spin"></i> -->
              </label>
              <input type="file" id="customFile" class="form-control"
                ref="files" @change="uploadfile">
            </div>
            <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
              class="img-fluid" alt="" :src="tempProduct.imageUrl">
          </div>
          <div class="col-sm-8">
            <div class="form-group">
              <label for="title">標題</label>
              <input type="text" class="form-control" id="title"
                placeholder="請輸入標題" v-model="tempProduct.title">
            </div>

            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="category">分類</label>
                <input type="text" class="form-control" id="category"
                  placeholder="請輸入分類" v-model="tempProduct.category">
              </div>
              <div class="form-group col-md-6">
                <label for="price">單位</label>
                <input type="unit" class="form-control" id="unit"
                  placeholder="請輸入單位" v-model="tempProduct.unit">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-md-6">
              <label for="origin_price">原價</label>
                <input type="number" class="form-control" id="origin_price"
                  placeholder="請輸入原價" v-model="tempProduct.origin_price">
              </div>
              <div class="form-group col-md-6">
                <label for="price">售價</label>
                <input type="number" class="form-control" id="price"
                  placeholder="請輸入售價" v-model="tempProduct.price">
              </div>
            </div>
            <hr>

            <div class="form-group">
              <label for="description">產品描述</label>
              <textarea type="text" class="form-control" id="description"
                placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
            </div>
            <div class="form-group">
              <label for="content">說明內容</label>
              <textarea type="text" class="form-control" id="content"
                placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox"
                  id="is_enabled" v-model="tempProduct.is_enabled" 
                  :true-value="1"
                  :false-value="0">
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
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
                <button type="button" class="btn btn-danger" @click="deleteApi()">確認刪除</button>
            </div>
            </div>
        </div>
        </div>
        <!--  -->
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
    methods:{
        getProducts(page = 1){
            const api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`;
                console.log(api)
                this.isLoading = true
                // const api = 'https://vue-course-api.hexschool.io/api/lucky4betty/products'
                this.$http.get(api).then((response) => {
                this.isLoading = false  
                this.products = response.data.products
                this.pagination = response.data.pagination
                console.log(response.data)
            })
        },
        // 刪除modal開啟
        deleteProduct(item){
            console.log('刪除')
            $('#delProductModal').modal('show')
            this.deleteId = item.id
            console.log(this.deleteId)
        },
        // 刪除API功能
        deleteApi(){
            const api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${this.deleteId}`;
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
                this.tempProduct={}
                this.isNew = true
            }else{
                this.tempProduct= Object.assign({},item)
                this.isNew = false
            }

            $('#productModal').modal('show');

        },
        updateProdect(){
            let api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
            let httpMethod ='post'
            if(!this.isNew){
            // 下面的 id 是 openModal 裡存的 tempProduct 的 id
            api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${this.tempProduct.id}`;
            console.log(this.tempProduct)
            httpMethod ='put'
            }
            console.log(api)
            // const api = 'https://vue-course-api.hexschool.io/api/lucky4betty/products'
            this.$http[httpMethod](api,{data:this.tempProduct}).then((response) => {
            // this.products = response.data.products
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
    created(){
        this.getProducts() ;
        // console.log('路由')

        
    }
};
</script>