import { Selector } from 'testcafe';

// import environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// define getLocation func
const addToWishlistBtn = Selector('[data-test="addToWishlist"]:first-of-type');
const productCard = Selector('[data-test="productCard"]:first-of-type');
const productWishlist = Selector('[data-test="productWishlist"]:first-of-type');
const rmFromWishlist = Selector('[data-test="rmFromWishlist"]');

// Define fixture
fixture('Requesting Checkout')
    .page(`${process.env.URL_TEST}`)
    .beforeEach( async t => {
        await t
            .hover(productCard)
            .click(addToWishlistBtn)
            .navigateTo(`${process.env.URL_TEST}/wishlist`);
    });

// Test case Whishlist-5
test('Whishlist-5 - Number on wishlist icon should decrease by 1 and the product is removed from Wishlist after being deleted', async (t) => {
    const productName = productWishlist.innerText;

    await t
        .setNativeDialogHandler(() => true)
        .click(rmFromWishlist)
        .expect(productWishlist.innerText).notContains(productName);
    });