package repository

import (
	"api/models"
	"fmt"
	"github.com/jmoiron/sqlx"

	_ "github.com/lib/pq"
)

type ChatRepository struct {
	db *sqlx.DB
}

func NewChatRepository(db *sqlx.DB) *ChatRepository{
	return &ChatRepository{
		db: db,
	}
}

func (h *ChatRepository) GetChatsByUsername(username string) ([]models.Chat, error){
	var chats []models.Chat
	err := h.db.Select(&chats,
		"SELECT * FROM chats WHERE (username1=$1 OR username2=$1)",
		username,
		)
	fmt.Println("GetChatsByUsername: ",err)
	return chats, err
}

func (h *ChatRepository) GetMessagesByChat(username string, _id string) ([]models.Message, error){
	var chats []models.Chat
	err := h.db.Select(&chats,
		"SELECT * FROM chats WHERE (username1=$1 OR username2=$1) AND id=$2",
		username, _id,
	)
	var messages []models.Message
	if len(chats) > 1{
		fmt.Println("TOO MANY CHATS PER USER!")
	} else {
		err = h.db.Select(&messages,
			"SELECT * FROM messages WHERE cid=$1",
			chats[0].Id,
			)
	}
	fmt.Println("GetMessagesByChat: ",err)
	return messages, err
}

func (h *ChatRepository) AddMessage(username string, _id string, msg models.Message) (models.Chat, error){
	var chat models.Chat
	_, err := h.db.NamedQuery(
		"INSERT INTO messages (cid, frm, txt) VALUES (:cid, :frm, :txt)",
		&msg,
		)
	fmt.Println("AddMessage: ",err)
	return chat, err
}

