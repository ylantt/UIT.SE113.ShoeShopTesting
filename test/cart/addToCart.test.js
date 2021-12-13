import { Selector, ClientFunction } from 'testcafe';
import { client } from '../utilities/createRole';

// import environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// select elements
const addToCartBtn = Selector('[data-test="addToCartBtn"]:first-of-type',{ timeout: 10000 });
//const addToCartBtn2 = Selector('.product__item', { timeout: 10000 }).nth(1);

const cartIcon = Selector('[data-test="cart-number"]');
const productCard = Selector('[data-test="productCard"]:first-of-type');
const addToWishlistBtn = Selector('[data-test="addToWishlist"]:first-of-type');
const wishlistNumberIcon = Selector('#wishlist-number');
const wishlistAddToCart=Selector('[data-test="wishlistAddToCart"]');
// Define fixture
fixture('Add to cart')
    .page(process.env.URL_TEST)

    // Test case Cart-1
test('Cart-1 - Cart empty, Add one item to the cart, Number on cart icon should increase by 1 ', async (t) => {
        await t
            .hover(productCard)
            .click(addToCartBtn)
            .wait(5000)
            .expect(cartIcon.innerText).eql('1')
    });

        // Test case Cart-3
test('Cart-3 - Add the same item multiple itmes and verify, Number on cart icon should increase by 2', async (t) => {
    await t
        .hover(productCard)
        .click(addToCartBtn)
        .wait(5000)
        .click(addToCartBtn)
        .wait(5000)
        .navigateTo(`${process.env.URL_TEST}/cart`)
        .expect(cartIcon.innerText).eql('2')
});


//Wishlist 6 Function Transform to Cart
test('Whishlist-6 - Check status Wishlist and Cart after moving product from Wishlist to Cart', async (t) => {
    await t
        .hover(productCard)
        .click(addToWishlistBtn)
        .click(wishlistNumberIcon)
        .click(wishlistAddToCart)
        .wait(5000)
        .expect(cartIcon.innerText).eql('1')
        
    }); 
    