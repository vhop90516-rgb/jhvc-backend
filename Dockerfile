FROM golang:1.23.0-bookworm AS builder

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .

RUN go build -v -o /run-app ./cmd/server

FROM debian:bookworm

COPY --from=builder /run-app /usr/local/bin/run-app
COPY --from=builder /usr/src/app/templates /templates

ENV PORT=8080

CMD ["run-app"]
 