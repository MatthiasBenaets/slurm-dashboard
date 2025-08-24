package main

import (
	"log"
	"net/http"

	"backend/internal/config"
	"backend/internal/handlers"
)

func main() {
	config.LoadEnv()

	// api routes
	http.HandleFunc("/api/login", handlers.LoginHandler)
	http.HandleFunc("/api/logout", handlers.LogoutHandler)
	http.HandleFunc("/api/protected", handlers.ProtectedHandler)

	http.ListenAndServe(":8080", nil)
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
