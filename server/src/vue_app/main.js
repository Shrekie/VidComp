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
        resourceLink: 'https://r2---sn-aigzrn7z.googlevideo.com/videoplayback?sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cnh%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&mime=video%2Fmp4&initcwndbps=97500&ipbits=0&c=WEB&source=youtube&dur=280.915&lmt=1471812821364858&requiressl=yes&nh=%2CIgpwZjAxLmFtczE1Kg04MC4yMzkuMTI4LjE2&signature=7FA64154648158EE5A7906552456A6AC89337A62.DADE971A274DEC034E6963BFA4679B21A6F5C27E&key=yt6&itag=22&expire=1533158345&ratebypass=yes&fvip=14&mt=1533136674&mv=m&ei=ac9hW5eXCZP7xgLG-IroBg&ms=au%2Conr&ip=167.99.91.144&pl=20&mm=31%2C26&mn=sn-aigzrn7z%2Csn-5hne6nse&id=o-AFRyJ_Swo8xKG-g6DPaKRCBjDxKyVntPb6FFpWSoqw7d',
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

