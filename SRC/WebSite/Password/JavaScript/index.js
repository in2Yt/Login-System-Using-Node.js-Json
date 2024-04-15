async function password_reset() {

    let email = document.querySelector('input[javascript="reset-email"]').value

    Snackbar.show({ text: "Loading...", pos: "bottom-left", showAction: false, backgroundColor: "linear-gradient(to right, #88a2f1, #bcc5e1)", textColor: "#002597" })

    setTimeout(async () => {
        let _response = await fetch("/post/password_reset", {
            method: 'post',
            body: JSON.stringify({
                type: 'rest',
                email: email
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
    
        let _Data = await _response.json();
        if (_Data.type && _Data.type === 'suff') {
            document.getElementById('password_reset').disabled = true;
            await Snackbar.show({ text: _Data.message, pos: "bottom-left", showAction: false, backgroundColor: "#12141d", textColor: "#ffeba7" });
        } else if (_Data.type && _Data.type === 'err') {
            return Snackbar.show({ text: _Data.message, pos: "bottom-left", showAction: false, backgroundColor: "linear-gradient(to right, #88a2f1, #bcc5e1)", textColor: "#002597" })
        }
    }, 5000);

}

document.getElementById('password_reset')
    .addEventListener('click', async (eval) => {
        password_reset();
    })