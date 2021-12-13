import { Selector } from 'testcafe';
import { admin } from '../utilities/createRole';

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const btnUpd = Selector('[data-test="btnUpd"]');

fixture('Fixture').page(`${process.env.URL_TEST}/admin/edit-product/60d09fa81e494f43901f84b3`)

const product_name = Selector('[data-test="product-name"]');
const product_cover_image = Selector('[data-test="product-cover-image"]');
const product_images = Selector('[data-test="product-images"]');
const product_description = Selector('[data-test="product-description"]');
const product_detail = Selector('[data-test="product-detail"]');
const product_size = Selector('[data-test="pro-size35"]');
const product_price = Selector('[data-test="product-price"]');
const product_category = Selector('[data-test="pro-brand-vans"]');
const product_quantity = Selector('[data-test="product-quantity"]');
const product_discount = Selector('[data-test="product-discount"]');
const product_condition = Selector('[data-test="product-condition"]');


test('EditProduct1', async t =>{
        await t
        .useRole(admin)
        .typeText(product_name,'Vans UA 1')
        .setFilesToUpload(product_cover_image,'../../public/images/palladium-sizechart.jpg')
        .setFilesToUpload(product_images, '../../public/images/red.jpg')
        .typeText(product_description,'Vans UA 1')
        .typeText(product_detail,'Vans UA 1')
        .click(product_size)
        .typeText(product_price,'10')
        .click(product_category,)
        .typeText(product_quantity,'20')
        .typeText(product_discount,'10')
        .typeText(product_condition, 'False')
        await t.click(btnUpd);
})
