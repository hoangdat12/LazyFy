/**
 * @swagger
 * /api/v1/product/create:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product based on the provided data.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: header
 *         name: user
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: authorization
 *         description: Access token for authentication
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *                 description: Name of the product
 *               product_thumb:
 *                 type: string
 *                 description: Thumbnail of the product
 *               product_description:
 *                 type: string
 *                 description: Description of the product
 *               product_shop:
 *                 type: string
 *                 description: Shop ID
 *               product_price:
 *                 type: number
 *                 description: Price of the product
 *               product_quantity:
 *                 type: integer
 *                 description: Quantity of the product
 *               product_type:
 *                 type: string
 *                 description: Type of the product
 *               product_attributes:
 *                 type: object
 *                 properties:
 *                   brand:
 *                     type: string
 *                     description: Brand of the product
 *                   size:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Size options for the product
 *                   meterial:
 *                     type: string
 *                     description: Material of the product
 *             example:
 *               product_name: "Product 1"
 *               product_thumb: "product_thumb 1"
 *               product_description: "HRadleyD"
 *               product_shop: "7"
 *               product_price: 5
 *               product_quantity: 100
 *               product_type: "Clothing"
 *               product_attributes:
 *                 brand: "brand"
 *                 size: ["S", "M", "L", "XL"]
 *                 meterial: "material"
 *     responses:
 *       '200':
 *         description: Example response
 *         content:
 *           application/json:
 *             example:
 *               message: "Create Product Success!"
 *               statusCode: 201
 *               metadata:
 *                 product_name: "Product 1"
 *                 product_thumb: "product_thumb 1"
 *                 product_description: "HRadleyD"
 *                 product_price: 5
 *                 product_quantity: 100
 *                 product_type: "Clothing"
 *                 product_shop: "7"
 *                 product_attributes:
 *                   brand: "brand"
 *                   size:
 *                     - "S"
 *                     - "M"
 *                     - "L"
 *                     - "XL"
 *                   meterial: "meterial"
 *                 product_ratingAverage: 4.5
 *                 product_variation: []
 *                 isDraft: true
 *                 isPublished: false
 *                 product_images: []
 *                 _id: "649055b010a547834d70309e"
 *                 createdAt: "2023-06-19T13:18:40.337Z"
 *                 updatedAt: "2023-06-19T13:18:40.337Z"
 *                 product_slug: "product-1"
 *                 __v: 0
 *               options: {}
 */

/**
 * @swagger
 * /api/v1/product/drafts/{shopId}:
 *   get:
 *     summary: Get all draft products for a shop
 *     description: Retrieves all draft products for the specified shop.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: header
 *         name: authorization
 *         description: Access token for authentication
 *         required: true
 *       - in: header
 *         name: x-client-id
 *         description: User's ID
 *         required: true
 *       - in: query
 *         name: limit
 *         description: The maximum number of draft products to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         description: The page number of draft products to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *       - in: path
 *         name: shopId
 *         description: ID of shop
 *         required: true
 *         schema:
 *           type: string
 *           example: abc123
 *     responses:
 *       '200':
 *         description: Example response
 *         content:
 *           application/json:
 *             example:
 *               message: "Get List Publish success!"
 *               statusCode: 200
 *               metadata:
 *                 - _id: "64872b24d4dec7b59ba562c3"
 *                   product_name: "Product 2"
 *                   product_thumb: "product_thumb 1"
 *                   product_description: "HRadleyD"
 *                   product_price: 5
 *                   product_quantity: 100
 *                   product_type: "Clothing"
 *                   product_shop: "18"
 *                   product_attributes:
 *                     brand: "brand"
 *                     size:
 *                       - "S"
 *                       - "M"
 *                       - "L"
 *                       - "XL"
 *                     meterial: "meterial"
 *                   product_ratingAverage: 4.5
 *                   product_variation: []
 *                   product_images: []
 *                   createdAt: "2023-06-12T14:26:44.151Z"
 *                   updatedAt: "2023-06-12T14:26:44.151Z"
 *                   product_slug: "product-2"
 *                   __v: 0
 *               options: {}
 */
