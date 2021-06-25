package controllers

import (
	"api/models"
	"encoding/json"
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
	_id := chi.URLParam(r, "id")
	messages, err := h.chatRepo.GetMessagesByChat(checkJwtToken(h.JwtSigningKey, w, r), _id)
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
	username := checkJwtToken(h.JwtSigningKey, w, r)
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
	chat, err := h.chatRepo.AddMessage(username, _id, msg)
	if err != nil{
		http.Error(w, err.Error(), 403)
	} else {
		if err:=json.NewEncoder(w).Encode(chat); err != nil{
			http.Error(w, err.Error(), 403)
		}
	}
	return
}

