## /api/game
### POST

Creates a new game as a Spy with a given password. Returns a JWT Authorized as a Spy.

#### Request

```json
{
  "password": "pass123" // The pasword that other Spies must enter.
}
```

#### Response
```json
{
  "joinToken": "dF2kxf",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnYW1lSWQiOjIsImlzU3B5Ijp0cnVlLCJpYXQiOjE1MTExMjkxNjN9.40V8ppJHoBAsOGSXc8kJRoMH2SwKGWkIm0miIy-K_6Q"
}

```

## /api/game/:joinToken
### GET

Returns the game by joinToken. If the Authorization header is provided, additional Spy fields may be returned. If the Authorization token is not provided or is invalid, the game will be returned as as a Spy response.

An Authorization header can be provided in the form `Bearer: <token>` where token is the JWT provided when joining a game. This will determine if the user is a Spy or an Agent. 

#### Response

If the user is not authorized as a Spy the following fields will be returned.

```json
{
  "isSpy": false,         // Whether the user is a spy.
  "joinToken": "ui2dfQD", // The join token of the game.
  "cards":  [             // List of cards.
    {
      "id": 23,           // ID of the card. Used for updating.
      "text": "MAIL",     // The text of the card.
      "chosen": false     // Whether the card has been chosen by an Agent.
      "team": "C"         // Team the card belongs to. Nullable. 
    },
    ...
  ]
}
```

If the user is authorized, the following fields will be returned.

```json
{
  "isSpy": true,          // Whether the user is a spy.
  "joinToken": "ui2dfQD", // The join token of the game.
  "cards":  [             // List of cards.
    {
      "id": 23,           // ID of the card. Used for updating.
      "text": "MAIL",     // The text of the card.
      "chosen": false,    // Whether a card has been chosen by an Agent.
      "team": "C",        // Team the card belongs to. 
      "revealed": false   // Whether the card has been revealed to the Agents.
    },
    ...
  ]
}
```
## /api/game/:joinToken/join
### POST

Attempts to join game by joinToken, returning a JWT that must be provided in the Authorization header in subsequent calls.

If a password is provided, it will be checked against the Spy password and the JWT will be returned with Authorization as a Spy. Otherwise the JWT will be authorized as an Agent.

### Request

```json
{
  "password": "pass123" // The password for joining the game.
}
```

### Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnYW1lSWQiOjIsImlzU3B5Ijp0cnVlLCJpYXQiOjE1MTExMjkxNjN9.40V8ppJHoBAsOGSXc8kJRoMH2SwKGWkIm0miIy-K_6Q"
}

```

## /api/game/:joinToken/action
### POST

Performs an action for a game by joinToken.