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
                            >
        
                                <v-tooltip
                                slot="prepend"
                                bottom
                                >
                                <v-icon slot="activator">mdi-help-circle-outline</v-icon>
                                Give your project a name
                                </v-tooltip>
                            
                            </v-text-field>

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
        project (){
            return this.$store.getters.projectByName(this.projectName);
        }
    },

    methods: {

        createProject() {

            this.$store.dispatch('createProject', { name: this.projectName }).then(response => {

                this.$router.push({ path: `/project/${this.projectName}`});

            }, error => {
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