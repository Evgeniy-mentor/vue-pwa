<template>
    <div>
        <page-title-bar></page-title-bar>
        <v-container fluid grid-list-xl py-0 style="margin-bottom: 25px">
            <app-card
                    customClasses="mb-30"
            >
                <v-form ref="form" lazy-validation>
                    <v-btn @click="searchProjects" color="secondary" style="margin: 10px">Refresh Projects</v-btn>
                    <v-btn @click="add" color="primary" style="margin: 10px">Add Project</v-btn>
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
                            :items="projects"
                            :search="search"
                            v-model="selected"
                            item-key="id"
                    >
                        <template slot="items" slot-scope="props">
                            <tr >
                                <td >{{ props.item.name }}</td>
                                <td>{{ props.item.client.name }}</td>
                                <td>{{ props.item.hours }}</td>
                                <td>{{ props.item.status }}</td>
                            </tr>
                        </template>
                        <template v-slot:item.action="{ item }">
                            <v-icon
                                    small
                                    class="mr-2"
                                    @click="edit(item)"
                            >
                                mdi-pencil
                            </v-icon>
                            <v-icon
                                    small
                                    @click="deleteItem(item)"
                            >
                                mdi-delete
                            </v-icon>
                        </template>
                    </v-data-table>
                </app-card>
            </v-layout>
        </v-container>
        <v-dialog
                v-model="dialogDeleteConfirmation"
                max-width="290"
        >
            <v-card>
                <v-card-title class="headline">Are you sure want to archive selected Project?</v-card-title>

                <v-card-text>
                    All archive projects won't be show at Timesheet screen
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                            color="green darken-1"
                            text
                            @click="dialogDeleteConfirmation = false"
                    >
                        Cancel
                    </v-btn>

                    <v-btn
                            color="red darken-1"
                            text
                            @click="archiveProject"
                    >
                        Archive Project
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import router from '../../router'

    export default {
        name: "Projects",
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
                    { text: "Client", value: "client.name" },
                    { text: "Total Hours", value: "hours" },
                    { text: "Status", value: "status" },
                    { text: 'Actions', value: 'action', sortable: false }
                ],
                items: [],
                dialogDeleteConfirmation: false,
                selectedProjectDelete:{}
            };
        },
        mounted() {
            this.searchProjects();
        },
        methods: {
            ...mapActions('projects', [
                'getProjects',
                'updateProject'
                ]
            ),
            add(){
                router.push({ name: 'addProject' });
            },
            edit(selectedItem){
                router.push({ name: 'editProject', params: { projectid: selectedItem.id } })
            },
            searchProjects(){
                this.getProjects();
            },
            deleteItem (item) {
                this.dialogDeleteConfirmation = true
                this.selectedProjectDelete = item
            },
           async archiveProject () {

                await this.updateProject({
                    id:  this.selectedProjectDelete.id,
                    status: 'archived'
                })
               this.dialogDeleteConfirmation = false
               this.searchProjects();
            }

        },
        computed: {
            ...mapGetters('projects', ['projects'])
        }
    }
</script>

<style scoped>

</style>