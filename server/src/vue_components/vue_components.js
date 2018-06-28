/*
    Entry point of webpack builder
*/

import Vue from 'vue';
Vue.config.devtools = true;

// Vue libraries
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css';
import VueRouter from 'vue-router';

// Components
import appWindow from './appWindow/appWindow.vue';
import workspaceContent from './workspaceContent/workspaceContent.vue';
import sidebarContent from './sidebarContent/sidebarContent.vue';
import assetComposer from './assetComposer/assetComposer.vue';
import assetRelocator from './assetRelocator/assetRelocator.vue';

// Middleware binding
Vue.use(Vuetify);
Vue.use(VueRouter)

// Routes
const routes = [
    { 
        path: '/', component:appWindow,
        children: [{
            path: '',
            components: {
                workspace: workspaceContent,
                sidebar: sidebarContent
            },
            children: [{
                path: 'compose',
                component:assetComposer
            }, {
                path: 'upload',
                component:assetRelocator
            }]
        }]

    }
];

// Route init conig
const router = new VueRouter({
    mode: 'history',
    routes
});

// Vue execution
import appHook from './appHook/appHook.vue';

new Vue({
    render: h => h(appHook),
    el: '#app',
    router
}).$mount('#app');

