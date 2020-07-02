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
                    <v-row>

                        <v-col cols="12" sm="3">
                            <v-alert
                                    text
                                    outlined
                                    color="deep-grey"
                            >
                                <div class="title">Total Time</div>
                                <div>{{totalTime}}</div>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <v-alert
                                    text
                                    outlined
                                    color="deep-grey"
                            >
                                <div class="title">Top Project</div>
                                <div>{{topProject}}</div>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <v-alert
                                    text
                                    outlined
                                    color="deep-grey"
                            >
                                <div class="title">Top Client</div>
                                <div>{{topClient}}</div>
                            </v-alert>
                        </v-col>
                    </v-row>
                    <br/>
                    <v-row>
                        <v-col cols="10" sm="10">
                            <v-row>
                                <v-col cols="12" sm="12">
                                    <column-chart :data="stackBarData" :stacked="true" :options="stackBarChartOptions"></column-chart>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="4" sm="4">
                                    <pie-chart :data="[['Blueberry', 44], ['Strawberry', 23]]" :donut="true"></pie-chart>
                                 </v-col>
                                <v-col cols="8" sm="8">
                                    <bar-chart :data="[['X-Small', 5], ['Small', 27]]"></bar-chart>
                                </v-col>
                            </v-row>

                        </v-col>
                        <v-col cols="2" sm="2">
                            <table width="100%">
                                <tr>
                                    <td>
                                        <v-alert
                                                text
                                                outlined
                                                color="deep-grey"
                                        >
                                            <div class="title">Week Billable Hours</div>
                                        </v-alert>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <v-alert
                                                text
                                                outlined
                                                color="white"
                                        >
                                            <div class="title">Top Client</div>
                                            <div>{{topClient}}</div>
                                        </v-alert>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <v-alert
                                                text
                                                outlined
                                                color="deep-grey"
                                        >
                                            <div class="title">YTD Billable Hours</div>
                                        </v-alert>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <v-alert
                                                text
                                                outlined
                                                color="white"
                                        >
                                            <div class="title">Top Client</div>
                                            <div>{{topClient}}</div>
                                        </v-alert>
                                    </td>
                                </tr>
                            </table>
                        </v-col>
                    </v-row>
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
    export default {
        name: "Dashboard",
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
                totalTime: 0,
                topProject: 'Test ',
                topClient: ' Test',
                stackBarData: [
                    {
                        name: "Fantasy & Sci Fi",
                        data: [["2010", 10], ["2020", 16], ["2030", 28]]
                    },
                    {
                        name: "Romance",
                        data: [["2010", 24], ["2020", 22], ["2030", 19]]
                    },
                    {
                        name: "Mystery/Crime",
                        data: [["2010", 20], ["2020", 23], ["2030", 29]]
                    }
                ],
                stackBarChartOptions: {
                    scales: {
                        xAxes: [{ stacked: true }],
                        yAxes: [{ stacked: true }]
                    }
                }
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
            async loadUserTimeSheet(){
                this.dialog1 = true;

                this.dialog1 = false;
            }
        }
    }
</script>

<style scoped>

</style>