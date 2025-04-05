function search2() {


    var myHeaders = new Headers();
    myHeaders.append("Cookie", "prod-api.ojp.gov=8b9260375cf102e1fd1978df6779e5c1");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br");
    myHeaders.append("Host", "nsopw-api.ojp.gov");

    var raw = JSON.stringify({
        "firstName": "Joe",
        "lastName": "Schmoe",
        "city": "",
        "county": "",
        "jurisdictions": [
            "AL",
            "AK",
            "AMERICANSAMOA",
            "AZ",
            "AR",
            "CA",
            "CO",
            "CT",
            "DE",
            "DC",
            "FL",
            "GA",
            "GU",
            "HI",
            "ID",
            "IL",
            "IN",
            "IA",
            "KS",
            "KY",
            "LA",
            "ME",
            "MD",
            "MA",
            "MI",
            "MN",
            "MS",
            "MO",
            "MT",
            "NE",
            "NV",
            "NH",
            "NJ",
            "NM",
            "NY",
            "NC",
            "ND",
            "CNMI",
            "OH",
            "OK",
            "OR",
            "PA",
            "PR",
            "RI",
            "SC",
            "SD",
            "TN",
            "TX",
            "USVI",
            "UT",
            "VT",
            "VA",
            "WA",
            "WV",
            "WI",
            "WY"
        ],
        "clientIp": ""
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://nsopw-api.ojp.gov/nsopw/v1/v1.0/search", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

}

search2(); // Call the search function to execute the API request