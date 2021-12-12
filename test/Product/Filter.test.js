import { debug } from 'debug';
import { Selector, Role, ClientFunction } from 'testcafe';

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const nav_product = Selector('[data-test="nav-product"]');
const submit_filter = Selector('[data-test="submit-filter"]');
const range_price = Selector('[data-test="range-price"]');
const product_item = Selector('[data-test="productCard"]');
const faEyeBtn = Selector('[data-test="fa-eye-btn"]');

const vans_brand= Selector('.form-check-label').withAttribute('for', 'vans');
const converse_brand= Selector('.form-check-label').withAttribute('for', 'converse');
const op_35= Selector('.form-check-label').withAttribute('for', 'size35');
const op_45= Selector('.form-check-label').withAttribute('for', 'size45.5');


const getLocation = ClientFunction(() => document.location.href);

fixture('Filter for products').page(process.env.URL_TEST)
//[Product-5] Display the product page with search filter tool on it
test('Display the product page with search filter tool on it',async (t) =>{
    await t
    .click(nav_product)
    .expect(getLocation()).contains(`${process.env.URL_TEST}/products`)
    
});

// [Product-6]	Searching filter for a product: Good search filter optipon
test('Unit-test-1-for-filter-Good search filter optipon',async (t) =>{
    await t.click(nav_product);
    await t.click(vans_brand);
    await t.click(op_35);
    await t.typeText(range_price, "61");
    const name = await (await Selector('[data-test="product_name"]')().innerText).indexOf('Vans');
    await t.expect(count).gt(-1)
    const price = await Selector('[data-test="product-price"]')().innerText;
    const price_t=price.split('$');
    const int_price=parseInt(price_t);
    await t.expect(int_price).lte(1000)
    await t.click(product_item);
    await t.click(faEyeBtn);
    const size = await Selector('[data-test="size_option"]')().withAttribute('value', '35');;
    await t.expect(size).gt(-1)
});

test('Unit-test-2-for-filter-Good search filter optipon',async (t) =>{
    await t.click(nav_product);
    await t.click(converse_brand);
    await t.click(op_45);
    await t.typeText(range_price, "1000");
    const name = await (await Selector('[data-test="product_name"]')().innerText).indexOf('Converse');
    await t.expect(count).gt(-1)
    const price = await Selector('[data-test="product-price"]')().innerText;
    const price_t=price.split('$');
    const int_price=parseInt(price_t);
    await t.expect(int_price).lte(1000)
    await t.click(product_item);
    await t.click(faEyeBtn);
    const size = await Selector('[data-test="size_option"]')().withAttribute('value', '45');;
    await t.expect(size).gt(-1)
});

test('Unit-test-3-for-filter-Good search filter optipon',async (t) =>{
    await t.click(nav_product);
    await t.click(op_35);
    await t.typeText(range_price, "1000");
    const price = await Selector('[data-test="product-price"]')().innerText;
    const price_t=price.split('$');
    const int_price=parseInt(price_t);
    await t.expect(int_price).lte(1000)
    await t.click(product_item);
    await t.click(faEyeBtn);
    const size = await Selector('[data-test="size_option"]')().withAttribute('value', '35');;
    await t.expect(size).gt(-1)
});

test('Unit-test-4-for-filter-Good search filter optipon',async (t) =>{
    await t.click(nav_product);
    await t.typeText(range_price, "1000");
    const price = await Selector('[data-test="product-price"]')().innerText;
    const price_t=price.split('$');
    const int_price=parseInt(price_t);
    await t.expect(int_price).lte(1000)
});

//[Product-7]	Searching filter for a product: Empty filter optipon
test('Unit-test-5-for-filter-Empty filter optipon',async (t) =>{
    await t.click(nav_product)
    await t.click(submit_filter);
    const  count = await Selector('[data-test="product_name"]')().count;
    await t.expect(count).eql(0)
});