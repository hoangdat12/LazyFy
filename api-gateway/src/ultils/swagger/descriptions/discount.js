/**
 * @swagger
 * /api/v1/discount/create:
 *   post:
 *     summary: Create new discount
 *     description: Creates a new discount.
 *     tags:
 *       - Discounts
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
 *           example:
 *             name: "name 1"
 *             description: "description"
 *             type: "fixed_amount"
 *             value: 50
 *             code: "code"
 *             start_date: "2023-06-20 13:00:00"
 *             end_date: "2023-06-20 15:00:00"
 *             max_uses: "100"
 *             shopId: "2"
 *             applies_to: "all"
 *             max_use_per_user: 1
 *     responses:
 *       '201':
 *         description: New discount created successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Create new discount successfully!"
 *               statusCode: 201
 *               metadata:
 *                 discount_name: "name 1"
 *                 discount_discription: "description"
 *                 discount_type: "fixed_amount"
 *                 discount_value: 50
 *                 discount_code: "code"
 *                 discount_start_date: "2023-06-20T06:00:00.000Z"
 *                 discount_end_date: "2023-06-20T08:00:00.000Z"
 *                 discount_max_uses: 100
 *                 discount_uses_count: 0
 *                 discount_users_used: []
 *                 discount_max_uses_per_user: 1
 *                 discount_min_order_value: null
 *                 discount_max_order_value: null
 *                 discount_shopId: "2"
 *                 discount_is_active: true
 *                 discount_applies_to: "all"
 *                 discount_product_ids: []
 *                 _id: "64915618e8d1c418fe693250"
 *                 createdAt: "2023-06-20T07:32:40.041Z"
 *                 updatedAt: "2023-06-20T07:32:40.041Z"
 *                 __v: 0
 *               options: {}
 *       '400':
 *         description: Bad request. The request is malformed or missing required data.
 *       '500':
 *         description: Internal server error. An error occurred while creating the discount.
 */

/**
 * @swagger
 * /api/v1/discount/product:
 *   get:
 *     summary: Get all discounts for product
 *     description: Retrieves all discounts for a specific product.
 *     tags:
 *       - Discounts
 *     parameters:
 *       - in: query
 *         name: shopId
 *         description: ID of the shop
 *         required: true
 *         schema:
 *           type: string
 *           example: abc123
 *       - in: query
 *         name: productId
 *         description: ID of the product
 *         required: true
 *         schema:
 *           type: string
 *           example: xyz789
 *       - in: query
 *         name: limit
 *         description: Maximum number of discounts to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *           example: 20
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: apply
 *         description: Filter discounts based on application status (null = all discounts, true = applied discounts, false = unapplied discounts)
 *         required: false
 *         schema:
 *           type: boolean
 *           example: true
 *     responses:
 *       '200':
 *         description: Success. Returns all discounts.
 *         content:
 *           application/json:
 *             example:
 *               message: "All discount for Product"
 *               statusCode: 200
 *               metadata:
 *                 listDiscountOfAdmin:
 *                   - _id: "64915618e8d1c418fe693250"
 *                     discount_name: "name 1"
 *                     discount_discription: "description"
 *                     discount_type: "fixed_amount"
 *                     discount_value: 50
 *                     discount_code: "code"
 *                     discount_applies_to: "all"
 *                 listDiscountOfShop:
 *                   - _id: "64915797e8d1c418fe693254"
 *                     discount_name: "name 1"
 *                     discount_discription: "description"
 *                     discount_type: "fixed_amount"
 *                     discount_value: 50
 *                     discount_code: "code 1"
 *                     discount_applies_to: "specific"
 *               options: {}
 *       '500':
 *         description: Internal server error. An error occurred while retrieving the discounts.
 */

/**
 * @swagger
 * /api/v1/discount/effective:
 *   get:
 *     summary: Get all effective discounts
 *     description: Retrieves all effective discounts.
 *     tags:
 *       - Discounts
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Maximum number of discounts to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *           example: 20
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: apply
 *         description: Filter discounts based on application status (null = all discounts, true = applied discounts, false = unapplied discounts)
 *         required: false
 *         schema:
 *           type: boolean
 *           example: true
 *     responses:
 *       '200':
 *         description: Success. Returns all discounts.
 *         content:
 *           application/json:
 *             example:
 *               message: "All discount for Product"
 *               statusCode: 200
 *               metadata:
 *                 listDiscountOfAdmin:
 *                   - _id: "64915618e8d1c418fe693250"
 *                     discount_name: "name 1"
 *                     discount_discription: "description"
 *                     discount_type: "fixed_amount"
 *                     discount_value: 50
 *                     discount_code: "code"
 *                     discount_applies_to: "all"
 *                 listDiscountOfShop: []
 *               options: {}
 *       '500':
 *         description: Internal server error. An error occurred while retrieving the discounts.
 */

