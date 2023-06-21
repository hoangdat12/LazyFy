/**
 * @swagger
 * /api/v1/inventory/:
 *   patch:
 *     summary: Increase quantity in inventory
 *     description: Increases the quantity of a product in the inventory.
 *     tags:
 *       - Inventory
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
 *             productId: "64905bec7ae5172a5b7e8ad7"
 *             shopId: "2"
 *             quantity: 100
 *     responses:
 *       '200':
 *         description: Inventory created or updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Create success!"
 *               statusCode: 200
 *               metadata:
 *                 inven_product_id: "64905bec7ae5172a5b7e8ad7"
 *                 inven_stock: 100
 *               options: {}
 *       '400':
 *         description: Bad request. The request is malformed or missing required data.
 *       '500':
 *         description: Internal server error. An error occurred while creating or updating the inventory.
 */
