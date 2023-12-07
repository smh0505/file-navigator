<template>
    <div id="background">
        <div id="search-box">
            <input type="text" v-model="inventory.directory" @click="selectAll" @keypress.enter="search">
        </div>
        <Inventory @open="openFolder" @start="openTarget"></Inventory>
    </div>
</template>

<script lang="ts">
import { useInventory } from './stores/Inventory'
import Inventory from './components/Inventory.vue'
import { fs } from '../wailsjs/go/models'
import { Execute } from '../wailsjs/go/main/App'

export default {
    data: () => ({
        inventory: useInventory(),
        isDisks: false,
    }),
    components: { Inventory },
    methods: {
        openTarget(target: fs.Item) {
            if (target.isFolder) this.openFolder(target.name)
            else Execute(this.inventory.directory + "\\" + target.name)
        },
        openFolder(folder: string) {
            let target = this.inventory.directory
            if (folder === ".." && !target.split("\\")[1]) {
                target = ""
            } else {
                target = (target ? target + "\\" + folder : folder) + "\\"
            }
            this.inventory.openDirectory(target)
        },
        search(e: KeyboardEvent) {
            const target = e.target as HTMLElement
            target.blur()
            this.inventory.openDirectory(this.inventory.directory)
        },
        selectAll(e: MouseEvent) {
            const target = e.target as HTMLInputElement
            target.select()
        }
    },
    mounted() {
        this.inventory.openDirectory()
    }
}
</script>

<style lang="scss">
#background {
    width: 100vw;
    height: 100vh;

    #search-box {
        width: 100%;
        height: 32px;
        border-bottom: 2px solid black;

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
}
</style>
