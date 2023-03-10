## POST /api/auth/register


### Request
```ts
type PostData = {
    email: string
    password: string
}
```


### Response
```ts
/**
 * SUCESS
 *  - 200 status code
 *  - attach a httpOnly refreshToken cookie that expires in 30 days. We use
 *  the cookie to re-login our user (on browser refresh,
 *  new tab, new window, etc.)
 */
type RegisterResponse = {
    accessToken: string
}
```

```ts
/**
 * ERROR
 *  - 422 status code <- failed email or password validation
 *  - 500 status code <- internal server error
 */
type ErrorResponse = {
    statusCode: 422 | 500
    message: string
}
```
