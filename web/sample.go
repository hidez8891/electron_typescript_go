package main

import (
	"net/http"
	"time"

	"./socket"
)

func webServer(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		http.ServeFile(w, r, "view/index.html")
	} else {
		http.ServeFile(w, r, "view/"+r.URL.Path[1:])
	}
}

func setupWebSocketEvent(sk *socket.Socket) {
	go func() {
		t := time.NewTicker(1 * time.Second)
		for {
			select {
			case <-t.C:
				sk.Emit("now-time", time.Now().String())
			}
		}
	}()
}
