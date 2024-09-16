import { createPinia } from 'pinia' 
import piniaPersist from 'pinia-plugin-persistedstate'; // 引入插件

const pinia = createPinia();
pinia.use(piniaPersist); // 使用持久化插件

export default pinia
