(async function() {
    // Mock API call function
    async function mockApiCall(firstName, lastName) {
        // Simulate an asynchronous API call with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`Result for ${firstName} ${lastName}`); // Mock result
            }, 1);
        });
    }

    // Function to call the actual API
    async function callApi(firstName, lastName, age) {
        const response = await fetch('https://o2spihb7uavvqzebliupustaki0heywl.lambda-url.us-west-2.on.aws/', {
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
        // data should have a statusCode an array of jurisdictionStatus with a count of records, and an array of offenders with an age
        // total number of records is the sum of all jurisdictionStatus counts
        const totalRecords = data.jurisdictionStatus.reduce((sum, status) => sum + status.count, 0);
        
        // return the totalRecords as a json object
        return JSON.stringify({ totalRecords });

        
        // return `Fact: ${data.fact}, Length: ${data.length}`;
    }

    // Extract the table with class "table member-list"
    const table = document.querySelector('.table.member-list');
    if (!table) {
        alert('Table with class "table member-list" not found.');
        return;
    }

    // Get all rows in the table (excluding the header row)
    const rows = table.querySelectorAll('tbody tr');
    if (rows.length === 0) {
        alert('No rows found in the table.');
        return;
    }

    // Add a new header column for the results
    const headerRow = table.querySelector('thead tr');
    if (headerRow) {
        const newHeader = document.createElement('th');
        newHeader.textContent = 'API Result';
        headerRow.appendChild(newHeader);
    }

    testRows = rows.slice(0, 5); // Limit to first 5 rows for testing
    // Process each row
    for (const row of testRows) {
        // Extract the name (assuming it's in the first cell)
        const nameCell = row.querySelector('td.n.fn a');
        if (!nameCell) continue;
        // Split the name into last name and first name
        const [lastName, firstName] = nameCell.textContent.trim().split(',').map(part => part.trim());
        
        // Make the mock API call
        // const result = await mockApiCall(firstName, lastName);
        const result = await callApi(firstName, lastName);

        // Add a new cell with the result
        const resultCell = document.createElement('td');
        resultCell.textContent = result;
        row.appendChild(resultCell);
    }

    alert('Processing complete!');
})();