/**
 * @swagger
 * /api/v1/discount/shop:
 *   get:
 *     summary: Get all discounts for a shop
 *     description: Retrieves all discounts for a specific shop.
 *     tags:
 *       - Discounts
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Maximum number of discounts to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *           example: 20
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shopId:
 *                 type: string
 *                 example: 123456789
 *             required:
 *               - shopId
 *     responses:
 *       '200':
 *         description: Success. Returns all discounts.
 *         content:
 *           application/json:
 *             example:
 *               message: "Discount of Shop"
 *               statusCode: 200
 *               metadata:
 *                 - _id: "64915797e8d1c418fe693254"
 *                   discount_name: "name 1"
 *                   discount_discription: "description"
 *                   discount_type: "fixed_amount"
 *                   discount_value: 50
 *                   discount_code: "code 1"
 *                   discount_start_date: "2023-06-20T07:00:00.000Z"
 *                   discount_end_date: "2023-06-20T09:00:00.000Z"
 *                   discount_max_uses: 100
 *                   discount_uses_count: 0
 *                   discount_users_used: []
 *                   discount_max_uses_per_user: 1
 *                   discount_min_order_value: null
 *                   discount_max_order_value: null
 *                   discount_is_active: true
 *                   discount_applies_to: "specific"
 *                   discount_product_ids:
 *                     - "64905bec7ae5172a5b7e8ad7"
 *                   createdAt: "2023-06-20T07:39:03.930Z"
 *                   updatedAt: "2023-06-20T07:39:03.930Z"
 *               options: {}
 *       '500':
 *         description: Internal server error. An error occurred while retrieving the discounts.
 */

/**
 * @swagger
 * /api/v1/discount/inven/save:
 *   post:
 *     summary: Save discount
 *     description: Saves a discount for a user.
 *     tags:
 *       - Discounts
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
 *               discount_code:
 *                 type: string
 *                 example: ABC123
 *             required:
 *               - discount_code
 *     responses:
 *       '200':
 *         description: Discount saved successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Save discount successfully!"
 *               statusCode: 200
 *               metadata:
 *                 _id: "64872eebcfdd111d981e8cf8"
 *                 userId: "2"
 *                 discounts:
 *                   - _id: "64915618e8d1c418fe693250"
 *                     discount_name: "name 1"
 *                     discount_discription: "description"
 *                     discount_type: "fixed_amount"
 *                     discount_value: 50
 *                     discount_code: "code"
 *                     discount_start_date: "2023-06-20T06:00:00.000Z"
 *                     discount_end_date: "2023-06-20T08:00:00.000Z"
 *                     discount_max_uses: 100
 *                     discount_uses_count: 0
 *                     discount_users_used: []
 *                     discount_max_uses_per_user: 1
 *                     discount_min_order_value: null
 *                     discount_max_order_value: null
 *                     discount_shopId: "2"
 *                     discount_is_active: true
 *                     discount_applies_to: "all"
 *                     discount_product_ids: []
 *                     createdAt: "2023-06-20T07:32:40.041Z"
 *                     updatedAt: "2023-06-20T07:32:40.041Z"
 *                     __v: 0
 *                 createdAt: "2023-06-12T14:42:51.840Z"
 *                 updatedAt: "2023-06-20T07:46:27.425Z"
 *                 __v: 1
 *               options: {}
 *       '400':
 *         description: Bad request. The request is malformed or missing required data.
 *       '500':
 *         description: Internal server error. An error occurred while saving the discount.
 */

