import HttpService from './http-service'
import { utilService } from '@/services/util-service.js';

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
        title: "New board",
        style: {"backgroundColor": "blue"},
        createdBy: _getCreatedBy(),
        members: [_getCreatedBy()],
        createdAt: Date.now(),
        lists: [
            {
                id: utilService.makeId(),
                title: "New list",
                cards: [{
                    id: utilService.makeId(),
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
        id: utilService.makeId(),
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
        labels: []
    }
    return card;
}

function getEmptyList(title = '') {
    const list = {
        id: utilService.makeId(),
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