export default {

    timesheets: state => {
        return state.timesheets;
    },
    isTimesheetOperationPending: state =>
        state.timesheetOperationPending,
    getCurrentTimesheet: state => {
        return state.currentTimesheet;
    },

}
