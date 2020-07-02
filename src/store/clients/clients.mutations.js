export default {

    setClients: (state, clients) => (state.clients = clients),
    setClientActionPending: (state, value) =>
        (state.clientOperationPending = value),
    setCurrentClient: (state, value) => (state.currentClient = value),
}