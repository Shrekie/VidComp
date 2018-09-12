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
import mediaEditor from './vueComponents/editor/mediaEditor.vue';
import assetRelocator from './vueComponents/editor/assetRelocator.vue';
import timelineEditor from './vueComponents/timeline/timelineEditor.vue';
import resourceLibrary from './vueComponents/resourceImport/resourceLibrary.vue';
import importGlobal from './vueComponents/resourceImport/importGlobal.vue';

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
                workspace: workspace
            },
            children: [{

                path: 'compose/:projectName',
                component:mediaEditor,
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
        name: 'Blender animation',
        resourceLink: 'https://r2---sn-aigl6nl7.googlevideo.com/videoplayback?source=youtube&initcwndbps=146250&c=WEB&expire=1536809841&ratebypass=yes&lmt=1471812821364858&ei=EYeZW7mvH4SjxgKE05noDA&fvip=2&dur=280.915&key=yt6&ipbits=0&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&mv=m&mt=1536788159&ms=au%2Conr&mime=video%2Fmp4&requiressl=yes&ip=167.99.91.144&signature=1F1F31896DD2FB116E9300773C08BCC6134F3257.A718F9661BA99A6D008F8E3E36DADC640880071A&mn=sn-aigl6nl7%2Csn-5hnekn7z&mm=31%2C26&id=o-AJZus3HUnM37ryzhAUnP4x7emSCfbQKCjhyVcT9WRul_&pl=23&itag=22',
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
        name: 'Blender animation'
    }
});

testProject.addMedia({
    layerIndex: 0,
    size: [200, 100],
    timelineTime: [0.23, 0.30],
    position: [0,40],
    videoStartTime: 0.2,
    resource: {
        name: 'Blender animation'
    }
});

testProject.addMedia({
    layerIndex: 0,
    size: [150, 100],
    timelineTime: [0.35, 0.42],
    position: [0,0],
    videoStartTime: 2.25,
    resource: {
        name: 'Blender animation'
    }
});

testProject.addMedia({
    layerIndex: 0,
    size: [300, 160],
    timelineTime: [0.43, 0.58],
    position: [0,0],
    videoStartTime: 2.10,
    resource: {
        name: 'Blender animation'
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

testProject.addMedia({
    layerIndex: 1,
    size: [100, 100],
    timelineTime: [0.45, 0.6],
    position: [40, 40],
    videoStartTime: 0.03,
    resource: {
        name: 'Cat playing'
    }
});

testProject.addMedia({
    layerIndex: 1,
    size: [100, 100],
    timelineTime: [0.64, 0.7],
    position: [40, 40],
    videoStartTime: 0.06,
    resource: {
        name: 'Blender animation'
    }
});

testProject.addMedia({
    layerIndex: 0,
    size: [100, 100],
    timelineTime: [0.75, 0.9],
    position: [50, 40],
    videoStartTime: 0.7,
    resource: {
        name: 'Cat playing'
    }
});


testProject.createLayer({

    newMedia: {
        layerIndex: 2,
        size: [200, 100],
        timelineTime: [0.00, 0.10],
        position: [0,0],
        videoStartTime: 0
    },

    newResource: {
        name: 'Colorful city',
        resourceLink: 'https://i.imgur.com/AjybU6j.jpg',
        resourceType: 'image'
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

