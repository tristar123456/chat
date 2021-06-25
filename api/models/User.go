package models

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Users []User

type UserRepository interface {
	CheckLogin(u User) (User, error)
	GetUser(username string) (User, error)
}