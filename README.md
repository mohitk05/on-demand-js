# on-demand-js

Execute JavaScript functions on the fly.

## API

### POST `/create-function/:name`
Create a new function.

```
POST /create-function/add
Body: {
    "function": "function({ a, b }) {return a + b}"
}
```

### POST `/execute/:name`
Execute an existing function.

```
POST /execute/add
Body: {
    "context": {
        "a": 1,
        "b": 2
    }
}

Response: {
    "result": 3
}
```

