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
        resourceLink: 'https://r2---sn-aigzrn7z.googlevideo.com/videoplayback?ipbits=0&ratebypass=yes&ip=167.99.91.144&fexp=23709359%2C23745105&source=youtube&mm=31%2C26&mn=sn-aigzrn7z%2Csn-5hnekn7z&id=o-AH_6_BR3cuqV5uhIwUMSRAUdpwasmP8dEOCnQo-na7Lf&ei=BidLW76aJoeb1wbX3IOABQ&ms=au%2Conr&mt=1531651748&mv=m&pl=21&fvip=2&signature=3917653E3B0BAE2B607DBE6F98BEE33F44801D5F.D1D008A3A8679DEAF2B41F82A0FD8FBE8FA35C8C&expire=1531673446&key=yt6&mime=video%2Fmp4&initcwndbps=170000&dur=280.915&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&c=WEB&requiressl=yes&itag=22&lmt=1471812821364858',
        resourceType: 'video'
    }

});

testProject.addMedia({
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
    videoStartTime: 0.25,
    resource: {
        name: 'BunnyVideo'
    }
});

testProject.addMedia({
    layerIndex: 0,
    size: [300, 160],
    timelineTime: [0.43, 0.58],
    position: [0,0],
    videoStartTime: 0.30,
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
    timelineTime: [0.65, 0.9],
    position: [40, 40],
    videoStartTime: 0,
    resource: {
        name: 'catvideoTwo'
    }
});

testProject.addMedia({
    layerIndex: 1,
    size: [100, 100],
    timelineTime: [0.4, 0.6],
    position: [40, 40],
    videoStartTime: 0,
    resource: {
        name: 'BunnyVideo'
    }
});

testProject.addMedia({
    layerIndex: 0,
    size: [100, 100],
    timelineTime: [0.65, 0.8],
    position: [50, 40],
    videoStartTime: 0,
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

