<template>
    <section class="side-menu" v-if="!isClose">
        <div class="side-menu-header flex">
            <h3>Menu</h3>
            <div class="side-menu-close-btn flex" @click="closeMenu">
                <i class="fas fa-times"></i>
            </div>
        </div>
        <div class="side-menu-nav flex">
            <button class="clr-btn" @click="removeBoard">
                <i class="el-icon-delete"></i> Delete Board
            </button>
            <button class="clr-btn" @click="toggleChangeBgcMenu">
                <i class="fas fa-palette"></i> Change Background
            </button>

            <div class="background-change flex" v-if="isBackgroundMenuOpen">
                <div
                    class="background-images"
                    v-if="!isColorPickerOpen && !isImgPickerOpen"
                >
                    <img
                        @click="toggleImgPicker"
                        src="https://res.cloudinary.com/morshva/image/upload/v1607417104/pictures_ksbogz.png"
                    />
                    <h5>Photos</h5>
                </div>

                <div
                    class="background-colors"
                    v-if="!isColorPickerOpen && !isImgPickerOpen"
                >
                    <img
                        @click="toggleColorPicker"
                        src="https://res.cloudinary.com/morshva/image/upload/v1607417101/colors_jnbhzi.png"
                    />
                    <h5>Colors</h5>
                </div>
                <image-picker
                    v-if="isImgPickerOpen"
                    @setBackgroundImg="setBackgroundImg"
                />
                <color-picker v-if="isColorPickerOpen" @setBgc="setBgc" />
            </div>
        </div>
        <div class="activity-title">
            <h5><i class="fas fa-list-ul"></i> Activity Log:</h5>
        </div>
        <div class="side-activities">
            <board-activity-log
                class="activity-preview"
                :activities="board.boardActivities"
            />
        </div>
    </section>
</template>

<script>
import boardActivityLog from "@/cmps/board/board-activity-log.cmp.vue";
import imagePicker from "@/cmps/image-picker.cmp.vue";
import colorPicker from "@/cmps/color-picker.cmp.vue";
import Swal from "sweetalert2";

export default {
    props: {
        board: Object,
    },
    data() {
        return {
            isClose: false,
            isBackgroundMenuOpen: false,
            isColorPickerOpen: false,
            isImgPickerOpen: false,
        };
    },
    computed: {},
    methods: {
        async removeBoard() {
            const result = await Swal.fire({
                title: "Are you sure you want to delete this board?",
                showDenyButton: true,
                confirmButtonText: `Yes`,
                denyButtonText: `No`,
            });
            if (result.isConfirmed) {
                this.$store.dispatch({
                    type: "removeBoard",
                    boardId: this.board._id,
                });
                this.$router.push("/");
            }
        },
        closeMenu() {
            this.isClose = true;
        },
        toggleChangeBgcMenu() {
            this.isBackgroundMenuOpen = !this.isBackgroundMenuOpen;
            this.isColorPickerOpen = false;
            this.isImgPickerOpen = false;
        },
        toggleImgPicker() {
            this.isImgPickerOpen = !this.isImgPickerOpen;
        },
        toggleColorPicker() {
            this.isColorPickerOpen = !this.isColorPickerOpen;
        },
        setBgc(color) {
            this.board.style.backgroundColor = color;
            this.board.style.backgroundImgUrl = "";
            this.$store.dispatch({
                type: "updateBoard",
                board: this.board,
            });
            this.isClose = true;
        },
        setBackgroundImg(imgUrl) {
            this.board.style.backgroundImgUrl = imgUrl;
            this.board.style.backgroundColor = "";
            this.$store.dispatch({
                type: "updateBoard",
                board: this.board,
            });
            this.isClose = true;
        },
    },
    components: {
        boardActivityLog,
        imagePicker,
        colorPicker,
    },
};
</script>