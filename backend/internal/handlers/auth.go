package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"backend/internal/auth"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")
	// check credentials
	if err := auth.LDAPAuthenticate(username, password); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}
	// create token
	auth.Authenticate(w, username)
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	// return expired cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   "expired",
		MaxAge:  -1,
		Expires: time.Unix(0, 0),
	})
}

func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	// validate existing token
	claims, err := auth.ValidateToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	// return user
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(claims); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func RefreshHandler(w http.ResponseWriter, r *http.Request) {
	// validate existing token
	claims, err := auth.ValidateToken(r)
	if err != nil {
		http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
		return
	}

	// issue new token with extended expiration
	auth.Authenticate(w, claims.Username)
}
