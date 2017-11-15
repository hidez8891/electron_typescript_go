package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"./socket"
)

func main() {
	var port uint
	flag.UintVar(&port, "port", 8001, "web server port")
	flag.Parse()

	log.SetFlags(0)

	apiServer := socket.NewSocket()
	http.Handle("/api", apiServer)
	http.HandleFunc("/", webServer)

	addr := fmt.Sprintf("localhost:%d", port)
	log.Fatal(http.ListenAndServe(addr, nil))
}

func webServer(w http.ResponseWriter, r *http.Request) {
	http.Error(w, "Not Found", 404)
}
