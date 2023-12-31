package main

import (
	"filenav/fs"
	"context"

    "github.com/skratchdot/open-golang/open"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) ListItems(dir string) fs.Result {
    return fs.ListItems(dir)
}

func (a *App)Execute(dir string) {
    open.Start(dir)
}
