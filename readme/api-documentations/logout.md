## POST /api/auth/logout


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
 *  - 204 status code
 *  - Backend will also invalidate the refreshToken cookie
 */
```

```ts
/**
 * ERROR
 *  - 401 status code <- invalid credentials (invalid Authorization header)
 *  - 409 status code <- when user has alrdy logged out
 *  - 500 status code <- internal server error
 */
type ErrorResponse = {
    statusCode: 401 | 409 | 500
    message: string
}
```
