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
                    <table class="table table-condensed" >
                        <thead >

                        <tr  style="background: #EEEEEE; margin: 0px">
                            <th> Project </th>
                            <th :key="index"  v-for="(day,index) in days">{{day.dayName}}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr :key="indexProject"  v-for="(project,indexProject) in currentUserProjects">
                            <td >
                                <div style="text-align: center;margin-right: 150px">
                                {{project.name}} -  {{project.client.name}}
                                </div>
                            </td>

                              <td style="text-align: center"
                                      :key="indexDay"  v-for="(day,indexDay) in days">

                                      <v-text-field v-if="indexDay < 7 && daysMatrix.length > 0 "
                                              style="margin-top: 15px;margin-left: 10px;margin-bottom: 0px;text-align: center"
                                              type="number" min="0" max="999999"
                                                    single-line
                                                    outlined
                                              v-model="daysMatrix[indexProject][indexDay].hours"
                                                    v-on:input="calculateProjectTotal(daysMatrix[indexProject][indexDay].hours, indexProject)"
                                      />
                                  <div v-if="indexDay >= 7 && daysMatrix.length > 0 " style="text-align: right;margin-bottom: 20px">
                                      {{daysMatrix[indexProject][indexDay]}}
                                  </div>
                                  <!--
                                      <v-text-field v-if="indexDay >= 7 && daysMatrix.length > 0 "
                                                    style="margin: 5px"
                                                    type="number" min="0" max="999999"
                                                    single-line
                                                    solo
                                                    readonly
                                                    v-model="daysMatrix[indexProject][indexDay]"
                                      />
                                      -->
                                </td>
                        </tr>

                        <tr style="background: #EEEEEE; margin: 0px">
                            <td><h4>Total</h4></td>
                            <td style="text-align: right"
                                :key="index"  v-for="(dayTotal,index) in daysTotal">
                                {{dayTotal}}
                            </td>
                            <td style="text-align: right">
                                <h4>
                                {{totalTimesheet}}
                                </h4>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                    <v-btn @click="submit" color="primary" style="margin-top: 60px;margin-bottom: 40px">Save TimeSheet</v-btn>
                    <v-btn v-if="this.getCurrentUser.role === 'admin'" @click="add" color="secondaty" style="margin-top: 60px; margin-left: 10px;margin-bottom: 40px">Add Project</v-btn>
                </v-form>
            </app-card>
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
    import {mapActions, mapGetters} from "vuex";
    import moment from "moment";
    import router from "../../router";
    /* eslint-disable */
    export default {
        name: "Timesheet",
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
                days: [],
                currentUserProjects:[],
                daysMatrix:[],
                totalTimesheet: 0,
                daysTotal: [0,0,0,0,0,0,0],
                daysHashCode: '',
                startOfWeek:'',
                endOfWeek:'',
                userTimesheets: [],
                weekNavigationTypes:{
                    currentWeek: 'currentWeek',
                    nextWeek: 'nextWeek',
                    prevWeek: 'prevWeek',
                },
                dialog1: false
            };
        },
        computed: {
            ...mapGetters('users', ['users']),
            ...mapGetters('clients', ['clients']),
            ...mapGetters('projects', ['projects']),
            ...mapGetters('authentication', ['getCurrentUser'])
        },
        async mounted() {
            this.loadUserTimeSheet(this.weekNavigationTypes.currentWeek)
        },
        methods:{
            ...mapActions('projects', [
                'getProjects'
            ]),
            ...mapActions('timesheets', [
                'findTimesheet',
                'updateTimesheet',
                'createTimesheet',
                'getTimesheets'
            ]),
            loadPrevWeek(){
                this.loadUserTimeSheet(this.weekNavigationTypes.prevWeek)
            },
            loadNextWeek(){
                this.loadUserTimeSheet(this.weekNavigationTypes.nextWeek)
            },
            loadCurrentWeek(){
                this.loadUserTimeSheet(this.weekNavigationTypes.currentWeek)
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
                    ['timesheetOwner', '==',  this.getCurrentUser.email],
                    ['daysHashCode', '==', this.daysHashCode]
                ]
                this.userTimesheets = await this.getTimesheets(filterConstraints)

                this.createDaysMatrix( this.currentUserProjects, this.days)
                this.dialog1 = false;
            },
            async submit() {

                    if(this.userTimesheets.length  > 0){

                        await this.updateTimesheet({
                            id:  this.userTimesheets[0].id,
                            daysMatrix: [].concat(...this.daysMatrix) ,
                            totalTimesheet: this.totalTimesheet,
                            daysHashCode: this.daysHashCode,
                            startOfWeek : moment(this.startOfWeek.toDate(), 'MM-DD-YYYY').format('YYYY-MM-DD'),
                            endOfWeek:  moment(this.endOfWeek.toDate(), 'MM-DD-YYYY').format('YYYY-MM-DD')
                        })
                    }else {
                        await  this.createTimesheet({
                            daysMatrix: [].concat(...this.daysMatrix) ,
                            totalTimesheet: this.totalTimesheet,
                            daysHashCode: this.daysHashCode,
                            timesheetOwner: this.getCurrentUser.email,
                            startOfWeek : moment(this.startOfWeek.toDate(), 'MM-DD-YYYY').format('YYYY-MM-DD'),
                            endOfWeek:  moment(this.endOfWeek.toDate(), 'MM-DD-YYYY').format('YYYY-MM-DD')
                        })
                    }


                this.$notify({
                    group: 'foo',
                    title: 'Important message',
                    text: 'TimeSheet saved !',
                    duration: 10000
                });
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
            async loadCurrentUserProjects(){
                const filterProjectsConstraints = [
                    ['status', '==',  'enabled']
                ]
                const projects =  await this.getProjects(filterProjectsConstraints);
                const currentUser = this.getCurrentUser;
                projects.forEach((project) => {
                    if(project.projectEmployees) {
                        project.projectEmployees.forEach((projectEmployee) => {
                            if (projectEmployee.employee.id === currentUser.id) {
                                this.currentUserProjects.push(project)
                            }
                        })
                    }
                })
            },
            /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
            createDaysMatrix( projects, days){
                // Creates all lines:
                for(let i=0; i < projects.length; i++){

                    // Creates an empty line
                    this.daysMatrix.push([]);

                    for(let j=0; j < days.length; j++){
                        // Initializes:
                        this.daysMatrix[i][j] = {
                            project: projects[i],
                            day: days[j],
                            row: i,
                            col: j,
                            hours: 0,
                            total: 0,
                            totalPerDay: 0
                        };
                    }
                }

                if(this.userTimesheets.length > 0) {
                    this.userTimesheets[0].daysMatrix.forEach((dayInfo,index,array) => {

                        if( dayInfo.day !== undefined) {
                            this.daysMatrix[dayInfo.row][dayInfo.col] = {
                                project: dayInfo.project,
                                day: days[dayInfo.col],
                                row: dayInfo.row,
                                col: dayInfo.col,
                                hours: dayInfo.hours,
                                total: dayInfo.total,
                                totalPerDay: dayInfo.totalPerDay
                            }
                        }

                    });
                }
                this.calculateProjectTotal();
            },
            calculateDayTotal(){
                let total = 0
                if(this.daysMatrix.length > 0) {
                  for (let indexday= 0; indexday < this.days.length - 1; indexday++) {
                    for(let indexProject=0; indexProject < this.currentUserProjects.length; indexProject++) {

                            total += parseFloat(this.daysMatrix[indexProject][indexday].hours)
                        }
                        // this.daysMatrix[indexProject][7].total = total
                        this.daysTotal.splice(indexday, 1, total);

                        total = 0
                    }
                }
            },
            calculateProjectTotal(){
                let total = 0
                this.totalTimesheet = 0;

                if(this.daysMatrix.length > 0) {
                    for(let indexProject=0; indexProject < this.currentUserProjects.length; indexProject++) {
                        for (let indexday= 0; indexday < this.days.length - 1; indexday++) {
                          total += parseFloat(this.daysMatrix[indexProject][indexday].hours)
                            this.totalTimesheet +=  parseFloat(this.daysMatrix[indexProject][indexday].hours)
                        }
                        // this.daysMatrix[indexProject][7].total = total
                        this.daysMatrix[indexProject].splice(7, 1, total);

                        total = 0
                    }
                    this.calculateDayTotal()
                }
            },
            add(){
               router.push({ name: 'addProject' });
            },
            process(){
                router.push({ name: 'addProject' });
            },

            calculateHashCode(str){
              this.daysHashCode = str.split('').reduce((prevHash, currVal) =>
                    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);// eslint-disable-line no-bitwise
            }
        }
    }
