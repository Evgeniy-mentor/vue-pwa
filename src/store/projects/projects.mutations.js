export default {

    setProjects: (state, projects) => (state.projects = projects),
    setProjectActionPending: (state, value) =>
        (state.projectOperationPending = value),
    setCurrentProject: (state, value) => (state.currentProject = value),
}