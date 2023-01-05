FROM golang
EXPOSE 8080
WORKDIR /app
COPY go.mod ./
COPY go.sum ./
RUN go mod download
RUN go install golang.org/x/tools/cmd/present@latest
COPY . .
CMD [ "present", "-http", ":8080", "-notes", "-orighost", "talks.ifelse.io", "-play", "false"]