import ProjectsDB from '@/firebase/projects-db'

export default {
    /**
     * Fetch Projects of current loggedin user
     */
    getProjects: async ({ rootState, commit }, constraints) => {
        const projectsDB = new ProjectsDB(rootState.authentication.user.id)

        const projects = await projectsDB.readAll(constraints)
        commit('setProjects', projects)
        return projects
    },

    /**
     * Create a Project for current loggedin user
     */
    createProject: async ({ commit, rootState }, project) => {
        const projectsDB = new ProjectsDB(rootState.authentication.user.id)

        commit('setProjectActionPending', true)
        await projectsDB.create(project)
        commit('setProjectActionPending', false)
    },

    /**
     * Update a Project for current loggedin user
     */
    updateProject: async ({ commit, rootState }, project) => {
        const projectsDB = new ProjectsDB(rootState.authentication.user.id)

        commit('setProjectActionPending', true)
        await projectsDB.update(project)
        commit('setProjectActionPending', false)
    },

    /**
     * Find a Project for current loggedin user
     */
    findProject: async ({ commit, rootState }, projectid) => {
        const projectsDB = new ProjectsDB(rootState.authentication.user.id)

        commit('setProjectActionPending', true)
        const currentProject = await projectsDB.read(projectid)
        commit('setCurrentProject', currentProject)
        commit('setProjectActionPending', false)
        return currentProject;
    },
}
