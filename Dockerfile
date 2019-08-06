FROM golang:latest 
ENV PORT=$PORT
ADD . /app/ 
WORKDIR /app 
RUN go get golang.org/x/tools/cmd/present
CMD ["present"] 