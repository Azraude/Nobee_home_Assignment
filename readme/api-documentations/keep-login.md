## POST /api/auth/keep-login


### Request
```ts
/**
 * If a user has registered or logged in before, they will have an httpOnly
 * refreshToken attached to this request automatically by the browser.
 */
```


### Response
```ts
/**
 * SUCESS
 *  - 200 status code
 *  - attach a new httpOnly refreshToken cookie that expires in 30 days.
 *  We use the cookie to re-login our user (on browser refresh,
 *  new tab, new window, etc.)
 */
type RegisterResponse = {
    accessToken: string
}
```

```ts
/**
 * ERROR
 *  - 401 status code <- invalid credentials (when user has not logged in or
 *  registered before, or their refreshToken cookie has expired)
 *  - 500 status code <- internal server error
 */
type ErrorResponse = {
    statusCode: 401 | 500
    message: string
}
```
