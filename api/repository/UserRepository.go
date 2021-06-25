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

