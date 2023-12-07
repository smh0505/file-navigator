import { defineStore } from "pinia"
import { fs } from '../../wailsjs/go/models'
import { ListItems } from "../../wailsjs/go/main/App"

export interface SortingOption {
    option: 'name' | 'size' | 'time',
    reverse: boolean
}

export const useInventory = defineStore('inventory', {
    state: () => ({
        directory: "",
        dirStack: [] as string[],
        isDisks: false,
        items: [] as fs.Item[],
        disks: [] as fs.Disk[],
        sortingOption: { option: 'name', reverse: false } as SortingOption
    }),
    actions: {
        openDirectory(directory: string = "") {
            ListItems(directory).then(res => {
                if (!res.success) return 
                
                this.directory = res.directory
                this.dirStack.push(this.directory)

                this.isDisks = this.directory === ""
                if (this.isDisks) this.disks = structuredClone(res.disks)
                else this.items = sortInventory(structuredClone(res.items), selectSortingOption(this.sortingOption))
            })
        },
        sortItems(option: 'name' | 'size' | 'time' | 'reverse') {
            if (option === 'reverse') this.sortingOption.reverse = !this.sortingOption.reverse
            else this.sortingOption.option = option
            this.items = sortInventory(this.items, selectSortingOption(this.sortingOption))
        }
    }
})

const sortByNameAtoZ = (a: fs.Item, b: fs.Item) => a.name.localeCompare(b.name)
const sortByNameZtoA = (a: fs.Item, b: fs.Item) => b.name.localeCompare(a.name)
const sortBySizeIncrease = (a: fs.Item, b: fs.Item) => a.size - b.size
const sortBySizeDecrease = (a: fs.Item, b: fs.Item) => b.size - a.size
const sortByTimeOldest = (a: fs.Item, b: fs.Item) => Date.parse(a.time) - Date.parse(b.time)
const sortByTimeLatest = (a: fs.Item, b: fs.Item) => Date.parse(b.time) - Date.parse(a.time)

function sortInventory(inventory: fs.Item[], sortingAlgorithm: (a: fs.Item, b: fs.Item) => number) {
    const group = inventory.filter(item => item.name !== "..").toSorted(sortByNameAtoZ)

    const folders = group.filter(item => item.isFolder)
    const files = group.filter(item => !item.isFolder)

    return [
        new fs.Item({ name: "..", isFolder: true }),
        ...folders.toSorted(sortingAlgorithm),
        ...files.toSorted(sortingAlgorithm)
    ]
}

function selectSortingOption(option: SortingOption) {
    const options = {
        'name': option.reverse ? sortByNameZtoA : sortByNameAtoZ,
        'size': option.reverse ? sortBySizeDecrease : sortBySizeIncrease,
        'time': option.reverse ? sortByTimeOldest : sortByTimeLatest
    }
    return options[option.option]
}
