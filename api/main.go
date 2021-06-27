package main

import (
	"api/controllers"
	"api/repository"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/jmoiron/sqlx"
	"log"
	"net/http"
)

//CHANGE TO STRONG KEY!
var JwtSigningKey = []byte("Hello World")

var schema=`
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    username text PRIMARY KEY,
    password text
);

CREATE TABLE IF NOT EXISTS chats (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	username1 text,
	username2 text
);

CREATE TABLE IF NOT EXISTS messages (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	cid uuid,
	frm text,
	txt text,
	created_at timestamp default current_timestamp
);
`

var test_data=`
INSERT INTO users (username, password) VALUES ('Test','t');
INSERT INTO users (username, password) VALUES ('d','o');
INSERT INTO users (username, password) VALUES ('Frank','w');
`

func main() {
	db, err := sqlx.Open("postgres", "user=postgres password=root dbname=postgres sslmode=disable")
	if err != nil {
		log.Fatalln(err)
	}

	db.MustExec(schema)
	db.Query(test_data)

	userRepository := repository.NewUserRepository(db)
	userHandler := controllers.NewUserHandler(JwtSigningKey, userRepository)

	chatRepository := repository.NewChatRepository(db)
	chatHandler := controllers.NewChatHandler(JwtSigningKey, chatRepository)

	r := chi.NewRouter()

	// Basic CORS
	// for more ideas, see: https://developer.github.com/v3/#cross-origin-resource-sharing
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	r.Post("/api/login", userHandler.Login)
	r.Put("/api/user", userHandler.AddUser)
	r.Get("/api/user", userHandler.SearchUser)
	r.Post("/api/checkauth", userHandler.CheckAuth)
	r.Get("/api/chat", chatHandler.GetAllChats)
	r.Get("/api/chat/{id}", chatHandler.GetMessagesByChat)
	r.Put("/api/chat/{id}", chatHandler.AddMessage)

	log.Fatal(http.ListenAndServe(":9000", r))
}

