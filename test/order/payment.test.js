import { Selector, ClientFunction } from 'testcafe';
import { client } from '../utilities/createRole';

// import environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// select elements
const addToCartBtn = Selector('[data-test="addToCartBtn"]:first-of-type');
const productCard = Selector('[data-test="productCard"]:first-of-type');
const paymentBtn = Selector('[data-test="paymentBtn"]');

// define getLocation func
const getLocation = ClientFunction(() => document.location.href);

// Define fixture
fixture('Requesting Checkout')
    .page(`${process.env.URL_TEST}`)
    .beforeEach( async t => {
        await t
            .useRole(client)
            .hover(productCard)
            .click(addToCartBtn)
            .navigateTo(`${process.env.URL_TEST}/checkout`);
    });

// Test case Order-3
test('Order-3 - Accessing to Checkout page successfully after login and have items in cart', async (t) => {
    await t
        .expect(getLocation()).contains(`${process.env.URL_TEST}/checkout`)
    });

// Test case Order-4
test('Order-4 - Check Payment on delivery method', async (t) => {
    await t
        .setNativeDialogHandler(() => true)
        .click(paymentBtn)
        .expect(getLocation()).contains(`${process.env.URL_TEST}/`);
});