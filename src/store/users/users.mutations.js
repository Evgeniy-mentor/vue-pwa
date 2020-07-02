export default {

    setUsers: (state, users) => (state.users = users),
    setUserActionPending: (state, value) =>
        (state.userOperationPending = value)
}