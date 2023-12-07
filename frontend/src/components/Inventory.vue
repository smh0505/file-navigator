<template>
    <div id="inventory">
        <div v-if="!inventory.isDisks" id="remote-sort">
            <button @click="inventory.sortItems('reverse')">Reverse</button>
            <button @click="inventory.sortItems('name')">Name</button>
            <button @click="inventory.sortItems('size')">Size</button>
            <button @click="inventory.sortItems('time')">Time</button>
        </div>
        <ul v-if="inventory.isDisks">
            <li v-for="disk in inventory.disks" :key="disk.name" @dblclick="$emit('open', disk.name)">
                <div :style="paintDisk(disk)">
                    <span>{{ disk.name }}</span>
                    <span>{{ computeSize(disk.used) }} / {{ computeSize(disk.size) }}</span>
                </div>
            </li>
        </ul>
        <table v-else>
            <tr v-for="item in inventory.items" :key="item.name" @dblclick="$emit('start', item)">
                <td><span :class="drawIcons(item)"></span></td>
                <td>{{ item.name }}</td>
                <td>{{ item.isFolder ? "" : computeSize(item.size) }}</td>
                <td>{{ item.name === ".." ? "" : new Date(item.time).toLocaleString() }}</td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import { fileExtension } from '@ultirequiem/file-extension'
import { useInventory, SortingOption } from '../stores/Inventory'
import { fs } from '../../wailsjs/go/models'

export default {
    data: () => ({
        inventory: useInventory(),
        index: 0,
        options: ['name', 'size', 'time'] as SortingOption["option"][]
    }),
    emits: ['open', 'start'],
    methods: {
        // Decorative
        getExtension(target: fs.Item) {
            if (target.isFolder) return "folder"
            else return fileExtension(target.name)
        },
        drawIcons(target: fs.Item) {
            return ['fiv-cla', 'fiv-icon-blank', 'fiv-icon-' + this.getExtension(target)]
        },
        computeSize(size: number) {
            if (size === 0) { return `0 Bytes` }

            const k = 1024
            const units = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

            const i = Math.floor(Math.log(size) / Math.log(k))
            return `${(size / Math.pow(k, i)).toFixed(2)} ${units[i]}`
        },
        paintDisk(disk: fs.Disk) {
            const colors = ['#0099ff', '#00cc66', '#cccc00', '#ff6600', '#ff0066']
            const percent = disk.used / disk.size
            const index = Math.floor(percent * 5)

            return {
                'background-color': colors[index],
                width: `${percent * 100}%`
            }
        }
    }
}
</script>

<style lang="scss">
#inventory {
    position: relative;
    width: 100vw;
    height: calc(100% - 32px);
    overflow: auto;
    user-select: none;

    #remote-sort {
        display: flex;
        justify-content: left;
        gap: 4px;

        button {
            padding: 4px;
            background-color: transparent;
            border: none;

            &:hover {
                background-color: #3366ff;
                color: white;
            }
        }
    }

    table {
        width: 100%;
        background-color: white;
        border-collapse: collapse;
        font: 12pt "EASTARJET-Medium", sans-serif;

        tr {
            border-bottom: 2px solid black;

            &:hover {
                background-color: #3366ff;
                color: white;
            }

            >:nth-child(1) {
                width: 20px;
                text-align: center;
            }

            >:nth-child(2) {
                max-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            >:nth-child(3) { 
                width: 120px;
                text-align: right;
            }

            >:nth-child(4) {
                width: 220px;
                text-align: right;
            }
        }
    }

    li {
        position: relative;

        height: 40px;
        border-bottom: 2px solid black;
        font: 18pt "EASTARJET-Medium", sans-serif;
        background-color: white;

        &:hover {
            background-color: #66ccff;
        }

        div {
            height: 100%;
            padding-block: 4px;
            padding-inline: 8px;
            border-radius: 0px 8px 8px 0px;

            >:first-child { position: absolute; }
            >:last-child {
                position: absolute;
                top: 3px;
                right: 8px;
                
                font-size: 12pt;
                padding: 4px;
                border: 2px solid black;
                border-radius: 8px;
                text-align: right;
                background-color: rgba(179, 179, 204, 0.85);
            }
        }
    }
}
</style>
