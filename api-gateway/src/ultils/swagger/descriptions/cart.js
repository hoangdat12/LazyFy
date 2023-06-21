/**
 * @swagger
 * /api/v1/cart/:
 *   post:
 *     summary: Add product to cart
 *     description: Adds a product to the user's cart.
 *     tags:
 *       - Cart
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
 *             schema:
 *               product:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                     description: Product ID
 *                   olderQuantity:
 *                     type: number
 *                     description: Previous quantity of the product in the cart
 *                   quantity:
 *                     type: number
 *                     description: New quantity of the product to be added
 *                   shopId:
 *                     type: string
 *                     description: Shop ID
 *                   name:
 *                     type: string
 *                     description: Product name
 *                   price:
 *                     type: number
 *                     description: Product price
 *             example:
 *               product:
 *                 productId: "789012"
 *                 olderQuantity: 2
 *                 quantity: 5
 *                 shopId: "345678"
 *                 name: "Product Name"
 *                 price: 10.99
 *     responses:
 *       '200':
 *         description: Add cart success
 *         content:
 *           application/json:
 *             example:
 *               message: "Add cart success!"
 *               statusCode: 200
 *               metadata:
 *                 _id: "649066e7f98dfb92a4cfec55"
 *                 cart_state: "active"
 *                 cart_user_id: "2"
 *                 __v: 0
 *                 cart_count_products: 1
 *                 cart_products:
 *                   - productId: "64905bec7ae5172a5b7e8ad7"
 *                     product_shop: "2"
 *                     quantity: 1
 *                 createdOn: "2023-06-19T14:32:07.149Z"
 *                 modifieOn: "2023-06-19T14:32:07.149Z"
 *               options: {}
 */

/**
 * @swagger
 * /api/v1/cart/delete/{productId}:
 *   delete:
 *     summary: Delete product from cart
 *     description: Deletes a product from the user's cart.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: productId
 *         description: ID of the product to be deleted from the cart
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
 *     responses:
 *       '200':
 *         description: Delete product from cart success
 *         content:
 *           application/json:
 *             example:
 *               message: "Delete product from cart success!"
 *               statusCode: 200
 *               metadata:
 *                 _id: "649066e7f98dfb92a4cfec55"
 *                 cart_state: "active"
 *                 cart_user_id: "2"
 *                 __v: 0
 *                 cart_count_products: 1
 *                 cart_products: []
 *                 createdOn: "2023-06-19T14:32:07.149Z"
 *                 modifieOn: "2023-06-19T14:48:15.736Z"
 *               options: {}
 */

/**
 * @swagger
 * /api/v1/cart/delete-multi:
 *   delete:
 *     summary: Delete multiple products from cart
 *     description: Deletes multiple products from the user's cart.
 *     tags:
 *       - Cart
 *     parameters:
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
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of product IDs to be deleted from the cart
 *             example:
 *               productIds: ["123456", "789012"]
 *     responses:
 *       '200':
 *         description: Products deleted from the cart successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Delete product from cart success!"
 *               statusCode: 200
 *               metadata:
 *                  true
 *               options: {}
 */
/**
 * @swagger
 * /api/v1/cart/update/quantity:
 *   patch:
 *     summary: Update quantity in cart
 *     description: Updates the quantity of items in the user's cart.
 *     tags:
 *       - Cart
 *     parameters:
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
 *           example:
 *             item_product:
 *               productId: "64905bec7ae5172a5b7e8ad7"
 *               shopId: "2"
 *               new_quantity: 5
 *               older_quantity: 1
 *     responses:
 *       '200':
 *         description: Cart quantity updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Update cart success!"
 *               statusCode: 200
 *               metadata:
 *                 _id: "649066e7f98dfb92a4cfec55"
 *                 cart_state: "active"
 *                 cart_user_id: "2"
 *                 __v: 0
 *                 cart_count_products: 1
 *                 cart_products:
 *                   - productId: "64905bec7ae5172a5b7e8ad7"
 *                     product_shop: "2"
 *                     quantity: 5
 *                 createdOn: "2023-06-19T14:32:07.149Z"
 *                 modifieOn: "2023-06-20T06:18:14.835Z"
 *               options: {}
 *       '500':
 *         description: Internal server error. An error occurred while updating the cart quantity.
 */

/**
 * @swagger
 * /api/v1/cart/{userId}:
 *   get:
 *     summary: Get cart
 *     description: Retrieves the user's cart.
 *     tags:
 *       - Cart
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
 *       '200':
 *         description: Add product to cart success
 *         content:
 *           application/json:
 *             example:
 *               message: "Success!"
 *               statusCode: 200
 *               metadata:
 *                 _id: "649066e7f98dfb92a4cfec55"
 *                 cart_state: "active"
 *                 cart_user_id: "2"
 *                 __v: 0
 *                 cart_count_products: 2
 *                 cart_products:
 *                   - productId: "64905bec7ae5172a5b7e8ad7"
 *                     product_shop: "2"
 *                     quantity: 1
 *                 createdOn: "2023-06-19T14:32:07.149Z"
 *                 modifieOn: "2023-06-19T14:55:49.862Z"
 *               options: {}
 */
