package models

type User struct {
	Username string `json:"username" db:"username"`
	Password string `json:"password" db:"password"`
}

type Users []User

type UserRepository interface {
	CheckLogin(u User) (User, error)
	GetUser(username string) (User, error)
	AddUser(u *User) (User, error)
	SearchUser(username string) ([]string, error)
}