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
	var user []models.User
	err := h.db.Select(&user, "SELECT * FROM users WHERE username=$1",username)
	fmt.Println(err)
	return user[0], err
}

func (h *UserRepository) CheckLogin(u models.User) (models.User, error){
	var user []models.User
	err := h.db.Select(&user, "SELECT * FROM users WHERE username=$1 AND password=$2",u.Username,u.Password)
	fmt.Println(err)
	return user[0], err
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
	err := h.db.Select(&usernames,"select username from users where username ~ $1", username+".*")
	if err == nil{
		fmt.Println("SearchUser: ", "user found")
	} else {
		fmt.Println("SearchUser: ", err)
	}
	return usernames, err
}


