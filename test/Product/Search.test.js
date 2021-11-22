import { debug } from 'debug';
import { Selector, Role } from 'testcafe';

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const search_input = Selector('[data-test="search_input"]');
const search_icon = Selector('[data-test="search_icon"]');

//[Product-2] Show search field in navigation bar
fixture('Searching for products').page(process.env.URL_TEST)
test('Show search field in navigation bar',async (t) =>{
    await t
    .click(search_input)
    .expect(search_icon.visible).ok();

});

//[Product-3]	Searching for a product: Good search
test('Keyword is the product name',async (t) =>{
    await t.click(search_icon);
    await t.typeText(search_input,'Vans UA Era Color Theory Shale Green');
    await t.pressKey('enter');
    const  product_name = await Selector('[data-test="product_name"]')().innerText;
    await t.expect(product_name).eql('Vans UA Era Color Theory Shale Green')
});

test('Keyword is the number of series',async (t) =>{
    await t.click(search_icon);
    await t.typeText(search_input,'1970');
    await t.pressKey('enter');
    const  count = await Selector('[data-test="product_name"]')().count;
    await t.expect(count).eql(5)
});

test('Keyword is the brand name',async (t) =>{
    await t.click(search_icon);
    await t.typeText(search_input,'Converse');
    await t.pressKey('enter');
    const  count = await (await Selector('[data-test="product_name"]')().innerText).indexOf('Converse');
    await t.expect(count).gt(-1)

});

//[Product-4]	Searching for a product: Empty search
test('Keyword is tempty',async (t) =>{
        await t.click(search_icon);
        await t.typeText(search_input,' ');
        await t.pressKey('enter');
        const  count = await Selector('[data-test="product_name"]')().count;
        await t.expect(count).eql(9)
    
});

test('Keyword is wrong',async (t) =>{
    await t.click(search_icon);
    await t.typeText(search_input,'bánh');
    await t.pressKey('enter');
    const  count = await Selector('[data-test="product_name"]')().count;
    await t.expect(count).eql(0);
});