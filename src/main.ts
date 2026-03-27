import { createApp } from 'vue'
import './main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // ← El Plus first
import './assets/styles/input-dark.css' // ← your overrides last
import App from './App.vue'

createApp(App).use(ElementPlus).mount('#app')