/**
 * @swagger
 * /api/v1/product/publish:
 *   post:
 *     summary: Publish product for a shop
 *     description: Publishes a product for the specified shop.
 *     tags:
 *       - Products
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
 *               productId:
 *                 type: string
 *                 description: ID of the product to be published
 *           example:
 *             productId: "12345"
 *     responses:
 *       '200':
 *         description: Example response
 *         content:
 *           application/json:
 *             example:
 *               message: "Publish product success!"
 *               statusCode: 200
 *               metadata:
 *                 _id: "64905bec7ae5172a5b7e8ad7"
 *                 product_name: "Product 1"
 *                 product_thumb: "product_thumb 1"
 *                 product_description: "HRadleyD"
 *                 product_price: 5
 *                 product_quantity: 100
 *                 product_type: "Clothing"
 *                 product_shop: "2"
 *                 product_attributes:
 *                   brand: "brand"
 *                   size:
 *                     - "S"
 *                     - "M"
 *                     - "L"
 *                     - "XL"
 *                   meterial: "meterial"
 *                 product_ratingAverage: 4.5
 *                 product_variation: []
 *                 product_images: []
 *                 createdAt: "2023-06-19T13:45:16.556Z"
 *                 updatedAt: "2023-06-19T13:48:34.627Z"
 *                 product_slug: "product-1"
 *                 __v: 0
 *               options: {}
 */

/**
 * @swagger
 * /api/v1/product/un-publish:
 *   post:
 *     summary: Unpublish product for a shop
 *     description: Unpublishes a product for the specified shop.
 *     tags:
 *       - Products
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
 *               productId:
 *                 type: string
 *                 description: ID of the product to be unpublished
 *           example:
 *             productId: "12345"
 *     responses:
 *       '200':
 *         description: Example response
 *         content:
 *           application/json:
 *             example:
 *               message: "UnPublish product success!"
 *               statusCode: 200
 *               metadata:
 *                 _id: "64905bec7ae5172a5b7e8ad7"
 *                 product_name: "Product 1"
 *                 product_thumb: "product_thumb 1"
 *                 product_description: "HRadleyD"
 *                 product_price: 5
 *                 product_quantity: 100
 *                 product_type: "Clothing"
 *                 product_shop: "2"
 *                 product_attributes:
 *                   brand: "brand"
 *                   size:
 *                     - "S"
 *                     - "M"
 *                     - "L"
 *                     - "XL"
 *                   meterial: "meterial"
 *                 product_ratingAverage: 4.5
 *                 product_variation: []
 *                 product_images: []
 *                 createdAt: "2023-06-19T13:45:16.556Z"
 *                 updatedAt: "2023-06-19T13:48:34.627Z"
 *                 product_slug: "product-1"
 *                 __v: 0
 *               options: {}
 */

/**
 * @swagger
 * /api/v1/product/publish/{shopId}:
 *   get:
 *     summary: Get all published products for a shop
 *     description: Retrieves all the published products for the specified shop.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: header
 *         name: authorization
 *         description: Access token for authentication
 *         required: true
 *       - in: header
 *         name: x-client-id
 *         description: User's ID
 *         required: true
 *       - in: query
 *         name: limit
 *         description: Maximum number of products to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 20
 *       - in: query
 *         name: page
 *         description: Page number of the results
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: path
 *         name: shopId
 *         description: ID of shop
 *         required: true
 *         schema:
 *           type: string
 *           example: abc123
 *     responses:
 *       '200':
 *         description: Example response
 *         content:
 *           application/json:
 *             example:
 *               message: "Get List Publish success!"
 *               statusCode: 200
 *               metadata:
 *                 - _id: "64872b24d4dec7b59ba562c3"
 *                   product_name: "Product 2"
 *                   product_thumb: "product_thumb 1"
 *                   product_description: "HRadleyD"
 *                   product_price: 5
 *                   product_quantity: 100
 *                   product_type: "Clothing"
 *                   product_shop: "18"
 *                   product_attributes:
 *                     brand: "brand"
 *                     size:
 *                       - "S"
 *                       - "M"
 *                       - "L"
 *                       - "XL"
 *                     meterial: "meterial"
 *                   product_ratingAverage: 4.5
 *                   product_variation: []
 *                   product_images: []
 *                   createdAt: "2023-06-12T14:26:44.151Z"
 *                   updatedAt: "2023-06-12T14:26:44.151Z"
 *                   product_slug: "product-2"
 *                   __v: 0
 *               options: {}
 */

