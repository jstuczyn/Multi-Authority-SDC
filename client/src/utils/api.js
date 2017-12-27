
// auxiliary, mostly for testing purposes to simulate delays
export function wait(t) {
    return new Promise((r) => setTimeout(r, t));
}





// BELOW IS AN OLD API,
// TODO: REFACTOR AND CLEAN UP BEFORE REUSING







export async function checkIfAlive(server, getPublicKey = false) {
    // only for test to see transitions
    // await wait(1000);

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
    let clientResponse = {
        status: null,
        signature: null
    };

    try {
        let response = await
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
        response = await response.json();
        clientResponse.signature = response.signature;
        clientResponse.status = true;
    }
    catch(err) {
        clientResponse.signature = ["Error", "Error"];
        clientResponse.status = false;
    }

    return clientResponse;
}