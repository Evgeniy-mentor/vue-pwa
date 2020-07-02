import UsersDB from '@/firebase/users-db'

export default {
    /**
     * Fetch clients of current loggedin user
     */
    getUsers: async ({ commit }) => {
        const usersDB = new UsersDB()

        const users = await usersDB.readAll()
        commit('setUsers', users)
    },
}
