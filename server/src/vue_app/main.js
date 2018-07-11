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
                //props: true,

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
VidComp.newProject('test');

VidComp.addLayer('test', {

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
        resourceLink: 'https://r2---sn-aigzrn7z.googlevideo.com/videoplayback?ipbits=0&lmt=1471812821364858&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cnh%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&ei=nptFW-b4MtPOxwLEy5noCA&initcwndbps=161250&source=youtube&requiressl=yes&ratebypass=yes&dur=280.915&fvip=14&nh=%2CIgpwZjAxLmFtczE2Kgs3Mi4xNC4yMTMuOQ&fexp=23709359%2C23745105&expire=1531310078&mime=video%2Fmp4&key=yt6&c=WEB&itag=22&pl=20&mn=sn-aigzrn7z%2Csn-5hne6nse&ip=167.99.91.144&mm=31%2C26&ms=au%2Conr&mv=m&mt=1531288351&id=o-ACuv1VJ5vdPXH_oA48YG1PywTbLdaQL5NI-0Zx58Rhuo&signature=76B695C29DC1F1AD54DFDE8AFBFC3EC3EBA2328F.D2741B633397D24FBD6CF183817EC10E9CB2FDFA',
        resourceType: 'video',

        resourceLoaded: function () {

            VidComp.addMedia('test', {
                name: 'fullScreenTest',
                layerIndex: 0,
                size: [300, 160],
                timelineTime: [0.21, 1.0],
                position: [0,0],
                videoStartTime: 0.80,
                resource: {
                    name: 'BunnyVideo'
                }
            });

            VidComp.addMedia('test', {
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

            VidComp.addMedia('test', {
                name: 'alonsideSecond',
                layerIndex: 0,
                size: [200, 100],
                timelineTime: [0.15, 0.25],
                position: [0,40],
                videoStartTime: 1.0,
                resource: {
                    name: 'BunnyVideo'
                }
            });

            VidComp.addMedia('test', {
                name: 'anotheroneofthese',
                layerIndex: 0,
                size: [150, 100],
                timelineTime: [0.21, 0.35],
                position: [0,0],
                videoStartTime: 1.0,
                resource: {
                    name: 'BunnyVideo'
                }
            });

        }
    }
});

VidComp.addMedia('test', {
    name: 'CAT',
    layerIndex: 0,
    size: [100, 100],
    timelineTime: [0.113, 0.205],
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

