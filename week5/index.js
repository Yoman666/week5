
// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
// prodcutsModal 元件導入
import prodcutsModal from './prodcutsModal.js';


// 步驟 2：註冊元件    
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
// 步驟 3：定義規則
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');
configure({
  generateMessage: localize('zh_TW'),
});

const apiUrl =  'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'yoyo123456';

Vue.createApp({
    data(){
        return{
        products:[],
        product:{},  
        cart:{},
        form: {
            user: {
              name: '',
              email: '',
              tel: '',
              address: '',
            },
            message: '',
          },
        }
        
    },
    // 步驟 2：註冊元件
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },

    methods: {
        getProducts(){
            const url = `${apiUrl}/api/${apiPath}/products`;
            axios.get(url).then((res)=>{
                console.log('取得產品列表',res);
                this.products = res.data.products;
            })
        },
        getProduct(id){
            const url = `${apiUrl}/api/${apiPath}/product/${id}`;
            axios.get(url).then((res)=>{
                console.log('取得單一產品',res);
                this.product = res.data.product;
                // 呼叫元件內的方法打開modal
                this.$refs.userProductModal.openModal();
            })
        },
        // 數量預設1
        addToCart(product_id, qty=1){
            const data = {
                product_id,
                qty
              }
            const url = `${apiUrl}/api/${apiPath}/cart`;
            axios.post(url,{data}).then((res)=>{
                console.log("加入購物車",res.data);
                // 加入購物車後自動關掉
                this.$refs.userProductModal.closeModal();

                // 點擊加入購物車也需要在呼叫一次
                this.getCarts();
            })
        },

        getCarts(){
            const url = `${apiUrl}/api/${apiPath}/cart`
            axios.get(url).then((res)=>{
                console.log("取得購物車表", res.data);
                // 注意資料取的來源要正確
                this.cart = res.data.data;
            })
        },

        updateCarts(item){
            const data={
                    product_id: item.product.id,
                    qty: item.qty, 
            }

            const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`
            axios.put(url,{data}).then((res)=>{
                console.log("更新購物車", res.data);
                this.getCarts();
            })

        },

        deleteitem(item){
            const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`
            axios.delete(url).then((res)=>{
                console.log("刪除購物車", res.data);
                this.getCarts();
            })

        },
        deleteAllItem(){
            const url = `${apiUrl}/api/${apiPath}/carts`
            axios.delete(url).then((res)=>{
                console.log("刪除全部購物車", res.data);
                this.getCarts();
            })

        },
        onSubmit(){
            console.log("send form");
        }

    },

// 元件區域註冊
    components:{
        prodcutsModal,
    },

    mounted() {
        this.getProducts();
        this.getCarts();

        
    },
}).mount("#app");

