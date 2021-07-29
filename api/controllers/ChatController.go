package controllers

import (
	"api/models"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi"
	"net/http"
)

type ChatHandler struct {
	JwtSigningKey []byte
	chatRepo models.ChatRepository
}

func NewChatHandler(_jwt []byte, repository models.ChatRepository) *ChatHandler {
	return &ChatHandler{
		JwtSigningKey: _jwt,
		chatRepo:      repository,
	}
}

func (h *ChatHandler) GetAllChats(w http.ResponseWriter, r *http.Request) {
	chats, err := h.chatRepo.GetChatsByUsername(checkJwtToken(h.JwtSigningKey,w, r))
	if err != nil{
		http.Error(w, err.Error(), 403)
	} else {
		if err:=json.NewEncoder(w).Encode(chats); err != nil{
			http.Error(w, err.Error(), 403)
		}
	}
	return
}

func (h *ChatHandler) GetMessagesByChat(w http.ResponseWriter, r *http.Request) {
	username2 := chi.URLParam(r, "username2")
	messages, err := h.chatRepo.GetMessagesByChat(checkJwtToken(h.JwtSigningKey, w, r), username2)
	if err != nil{
		http.Error(w, err.Error(), 403)
	} else {
		if err:=json.NewEncoder(w).Encode(messages); err != nil{
			http.Error(w, err.Error(), 403)
		}
	}
	return
}
func (h *ChatHandler) AddMessage(w http.ResponseWriter, r *http.Request) {
	_id := chi.URLParam(r, "id")
	checkJwtToken(h.JwtSigningKey, w, r)
	var msg models.Message
	if r.Body == nil {
		http.Error(w, "Please send a request body", 400)
		return
	}
	err := json.NewDecoder(r.Body).Decode(&msg)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	msg.CId = _id
	chat, err := h.chatRepo.AddMessage(msg)
	if err != nil{
		http.Error(w, err.Error(), 403)
	} else {
		if err:=json.NewEncoder(w).Encode(chat); err != nil{
			http.Error(w, err.Error(), 403)
		}
	}
	return
}

func (h *ChatHandler) AddChat(w http.ResponseWriter, r *http.Request) {
	var user struct{
		Name2 string `json:"name"`
	}
	username1 := checkJwtToken(h.JwtSigningKey, w, r)
	if r.Body == nil {
		http.Error(w, "Please send a request body", 400)
		return
	}

	err := json.NewDecoder(r.Body).Decode(&user)
	fmt.Println(user.Name2)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	id, err := h.chatRepo.AddChat(username1,user.Name2)
	if id == "" {
		http.Error(w, "Conflict with other chat", 409)
	}
	if err != nil{
		http.Error(w, err.Error(), 403)
	} else {
		if err:=json.NewEncoder(w).Encode(id); err != nil{
			http.Error(w, err.Error(), 403)
		}
	}
	return
}

