package main

import (
	"os"
	"syscall"

	"./socket"
)

func setSocketAPI(soc *socket.Socket, shutdown chan os.Signal) {
	soc.On("window-all-closed", func(args ...string) {
		soc.Emit("app-quit")
		shutdown <- syscall.SIGTERM
	})
}
