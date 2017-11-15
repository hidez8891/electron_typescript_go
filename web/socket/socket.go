package socket

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Function = func(args ...string)

type Message struct {
	Name string   `json:"name"`
	Argc int      `json:"argc"`
	Argv []string `json:"argv"`
}

var upgrader = websocket.Upgrader{}

type Socket struct {
	events map[string]Function
	msgque chan *Message
}

func NewSocket() *Socket {
	return &Socket{
		events: make(map[string]Function),
		msgque: make(chan *Message),
	}
}

func (s *Socket) On(event string, f Function) *Socket {
	s.events[event] = f
	return s
}

func (s *Socket) Emit(event string, args ...string) *Socket {
	s.msgque <- &Message{
		Name: event,
		Argc: len(args),
		Argv: args,
	}
	return s
}

func (s *Socket) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	ws, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer ws.Close()
}

func (s *Socket) sender(ws *websocket.Conn) {
	defer ws.Close()

	for {
		msg, ok := <-s.msgque
		if !ok {
			log.Println("msgque raise error")
			return
		}

		if err := ws.WriteJSON(msg); err != nil {
			log.Println(err)
			return
		}
	}
}

func (s *Socket) receiver(ws *websocket.Conn) {
	defer ws.Close()

	for {
		var msg Message
		if err := ws.ReadJSON(&msg); err != nil {
			log.Println(err)
			return
		}

		if f, ok := s.events[msg.Name]; ok {
			f(msg.Argv...)
		}
	}
}
