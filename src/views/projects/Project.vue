<template>
    <div>
        <page-title-bar></page-title-bar>
        <v-container fluid grid-list-xl py-0>
            <app-card
                    customClasses="mb-30"
            >
                <v-form v-model="form2.valid" ref="form" lazy-validation>

                        <v-row>

                            <v-col cols="12" sm="6">
                                <v-text-field
                                        v-model="form2.name"
                                        label="Project Name"
                                        :rules="[v => !!v || 'Name is required']"
                                        required
                                />
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-select
                                        label="Select a Client"
                                        v-model="form2.clientId"
                                        :items="clients"
                                        item-text="name"
                                        item-value="id"
                                        :rules="[v => !!v || 'Client is required']"
                                        required
                                />
                            </v-col>

                        </v-row>

                    <v-row>

                        <v-col cols="12" sm="6">
                            <v-text-field
                                    v-model="form2.projectId"
                                    label="Project Id "
                                    :rules="[v => !!v || 'Project Id  is required']"
                                    required
                            />
                            <v-select
                                    label="Project Type"
                                    v-model="form2.projectType"
                                    :items="projectTypes"
                                    item-text="name"
                                    item-value="id"
                                    :rules="[v => !!v || 'Client is required']"
                                    required
                            />

                            <v-radio-group v-model="form2.billableType">
                                <v-radio
                                        label="Billable"
                                        value="billable"
                                ></v-radio>
                                <v-radio
                                        label="Non-Billable"
                                        value="nonBillable"
                                ></v-radio>

                            </v-radio-group>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-textarea
                                    v-model="form2.description"
                                    label="Project Description"
                                    :rules="[v => !!v || 'Description is required']"
                                    required
                                    color="teal"
                            >
                                <template v-slot:label>
                                    <div>
                                        Project Description
                                    </div>
                                </template>
                            </v-textarea>
                        </v-col>

                    </v-row>

                    <v-row>

                        <v-col cols="4" sm="3">
                            <v-select
                                    label="Select a Employee"
                                    v-model="selectedEmployee"
                                    :items="users"
                                    item-text="displayName"
                                    name="selectedEmployee"
                                    :rules="[v => !!v || 'Employee is required']"
                                    required
                                    return-object
                            />
                        </v-col>

                        <v-col cols="4" sm="3">
                            <v-text-field
                                    v-model="laborCategory"
                                    label="Labor Category"
                            />
                        </v-col>

                        <v-col cols="4" sm="3">
                            <v-text-field
                                    v-model="billableRate"
                                    label="Billable Rate"
                                    type="number" min="0" max="999999"
                            />
                        </v-col>

                        <v-col cols="4" sm="3">
                            <v-btn @click="assignEmployee" color="secondary" style="margin: 10px">Add</v-btn>
                        </v-col>
                    </v-row>
                    <v-container fluid grid-list-xl py-0>
                        <v-layout row wrap>
                            <app-card
                                    colClasses="xl12 lg12 md12 sm12 xs12"
                            >
                                <v-data-table
                                        :headers="headers"
                                        :items="projectEmployees"
                                        item-key="id"
                                        @click:row="editEmpRow"
                                >

                                    <template v-slot:item.employee="{ item }">
                                        {{displayEmployeeName(item.employee)}}
                                    </template>
                                </v-data-table>
                            </app-card>
                        </v-layout>
                    </v-container>
                    <v-btn
                            @click="submit"
                            :disabled="!form2.valid"
                            color="success"
                            style="margin: 10px"
                    >
                        Save
                    </v-btn>

                    <v-btn @click="goProjectList" color="secondary" style="margin: 10px">Back to Projects</v-btn>
                </v-form>
            </app-card>
        </v-container>
    </div>
</template>

<script>

    import {mapActions, mapGetters} from 'vuex'
    import router from "../../router";

    export default {
        name: "Project",
        data() {
            return {
                form2: {
                    name: '',
                    status: 'enabled',
                    clientId: '',
                    projectId:'',
                    description:'',
                    valid: true,
                    select: null,
                    items: ["enabled", "disabled"],
                    checkbox: false,
                    projectType:'',
                    billableType:''
                },
                selectedclientid: null,
                selected: [],
                headers: [
                    {
                        text: "Employee",
                        align: "left",
                        value: "employee"
                    },
                    { text: "Labor Category ", value: "laborCategory" },
                    { text: "Billable Rate", value: "billableRate" }
                ],
                laborCategory: '',
                billableRate:0,
                selectedEmployee:{},
                projectEmployees:[],
                projectTypes:['T+M', 'FFP']

            };
        },
        methods:{
            ...mapActions('projects', [
                'createProject',
                'findProject',
                'updateProject'
            ]),
            ...mapActions('clients', [
                'getClients',
                'findClient'
            ]),
            ...mapActions('users', [
                'getUsers'
            ]),
            async submit() {

                if (this.$refs.form.validate() && this.projectEmployees.length > 0) {
                    const {name , status, clientId, projectId, description, projectType, billableType} = this.form2;

                    const client = await this.findClient(clientId)
                    if(this.$route.params.projectid){
                        const itemId = this.$route.params.projectid
                        await this.updateProject({
                            id: itemId,
                            name,
                            status,
                            clientId,
                            client,
                            projectId,
                            description,
                            projectEmployees: this.projectEmployees,
                            projectType,
                            billableType
                        })
                    }else {
                        await  this.createProject({
                            name,
                            status,
                            clientId,
                            client,
                            projectId,
                            description,
                            hours: 0,
                            projectEmployees: this.projectEmployees,
                            projectType,
                            billableType
                        })
                    }
                    this.$notify({
                        group: 'foo',
                        title: 'Important message',
                        text: 'Project saved !',
                        duration: 10000
                    });

                    this.$router.push({ name: 'projectList'})
                }
            },
            clear() {
                this.$refs.form.reset();
            },
            goProjectList() {
                router.push({ name: 'projectList'})
            },
            editEmpRow(selectedItem){
                console.log(selectedItem)
                // router.push({ name: 'editProject', params: { projectid: selectedItem.id } })
            },
            assignEmployee(){

                const employeeProject = {
                    laborCategory : this.laborCategory  ? this.laborCategory : '',
                    billableRate: this.billableRate ? this.billableRate : 0,
                    employee: this.selectedEmployee
                }
                this.projectEmployees.push(employeeProject);

                this.laborCategory= ''
                this.billableRate=0
                this.selectedEmployee={}


            },
            displayEmployeeName(employee){
                return employee.displayName
            }
        },
        created() {
            if (this.$route.params.projectid) {
                this.selectedid = this.$route.params.projectid
                this.findProject(this.$route.params.projectid)
                    .then(response => {
                        this.form2.name = response.name
                        this.form2.clientId = response.clientId
                        this.form2.projectId = response.projectId
                        this.form2.description = response.description
                        this.form2.status = response.status
                        this.projectEmployees = response.projectEmployees
                        this.form2.projectType = response.projectType
                        this.form2.billableType = response.billableType
                    })
                    .catch(error => {
                        console.log(error)
                    })

            }
        },
        computed: {
            ...mapGetters('users', ['users']),
            ...mapGetters('clients', ['clients'])
        },
        mounted() {
            const filterClientConstraints = [
                ['status', '==',  'enabled']
            ]
            this.getClients(filterClientConstraints);
            this.getUsers();
        }
    }
</script>

<style scoped>

</style>