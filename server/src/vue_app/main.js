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
        name: 'mainparent',
        layerIndex: 0,
        size: [200, 100],
        timelineTime: [1, 33],
        position: [0,0],
        videoStartTime: 1
    },

    newResource: {
        name: 'BunnyVideo',
        resourceLink: 'https://r1---sn-aigl6n7s.googlevideo.com/videoplayback?requiressl=yes&dur=139.342&pl=20&fexp=23709359&ms=au%2Crdu&mt=1531082379&mv=m&source=youtube&mm=31%2C29&mn=sn-aigl6n7s%2Csn-aigzrn7z&ratebypass=yes&expire=1531104090&c=WEB&id=o-ACjh5WmfeME4HwphL2_e5umqHk87iqV69aEIPKrRaxHM&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&lmt=1516189607568004&fvip=1&initcwndbps=118750&ip=167.99.91.144&mime=video%2Fmp4&itag=22&key=yt6&ei=-nZCW56UHdeh1gbVvZmYCQ&ipbits=0&signature=8784328037C1BDD12BEBB56CACEBBEBED0A2B2E4.397662FEF1D4B70CD683851048EB37AEFCEEB1E7',
        resourceType: 'video',

        resourceLoaded: function () {

            VidComp.addMedia('test', {
                name: 'two',
                layerIndex: 0,
                size: [50, 100],
                timelineTime: [23, 30],
                position: [0,0],
                videoStartTime: 100,
                resource: {
                    name: 'BunnyVideo'
                }
            });

            VidComp.addMedia('test', {
                name: 'six',
                layerIndex: 0,
                size: [70, 80],
                timelineTime: [2, 10],
                position: [120, 20],
                videoStartTime: 70,
                resource: {
                    name: 'BunnyVideo'
                }
            });

            VidComp.addMedia('test', {
                name: 'seven',
                layerIndex: 0,
                size: [150, 100],
                timelineTime: [20, 30],
                position: [10,120],
                videoStartTime: 120,
                resource: {
                    name: 'BunnyVideo'
                }
            });

            VidComp.addMedia('test', {
                name: 'three',
                layerIndex: 0,
                size: [70, 200],
                timelineTime: [10, 15],
                position: [20, 100],
                videoStartTime: 5,
                resource: {
                    name: 'BunnyVideo'
                }
            });

            VidComp.addMedia('test', {
                name: 'four',
                layerIndex: 0,
                size: [190, 30],
                timelineTime: [15, 33],
                position: [200, 20],
                videoStartTime: 50,
                resource: {
                    name: 'BunnyVideo'
                }
            });

            VidComp.addMedia('test', {
                name: 'five',
                layerIndex: 0,
                size: [100, 50],
                timelineTime: [5, 20],
                position: [100, 20],
                videoStartTime: 30,
                resource: {
                    name: 'BunnyVideo'
                }
            });

        }
    }
});

VidComp.addMedia('test', {
    name: 'eight',
    layerIndex: 0,
    size: [100, 100],
    timelineTime: [5, 10],
    position: [40, 40],
    videoStartTime: 5,
    newResource: {
        name: 'catvideo',
        resourceLink: 'https://i.imgur.com/Q5PBbSW.mp4',
        resourceType: 'video'
    }
});

VidComp.addMedia('test', {
    name: 'nine',
    layerIndex: 0,
    size: [70, 200],
    timelineTime: [0, 10],
    position: [250, 10],
    videoStartTime: 5,
    newResource: {
        name: 'footballer',
        resourceLink: 'https://i.imgur.com/ZPiM3fT.mp4',
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

