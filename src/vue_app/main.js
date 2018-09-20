/*
    Entry point of webpack builder
*/

import Vue from 'vue';
Vue.config.devtools = true;

// Vue libraries
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import VidComp from './../vue_plugin/main.js';
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
        path: '/authStatus',

        component:authStatus

    }, { 

        path: '/', 
        
        component:appWindow,

        children: [{

            path: '',

            components: {

                workspace: workspace

            },
            children: [{

                path: '/authStatus',
                component:authStatus,

            },{

                path: '',
                component:projectLibrary,

            },{

                path: 'new',
                component:projectCreate,

            }, {

                path: 'compose/:projectName',
                component:mediaEditor,
                props: true,

                children: [{
                    path: '',
                    component: timelineEditor,
                    props: true
                },]

            },{

                path: 'resources/:projectName/:resourceTypeView',
                component:resourceLibrary,
                props: true

            },{
                path: 'import/:projectName',
                component: importGlobal,
                props: true
            }]
        }]
    }
];

// VideoComposer init
/*
var testProject = VidComp.videoProject.new('Tutorial');

testProject.createLayer({

    newMedia: {
        layerIndex: 0,
        size: [200, 100],
        timelineTime: [0.00, 0.10],
        position: [0,0],
        videoStartTime: 0
    },

    newResource: {
        name: 'Showcase',
        resourceLink: 'cdn-b-east.streamable.com/video/mp4/my6zy_1.mp4?token=ADZG5jsp57u35dxTphT5JA&expires=1537408394',
        resourceType: 'video'
    }

});

testProject.createLayer({

    newMedia: {
        layerIndex: 1,
        size: [200, 100],
        timelineTime: [0.00, 0.10],
        position: [0,0],
        videoStartTime: 0
    },

    newResource: {
        name: 'Cat playing',
        resourceLink: 'https://i.imgur.com/Q5PBbSW.mp4',
        resourceType: 'video'
    }

});
*/
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