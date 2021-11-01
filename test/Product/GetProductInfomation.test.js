import { Selector, Role } from 'testcafe';

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const product_item = Selector('[data-test="product_item"]');
const faEyeBtn = Selector('[data-test="fa-eye-btn"]');


fixture('Fixture').page(process.env.URL_TEST)

test('display',async (t) => {
        const  product_name = await Selector('[data-test="product_name"]')().innerText;
        await t.click(product_item);
        await t.click(faEyeBtn);
        const string = await Selector('[data-test="name_detail"]')().innerText;
        await t.expect(product_name).eql(string);
});