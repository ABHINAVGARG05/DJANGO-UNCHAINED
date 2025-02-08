package db

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func DbConnection() {

	godotenv.Load()
	uri := os.Getenv("MONGO_URI")
	dbName := os.Getenv("DB_NAME")

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal("Error connecting to MongoDB:", err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal("MongoDB connection failed:", err)
	}

	DB = client.Database(dbName)

	

	log.Println("----------------------------")
	log.Println("DB Connected Successfully",dbName)
	log.Println("----------------------------")
}

func GetCollection(name string) *mongo.Collection {
	return DB.Collection(name)
}
