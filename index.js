const express = require('express');
const fs = require('fs');
const axios = require('axios'); // Menambahkan axios untuk membuat permintaan HTTP
const app = express();
const cors = require('cors');  // Import the cors module
const port = 5000;
app.use(cors({
    origin: '*'
}));
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
app.use(express.json());
const path = require('path');
app.get('/fetch-and-store', async (req, res) => {
    try {
        const searchTerm = "baju"; // assuming you get this from the POST request body
        const graphqlQuery = {
            "operationName": "SearchProductQueryV4",
            "variables": {
                "params": `device=desktop&navsource=home%2Chome&ob=23&page=1&q=${encodeURIComponent(searchTerm)}&related=true&rows=60&safe_search=false&scheme=https&shipping=&show_adult=false&source=search&srp_component_id=02.01.00.00&srp_page_id=&srp_page_title=&st=product&start=0&topads_bucket=true&unique_id=5b2ace58505340176430cf359e34dbc8&user_addressId=&user_cityId=176&user_districtId=2274&user_id=&user_lat=&user_long=&user_postCode=&user_warehouseId=12210375&variants=&warehouses=12210375%232h%2C0%2315m`
            },
            "query": "query SearchProductQueryV4($params: String!) {\n  ace_search_product_v4(params: $params) {\n    header {\n      totalData\n      totalDataText\n      processTime\n      responseCode\n      errorMessage\n      additionalParams\n      keywordProcess\n      componentId\n      __typename\n    }\n    data {\n      banner {\n        position\n        text\n        imageUrl\n        url\n        componentId\n        trackingOption\n        __typename\n      }\n      backendFilters\n      isQuerySafe\n      ticker {\n        text\n        query\n        typeId\n        componentId\n        trackingOption\n        __typename\n      }\n      redirection {\n        redirectUrl\n        departmentId\n        __typename\n      }\n      related {\n        position\n        trackingOption\n        relatedKeyword\n        otherRelated {\n          keyword\n          url\n          product {\n            id\n            name\n            price\n            imageUrl\n            rating\n            countReview\n            url\n            priceStr\n            wishlist\n            shop {\n              city\n              isOfficial\n              isPowerBadge\n              __typename\n            }\n            ads {\n              adsId: id\n              productClickUrl\n              productWishlistUrl\n              shopClickUrl\n              productViewUrl\n              __typename\n            }\n            badges {\n              title\n              imageUrl\n              show\n              __typename\n            }\n            ratingAverage\n            labelGroups {\n              position\n              type\n              title\n              url\n              __typename\n            }\n            componentId\n            __typename\n          }\n          componentId\n          __typename\n        }\n        __typename\n      }\n      suggestion {\n        currentKeyword\n        suggestion\n        suggestionCount\n        instead\n        insteadCount\n        query\n        text\n        componentId\n        trackingOption\n        __typename\n      }\n      products {\n        id\n        name\n        ads {\n          adsId: id\n          productClickUrl\n          productWishlistUrl\n          productViewUrl\n          __typename\n        }\n        badges {\n          title\n          imageUrl\n          show\n          __typename\n        }\n        category: departmentId\n        categoryBreadcrumb\n        categoryId\n        categoryName\n        countReview\n        customVideoURL\n        discountPercentage\n        gaKey\n        imageUrl\n        labelGroups {\n          position\n          title\n          type\n          url\n          __typename\n        }\n        originalPrice\n        price\n        priceRange\n        rating\n        ratingAverage\n        shop {\n          shopId: id\n          name\n          url\n          city\n          isOfficial\n          isPowerBadge\n          __typename\n        }\n        url\n        wishlist\n        sourceEngine: source_engine\n        __typename\n      }\n      violation {\n        headerText\n        descriptionText\n        imageURL\n        ctaURL\n        ctaApplink\n        buttonText\n        buttonType\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
        };
        const headers = {
            'Content-Type': 'application/json',
            'Origin': 'gql.tokopedia.com',
            'Accept': '*/*',
            'Content-Length': JSON.stringify(graphqlQuery).length,
            'Accept-Encoding': 'gzip, deflate, br'
        };
        const response = await axios.post('https://gql.tokopedia.com/graphql/SearchProductQueryV4', JSON.stringify(graphqlQuery), { headers })

        const products = response.data.data.ace_search_product_v4.data.products;
        // const dataFromAPI = JSON.stringify(response.data);
        // const getObject = dataFromAPI[0]['data']['ace_search_product_v4']['data']['products']

        const dynamicFileName = `data_${Date.now()}.json`;
        fs.appendFile(dynamicFileName, JSON.stringify(products, null, 2) + '\n', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                res.status(500).send('Internal server error');
            } else {
                // Read the file and send its content as a response
                fs.readFile(dynamicFileName, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading the file:', err);
                        res.status(500).send('Error reading the file');
                    } else {
                        res.json(JSON.parse(data));
                        // Delete the file after sending its content
                        fs.unlink(dynamicFileName, (err) => {
                            if (err) {
                                console.error('Error deleting the file:', err);
                            } else {
                                console.log('File deleted successfully');
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error fetching data from API:', error);
        res.status(500).send('Error fetching data from API');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
