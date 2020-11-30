import HttpService from './http-service'
// import { utilService } from '@/services/util-service.js';

export const boardService = {
    getBoards,
    getBoardById,
    addBoard,
    removeBoard,
    updateBoard,
    getEmptyCard,
    getEmptyList
}

function getBoards() {
    return HttpService.get('board')
}
function getBoardById(boardId) {
    return HttpService.get(`board/${boardId}`)
}

function addBoard() {
    const board = {
        // _id: new ObjectID(''),
        title: "New board",
        style: {"backgroundColor": "blue"},
        createdBy: _getCreatedBy(),
        members: [_getCreatedBy()],
        createdAt: Date.now(),
        lists: [
            {
                // _id: new ObjectID(''),
                title: "New list",
                cards: [{
                    // _id: new ObjectID(''),
                    title: "New card",
                    description: "",
                    createdAt: Date.now(),
                    style: {"bgColor": "#C1C1C1"},
                    createdBy: _getCreatedBy(),
                    members: [],
                    labels: [],
                    comments: [],
                }],
                // push the member
            }]
    }
    console.log(board);
    return HttpService.post('board', board)
}


function removeBoard(boardId) {
    return HttpService.delete(`board/${boardId}`)
}

function updateBoard(board) {
    return HttpService.put(`board/${board._id}`, board)
}

function getEmptyCard(title = '') {
    const card = {
        // _id: new ObjectID(''),
        title,
        createdAt: Date.now(),
        dueDate: null,
        description: '',
        uploadImgUrl: '',
        style: {
            bgColor: '#C1C1C1'
        },
        createdBy: _getCreatedBy(),
        members: [_getCreatedBy()],
    }
    return card;
}

function getEmptyList(title = '') {
    const list = {
        // _id: new ObjectID(''),
        title,
        cards: []
    }
    return list;
}

// TODO implement when login is ready
function _getCreatedBy() {
    return {
        id: 'u103',
        fullname: 'Shimrit Herbst',
        imgUrl: 'https://res.cloudinary.com/shimrit/image/upload/v1606511397/cardella/shimrit_idcy9l.jpg',
    };
}