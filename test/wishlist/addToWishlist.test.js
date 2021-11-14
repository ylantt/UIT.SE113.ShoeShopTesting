import { Selector } from 'testcafe';
import { client } from '../utilities/createRole';

// import environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// define getLocation func
const addToWishlistBtn = Selector('[data-test="addToWishlist"]:first-of-type');
const wishlistIcon = Selector('[data-test="wishlistIcon"]');
const productCard = Selector('[data-test="productCard"]:first-of-type');
const productWishlist = Selector('[data-test="productWishlist"]:first-of-type');

// Define fixture
fixture('Requesting Checkout')
    .page(`${process.env.URL_TEST}`)

// Test case Whishlist-1
test('Whishlist-1 - Number on wishlist icon should increase by 1 and the product exists in Wishlist page after add product to wishlist', async (t) => {
    await t
        .hover(productCard)
        .click(addToWishlistBtn)
        .expect(wishlistIcon.innerText).eql('1')
        .navigateTo(`${process.env.URL_TEST}/wishlist`)
        .expect(productWishlist.visible).ok();
    });
    
// Test case Whishlist-2
test('Whishlist-2 - Number on wishlist icon should be 1 after click addToWishlist mutiple times on the same product', async (t) => {
    await t
        .hover(productCard)
        .click(addToWishlistBtn)
        .click(addToWishlistBtn)
        .click(addToWishlistBtn)
        .expect(wishlistIcon.innerText).eql('1')
    });
    
// Test case Whishlist-3
test('Whishlist-3 - Should have no items in Wishlist page when does not add any products to Wishlist', async (t) => {
    await t
        .navigateTo(`${process.env.URL_TEST}/wishlist`)
        .expect(productWishlist.visible).notOk();
    });
    
// Test case Whishlist-4
test('Whishlist-4 - Products are remain in Wishlist after login and refresh the page', async (t) => {
    await t
        .hover(productCard)
        .click(addToWishlistBtn)
        .useRole(client)
        .expect(wishlistIcon.innerText).eql('1')
        .navigateTo(`${process.env.URL_TEST}/wishlist`)
        .expect(productWishlist.visible).ok();
    });