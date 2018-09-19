<template>
        <v-flex xs12 text-xs-center>

            <v-card flat>
                <v-btn icon :to="'/'">
                    <v-icon>mdi-arrow-left-bold-circle</v-icon>
                </v-btn>
                
            </v-card>

            <v-layout>
                <v-flex xs12 text-xs-center align-center>
                    <v-card flat>

                        <v-btn @click="createProject">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>

                        <v-flex xs8 offset-xs2>
                            <v-text-field v-model="projectName"
                            outline
                            append-icon="mdi-folder-plus"
                            ></v-text-field>
                        </v-flex>

                    </v-card>
                </v-flex>
            </v-layout>

        </v-flex>
</template>

<script>

export default {

    name: "projectCreate",

    computed: {

    },

    methods: {

        createProject() {
            
            //TODO: make sure the promise is proper
            const promise = new Promise((resolve, reject) => {
                if (this.$store.dispatch('createProject', { name: this.projectName })) {
                    this.$vcomp.new(this.projectName).createLayer({layerIndex:0});
                    resolve();
                } else {
                    reject(Error('it broke'));
                }
            });

            promise.then(result => {
                this.$router.push({ path: `/compose/${this.projectName}`});
            }, err => {
                console.log(err);
            });

        }

    },

    data() {

        var projectName;

        return {

            projectName

        }

    }
    
};
</script>

<style>

</style>