/**
 * @swagger
 * /api/v1/product/search:
 *   get:
 *     summary: Search products by keyword
 *     description: Searches products based on the provided keyword.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Keyword to search for products
 *         required: true
 *         schema:
 *           type: string
 *           example: "keyword"
 *     responses:
 *       '200':
 *         description: Example response
 *         content:
 *           application/json:
 *             example:
 *               message: "List product for search!"
 *               statusCode: 200
 *               metadata:
 *                 - _id: "64905bec7ae5172a5b7e8ad7"
 *                   product_name: "Product 1"
 *                   product_thumb: "product_thumb 1"
 *                   product_description: "HRadleyD"
 *                   product_price: 5
 *                   product_quantity: 100
 *                   product_type: "Clothing"
 *                   product_shop: "2"
 *                   product_attributes:
 *                     brand: "brand"
 *                     size:
 *                       - "S"
 *                       - "M"
 *                       - "L"
 *                       - "XL"
 *                     meterial: "meterial"
 *                   product_ratingAverage: 4.5
 *                   product_variation: []
 *                   product_images: []
 *                   createdAt: "2023-06-19T13:45:16.556Z"
 *                   updatedAt: "2023-06-19T13:49:42.587Z"
 *                   product_slug: "product-1"
 *                   __v: 0
 *                   score: 0.75
 *               options: {}
 */

/**
 * @swagger
 * /api/v1/product/pagination:
 *   get:
 *     summary: Get all products with pagination
 *     description: Retrieves all products with pagination.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: limit
 *         description: Maximum number of products per page
 *         required: false
 *         schema:
 *           type: number
 *           example: 20
 *       - in: query
 *         name: sort
 *         description: Sorting option for products
 *         required: false
 *         schema:
 *           type: string
 *           example: name:asc
 *     responses:
 *       '200':
 *         description: Example response
 *         content:
 *           application/json:
 *             example:
 *               message: "Get products success!"
 *               statusCode: 200
 *               metadata:
 *                 products:
 *                   - _id: "64905bec7ae5172a5b7e8ad7"
 *                     product_name: "Product 1"
 *                     product_thumb: "product_thumb 1"
 *                     product_price: 5
 *                     product_quantity: 100
 *                     product_shop: "2"
 *                 page: "1"
 *               options: {}
 */

/**
 * @swagger
 * /api/v1/product/{productId}:
 *   get:
 *     summary: Get product detail
 *     description: Retrieves the detail of a specific product.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: productId
 *         description: ID of the product to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           example: abc123
 *     responses:
 *       '200':
 *         description: Example response
 *         content:
 *           application/json:
 *             example:
 *               message: "Detail product"
 *               statusCode: 200
 *               metadata:
 *                 _id: "64905bec7ae5172a5b7e8ad7"
 *                 product_name: "Product 1"
 *                 product_thumb: "product_thumb 1"
 *                 product_description: "HRadleyD"
 *                 product_price: 5
 *                 product_quantity: 100
 *                 product_type: "Clothing"
 *                 product_shop: "2"
 *                 product_attributes:
 *                   brand: "brand"
 *                   size:
 *                     - "S"
 *                     - "M"
 *                     - "L"
 *                     - "XL"
 *                   meterial: "meterial"
 *                 product_ratingAverage: 4.5
 *                 product_variation: []
 *                 product_images: []
 *                 createdAt: "2023-06-19T13:45:16.556Z"
 *                 updatedAt: "2023-06-19T13:49:42.587Z"
 *                 product_slug: "product-1"
 *                 __v: 0
 *               options: {}
 */

/**
 * @swagger
 * /api/v1/product/{productId}:
 *   patch:
 *     summary: Update product of shop
 *     description: Updates the details of a specific product belonging to a shop.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: productId
 *         description: ID of the product to update
 *         required: true
 *         schema:
 *           type: string
 *           example: abc123
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
 *           example:
 *             product_type: "Clothing"
 *             product_name: "product Update name"
 *             product_attributes:
 *               brand: "Viet Nam 123"
 *     responses:
 *       '200':
 *         description: Updated product success
 *         content:
 *           application/json:
 *             example:
 *               message: "Updated product success!"
 *               statusCode: 200
 *               metadata:
 *                 _id: "64905bec7ae5172a5b7e8ad7"
 *                 product_name: "product Update name"
 *                 product_thumb: "product_thumb 1"
 *                 product_description: "HRadleyD"
 *                 product_price: 5
 *                 product_quantity: 100
 *                 product_type: "Clothing"
 *                 product_shop: "2"
 *                 product_attributes:
 *                   brand: "Viet Nam 123"
 *                   size:
 *                     - "S"
 *                     - "M"
 *                     - "L"
 *                     - "XL"
 *                   meterial: "meterial"
 *                 product_ratingAverage: 4.5
 *                 product_variation: []
 *                 product_images: []
 *                 createdAt: "2023-06-19T13:45:16.556Z"
 *                 updatedAt: "2023-06-19T13:58:02.987Z"
 *                 product_slug: "product-1"
 *                 __v: 0
 *               options: {}
 */
