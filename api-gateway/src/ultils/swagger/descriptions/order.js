/*
    CHECKOUT
*/

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Perform checkout review
 *     description: Retrieves the review of the checkout process, including order details and pricing information.
 *     tags:
 *       - Order
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
 *             example:
 *               cartId: "cart123"
 *               shop_orders:
 *                 - shopId: "shop1"
 *                   products:
 *                     - productId: "product1"
 *                       quantity: 2
 *                     - productId: "product2"
 *                       quantity: 1
 *                   discountOfShop: "SHOP10"
 *               discountApply: "USER15"
 *     responses:
 *       200:
 *         description: Successful operation. Returns the checkout review details.
 *         content:
 *           application/json:
 *             schema:
 *             example:
 *               message: "Checkout"
 *               statusCode: 200
 *               metadata:
 *                 checkout_order:
 *                   totalPrice: 10
 *                   feeShip: 0
 *                   totalDiscount: 0
 *                   totalCheckout: 10
 *                 shop_orders_new:
 *                   - productId: "64872b24d4dec7b59ba562c3"
 *                     shopId: "17"
 *                     quantity: 1
 *                   - productId: "64872b33d4dec7b59ba562c7"
 *                     shopId: "17"
 *                     quantity: 1
 *                 shop_orders:
 *                   - shopId: "17"
 *                     products:
 *                       - productId: "64872b24d4dec7b59ba562c3"
 *                         quantity: 1
 *                         discount: null
 *                       - productId: "64872b33d4dec7b59ba562c7"
 *                         quantity: 1
 *                         discount: null
 *                     discountOfShop: null
 *                 discountCodes:
 *                   - null
 *               options: {}
 */

/*
    ORDER
*/
/**
 * @swagger
 * /:
 *   post:
 *     summary: Place a new order
 *     description: Creates a new order based on the provided user, cart, and order details.
 *     tags:
 *       - Order
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
 *             example:
 *               cartId: "648c5cb86a34cb15127f9e9f"
 *               shop_orders:
 *                 - shopId: "17"
 *                   products:
 *                     - productId: "64872b24d4dec7b59ba562c3"
 *                       quantity: 1
 *                       discount: null
 *                     - productId: "64872b33d4dec7b59ba562c7"
 *                       quantity: 1
 *                       discount: null
 *                   discountOfShop: null
 *               discountApply: "code"
 *     responses:
 *       200:
 *         description: Successful operation. Returns the newly created order details.
 *         content:
 *           application/json:
 *             schema:
 *             example:
 *               message: "Checkout"
 *               statusCode: 200
 *               metadata:
 *                 order_user_id: 7
 *                 order_checkout:
 *                   totalPrice: 10
 *                   feeShip: 0
 *                   totalDiscount: 0
 *                   totalCheckout: 10
 *                 order_products:
 *                   - productId: "64872b24d4dec7b59ba562c3"
 *                     shopId: "17"
 *                     quantity: 1
 *                   - productId: "64872b33d4dec7b59ba562c7"
 *                     shopId: "17"
 *                     quantity: 1
 *                 order_status: "pending"
 *                 _id: "648d7a16c8f0cc43a8a4459b"
 *                 createdAt: "2023-06-17T09:17:10.220Z"
 *                 updatedAt: "2023-06-17T09:17:10.220Z"
 *                 __v: 0
 *               options: {}
 */
