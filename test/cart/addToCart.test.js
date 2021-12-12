import { Selector, ClientFunction } from 'testcafe';
import { client } from '../utilities/createRole';

// import environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// select elements
const addToCartBtn = Selector('[data-test="addToCartBtn"]:first-of-type',{ timeout: 10000 });
//const addToCartBtn2 = Selector('.product__item', { timeout: 10000 }).nth(1);

const cartIcon = Selector('#cart-number');
const cartProduct= Selector(".cart__product-name")
const product_quantity=Selector(".product-quantity")
const productCard = Selector('[data-test="productCard"]:first-of-type');
const product_price= Selector(".product-full-price") 
const addToWishlistBtn = Selector('[data-test="addToWishlist"]:first-of-type');
const wishlistNumberIcon = Selector('#wishlist-number');
const wishlistAddToCart=Selector('[data-test="wishlistAddToCart"]')
// Define fixture
fixture('Add to cart')
    .page(process.env.URL_TEST)

    // Test case Cart-1
test('Cart-1 - Cart empty, Add one item to the cart, Number on cart icon should increase by 1 and product exists at cart page', async (t) => {
        await t
            .hover(productCard)
            .click(addToCartBtn)
            .wait(5000)
            
            .expect(cartIcon.innerText).eql('1')

            .click(cartIcon)
            .expect(cartProduct.visible).ok();
    });

        // Test case Cart-3
test('Cart-3 - Add the same item multiple itmes and verify, Number on cart icon should increase by 2', async (t) => {
    await t
        .hover(productCard)
        .click(addToCartBtn)
        .click(addToCartBtn)
        .wait(5000)
        .navigateTo(`${process.env.URL_TEST}/cart`)
        .expect(cartIcon.innerText).eql('2')
});

    // Test case Cart-4
test('Cart-4 - Add multiple items of different types and verify, Number on cart icon should increase by 2', async (t) => {
    await t
        .hover(productCard)
        .click(addToCartBtn)
        .hover(addToCartBtn2)
        .click(addToCartBtn2)
        .navigateTo(`${process.env.URL_TEST}/cart`)
        .expect(cartIcon.innerText).eql('2')
});




  // Test case Cart-6
test('Cart-6 - Edit Quantity Validation Cart', async (t) => {
        await t
            .hover(productCard)
            .click(addToCartBtn)
            .click(cartIcon)
            .selectText(product_quantity)
            .pressKey('delete')
            .typeText(product_quantity, '5')
            .expect(cartIcon.innerText).eql('5')
            
    });



 // Test case Cart-7
 test('Cart-7 - Edit Quantity Invlidation Cart', async (t) => {
    await t
        .hover(productCard)
        .click(addToCartBtn)
        .click(cartIcon)
        .selectText(product_quantity)
        .pressKey('delete')
        .typeText(product_quantity, '*!@huong')
        .wait(10000)
        .expect(product_quantity.innerText).eql('')
        .expect(product_price.innerText).eql('$null')
});


//Wishlist 6 Function Transform to Cart
test('Whishlist-6 - Check status Wishlist and Cart after moving product from Wishlist to Cart', async (t) => {
    await t
        .hover(productCard)
        .click(addToWishlistBtn)
        .click(wishlistNumberIcon)
        .click(wishlistAddToCart)
        .wait(10000)
        .expect(cartIcon.innerText).eql('1')
        
    }); 
    