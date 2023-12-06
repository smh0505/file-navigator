<template>
    <div id="background">
        <div id="search-box">
            <input type="text" v-model="directory" @keypress.enter="search">
        </div>
        <Inventory :items="items" :disks="disks" :is-disks="isDisks" @open="openFolder"></Inventory>
    </div>
</template>

<script lang="ts">
import { fs } from '../wailsjs/go/models'
import Inventory from './components/Inventory.vue'
import { ListItems } from '../wailsjs/go/main/App'

export default {
    data: () => ({
        isDisks: false,
        directory: "",
        prev: "",
        items: [] as fs.Item[],
        disks: [] as fs.Disk[]
    }),
    components: { Inventory },
    methods: {
        openDirectory(directory: string) {
            ListItems(directory).then(res => {
                if (res.success) {
                    this.prev = this.directory = res.directory
                    if (!res.directory) {
                        this.isDisks = true
                        this.disks = structuredClone(res.disks)
                    } else {
                        this.isDisks = false
                        this.items = structuredClone(res.items)
                        this.items.splice(0, 0, new fs.Item({
                            name: "..",
                            isFolder: true,
                            size: 0
                        }))
                    }
                }
                else { this.directory = this.prev }
            })
        },
        openFolder(folder: string) {
            let target = this.directory
            if (folder === ".." && !target.split("\\")[1]) {
                target = ""
            } else {
                target = (target ? target + "\\" + folder : folder) + "\\"
            }
            this.openDirectory(target)
        },
        search(e: KeyboardEvent) {
            const target = e.target as HTMLElement
            target.blur()
            this.openDirectory(this.directory)
        }
    },
    mounted() {
        this.openDirectory("")
    }
}
</script>

<style lang="scss">
#background {
    width: 100vw;
    height: 100vh;
    background-color: gray;

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
