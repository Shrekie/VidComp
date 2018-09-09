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

// Top level route components
import appHook from './integralFundament/appHook/appHook.vue';
import appWindow from './integralFundament/appWindow/appWindow.vue';
import workspaceContent from './pageSection/workspaceContent/workspaceContent.vue';
import sidebarContent from './pageSection/sidebarContent/sidebarContent.vue';
import assetComposer from './pageContent/assetComposer/assetComposer.vue';
import assetRelocator from './pageContent/assetRelocator/assetRelocator.vue';
import timelineEditor from './projectHandling/timeline/timelineEditor.vue';
import mediaLibrary from './resourceImport/mediaLibrary.vue';
// Stores
import pve_store from './stores/pve_store.js';

// Routes
// TODO: Add to file
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

                path: 'compose/:projectName',
                component:assetComposer,
                props: true,

                children: [{
                    path: '',
                    component: timelineEditor,
                    props: true
                },]

            }, {

                path: 'upload/:projectName',
                component:assetRelocator,
                props: true

            },{

                path: 'media/:projectName',
                component:mediaLibrary,
                props: true

            }]
        }]
    }
];

// VideoComposer init
var testProject = VidComp.videoProject('test');

testProject.createLayer({

    newMedia: {
        layerIndex: 0,
        size: [200, 100],
        timelineTime: [0.00, 0.10],
        position: [0,0],
        videoStartTime: 0
    },

    newResource: {
        name: 'BunnyVideo',
        resourceLink: 'https://r1---sn-aigzrn7s.googlevideo.com/videoplayback?expire=1536466079&id=o-ANBbkcwl22lb-PccPLdJDRCOezJviQUeYcDkTuXMqeSw&signature=1E7E1EB8BB6AF5B62100E79D9ABD97AE37323FB8.3DAAF0A041BCF211BDDC7D26E6DC5A70C2BF87EC&ms=au%2Crdu&pl=24&ipbits=0&initcwndbps=153750&mv=m&mt=1536444346&itag=22&mm=31%2C29&key=yt6&ip=167.99.91.144&fvip=1&dur=1150.479&source=youtube&ratebypass=yes&requiressl=yes&lmt=1521383875269200&mime=video%2Fmp4&c=WEB&ei=P0iUW7SAJtGC1gbwyLaIBA&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&mn=sn-aigzrn7s%2Csn-aigl6nl7',
        resourceType: 'video'
    }

});

testProject.addMedia({
    layerIndex: 0,
    size: [50, 100],
    timelineTime: [0.11, 0.20],
    position: [0,0],
    videoStartTime: 1.20,
    resource: {
        name: 'BunnyVideo'
    }
});

testProject.addMedia({
    layerIndex: 0,
    size: [200, 100],
    timelineTime: [0.23, 0.30],
    position: [0,40],
    videoStartTime: 0.2,
    resource: {
        name: 'BunnyVideo'
    }
});

testProject.addMedia({
    layerIndex: 0,
    size: [150, 100],
    timelineTime: [0.35, 0.42],
    position: [0,0],
    videoStartTime: 2.25,
    resource: {
        name: 'BunnyVideo'
    }
});

testProject.addMedia({
    layerIndex: 0,
    size: [300, 160],
    timelineTime: [0.43, 0.58],
    position: [0,0],
    videoStartTime: 2.10,
    resource: {
        name: 'BunnyVideo'
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
        name: 'catvideoTwo',
        resourceLink: 'https://i.imgur.com/Q5PBbSW.mp4',
        resourceType: 'video'
    }

});

testProject.addMedia({
    layerIndex: 1,
    size: [100, 100],
    timelineTime: [0.45, 0.6],
    position: [40, 40],
    videoStartTime: 0.03,
    resource: {
        name: 'catvideoTwo'
    }
});

testProject.addMedia({
    layerIndex: 1,
    size: [100, 100],
    timelineTime: [0.64, 0.7],
    position: [40, 40],
    videoStartTime: 0.06,
    resource: {
        name: 'BunnyVideo'
    }
});

testProject.addMedia({
    layerIndex: 0,
    size: [100, 100],
    timelineTime: [0.75, 0.9],
    position: [50, 40],
    videoStartTime: 0.7,
    resource: {
        name: 'catvideoTwo'
    }
});

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

