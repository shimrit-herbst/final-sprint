import { boardService } from '@/services/board-service.js';

export const boardStore = {
    strict: true,
    state: {
        boards: [],
        currBoard: {},
    },
    getters: {
        getCurrBoard(state) {
            return state.currBoard;
        }
    },
    mutations: {
        //BOARD//
        setCurrBoard(state, { board }) {
            state.currBoard = board;
        },
        addBoard(state, { board }) {
            state.boards.push(board);
            state.currBoard = board;
        },
        updateBoard(state, { board }) {
            const idx = state.boards.findIndex(currBoard => currBoard._id === board._id);
            state.boards.splice(idx, 1, board);
            state.currBoard = board;
        },
        // removeBoard(state, { boardId }) {
        //     const idx = state.boards.findIndex(board => board._id === boardId);
        //     state.boards.splice(idx, 1);
        // },
        //CARD//
        addCard(state, { listId, card }) {
            const listIdx = state.currBoard.lists.findIndex(list => list.id === listId);
            const cards = state.currBoard.lists[listIdx].cards;
            cards.push(card);
        },
        updateCard(state, { list, card }) {
            const listIdx = state.currBoard.lists.findIndex(currList => currList.id === list.id);
            const cardIdx = state.currBoard.lists[listIdx].cards.findIndex(currCard => currCard.id === card.id);
            const cards = state.currBoard.lists[listIdx].cards;
            cards.splice(cardIdx, 1, card);
        },
        removeCard(state, { listId, cardId }) {
            const listIdx = state.currBoard.lists.findIndex(list => list.id === listId);
            const cardIdx = state.currBoard.lists[listIdx].cards.findIndex(card => card.id === cardId);
            const cards = state.currBoard.lists[listIdx].cards;
            cards.splice(cardIdx, 1);
        },
        //LIST//
        addList(state, { list }) {
            const lists = state.currBoard.lists;
            lists.push(list);
        },
        updateList(state, { list }) {
            const listIdx = state.currBoard.lists.findIndex(currList => currList.id === list.id);
            const lists = state.currBoard.lists;
            lists.splice(listIdx, 1, list);
        },
        removeList(state, { listId }) {
            const listIdx = state.currBoard.lists.findIndex(currList => currList.id === listId);
            const lists = state.currBoard.lists;
            lists.splice(listIdx, 1);
        },
    },
    actions: {
        //BOARD//
        async loadBoard({ commit }, { boardId }) {
            const board = await boardService.getBoardById(boardId)
            commit({ type: 'setCurrBoard', board })
        },
        async updateBoard({ state }) {
            await boardService.updateBoard(state.currBoard);
        },
        async updateBoardV2({ commit, state }, { board }) {
            await boardService.updateBoard(state.currBoard);
            commit({ type: 'updateBoard', board });
        },
        //CARD//
        async addCard({ commit, state }, { listId, cardTitle }) {
            const card = boardService.getEmptyCard(cardTitle);
            commit({ type: 'addCard', listId, card })
            await boardService.updateBoard(state.currBoard);
        },
        async updateCard({ commit, state }, { list, card }) {
            commit({ type: 'setIsLoading', isLoading: true })
            commit({ type: 'updateCard', list, card });
            await boardService.updateBoard(state.currBoard);
            commit({ type: 'setIsLoading', isLoading: false })
        },
        async removeCard({ commit, state }, { listId, cardId }) {
            commit({ type: 'removeCard', listId, cardId })
            await boardService.updateBoard(state.currBoard);
        },

        //LIST//
        async addList({ commit, state }, { listTitle }) {
            const list = boardService.getEmptyList(listTitle);
            commit({ type: 'addList', list })
            await boardService.updateBoard(state.currBoard);
        },
        async updateList({ commit, state }, { list }) {
            commit({ type: 'updateList', list });
            await boardService.updateBoard(state.currBoard);
        },
        async removeList({ commit, state }, { listId }) {
            commit({ type: 'removeList', listId })
            await boardService.updateBoard(state.currBoard);
        },
    }
}