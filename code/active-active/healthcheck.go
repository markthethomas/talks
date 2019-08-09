// START 1 OMIT
package main

// import modules we use...
import (
	"encoding/json"
	"os"
	"time"

	"floqars/shared"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"gopkg.in/underarmour/dynago.v2"
)

// HealthCheckReply is the health check reply body
type HealthCheckReply struct {
	Region string    `json:"region"`
	Time   time.Time `json:"time"`
}

// END 1 OMIT

// START 2 OMIT
func checker() (events.APIGatewayProxyResponse, error) {
	// get region from env
	reg := os.Getenv("AWS_REGION")
	// query dynamo and handle error
	res, err := shared.DAL.GetItem("region-health", dynago.HashKey("region", reg)).Execute()
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, err
	}
	// are we up?
	up := res.Item.GetBool("healthy")
	if !up {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	// END 2 OMIT
	// START 3 OMIT
	// create body for reply...
	body := HealthCheckReply{
		Region: reg,
		Time:   time.Now().UTC(),
	}
	// handle serialization error
	b, err := json.Marshal(body)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, err
	}
	// reply!
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(b),
	}, nil
}
func main() {
	// connect to DB
	shared.Connect()
	// run lambda
	lambda.Start(checker)
}

// END 3 OMIT
