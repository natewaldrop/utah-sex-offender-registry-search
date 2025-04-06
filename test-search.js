(async function () {
    // Function to call the actual API
    async function callApi(firstName, lastName) {
        const url = new URL('https://o2spihb7uavvqzebliupustaki0heywl.lambda-url.us-west-2.on.aws/');
        url.searchParams.append('firstName', firstName);
        url.searchParams.append('lastName', lastName);


        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();

        return JSON.stringify({ data });


    }

    // Extract the table with class "table member-list"
    const table = document.querySelector('.table.member-list');
    if (!table) {
        alert('Table with class "table member-list" not found.');
        return;
    }
    console.log('Table found:', table);
    // Get all rows in the table (excluding the header row)
    const rows = table.querySelectorAll('tbody tr');
    if (rows.length === 0) {
        alert('No rows found in the table.');
        return;
    }
    console.log('Rows found:', rows.length);
    // Add a new header column for the results if it doesn't exist

    const headerRow = table.querySelector('thead tr');

    const existingResultHeader = Array.from(headerRow.querySelectorAll('th')).find(th => th.textContent.trim() === 'Result');
    if (!existingResultHeader) {
        const resultHeader = document.createElement('th');
        resultHeader.textContent = 'Result';
        headerRow.appendChild(resultHeader);
    }


    // pick a random row to test
    const randomIndex = Math.floor(Math.random() * rows.length - 1);

    const testRows = Array.from(rows).slice(randomIndex, randomIndex + 1);
    console.log('Test rows:', testRows.length);
    console.log('Test rows:', testRows);


    // Process each row
    for (const row of testRows) {

        // Extract the name (assuming it's in the first cell)
        const nameCell = row.querySelector('td.n.fn a');
        if (!nameCell) continue;
        // Split the name into last name and first name
        const [lastName, firstName] = nameCell.innerText.trim().split(',').map(part => part.trim());
        const ageCell = row.querySelector('.age');
        const memberAge = parseInt(ageCell.textContent.trim(), 10);
        if (isNaN(memberAge)) {
            console.error('Invalid age:', ageCell.textContent.trim());
            continue;
        } else {
            console.log('Member Age:', memberAge);
        }
        const sexCell = row.querySelector('.sex');
        const memberSex = sexCell.textContent.trim();
        if (!memberSex) {
            console.error('Invalid memberSex:', sexCell.textContent.trim());
            continue;
        }else{
            console.log('Member Sex:', memberSex);
        }

        console.log('Name:', firstName + ' ' + lastName + ' (' + memberAge + ')' + memberSex);

        try {
            const result = await callApi(firstName, lastName);

            const parsedResult = JSON.parse(result);
            console.log('Parsed result:', parsedResult);
            // if statusCode is 429, wait for 3 seconds and retry
            if (parsedResult.statusCode === 429) {
                console.log('Rate limit exceeded. Waiting for 3 seconds...');
                await new Promise(resolve => setTimeout(resolve, 3000));
                const retryResult = await callApi(firstName, lastName);
                parsedResult = JSON.parse(retryResult);
            }

            const totalRecords = parsedResult.data.jurisdictionStatus.reduce((sum, status) => sum + (status.records || 0), 0);
            console.log('Total records:', totalRecords);
            // Create a summary of offenders

            const offenders = parsedResult.data.offenders || [];

            const offenderLinks = offenders.map(offender => {
                const { givenName, surName } = offender.name || {};
                const { gender, age, offenderUri } = offender;
                // compare the mapped age and gender with the memberAge and memberSex
                const isAgeMatch = memberAge === age || memberAge === age + 1 || memberAge === age - 1;
                const isSexMatch = memberSex === gender;
                // console.log(memberAge + ' ' + age);
                // console.log(memberSex + ' ' + gender)
                if (!isAgeMatch || !isSexMatch) {
                    return `<a href="${offenderUri}" target="_blank"><s>${givenName} ${surName} (${gender}, ${age})</s></a>`;
                } else {
                    return `<a href="${offenderUri}" target="_blank">${givenName} ${surName} (${gender}, ${age})</a>`;
                }
                // Create a link for the offender

            }).join('<br>');

            // Add a new cell with the result
            const resultCell = document.createElement('td');
            resultCell.innerHTML = `<strong>Total Records:</strong> ${totalRecords}<br>${offenderLinks}`;
            row.appendChild(resultCell);

        } catch (error) {
            console.error('Error processing row:', error);
            const resultCell = document.createElement('td');
            resultCell.textContent = 'Error fetching data';
            row.appendChild(resultCell);
        }


        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }

    alert('Processing complete!');
})();