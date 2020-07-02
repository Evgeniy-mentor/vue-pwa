<template>
    <div>
        <page-title-bar></page-title-bar>
        <v-container fluid grid-list-xl py-0>
            <app-card
                    customClasses="mb-30"
            >
                <v-form v-model="form2.valid" ref="form" lazy-validation>
                    <div style="margin: 20px">
                        <v-btn small @click="loadCurrentWeek">This Week</v-btn>
                        <v-btn text icon @click="loadPrevWeek">
                            <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                        <v-btn text icon @click="loadNextWeek">
                            <v-icon>mdi-arrow-right</v-icon>
                        </v-btn>
                    </div>

                    <div style="overflow-x:auto;">

                    </div>
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
                            :items="reportItems"
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
                    </v-data-table>
                </app-card>
            </v-layout>
        </v-container>
        <v-dialog
                v-model="dialog1"
                hide-overlay
                persistent
                width="300"
        >
            <v-card
                    color="primary"
                    dark
            >
                <v-card-text>
                    Please stand by
                    <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import moment from "moment";
    /* eslint-disable */
    export default {
        name: "Reports",
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
                    checkbox: false
                },
                dialog1: false,
                weekNavigationTypes:{
                    currentWeek: 'currentWeek',
                    nextWeek: 'nextWeek',
                    prevWeek: 'prevWeek',
                },
                headers: [
                    {
                        text: "Customer",
                        align: "left",
                        value: "customer"
                    },
                    { text: "Project ID", value: "projectId" },
                    { text: "Project Name", value: "projectName" },
                    { text: "Labor Category", value: "laborCategory" },
                    { text: 'Hourly Rate', value: 'hourlyRate'},
                    { text: 'Hours', value: 'hours'},
                    { text: 'Total', value: 'total'}
                ],
                reportItems: [],
                days: [],
                currentUserProjects:[],
                daysMatrix:[],
                totalTimesheet: 0,
                daysTotal: [0,0,0,0,0,0,0],
                daysHashCode: '',
                startOfWeek:'',
                endOfWeek:'',
                userTimesheets: []
            };
        },
        methods:{

            loadPrevWeek(){
                this.loadUserTimeSheet(this.weekNavigationTypes.prevWeek)
            },
            loadNextWeek(){
                this.loadUserTimeSheet(this.weekNavigationTypes.nextWeek)
            },
            loadCurrentWeek(){
                this.loadUserTimeSheet(this.weekNavigationTypes.currentWeek)
            },
            calculateHashCode(str){
                this.daysHashCode = str.split('').reduce((prevHash, currVal) =>
                    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);// eslint-disable-line no-bitwise
            },
            populateWeekDays(weekNavigation){
                if(weekNavigation === this.weekNavigationTypes.currentWeek) {
                    this.startOfWeek = moment().startOf('isoWeek');
                    this.endOfWeek = moment().endOf('isoWeek');
                } else if(weekNavigation === this.weekNavigationTypes.prevWeek) {
                    this.startOfWeek = moment(this.startOfWeek).subtract(1, 'weeks').startOf('isoWeek');
                    this.endOfWeek =   moment(this.endOfWeek).subtract(1, 'weeks').endOf('isoWeek')
                } else if(weekNavigation === this.weekNavigationTypes.nextWeek) {
                    this.startOfWeek = moment(this.startOfWeek).add(1, 'weeks').startOf('isoWeek')
                    this.endOfWeek =  moment(this.endOfWeek).add(1, 'weeks').endOf('isoWeek')
                }

                let day = this.startOfWeek;
                let dayStringForHashCode = '';

                while (day <= this.endOfWeek) {
                    this.days.push({
                            dayName: moment(day.toDate(), 'MM-DD-YYYY').format('MMMM D'),
                            total: 0
                        }
                    );
                    day = day.clone().add(1, 'd');
                    dayStringForHashCode = dayStringForHashCode + moment(day.toDate(), 'MM-DD-YYYY').format('MM-DD-YYYY');
                }
                this.days.push({
                        dayName: 'Total',
                        total: 0
                    }
                );
                this.calculateHashCode(dayStringForHashCode);
            },
            async loadUserTimeSheet(weekNavigation){
                this.dialog1 = true;
                this.days= []
                this.currentUserProjects=[]
                this.daysMatrix=[]
                this.totalTimesheet= 0
                this.daysTotal= [0,0,0,0,0,0,0]
                this.daysHashCode= ''
                this.userTimesheets= []

                this.populateWeekDays(weekNavigation);
                await this.loadCurrentUserProjects();
                const filterConstraints = [
                    ['daysHashCode', '==', this.daysHashCode]
                ]
                this.userTimesheets = await this.getTimesheets(filterConstraints)

                this.dialog1 = false;
            }
        }
    }
</script>

<style scoped>

</style>