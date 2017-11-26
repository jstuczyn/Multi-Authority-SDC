// todo put parsing pk here


function wait(t) {
    return new Promise((r) => setTimeout(r, t));
}

export async function checkIfAlive(server) {
    // only for test to see transitions
    await wait(1000);

    // might as well get pk now
    let response = {
        status: null,
        pk: null
    };
    try {
        let pk = await getPublicKey(server);
        pk = await pk.json();
        response.pk = pk.message;
        response.status = true;
    }
    catch(err) {
        response.pk = "Error";
        response.status = false;
    }

    return response
}

export async function getPublicKey(server) {
    let response = null;
    try {
        response = await fetch(`http://${server}/testapi/pk`);
    }
    catch(err) {
        throw err
    }

    return response
}

export async function signMessage(server, message) {
    let response = null;
    try {
        response = await
            fetch(`http://${server}/testapi/sign`, {
                method: 'POST',
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                })
            });
    }
    catch(err) {
        throw err
    }
}