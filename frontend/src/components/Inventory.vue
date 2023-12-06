<template>
    <div id="inventory">
        <ul>
            <li class="disk" v-if="isDisks" v-for="disk in disks" :key="disk.name" @click="$emit('open', disk.name)">
                <div :style="paintDisk(disk)">
                    <span>{{ disk.name }}</span>
                    <span>{{ computeSize(disk.used) }} / {{ computeSize(disk.size) }}</span>
                </div>
            </li>
            <li class="file" v-else v-for="item in items" :key="item.name" @click="openTarget(item)">
                <span>{{ item.name }}</span>
                <span>{{ item.isFolder ? "" : computeSize(item.size) }}</span>
                <span>{{ item.name === ".." ? "" : new Date(item.time).toLocaleString() }}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { fs } from '../../wailsjs/go/models'

export default {
    props: {
        items: {
            type: Array<fs.Item>,
            required: true
        },
        disks: {
            type: Array<fs.Disk>,
            required: true
        },
        isDisks: {
            type: Boolean,
            required: true
        }
    },
    emits: ['open'],
    methods: {
        computeSize(size: number) {
            if (size === 0) { return `0 Bytes` }

            const k = 1024
            const units = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

            const i = Math.floor(Math.log(size) / Math.log(k))
            return `${(size / Math.pow(k, i)).toFixed(2)} ${units[i]}`
        },
        paintDisk(disk: fs.Disk) {
            const colors = ['skyblue', 'yellowgreen', 'yellow', 'orange', 'salmon']
            const percent = disk.used / disk.size
            const index = Math.floor(percent * 5)

            return {
                'background-color': colors[index],
                width: `${percent * 100}%`
            }
        },
        openTarget(target: fs.Item) {
            if (target.isFolder) {
                this.$emit('open', target.name)
            }
        }
    }
}
</script>

<style lang="scss">
#inventory {
    width: 100vw;
    height: calc(100% - 32px);
    overflow: auto;

    ul { margin: 4px; }
    li {
        font: 14pt "EASTARJET-Medium", sans-serif;
        background-color: white;
        border: 4px solid black;
        margin-block: 6px;

        &.disk {
            position: relative;
            height: 40px;

            div {
                height: 100%;
                padding-block: 4px;
                padding-inline: 8px;

                >:first-child { position: absolute; }
                >:last-child {
                    text-align: right;
                    position: absolute;
                    right: 12px;
                }
            }
        }

        &.file {
            display: grid;
            grid-template-columns: 60% 14% 26%;

            padding-block: 4px;
            padding-inline: 8px;

            >:nth-child(1) { 
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap; 
            }
            >:nth-child(2) { text-align: right; }
            >:nth-child(3) { text-align: right; }
        }
    }
}
</style>
