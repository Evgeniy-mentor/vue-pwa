import TimesheetsDB from '@/firebase/timesheets-db'

export default {
    /**
     * Fetch Timesheets of current loggedin user
     */
    getTimesheets: async ({ commit }, constraints) => {
        const timesheetsDB = new TimesheetsDB()

        const timesheets = await timesheetsDB.readAll(constraints)
        commit('setTimesheets', timesheets)
        return timesheets
    },

    /**
     * Create a Timesheet for current loggedin user
     */
    createTimesheet: async ({ commit }, timesheet) => {
        const timesheetsDB = new TimesheetsDB()

        commit('setTimesheetOperationPending', true)
        await timesheetsDB.create(timesheet)
        commit('setTimesheetOperationPending', false)
    },

    /**
     * Update a Project for current loggedin user
     */
    updateTimesheet: async ({ commit }, timesheet) => {
        const timesheetsDB = new TimesheetsDB()

        commit('setTimesheetOperationPending', true)
        await timesheetsDB.update(timesheet)
        commit('setTimesheetOperationPending', false)
    },

    /**
     * Find a Project for current loggedin user
     */
    findTimesheet: async ({ commit }, timesheetid) => {
        const timesheetsDB = new TimesheetsDB()

        commit('setTimesheetOperationPending', true)
        const currentTimesheet = await timesheetsDB.read(timesheetid)
        commit('setCurrentTimesheet', currentTimesheet)
        commit('setTimesheetOperationPending', false)
        return currentTimesheet;
    },
}
