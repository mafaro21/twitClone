/* /*For Register Form */
//checking values entered by user */}
function checkInputs() {
    const a = document.forms["register"]["name"].value.trim();
    const b = document.forms["register"]["email"].value.trim();
    const c = document.forms["register"]["password"].value.trim();
    const d = document.forms["register"]["confirmPass"].value.trim();

    //reset all error texts to null
    document.getElementById("errname").innerHTML = "";
    document.getElementById("erremail").innerHTML = "";
    document.getElementById("errpwd").innerHTML = "";
    document.getElementById("errpwd2").innerHTML = "";

    const reg = new RegExp('[^ a-zA-Z0-9_]');

    if (reg.test(a)) {
        document.getElementById("errname").innerHTML = "Name contains illegal characters ";
        return false;
    }

    if (b.indexOf('.') - b.indexOf("@") < 2) {
        document.getElementById("erremail").innerHTML = "Invalid email address";
        return false;
    }
    if (c.length < 8) {
        document.getElementById("errpwd").innerHTML = "Required 8 or more characters";
        return false;
    }
    if (c !== d) {
        document.getElementById("errpwd2").innerHTML = "Passwords do not match";
        return false;
    }
}
async function proceeed() {
await checkInputs();
    if (checkInputs() === true) {
        const formaa = document.getElementById('register');

        formaa.setAttribute("onsubmit", "true");
    }
}