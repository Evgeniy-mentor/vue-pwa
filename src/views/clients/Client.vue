<template>
    <div>
        <page-title-bar></page-title-bar>
        <v-container fluid grid-list-xl py-0>
            <app-card
                    customClasses="mb-30"
            >
                <v-form v-model="form2.valid" ref="form" lazy-validation>
                    <v-text-field
                            v-model="form2.name"
                            label="Name"
                            :rules="[v => !!v || 'Name is required']"
                            required
                    ></v-text-field>

                    <v-select
                            label="Status"
                            v-model="form2.status"
                            :items="form2.items"
                            :rules="[v => !!v || 'Status is required']"
                            required
                    ></v-select>
                    <v-btn
                            @click="submit"
                            :disabled="!form2.valid"
                            color="success"
                            style="margin: 10px"
                    >
                       Save
                    </v-btn>

                    <v-btn @click="goClientList" color="secondary" style="margin: 10px">Back to Clients</v-btn>
                </v-form>
            </app-card>
        </v-container>
    </div>
</template>

<script>

    import {mapActions} from 'vuex'

    export default {
        name: "Client",
        data() {
            return {
                form2: {
                    name: '',
                    status: '',
                    valid: true,
                    select: null,
                    items: ["enabled", "disabled"],
                    checkbox: false
                },
                selectedclientid: null
            };
        },
    methods:{
    ...mapActions('clients', [
            'createClient',
            'findClient',
            'updateClient'
        ]),
            async submit() {

            if (this.$refs.form.validate()) {
                const {name , status} = this.form2;
                if(this.$route.params.clientid){
                    const itemId = this.$route.params.clientid
                    await this.updateClient({
                        id: itemId,
                        name,
                        status
                    })
                }else {
                    await  this.createClient({
                        name,
                        status
                    })
                }
                this.$router.push({ name: 'clientList'})
            }
        },
        clear() {
            this.$refs.form.reset();
        },
        goClientList() {
            this.$router.push({ name: 'clientList'})
        }
    },
    created() {
        if (this.$route.params.clientid && this.$route.params.clientid !== 'add') {
            this.selectedclientid = this.$route.params.clientid
            this.findClient(this.$route.params.clientid)
                .then(response => {

                    this.form2.name = response.name
                    this.form2.status = response.status
                })
                .catch(error => {
                    console.log(error)
                })

        }
    }
    }
</script>

<style scoped>

</style>