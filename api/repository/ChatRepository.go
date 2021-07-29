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

func (h *ChatRepository) GetMessagesByChat(username1 string, username2 string) ([]models.Message, error){
	var chats []models.Chat
	err := h.db.Select(&chats,
		"SELECT * FROM chats WHERE (username1=$1 AND username2=$2) OR (username1=$2 AND username2=$1)",
		username1, username2,
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

func (h *ChatRepository) AddMessage(msg models.Message) (models.Chat, error){
	var chat models.Chat
	_, err := h.db.NamedQuery(
		"INSERT INTO messages (cid, frm, txt) VALUES (:cid, :frm, :txt)",
		&msg,
		)
	fmt.Println("AddMessage: ",err)
	return chat, err
}

func (h *ChatRepository) AddChat(username1 string, username2 string) (string, error){
	var id string
	var chats []models.Chat
	err := h.db.Select(&chats,
		"SELECT * FROM chats WHERE (username1=$1 AND username2=$2) OR (username1=$2 AND username2=$1)",
		username1, username2,
	)
	if len(chats) == 0 {
		_rows, _ := h.db.Queryx(
			"INSERT INTO chats (username1, username2) VALUES ($1, $2) RETURNING id",
			username1, username2,
		)
		_rows.Next()
		err = _rows.Scan(&id)
	} else {
		id = chats[0].Id
	}
	fmt.Println("AddChat: ",err)
	return id, err
}

