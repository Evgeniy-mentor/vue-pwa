export default {

    setTimesheets: (state, timesheets) => (state.timesheets = timesheets),
    setTimesheetOperationPending: (state, value) =>
        (state.timesheetOperationPending = value),
    setCurrentTimesheet: (state, value) => (state.currentTimesheet = value),
}