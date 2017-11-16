package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"./socket"
)

func main() {
	var port uint
	flag.UintVar(&port, "port", 8001, "web server port")
	flag.Parse()

	log.SetFlags(0)
	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGTERM)

	apiServer := socket.NewSocket()
	setSocketAPI(apiServer, shutdown)

	http.Handle("/api/", apiServer)
	http.HandleFunc("/", webServer)

	addr := fmt.Sprintf("localhost:%d", port)
	srv := &http.Server{Addr: addr}
	go func() {
		log.Println("web start: ", addr)
		if err := srv.ListenAndServe(); err != nil {
			log.Println(err)
		}
	}()

	for {
		s := <-shutdown
		if s == syscall.SIGTERM {
			srv.Shutdown(context.Background())
			return
		}
	}
}

func webServer(w http.ResponseWriter, r *http.Request) {
	http.Error(w, "Not Found", 404)
}
