## /api/game
### POST

Creates a new game as a Spy with a given password. Returns a response with the name of the game for joining. Also sets the `connect.sid` cookie for session management.

#### Request

```json
{
  "password": "pass123" // The pasword that other Spies must enter.
}
```

#### Response
```json
{
  "name": "dF2kxf" // The name of the game for later joining.
}

```

## /api/game/:name
### GET

Returns the game by name. If the `connect.sid` token is present and valid for the game, additional Spy fields may be returned.

#### Response

If the user is not authorized as a Spy the following fields will be returned.

```json
{
  "isSpy": false,         // Whether the user is a spy.
  "name": "ui2dfQD",      // The join token of the game.
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
  "name": "ui2dfQD",      // The join token of the game.
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
## /api/game/:name/join
### POST

Attempts to join game by name, setting the `connect.sid` cookie for session management.

### Request

```json
{
  "password": "pass123" // The password for joining the game.
}
```

### Response
200 - OK
404 - Not Found

## /api/game/:name/action
### POST

Performs an action for a game by name.

Action can be either `select` for an Agent to select a card, or `reveal` for a Spy to reveal it. The user must be authorized as a Spy to reveal.

### Request

```json
{
  "action": "select", // The action to peform.
  "cardId": 23        // The card to perform the action on.
}
```

### Response

200 - OK  
403 - Permission Denied