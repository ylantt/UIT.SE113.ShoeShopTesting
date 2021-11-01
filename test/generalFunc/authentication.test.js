import { Selector, Role } from 'testcafe';
import { client, admin } from '../utilities/createRole';

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const adminDashboardBtn = Selector('[data-test="adminDashboardBtn"]');
const navbarUsername = Selector('[data-test="navbar_userName"]');

fixture('Fixture').page(process.env.URL_TEST)

test('should show admin dashboard button in admin role', async (t) => {
  await t
    .useRole(client)
    .click(navbarUsername)
    .expect(adminDashboardBtn.visible).notOk()
    .useRole(admin)
    .click(navbarUsername)
    .expect(adminDashboardBtn.visible).ok()
});

test('should show username on navbar only after login', async (t) => {
  await t
    .useRole(client)
    .expect(navbarUsername.visible).ok()
    .useRole(admin)
    .expect(navbarUsername.visible).ok()
    .useRole(Role.anonymous())
    .expect(navbarUsername.visible).notOk()
});

