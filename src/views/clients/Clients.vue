<template>
    <div>
        <page-title-bar></page-title-bar>
        <v-container fluid grid-list-xl py-0 style="margin-bottom: 25px">
            <app-card
                    customClasses="mb-30"
            >
                <v-form ref="form" lazy-validation>
                    <v-btn @click="searchClients" color="secondary" style="margin: 10px">Refresh Clients</v-btn>
                    <v-btn @click="add" color="primary" style="margin: 10px">Add Client</v-btn>
                </v-form>
            </app-card>
        </v-container>
        <v-container fluid grid-list-xl py-0>
            <v-layout row wrap>
                <app-card
                        colClasses="xl12 lg12 md12 sm12 xs12"
                >
                    <v-data-table
                            :headers="headers"
                            :items="clients"
                            :search="search"
                            v-model="selected"
                            item-key="id"
                            @click:row="edit"
                    >
                        <template slot="items" slot-scope="props">
                            <tr >
                                <td >{{ props.item.name }}</td>
                                <td>{{ props.item.status }}</td>
                                <td>{{ props.item.createTimestamp }}</td>
                                <td>{{ props.item.updateTimestamp }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                </app-card>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import router from '../../router'

    export default {
        name: "Clients",
        data() {
            return {
                loader: true,
                search: "",
                selected: [],
                headers: [
                    {
                        text: "Name",
                        align: "left",
                        value: "name"
                    },
                    { text: "Status", value: "status" },
                  { text: "Created Om", value: "createTimestamp" },
                    { text: "Updated On", value: "updateTimestamp" }
                ],
                items: []
            };
        },
        mounted() {
            this.searchClients();
        },
        methods: {
            ...mapActions('clients', ['getClients']),
            add(){
                this.$router.push({ name: 'addClient' });
            },
            edit(selectedItem){
                router.push({ name: 'editClient', params: { clientid: selectedItem.id } })
            },
            searchClients(){
                this.getClients();
            }
        },
        computed: {
            ...mapGetters('clients', ['clients'])
        }
    }
</script>

<style scoped>

</style>