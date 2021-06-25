package controllers

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"strings"
)

func checkJwtToken(JwtSigningKey []byte, w http.ResponseWriter, r *http.Request) string {
	if r.Header.Get("Authorization") == "" {
		http.Error(w, "Please send a Authorization Token", 401)
		return ""
	}
	tokenString := strings.Fields(r.Header.Get("Authorization"))[1]

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return JwtSigningKey, nil
	})
	if token == nil {
		http.Error(w, "", 401)
		return ""
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims["iss"].(string)[1:]
	} else {
		http.Error(w, err.Error(), 403)
	}
	return ""
}
