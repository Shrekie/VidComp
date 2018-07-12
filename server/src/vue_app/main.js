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
import timelineEditor from './vidCompManipulation/projectHandling/timeline/timelineEditor.vue';
import establishMedia from './vidCompManipulation/projectHandling/timelineGenerators/establishMedia.vue';

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
        name: 'FIRSTBALL',
        layerIndex: 0,
        size: [200, 100],
        timelineTime: [0.00, 0.10],
        position: [0,0],
        videoStartTime: 0
    },
    newResource: {
        name: 'BunnyVideo',
        resourceLink: 'https://r2---sn-aigzrn7z.googlevideo.com/videoplayback?mn=sn-aigzrn7z%2Csn-5hne6nse&signature=55BDDA90FD3BCEF0A2AA76684017B2A5C66FD760.C8F2782D2701783946789BC2E5D4B84B36CBE810&source=youtube&requiressl=yes&nh=%2CIgpwZjAxLmFtczE2Kgs3Mi4xNC4yMTMuOQ&mime=video%2Fmp4&beids=%5B9466593%5D&ipbits=0&initcwndbps=150000&fexp=23709359%2C23745105&dur=280.915&key=yt6&lmt=1471812821364858&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cnh%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&ip=167.99.91.144&mv=m&ratebypass=yes&id=o-AIs7dyuO2sCO4kFCk84v1gmy8U3I6EcuxifL_2D4aRW2&fvip=14&c=WEB&expire=1531459011&mm=31%2C26&ms=au%2Conr&ei=Y-FHW8W0F5CcxwLAg7oY&itag=22&pl=20&mt=1531437280',
        resourceType: 'video'
    }

});

testProject.addMedia({
    name: 'SECONDBALL',
    layerIndex: 0,
    size: [50, 100],
    timelineTime: [0.11, 0.20],
    position: [0,0],
    videoStartTime: 0.20,
    resource: {
        name: 'BunnyVideo'
    }
});

testProject.addMedia({
    name: 'alonsideSecond',
    layerIndex: 0,
    size: [200, 100],
    timelineTime: [0.23, 0.30],
    position: [0,40],
    videoStartTime: 1.0,
    resource: {
        name: 'BunnyVideo'
    }
});

testProject.addMedia({
    name: 'anotheroneofthese',
    layerIndex: 0,
    size: [150, 100],
    timelineTime: [0.40, 0.42],
    position: [0,0],
    videoStartTime: 1.0,
    resource: {
        name: 'BunnyVideo'
    }
});

testProject.addMedia({
    name: 'fullScreenTest',
    layerIndex: 0,
    size: [300, 160],
    timelineTime: [0.43, 0.58],
    position: [0,0],
    videoStartTime: 0.80,
    resource: {
        name: 'BunnyVideo'
    }
});

testProject.addMedia({
    name: 'CAT',
    layerIndex: 0,
    size: [100, 100],
    timelineTime: [0.65, 1.00],
    position: [40, 40],
    videoStartTime: 0,
    newResource: {
        name: 'catvideo',
        resourceLink: 'https://i.imgur.com/Q5PBbSW.mp4',
        resourceType: 'video'
    }
});


// Store init config
const store = new Vuex.Store(pve_store);

// Route init conig
const router = new VueRouter({
    mode: 'history',
    routes
});

// Vue execution
new Vue({
    render: h => h(appHook),
    el: '#app',
    store,
    router
}).$mount('#app');

