async function searchOffenderRegistry(firstName, lastName) {
    const headers = {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br"

    };

    const body = {
        firstName: firstName,
        lastName: lastName,
        city: "",
        county: "",
        jurisdictions: [
            "AL", "AK", "AMERICANSAMOA", "AZ", "AR", "CA", "CO", "CT", "DE", "DC",
            "FL", "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
            "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM",
            "NY", "NC", "ND", "CNMI", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD",
            "TN", "TX", "USVI", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
        ],
        clientIp: ""
    };

    try {
        const response = await fetch('https://nsopw-api.ojp.gov/nsopw/v1/v1.0/search', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        const jsonResponse = await response.json();
        console.log(JSON.stringify(jsonResponse, null, 2));
    } catch (error) {
        console.error("Error making the API request:", error);
    }
}

searchOffenderRegistry("Joe", "Schmoe");