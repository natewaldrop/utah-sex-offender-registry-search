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

    // Process each row
    for (const row of rows) {
        // Extract the name (assuming it's in the first cell)
        const nameCell = row.querySelector('td.n.fn a');
        if (!nameCell) continue;
        // Split the name into last name and first name
        const [lastName, firstName] = nameCell.textContent.trim().split(',').map(part => part.trim());
        
        // Make the mock API call
        const result = await mockApiCall(firstName, lastName);

        // Add a new cell with the result
        const resultCell = document.createElement('td');
        resultCell.textContent = result;
        row.appendChild(resultCell);
    }

    alert('Processing complete!');
})();