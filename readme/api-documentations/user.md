## GET /api/auth/user


### Request
```ts
/**
 * Attach a `Bearer ${accessToken}` to Authorization header as part of the
 * request. The token are from the response of login & register endpoints
 */
```


### Response
```ts
/**
 * SUCESS
 *  - 200 status code
 */
type UserResponse = {
    id: number;
    email: string;
    createdAt: string;
    updatedAt: string;
}
```

```ts
/**
 * ERROR
 *  - 401 status code <- invalid credentials (invalid Authorization header)
 *  - 500 status code <- internal server error
 */
type ErrorResponse = {
    statusCode: 401 | 500
    message: string
}
```


