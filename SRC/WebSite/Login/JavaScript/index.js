async function Login() {

    let email = document.querySelector('input[javascript="login-email"]').value
    let password = document.querySelector('input[javascript="login-password"]').value

    Snackbar.show({ text: "Loading...", pos: "bottom-left", showAction: false, backgroundColor: "linear-gradient(to right, #88a2f1, #bcc5e1)", textColor: "#002597" })

    setTimeout(async () => {
        let _response = await fetch("/post/login", {
            method: 'post',
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
    
        let _Data = await _response.json();
        if (_Data.type && _Data.type === 'suff') {
            document.getElementById('suplogin').disabled = true;
            await Snackbar.show({ text: _Data.message, pos: "bottom-left", showAction: false, backgroundColor: "#12141d", textColor: "#ffeba7" });
            setTimeout(() => {
                return window.location.href = '/'
            }, 5000)
        } else if (_Data.type && _Data.type === 'err') {
            return Snackbar.show({ text: _Data.message, pos: "bottom-left", showAction: false, backgroundColor: "linear-gradient(to right, #88a2f1, #bcc5e1)", textColor: "#002597" })
        }
    }, 5000);

}

document.getElementById("suplogin")
    .addEventListener("click", async (event) => {
        Login()
    })

async function forgot_password() {

    let email = document.querySelector('input[javascript="login-email"]').value

    if (email) {
        return window.location.href = '/password_reset?value=' + email
    } else if (!email) {
        return window.location.href = '/password_reset'
    }

}

document.getElementById("forgot_password")
    .addEventListener('click', async (event) => {
        forgot_password()
    })

async function sign_UP() {

    let name = document.querySelector('input[javascript="signup-name"]').value
    let username = document.querySelector('input[javascript="signup-username"]').value
    let email = document.querySelector('input[javascript="signup-email"]').value
    let password = document.querySelector('input[javascript="signup-password"]').value

    Snackbar.show({ text: "Loading...", pos: "bottom-left", showAction: false, backgroundColor: "linear-gradient(to right, #88a2f1, #bcc5e1)", textColor: "#002597" })

    setTimeout(async () => {
        let _response = await fetch("/post/sign-up", {
            method: 'post',
            body: JSON.stringify({
                name: name,
                username: username,
                email: email,
                password: password
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
    
        let _Data = await _response.json();
        if (_Data.type && _Data.type === 'suff') {
            document.getElementById('suplogin').disabled = true;
            await Snackbar.show({ text: _Data.message, pos: "bottom-left", showAction: false, backgroundColor: "#12141d", textColor: "#ffeba7" });
            setTimeout(() => {
                window.location.href = '/';
            }, 3500)
        } else if (_Data.type && _Data.type === 'err') {
            return Snackbar.show({ text: _Data.message, pos: "bottom-left", showAction: false, backgroundColor: "linear-gradient(to right, #88a2f1, #bcc5e1)", textColor: "#002597" })
        }
    }, 3000);

}

document.getElementById("register")
    .addEventListener("click", async (event) => {
        sign_UP()
    })