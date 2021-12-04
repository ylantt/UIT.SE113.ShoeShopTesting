import { Selector, Role, ClientFunction } from 'testcafe';
import { client, admin } from '../utilities/createRole';

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const adminDashboardBtn = Selector('[data-test="adminDashboardBtn"]');
const navbarUsername = Selector('[data-test="navbar_userName"]');
const signInButton = Selector('[data-test = "signIn_button"]');


fixture('Check display information').page(process.env.URL_TEST)

test('Auth-1 - should show login page after clicking log in button on navbar', async(t) => {
  const getLocation = ClientFunction(() => document.location.href);

  await t
    .click(signInButton)
    .expect(getLocation()).contains(`${process.env.URL_TEST}/signIn`);
});

test('Auth-2 - should show username on navbar only after login', async (t) => {
  await t
    .useRole(client)
    .expect(navbarUsername.visible).ok()
    .useRole(admin)
    .expect(navbarUsername.visible).ok()
    .useRole(Role.anonymous())
    .expect(navbarUsername.visible).notOk()
});

test('Auth-3 - should show admin dashboard button in admin role', async (t) => {
  await t
    .useRole(client)
    .click(navbarUsername)
    .expect(adminDashboardBtn.visible).notOk()
    .useRole(admin)
    .click(navbarUsername)
    .expect(adminDashboardBtn.visible).ok()
});
