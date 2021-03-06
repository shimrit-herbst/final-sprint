
<template>
    <section class="list-container flex">
        <div class="list-header flex f-center">
            <h4
                class="list-title flex"
                contenteditable="true"
                @keypress.enter.prevent="updateListTitle"
                @blur="updateListTitle"
            >
                {{ list.title }}
            </h4>

            <div class="list-open-menu flex" @click="toggleOpenListMenu">
                <i class="el-icon-more"></i>
            </div>
            <list-menu
                v-if="isMenuOpen"
                :list="list"
                @closeListMenu="closeListMenu"
            />
        </div>

        <div class="list-cards">
            <!-- <list-menu
            v-if="isMenuOpen"
            :list="list"
            @closeListMenu="closeListMenu"
        /> -->

            <Container
                :non-drag-area-selector="pauseDrag"
                group-name="list"
                @drop="(dropResult) => onDrop(dropResult)"
                :get-child-payload="getCardPayload(list.id)"
                :animation-duration="350"
            >
                <Draggable v-for="card in list.cards" :key="card.id">
                    <router-link :to="`list/${list.id}/card/${card.id}`" append>
                        <card-preview
                            class="drag-component"
                            v-bind:style="{
                                backgroundColor: card.style.bgColor,
                            }"
                            :card="card"
                            @removeCard="removeCard"
                            @updateCard="onUpdateBoard"
                        />
                    </router-link>
                </Draggable>
            </Container>
        </div>

        <div class="add-card-container">
            <button
                class="add-another-card-button clr-btn"
                v-if="!isNew"
                @click="onOpenNewCard"
            >
                + Add another card
            </button>
            <div class="add-card-button-inside clr-btn flex" v-else>
                <input
                    type="text"
                    v-model="newCardTitle"
                    placeholder="Enter a title for this card..."
                    @keyup.enter="addCard"
                />
                <div class="add-card-inside-cont flex">
                    <button class="add-card-btn clr-btn" @click="addCard">
                        Add card
                    </button>
                    <button class="clr-btn" @click="onCloseNewCard">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { Container, Draggable } from "vue-smooth-dnd";
import { utilService } from "../../services/util-service.js";
import cardPreview from "../card/card-preview.cmp";
import listMenu from "../list/list-menu.cmp";
import Swal from "sweetalert2";

const mediaQuery = window.matchMedia("(max-width: 770px)");
export default {
    props: {
        board: Object,
        list: Object,
        lists: Array,
        index: Number,
    },
    data() {
        return {
            isNew: false,
            newCardTitle: "",
            isMenuOpen: false,
            preventDrag: false,
        };
    },
    computed: {
        pauseDrag() {
            if (this.preventDrag) {
                return ".drag-component";
            } else {
                return "";
            }
        },
    },
    methods: {
        toggleOpenListMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        closeListMenu() {
            this.isMenuOpen = false;
        },
        onDrop(dropResult) {
            this.list.cards = utilService.applyDrag(
                this.list.cards,
                dropResult
            );
            // let updtBoard = JSON.parse(JSON.stringify(this.board));
            this.$store.dispatch({ type: "updateBoard", board: this.board });
        },
        getCardPayload(listId) {
            return (index) => {
                return this.lists.filter((p) => p.id === listId)[0].cards[
                    index
                ];
            };
        },
        onOpenNewCard() {
            this.isNew = true;
        },
        onCloseNewCard() {
            this.isNew = false;
        },
        updateListTitle(ev) {
            if (this.list.title === ev.target.innerText) return;
            if (!ev.target.innerText) {
                ev.target.innerText = this.list.title;
                return;
            }
            this.list.title = ev.target.innerText;
            ev.target.blur();
            this.$store.dispatch({
                type: "updateList",
                list: this.list,
            });
        },
        addCard() {
            this.$store.dispatch({
                type: "addCard",
                cardTitle: this.newCardTitle,
                listId: this.list.id,
            });
            this.isNew = false;
            this.newCardTitle = "";
        },
        async removeCard(cardId) {
            const result = await Swal.fire({
                title: "Are you sure you want to delete this card?",
                showDenyButton: true,
                confirmButtonText: `Yes`,
                denyButtonText: `No`,
            });
            if (result.isConfirmed) {
                this.$store.dispatch({
                    type: "removeCard",
                    cardId,
                    listId: this.list.id,
                });
                // this.$router.push(`/board/${this.board._id}`);
            }
        },
        onUpdateBoard() {
            console.log("onUpdateBoard in list.cmp");
            let updtBoard = JSON.parse(JSON.stringify(this.board));
            this.$store.dispatch({ type: "updateBoard", board: updtBoard });
        },
        onWindowWidthChange() {
            if (mediaQuery.matches) {
                console.log("onWindowWidthChange - if");
                this.preventDrag = true;
            } else {
                console.log("onWindowWidthChange - else");
                this.preventDrag = false;
            }
        },
    },
    components: {
        Container,
        Draggable,
        cardPreview,
        listMenu,
    },
    created() {
        mediaQuery.addEventListener("change", () => {
            this.onWindowWidthChange();
        });
        this.onWindowWidthChange();
    },
};
</script>