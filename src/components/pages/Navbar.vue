<template>
    <div>
        <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Company name</a>
        <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search">
        <ul class="navbar-nav px-3">
            <li class="nav-item text-nowrap">
            <a class="nav-link" href="#" @click.prevent="signout" >登出</a>
            </li>
        </ul>
        </nav>
    </div>
</template>

<script>
export default {
    methods:{
    signout(){
      const api =`${process.env.APIPATH}/logout`;
        const vm = this;
        console.log(api)
            // const api = 'https://vue-course-api.hexschool.io/api/lucky4betty/products'
        this.$http.post(api).then((response) => {
        console.log(response.data)
// -------------------------------------------------------
        //1. vue router -> 跳轉失敗 
         vm.$router.push('/login')
// -------------------------------------------------------
        //2. promise 物件 ->開新分頁，再關掉舊分頁 
        if(response.data.success){
            console.log('我已經登出')
            var url = 'http://localhost:8080/#/login'
            const openpage = new Promise((resolve, reject) => {
                window.open(url, "_target");
            });
            const closepage = new Promise((resolve, reject) => {
                window.close()
            });
            Promise.all( [openpage, closepage ] )
// -------------------------------------------------------
        //    window.open(url, "_target");
        //    window.close()  

        // 
        // var RunCallbackFunction = function() { window.close()};
        // //random function you want to call
        //     function myFunc() { window.close() }

        //     //to actually open the window..
        //     var win = window.open("http://localhost:8080/#/login");
        //     win.onload = function() { win.RunCallbackFunction = myFunc; };


        }
        }) 
    }
  }
}
</script>