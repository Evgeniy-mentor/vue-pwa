
export default {
    /**
     * Get projects
     */
    projects: state => {
        return state.projects;
    },
    isProjectActionPending: state =>
        state.projectOperationPending

}
