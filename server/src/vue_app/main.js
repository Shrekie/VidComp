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
        name: 'FIRSTBALL',
        layerIndex: 0,
        size: [200, 100],
        timelineTime: [0.00, 0.10],
        position: [0,0],
        videoStartTime: 0
    },

    newResource: {
        name: 'BunnyVideo',
        resourceLink: 'https://r2---sn-aigl6ned.googlevideo.com/videoplayback?ms=au%2Crdu&mv=m&pl=20&ipbits=0&initcwndbps=177500&source=youtube&ip=167.99.91.144&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&dur=63.088&id=o-ABNuY0Bf1Tb7umpKM87DkyCm91uD2Eb10bLzjTF5GWWV&fvip=2&signature=68BAA47353FE08596387AAE9E414843F3E94931E.B6603083C64CAA6750721EDC93C191F6A140580B&key=yt6&mime=video%2Fmp4&requiressl=yes&ei=LuZDW8a8FaaMxgKMrYvwBw&itag=22&mt=1531176401&mn=sn-aigl6ned%2Csn-aigs6n7y&c=WEB&fexp=23709359&ratebypass=yes&mm=31%2C29&expire=1531198094&lmt=1509022744117697',
        resourceType: 'video',

        resourceLoaded: function () {

            VidComp.addMedia('test', {
                name: 'SECONDBALL',
                layerIndex: 0,
                size: [50, 100],
                timelineTime: [0.11, 0.20],
                position: [0,0],
                videoStartTime: 100,
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

