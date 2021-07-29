package repository

import (
	"api/models"
	"fmt"
	"github.com/jmoiron/sqlx"

	_ "github.com/lib/pq"
)

type UserRepository struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) *UserRepository{
	return &UserRepository{
		db: db,
	}
}

func (h *UserRepository) GetUser(username string) (models.User, error){
	var users []models.User
	var user models.User
	err := h.db.Select(&users, "SELECT * FROM users WHERE username=$1",username)
	if len(users) == 1{
	    user = users[0]
		fmt.Println("GetUser: User found!")
		return user, err
	} else{
	    return user,err
	}
}

func (h *UserRepository) CheckLogin(u models.User) (models.User, error){
	var users []models.User
	err := h.db.Select(&users, "SELECT * FROM users WHERE username=$1 AND password=$2",u.Username,u.Password)
	var user models.User
	if len(users) == 1{
		user = users[0]
		fmt.Println("CheckLogin: TRUE")
		return user, err
	} else {
		fmt.Println("CheckLogin: FALSE")
		return user, fmt.Errorf("CheckLogin: FALSE")
	}
}

func (h *UserRepository) AddUser(u *models.User) (models.User, error){
	var user models.User
	rows, err := h.db.NamedQuery("INSERT INTO users (username, password) VALUES (:username, :password) RETURNING username,password", u)
	if rows != nil{
		rows.Next()
		err = rows.StructScan(&user)
	}
	if err == nil{
		fmt.Println("AddUser: ", user.Username)
	} else {
		fmt.Println("AddUser: ", err)
	}
	return user, err
}

func (h *UserRepository) SearchUser(username string) ([]string, error){
	var usernames []string
	err := h.db.Select(&usernames,"select username from users where username ~ $1" ,username+".*")
	if err == nil && len(usernames) >= 1{
		fmt.Println("SearchUser: user found")
	    return usernames, err
	} else {
		return usernames, fmt.Errorf("SearchUser: user not found!")
	}
}