</script>

<style scoped>
    .border-none{
        border: none;
    }

    table {
        border-collapse: collapse;
        width: 100%;    }

    tr, td { padding: 8px; }

    tr {
        border-bottom: 1px solid #ccc;
    }

    th {
        text-align: left;
    }

    @media
    only screen and (max-width: 760px),
    (min-device-width: 768px) and (max-device-width: 1024px)  {

        /* Force table to not be like tables anymore */
        table, thead, tbody, th, td, tr {
            display: block;
        }

        /* Hide table headers (but not display: none;, for accessibility) */
        thead tr {
            position: absolute;
            top: -9999px;
            left: -9999px;
        }

        tr { border: 1px solid #ccc; }

        td {
            /* Behave  like a "row" */
            border: none;
            border-bottom: 1px solid #eee;
            position: relative;
            padding-left: 50%;
        }

        td:before {
            /* Now like a table header */
            position: absolute;
            /* Top/left values mimic padding */
            top: 6px;
            left: 6px;
            width: 45%;
            padding-right: 10px;
            white-space: nowrap;
        }

        /*
        Label the data
        */
        td:nth-of-type(1):before { content: "Project"; }
        td:nth-of-type(2):before { content: "Day 1"; }
        td:nth-of-type(3):before { content: "Day 1"; }
        td:nth-of-type(4):before { content: "Day 1"; }
        td:nth-of-type(5):before { content: "Day 1"; }
        td:nth-of-type(6):before { content: "Day 1"; }
        td:nth-of-type(7):before { content: "Day 1"; }
        td:nth-of-type(8):before { content: "Day 1"; }
        td:nth-of-type(9):before { content: "Total"; }
    }
</style>