import ClientsDB from '@/firebase/clients-db'

export default {
    /**
     * Fetch clients of current loggedin user
     */
    getClients: async ({ rootState, commit }, constraints) => {
        const clientsDb = new ClientsDB(rootState.authentication.user.id)

        const clients = await clientsDb.readAll(constraints)
        commit('setClients', clients)
    },

    /**
     * Create a client for current loggedin user
     */
    createClient: async ({ commit, rootState }, client) => {
        const clientsDb = new ClientsDB(rootState.authentication.user.id)

        commit('setClientActionPending', true)
        await clientsDb.create(client)
        commit('setClientActionPending', false)
    },

    /**
     * Update a client for current loggedin user
     */
    updateClient: async ({ commit, rootState }, client) => {
        const clientsDb = new ClientsDB(rootState.authentication.user.id)

        commit('setClientActionPending', true)
        await clientsDb.update(client)
        commit('setClientActionPending', false)
    },

    /**
     * Find a client for current loggedin user
     */
    findClient: async ({ commit, rootState }, clientid) => {
        const clientsDb = new ClientsDB(rootState.authentication.user.id)

        commit('setClientActionPending', true)
        const currentClient = await clientsDb.read(clientid)
        commit('setCurrentClient', currentClient)
        commit('setClientActionPending', false)
        return currentClient;
    },
}
