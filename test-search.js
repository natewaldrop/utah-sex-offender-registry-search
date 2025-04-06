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
    // Add a stop button to the page
    let stopExecution = false;
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop Script';
    stopButton.style.position = 'fixed';
    stopButton.style.top = '10px';
    stopButton.style.right = '10px';
    stopButton.style.zIndex = '1000';
    stopButton.addEventListener('click', () => {
        stopExecution = true;
        alert('Script execution stopped.');
    });
    document.body.appendChild(stopButton);
    

    let total429 = 0;


    // Process each row
    for (const row of rows) {
        // Check if the script should stop
        if (stopExecution) {
            alert('Script execution stopped by user.');
            break;
        }
        // Check if the row is already processed
        const existingResultCell = row.querySelector('td:last-child');
        if (existingResultCell) {
            const cellText = existingResultCell.textContent.trim();
            if (cellText.startsWith('Total Records')) {
            // console.log('Row already processed:', cellText);
            continue; // Skip this row
            } else if (cellText === 'Error fetching data') {
            console.log('Previous run failed. Removing error cell.');
            existingResultCell.remove(); // Remove the error cell
            }
        }
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
            // console.log('Member Age:', memberAge);
        }
        const sexCell = row.querySelector('.sex');
        const memberSex = sexCell.textContent.trim();
        if (!memberSex) {
            console.error('Invalid memberSex:', sexCell.textContent.trim());
            continue;
        }else{
            // console.log('Member Sex:', memberSex);
        }

        console.log('Name:', firstName + ' ' + lastName + ' (' + memberSex + '-' + memberAge + ') ');

        try {
            let parsedResult;
            let retryCount = 0;
            const maxRetries = 5;

            while (retryCount <= maxRetries) {
                try {
                    const result = await callApi(firstName, lastName);
                    parsedResult = JSON.parse(result);
                    console.log('Parsed result:', parsedResult);
                    
                    // Exit the loop if no error occurs
                    break;
                } catch (error) {
                    // Check if the error is due to rate limiting (429)
                    if (error.message.includes('429')) {
                        if (retryCount < maxRetries) {
                            const backoffTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
                            console.log(`Rate limit exceeded. Waiting for ${backoffTime / 1000} seconds... (Retry ${retryCount + 1}/${maxRetries})`);
                            await new Promise(resolve => setTimeout(resolve, backoffTime));
                            retryCount++;
                            total429++;
                            continue;
                        } else {
                            console.error('Max retries reached due to rate limiting.');
                            throw error;
                        }
                    }

                    if (retryCount >= maxRetries) {
                        console.error('Error after maximum retries:', error);
                        throw error;
                    }
                    console.log(`Error occurred. Retrying... (${retryCount + 1}/${maxRetries})`);
                    retryCount++;
                }
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
                    return `<a href="${offenderUri}" target="_blank"><strong>${givenName} ${surName} (${gender}, ${age})</strong></a>`;
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

        console.log('Row processed:', firstName + ' ' + lastName + ' (' + memberSex + '-' + memberAge + ') ');
        if (total429 >= 10) {
            console.log('Too many 429s - cooling down for 1 minute', total429);
            await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute delay - to avoid rate limiting
            total429 = 0; // Reset the counter after cooling down

        }else{
            console.log('Waiting for 5 seconds before next request...');
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay - to avoid rate limiting
        }
        
    }
})();