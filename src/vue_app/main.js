/*
    Entry point of webpack builder
*/

import Vue from 'vue';
Vue.config.devtools = true;

// Vue libraries
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import VidComp from '../vue_plugin/VidComp/main.js';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/dist/vuetify.min.css';

// Middleware binding
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Vuetify)
Vue.use(VidComp);

// Top level route components vueComponents
import appHook from './vueComponents/fundament/appHook.vue';
import appWindow from './vueComponents/fundament/appWindow.vue';
import workspace from './vueComponents/pageSection/workspace.vue';
import projectLibrary from './vueComponents/project/projectLibrary.vue';
import projectCreate from './vueComponents/project/projectCreate.vue';
import mediaEditor from './vueComponents/editor/mediaEditor.vue';
import timelineEditor from './vueComponents/timeline/timelineEditor.vue';
import resourceLibrary from './vueComponents/resourceImport/resourceLibrary.vue';
import importGlobal from './vueComponents/resourceImport/importGlobal.vue';
import authStatus from './vueComponents/user/authStatus.vue';

// Stores
import pve_store from './stores/pve_store.js';

// Routes
// TODO: Add to file
const routes = [
    { 

        path: '', 
        
        component:appWindow,

        children: [{

            path: '/authStatus',
                component:authStatus,
    
            },{
    
                path: '',
                component:projectLibrary,
    
            },{
    
                path: '/new',
                component:projectCreate,
    
            },{

            path: '/project/:projectName',

            component: workspace,
            props: true,

            children: [{

                path: '',
                component:mediaEditor,
                props: true,

                children: [{
                    path: '',
                    component: timelineEditor,
                    props: true
                },]

            },{

                path: '/project/:projectName/resources/:resourceTypeView',
                component:resourceLibrary,
                props: true

            },{
                path: '/project/:projectName/import',
                component: importGlobal,
                props: true
            }]
        }]
    }
];

// Store init config
const store = new Vuex.Store(pve_store);

// Route init conig
const router = new VueRouter({
    mode: 'history',
    routes
});

Vue.prototype.$eventHub = new Vue(); // Global event bus

// Vue execution
new Vue({
    render: h => h(appHook),
    el: '#app',
    store,
    router
}).$mount('#app');