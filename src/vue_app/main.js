/*
    Entry point of webpack builder
*/

import Vue from 'vue';
Vue.config.devtools = false;

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
import editor from './vueComponents/composer/editor.vue';
import render from './vueComponents/composer/render.vue';
import editorPort from './vueComponents/timeline/editorPort.vue';
import resourceLibrary from './vueComponents/resourceImport/resourceLibrary.vue';
import importTab from './vueComponents/resourceImport/importTab.vue';
import importGlobal from './vueComponents/resourceImport/importGlobal.vue';
import importYoutube from './vueComponents/resourceImport/importYoutube.vue';
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
                component:editor,
                props: true,

                children: [{

                    path: '',
                    component: editorPort,
                    props: true

                },]

            },{

                path: '/project/:projectName/resources/:resourceTypeView',
                component:resourceLibrary,
                props: true

            },{

                path: '/project/:projectName/import',
                component: importTab,
                props: true,
                children: [{

                    path: '/project/:projectName/import/global',
                    component: importGlobal,
                    props: true

                },{
                    path: '/project/:projectName/import/youtube',
                    component: importYoutube,
                    props: true
                }]

            },{

                path: '/project/:projectName/render',
                component: render,
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
    el: '#appHook',
    store,
    router
}).$mount('#app');
