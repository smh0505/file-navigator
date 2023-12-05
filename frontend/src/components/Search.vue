<template>
    <div id="search-box">
        <input type="text" v-model="directory" @keypress.enter="search">
    </div>
</template>

<script lang="ts">
import { ListItems } from '../../wailsjs/go/main/App';

export default {
    data: () => ({
        directory: ""
    }),
    emits: ['return'],
    methods: {
        search(e: KeyboardEvent) {
            const target = e.target as HTMLElement
            target.blur()
            
            ListItems(this.directory)
                .then(res => {
                    this.directory = res.directory
                    this.$emit('return', res)
                })
        }
    }
}
</script>

<style lang="scss">
#search-box {
    width: calc(100% - 200px);
    height: 28px;

    input[type=text] {
        width: 100%;
        height: 100%;
        border: none;
        padding-inline: 4px;

        font: 14pt "D2Coding", sans-serif;

        &:focus {
            outline: none;
        }
    }
}
</style>
