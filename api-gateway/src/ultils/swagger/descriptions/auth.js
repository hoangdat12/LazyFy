/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Create a new account
 *     description: Creates a new user account with the provided details.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               firstName: "firstName"
 *               lastName: "lastName"
 *               email: "test12@gmail.com"
 *               password: "123456"
 *     responses:
 *       201:
 *         description: Account creation successful. Returns the newly created user details and token.
 *         content:
 *           application/json:
 *             example:
 *               message: "Create Account Success!"
 *               statusCode: 201
 *               metadata: "String message"
 *
 */

/**
 * @swagger
 * /api/v1/auth/active/account/{token}:
 *   get:
 *     summary: Activate user account
 *     description: Activates a user account using a token.
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: token
 *         in: path
 *         description: Token for activating the account
 *         required: true
 *     responses:
 *       200:
 *         description: Account activated successfully
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with the provided email and password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               email: "test1@gmail.com"
 *               password: "123456"
 *     responses:
 *       200:
 *         description: Login successful. Returns the user details and token.
 *         content:
 *           application/json:
 *             example:
 *               message: "Login success!"
 *               statusCode: 200
 *               metadata:
 *                 user:
 *                   id: 7
 *                   fullname: "Hoang Dat"
 *                   email: "test1@gmail.com"
 *                   password: "$2b$10$QDW9A1DrDNrYVhYjglsZmOaLhc1Vh0xlddzAGhTt4UOeiWTTaJwc2"
 *                   status: "inactive"
 *                   roles: "USER"
 *                   isactive: true
 *                   createdat: "2023-05-13T08:20:27.556Z"
 *                   updatedat: "2023-05-13T08:20:27.556Z"
 *                 token: "string token"
 *               options: {}
 *             headers:
 *               Set-Cookie:
 *                 example:
 *                   refresh-token: "string"
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout Account
 *     description: Logout a user account using a token.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: header
 *         name: authorization
 *         description: Access token for authentication
 *         required: true
 *       - in: header
 *         name: x-client-id
 *         description: User's ID
 *         required: true
 *     responses:
 *       200:
 *         description: Logout success
 *         content:
 *           application/json:
 *             example:
 *               message: "Logout success!"
 *               statusCode: 200
 *               metadata:
 *                 "?column?": true
 *               options: {}
 */

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Refreshes the access token using the refresh token stored in the cookie.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: cookie
 *         name: refresh-token
 *         required: true
 *         description: Refresh token stored in the cookie
 *     responses:
 *       200:
 *         description: Access token refreshed successfully. Returns the updated access token and user details.
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 id: 123456
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "johndoe@example.com"
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             headers:
 *               Set-Cookie:
 *                 example:
 *                   refresh-token: "new refresh-token"
 *       401:
 *         description: Invalid or expired refresh token. User needs to authenticate again.
 *       500:
 *         description: An error occurred while refreshing the access token.
 */

/**
 * @swagger
 * /api/v1/auth/change/password:
 *   patch:
 *     summary: Change password
 *     description: Received email to verify user's email and after handle change password
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: header
 *         name: authorization
 *         description: Access token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-client-id
 *         description: User's ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Send mail success for user who wants to change password
 *         content:
 *           application/json:
 *             example:
 *               message: "Success!"
 *               statusCode: 200
 *               metadata:
 *                 "message"
 *               options: {}
 */

/**
 * @swagger
 * /api/v1/auth/verify/email/{token}:
 *   get:
 *     summary: Verify user's email
 *     description: Verifies user's email using the provided token and handles redirection.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         description: Token for email verification
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             example:
 *               message: "Success!"
 *               statusCode: 200
 *               metadata:
 *                 {isValid: boolean}
 *               options: {}
 *
 */

/**
 * @swagger
 * /api/v1/auth/change/password/{secret}:
 *   patch:
 *     summary: Change password
 *     description: Changes user's password using the provided secret and authentication.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: secret
 *         description: Secret for password change
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: authorization
 *         description: Access token for authentication
 *         required: true
 *       - in: header
 *         name: x-client-id
 *         description: User's ID
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               olderPassword: "olderPassword"
 *               newPassword: "newPassword"
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             example:
 *               message: "Success!"
 *               statusCode: 200
 *               metadata:
 *                 { message: "Change message successfully!" }
 *               options: {}
 */
