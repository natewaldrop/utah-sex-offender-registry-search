$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Content-Type", "application/json")
# $headers.Add("User-Agent", "PostmanRuntime/7.39.1")
$headers.Add("Accept", "*/*")
$headers.Add("Accept-Encoding", "gzip, deflate, br")

$body = @"
{
    `"firstName`": `"Firstname`",
    `"lastName`": `"LastName`",
    `"city`": `"`",
    `"county`": `"`",
    `"jurisdictions`": [
        `"AL`",
        `"AK`",
        `"AMERICANSAMOA`",
        `"AZ`",
        `"AR`",
        `"CA`",
        `"CO`",
        `"CT`",
        `"DE`",
        `"DC`",
        `"FL`",
        `"GA`",
        `"GU`",
        `"HI`",
        `"ID`",
        `"IL`",
        `"IN`",
        `"IA`",
        `"KS`",
        `"KY`",
        `"LA`",
        `"ME`",
        `"MD`",
        `"MA`",
        `"MI`",
        `"MN`",
        `"MS`",
        `"MO`",
        `"MT`",
        `"NE`",
        `"NV`",
        `"NH`",
        `"NJ`",
        `"NM`",
        `"NY`",
        `"NC`",
        `"ND`",
        `"CNMI`",
        `"OH`",
        `"OK`",
        `"OR`",
        `"PA`",
        `"PR`",
        `"RI`",
        `"SC`",
        `"SD`",
        `"TN`",
        `"TX`",
        `"USVI`",
        `"UT`",
        `"VT`",
        `"VA`",
        `"WA`",
        `"WV`",
        `"WI`",
        `"WY`"
    ],
    `"clientIp`": `"`"
}
"@

$response = Invoke-RestMethod 'https://nsopw-api.ojp.gov/nsopw/v1/v1.0/search' -Method 'POST' -Headers $headers -Body $body
$response | ConvertTo-Json