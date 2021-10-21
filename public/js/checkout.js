const order = document.getElementById('orderBtn');

const list = document.getElementsByClassName("payment__product-list")
var cart = []
for (i = 0; i < list.length; i++) {
    cart.push({
        id: list[i].getElementsByClassName("product_id")[0].getAttribute("data-product-id"),
        qty: parseInt(list[i].getElementsByClassName("qty")[0].innerText.replace("x ", "")),
    })
}

async function sendData(type, cart, token, user) {
    console.log(user);
    let res = await axios.post("/client/api/payment/", {
        type: type,
        cart: cart,
        token: token,
        user: user
    })
    sessionStorage.setItem("message", res.data.message)
    await axios.delete("client/api/payment/")
    window.location = "/"
}

var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'en',
    token: async function (token) {
        await sendData("card", cart, token.id, user);
    }
});

const purchase = async () => {
    var priceElement = document.getElementsByClassName("cost")[0];
    var price = parseFloat(priceElement.innerText.replace('$', '')) * 100;
    for (index = 2; index < 3 && !(document.getElementsByClassName("payment__input")[index].checked); index++);
    switch (index) {
        case 2:
            await sendData("direct", cart, "0", user)
            break;
        case 3:
            stripeHandler.open({ amount: price })
            break;
    }
}

//User
let user = {}

order.addEventListener('click', async () => {
    user = {
        fullname: $("#name").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
        address: {
            detail: $("#address-detail-field").val(),
            city: $("#address-city-field").val(),
            state: $("#address-state-field").val(),
            country: $("#address-country-field").val()
        }
    }
    purchase();
});




