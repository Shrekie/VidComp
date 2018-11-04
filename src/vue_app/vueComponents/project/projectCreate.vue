<template>
        <v-flex xs12 text-xs-center>


            <v-toolbar app dense flat>
                <v-btn icon :to="'/'" exact>
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </v-toolbar>

            <v-layout>
                <v-flex xs12 text-xs-center align-center>
                    <v-card flat>

                    <v-flex xs8 offset-xs2 class="pt-5">
                        <v-form v-model="validProject" onSubmit="return false;">
                            <v-text-field v-model="projectName"
                            :rules="[rules.required, rules.min, rules.max, 
                            rules.unixFile]"
                            required
                            @click:append="createProject"
                            @keyup.enter.native="createProject"
                            append-icon="mdi-folder-plus"
                            placeholder="Project name"
                            solo
                            light
                            >
                            </v-text-field>
                        </v-form>
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
            if(this.validProject){
                this.$store.dispatch('createProject', { name: this.projectName }).then(response => {

                    this.$router.push({ path: `/project/${this.projectName}`});

                }, error => {
                    console.log(err);
                });
            }
        }

    },

    data() {

        return {
            projectName:"",
            validProject:false,
            rules: {
                required: value => !!value || 'Required.',
                min: value => value.length >= 6 || 'Minimum 6 characters',
                max: value => value.length <= 60 || 'Max 60 characters',
                unixFile: value => {
                    const pattern = /[^-_.A-Za-z0-9 ]/
                    return !pattern.test(value) || 'Illegal character'
                }
            }

        }

    }
    
};
</script>

<style>

</style>