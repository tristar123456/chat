package models

import "database/sql"

type Chat struct {
	Id string `json:"id" db:"id"`
	Username1 string `json:"username1" db:"username1"`
	Username2 string `json:"username2" db:"username2"`
}

type Message struct {
	Id 		  string `json:"id" db:"id"`
	CId	  string `json:"cid" db:"cid"`
	Frm      string `json:"frm" db:"frm"`
	Txt      string `json:"txt" db:"txt"`
	CreatedAt sql.NullTime `json:"created_at" db:"created_at"`
}

type ChatRepository interface {
	GetChatsByUsername(username string)([]Chat, error)
	GetMessagesByChat(username string, _id string)([]Message, error)
	AddMessage (username string, _id string, msg Message) (Chat, error)
}