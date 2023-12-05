package fs

import (
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/shirou/gopsutil/v3/disk"
)

type Result struct {
	Success   bool   `json:"success"`
    Directory string `json:"directory"`
	Items     []Item `json:"items"`
    Disks     []Disk `json:"disks"`
}

type Item struct {
    Name string    `json:"name"`
    IsFolder bool `json:"isFolder"`
    Size int64     `json:"size"`
    Time time.Time `json:"time"`
}

type Disk struct {
	Name string `json:"name"`
	Size uint64 `json:"size"`
    Used uint64 `json:"used"`
}

func ListItems(dir string) Result {
    var result Result
    pos := strings.TrimSpace(dir)

	if pos == "" {
        disks, _ := disk.Partitions(true)
        result.Success = true

        for _, d := range disks {
            usage, _ := disk.Usage(d.Mountpoint)
            result.Disks = append(result.Disks, Disk{
                Name: d.Mountpoint,
                Size: usage.Total,
                Used: usage.Used,
            })
        }
        return result
    }

    entries, err := os.ReadDir(pos)
    result.Success = err == nil
    if result.Success {
        result.Directory, _ = filepath.Abs(pos)

        for _, entry := range entries {
            info, _ := entry.Info()
            result.Items = append(result.Items, Item{
                Name: info.Name(),
                IsFolder: info.IsDir(),
                Size: info.Size(),
                Time: info.ModTime(),
            })
        }
    }
    return result
}
