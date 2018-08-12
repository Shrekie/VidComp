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
import 'vuetify/dist/vuetify.min.css';

// Middleware binding
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(VidComp);

// Top level route components
import appHook from './integralFundament/appHook/appHook.vue';
import appWindow from './integralFundament/appWindow/appWindow.vue';
import workspaceContent from './pageSection/workspaceContent/workspaceContent.vue';
import sidebarContent from './pageSection/sidebarContent/sidebarContent.vue';
import assetComposer from './pageContent/assetComposer/assetComposer.vue';
import assetRelocator from './pageContent/assetRelocator/assetRelocator.vue';
import timelineEditor from './projectHandling/timeline/timelineEditor.vue';
import establishMedia from './projectHandling/timelineGenerators/establishMedia.vue';

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
                },
                {
                    path: 'addmedia/:layerIndex',
                    component: establishMedia,
                    props: true

                }]

            }, {

                path: 'upload/:projectName',
                component:assetRelocator

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
        resourceLink: 'https://r4---sn-aigzrn7l.googlevideo.com/videoplayback?sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&signature=8ABFC5D426A5B2B038B0AB9BA82166DD7D93E5D0.070DDD6D428262846091D21C66A1F5EB9301703F&ip=167.99.91.144&id=o-AHqs-FPq3UUug1z5wi0HfuY8OjY6nmFIo1Pvbh_oXXZ1&fvip=4&c=WEB&mime=video%2Fmp4&requiressl=yes&expire=1534123831&ratebypass=yes&mn=sn-aigzrn7l%2Csn-5hne6nlk&source=youtube&mm=31%2C26&itag=22&ipbits=0&initcwndbps=132500&dur=278.918&key=yt6&lmt=1529227567484654&ms=au%2Conr&ei=1opwW7erOdXJVOjunYgE&mv=m&pl=20&mt=1534102129',
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
    timelineTime: [0.40, 0.42],
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

