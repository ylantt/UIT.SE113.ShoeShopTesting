import { Role, ClientFunction } from 'testcafe';
import { client } from '../utilities/createRole';

// import environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const getLocation = ClientFunction(() => document.location.href);

// Define fixture
fixture('Requesting Checkout')
    .page(`${process.env.URL_TEST}`);

// Test case Order-1
test('Order-1 - Redirect to Require Sign In page when accessing to the Checkout without Sign In', async (t) => {
    await t
        .useRole(Role.anonymous())
        .navigateTo(`${process.env.URL_TEST}/checkout`)
        .expect(getLocation()).contains(`${process.env.URL_TEST}/signInFirst`)
});

// Test case Order-2
test('Order-2 - Redirect to Product list page when accessing to the Checkout with empty cart', async (t) => {
    await t
        .useRole(client)
        .navigateTo(`${process.env.URL_TEST}/checkout`)
        .expect(getLocation()).contains(`${process.env.URL_TEST}/products`);
});