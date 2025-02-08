FROM golang:1.23-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache git

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

EXPOSE 8080

RUN go build -o go-api cmd/api/main.go

CMD ["./go-api"]
