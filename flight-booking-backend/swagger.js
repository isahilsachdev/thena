const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Flight Booking API',
            version: '1.0.0',
            description: 'API documentation for the Flight Booking application',
        },
        servers: [
            {
                url: 'https://thenaassignmentbackend.vercel.app/', // Update with your server URL
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
