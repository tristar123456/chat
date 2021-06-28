package controllers

import (
	"api/models"
	"encoding/json"
	"github.com/dgrijalva/jwt-go"
	"net/http"
)


type UserHandler struct {
	JwtSigningKey []byte
	userRepo models.UserRepository
}

func NewUserHandler(_jwt []byte, repository models.UserRepository) *UserHandler {
	return &UserHandler{
		JwtSigningKey: _jwt,
		userRepo: repository,
	}
}

func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	// READING BODY
	var u models.User
	if r.Body == nil {
		http.Error(w, "Please send a request body", 400)
		return
	}
	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	// Check if User exists and Password is right
	u, err = h.userRepo.CheckLogin(u)
	if err != nil {
		http.Error(w, "Wrong Username or Password!", 401)
		return
	}

	// Generating an JWT token
	claims := jwt.StandardClaims{
		Issuer: "_" + u.Username,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	responseJwt, err := token.SignedString(h.JwtSigningKey)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	json.NewEncoder(w).Encode(responseJwt)
	return
}

func (h *UserHandler) CheckAuth(w http.ResponseWriter, r *http.Request) {
	u, err := h.userRepo.GetUser(checkJwtToken(h.JwtSigningKey,w, r))
	if err != nil{
		http.Error(w, err.Error(), 400)
	} else{
		json.NewEncoder(w).Encode(u.Username)
	}
	return
}

func (h *UserHandler) AddUser(w http.ResponseWriter, r *http.Request) {
	//READING BODY
	var u models.User
	if r.Body == nil {
		http.Error(w, "Please send a request body", 400)
		return
	}
	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	//ADD USER ENTRY
	u, err = h.userRepo.AddUser(&u)
	if err != nil{
		http.Error(w, "Username already taken", 409)
	} else{
		json.NewEncoder(w).Encode(u.Username)
	}
	return
}

func (h *UserHandler) SearchUser(w http.ResponseWriter, r *http.Request) {
	_, err := h.userRepo.GetUser(checkJwtToken(h.JwtSigningKey,w, r))
	//READING BODY
	if r.Body == nil  || err != nil{
		http.Error(w, "Please send a request body", 400)
		return
	}
	var s models.SearchString
	err = json.NewDecoder(r.Body).Decode(&s)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	//GET USER ENTRY
	usernames, err := h.userRepo.SearchUser(s.Search)
	if err != nil{
		http.Error(w, "No User found", 404)
	} else{
		json.NewEncoder(w).Encode(usernames)
	}
	return
}

