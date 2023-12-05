<template>
    <div id="background">
        <Search @return="listItems"></Search>
        <ul v-show="isDisks">
            <li v-for="disk in disks" :key="disk.name">{{ disk.name }}</li>
        </ul>
        <ul v-show="!isDisks">
            <li v-for="item in items" :key="item.name">{{ item.name }}</li>
        </ul>
    </div>
</template>

<script lang="ts">
import { fs } from '../wailsjs/go/models';
import Search from './components/Search.vue'

export default {
    data: () => ({
        isDisks: false,
        items: [] as fs.Item[],
        disks: [] as fs.Disk[]
    }),
    components: { Search },
    methods: {
        listItems(res: fs.Result) {
            console.log(res)
            if (!res.success) return
            if (!res.directory) {
                this.isDisks = true
                this.disks = structuredClone(res.disks)
                console.log(res.disks)
            } else {
                this.isDisks = false
                this.items = structuredClone(res.items)
                console.log(res.items)
            }
        }
    }
}
</script>

<style lang="scss">
#background {
    width: 100vw;
    height: 100vh;
    background-color: gray;
}
</style>