/**
 * @swagger
 * /api/v1/discount/inven/delete:
 *   delete:
 *     summary: Delete discount from inventory
 *     description: Deletes a discount from the user's inventory.
 *     tags:
 *       - Discounts
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
 *               discount_code:
 *                 type: string
 *                 example: ABC123
 *             required:
 *               - discount_code
 *     responses:
 *       '200':
 *         description: Discount deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Delete discount from Inven successfully!"
 *               statusCode: 200
 *               metadata:
 *                 _id: "64872eebcfdd111d981e8cf8"
 *                 userId: "2"
 *                 discounts: []
 *                 createdAt: "2023-06-12T14:42:51.840Z"
 *                 updatedAt: "2023-06-20T07:48:08.944Z"
 *                 __v: 1
 *               options: {}
 *       '400':
 *         description: Bad request. The request is missing the discountId parameter.
 *       '404':
 *         description: Not found. The specified discount does not exist.
 *       '500':
 *         description: Internal server error. An error occurred while deleting the discount.
 */

/**
 * @swagger
 * /api/v1/discount/disable:
 *   patch:
 *     summary: Disable discount
 *     description: Disables a discount for a specific shop.
 *     tags:
 *       - Discounts
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
 *               discount_code:
 *                 type: string
 *                 example: ABC123
 *               shopId:
 *                 type: string
 *                 example: 123456789
 *             required:
 *               - discount_code
 *               - shopId
 *     responses:
 *       '200':
 *         description: Discount deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Delete discount from Inven successfully!"
 *               statusCode: 200
 *               metadata:
 *                "message": "Disable discount successfully!"
 *               options: {}
 *       '400':
 *         description: Bad request. The request is missing the discountId parameter.
 *       '404':
 *         description: Not found. The specified discount does not exist.
 *       '500':
 *         description: Internal server error. An error occurred while deleting the discount.
 */

/**
 * @swagger
 * /api/v1/discount/update:
 *   patch:
 *     summary: Modify discount code
 *     description: Modifies an existing discount code for a specific shop.
 *     tags:
 *       - Discounts
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
 *               shopId:
 *                 type: string
 *                 example: 123456789
 *               discount_code:
 *                 type: string
 *                 example: ABC123
 *               updatedDiscount:
 *                 example:
 *             required:
 *               - shopId
 *               - discount_code
 *               - updatedDiscount
 *             example:
 *               discount_code: "code 1"
 *               shopId: "2"
 *               updatedDiscount:
 *                 discount_start_date: "2023-06-21 20:00:00"
 *                 discount_end_date: "2023-06-21 22:00:00"
 *     responses:
 *       '200':
 *         description: Discount saved successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Update discount successfully!"
 *               statusCode: 200
 *               metadata:
 *                 _id: "64872eebcfdd111d981e8cf8"
 *                 userId: "2"
 *                 discounts:
 *                   - _id: "64915618e8d1c418fe693250"
 *                     discount_name: "name 1"
 *                     discount_discription: "description"
 *                     discount_type: "fixed_amount"
 *                     discount_value: 50
 *                     discount_code: "code"
 *                     discount_start_date: "2023-06-21T06:00:00.000Z"
 *                     discount_end_date: "2023-06-21T08:00:00.000Z"
 *                     discount_max_uses: 100
 *                     discount_uses_count: 0
 *                     discount_users_used: []
 *                     discount_max_uses_per_user: 1
 *                     discount_min_order_value: null
 *                     discount_max_order_value: null
 *                     discount_shopId: "2"
 *                     discount_is_active: true
 *                     discount_applies_to: "all"
 *                     discount_product_ids: []
 *                     createdAt: "2023-06-20T07:32:40.041Z"
 *                     updatedAt: "2023-06-20T07:32:40.041Z"
 *                     __v: 0
 *                 createdAt: "2023-06-12T14:42:51.840Z"
 *                 updatedAt: "2023-06-20T07:46:27.425Z"
 *                 __v: 1
 *               options: {}
 *       '400':
 *         description: Bad request. The request is malformed or missing required data.
 *       '500':
 *         description: Internal server error. An error occurred while saving the discount.
 */
/**
 * @swagger
 * /api/v1/discount/user/{userId}:
 *   get:
 *     summary: Get discounts of a user
 *     description: Retrieves all discounts associated with a specific user.
 *     tags:
 *       - Discounts
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User's discounts retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Discount of User"
 *               statusCode: 200
 *               metadata:
 *                 discounts:
 *                   _id: "64872eebcfdd111d981e8cf8"
 *                   userId: "2"
 *                   discounts: []
 *                   createdAt: "2023-06-12T14:42:51.840Z"
 *                   updatedAt: "2023-06-20T07:48:08.944Z"
 *                   __v: 1
 *               options: {}
 *       '404':
 *         description: User's discounts not found.
 *       '500':
 *         description: Internal server error. An error occurred while retrieving the discounts.
 */
