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
        resourceLink: 'https://r2---sn-aigl6nl7.googlevideo.com/videoplayback?ipbits=0&initcwndbps=148750&mm=31%2C29&mn=sn-aigl6nl7%2Csn-aigzrn7z&mt=1531414789&mv=m&pl=20&ei=bYlHW7T3E8aVVpXFjKAL&fexp=23709359%2C23745105&ms=au%2Crdu&lmt=1471812821364858&key=yt6&ip=167.99.91.144&dur=280.915&source=youtube&signature=381210CF968C569AB19607EFB5CDDF0B4F160965.DB39ADCFAB8CE5BBF34533DB81E7A78419FC0F42&itag=22&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&ratebypass=yes&requiressl=yes&mime=video%2Fmp4&fvip=2&c=WEB&id=o-AKg2VSP2aWrJsx4LsmKJsCWwBoM58yDcspK1e0MhpsdO&expire=1531436493',
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
    timelineTime: [0.15, 0.25],
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
    timelineTime: [0.21, 0.35],
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
    timelineTime: [0.21, 1.0],
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

