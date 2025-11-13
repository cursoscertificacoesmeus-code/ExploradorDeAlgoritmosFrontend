import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import router from './router';
import { createPinia } from 'pinia'; // Importa createPinia
import ToastService from 'primevue/toastservice'; // 1. Importar o serviço


// Importa o tema do PrimeVue e os ícones
import 'primevue/resources/themes/aura-light-green/theme.css';
import 'primeicons/primeicons.css';

const app = createApp(App);
const pinia = createPinia(); // Cria a instância do Pinia

app.use(PrimeVue);
app.use(router);
app.use(pinia); // Usa o Pinia na aplicação Vue
app.use(ToastService); // 2. Registrar o serviço


app.mount('#app');
