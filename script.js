let bounties = [];

document.getElementById('sortDropdown').addEventListener('change', function() {
    sortBounties(this.value);
    displayBounties();
});

function fetchDefaultFile() {
    fetch('bounties.csv')
        .then(response => response.text())
        .then(data => {
            parseCSV(data);
            displayBounties();
        })
        .catch(error => console.error('Error loading default CSV:', error));
}

function parseCSV(data) {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');

    bounties = lines.slice(1).map(line => {
        const row = parseCSVRow(line);
        const [title, description, claimer, prize] = row;
        return { title, description, prize, claimer };
    });
}

function parseCSVRow(row) {
    const result = [];
    let inQuotes = false;
    let value = '';

    for (let char of row) {
        if (char === '"' && inQuotes) {
            inQuotes = false;
        } else if (char === '"' && !inQuotes) {
            inQuotes = true;
        } else if (char === ',' && !inQuotes) {
            result.push(value);
            value = '';
        } else {
            value += char;
        }
    }

    result.push(value); // Add the last value
    return result;
}

function displayBounties() {
    const container = document.getElementById('bountyContainer');
    container.innerHTML = ''; // Clear previous content

    bounties.forEach(bounty => {
        const bountyDiv = document.createElement('div');
        bountyDiv.className = 'bounty-box';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'bounty-title';
        titleDiv.innerText = bounty.title;
        bountyDiv.appendChild(titleDiv);

        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'bounty-description';
        descriptionDiv.innerText = bounty.description;
        bountyDiv.appendChild(descriptionDiv);

        const prizeDiv = document.createElement('div');
        prizeDiv.className = 'bounty-prize';
        prizeDiv.innerText = `Prize: ${bounty.prize}`;
        bountyDiv.appendChild(prizeDiv);

        const claimerDiv = document.createElement('div');
        claimerDiv.className = 'bounty-claimer';
        claimerDiv.innerHTML = 'Claimed:<br>' + bounty.claimer;
        bountyDiv.appendChild(claimerDiv);

        container.appendChild(bountyDiv);

        // Adjust font size dynamically
        adjustFontSizeForContainer(bountyDiv, titleDiv, descriptionDiv, prizeDiv);
    });
}

function adjustFontSizeForContainer(bountyBox, title, description, prize) {
    // Set maximum font sizes
    let maxTitleFontSize = 60;
    let maxPrizeFontSize = 50;
    let maxDescriptionFontSize = 140;

    // Define a function to adjust font size based on content length and available space
    const adjustFontSize = (element, initialSize, maxHeight) => {
        let fontSize = initialSize;
        element.style.fontSize = fontSize + 'px';

        // Reduce font size if the element overflows its allotted space
        while (fontSize > 8 && (element.scrollWidth > bountyBox.clientWidth || element.scrollHeight > maxHeight)) {
            fontSize--;
            element.style.fontSize = fontSize + 'px';
        }
    };

    // Apply font size adjustments
    adjustFontSize(title, maxTitleFontSize, bountyBox.clientHeight * 0.25); // Allocate 25% of height to title
    adjustFontSize(description, maxDescriptionFontSize, bountyBox.clientHeight * 0.50); // Allocate 50% of height to description
    adjustFontSize(prize, maxPrizeFontSize, bountyBox.clientHeight * 0.25); // Allocate 25% of height to prize
}

// This function now intelligently adjusts each text component within the bounty box based on the element's content length and the proportion of the container it is allowed to occupy.



function sortBounties(criteria) {
    bounties.sort((a, b) => {
        /*if (criteria === 'prize') {
            return parseFloat(a[criteria]) - parseFloat(b[criteria]);
        } */
        return a[criteria].localeCompare(b[criteria]);
    });
}

// Load the default file on page load
window.onload = function() {
    fetchDefaultFile();
};


document.getElementById('toggleClaimedButton').addEventListener('click', function() {
    // Get all elements with the class 'bounty-claimer'
    var claimers = document.querySelectorAll('.bounty-claimer');
    
    // Loop through all claimer elements
    claimers.forEach(function(claimer) {
        if (claimer.style.display === 'none') {
            claimer.style.display = 'block'; // Make visible if hidden
        } else {
            claimer.style.display = 'none'; // Hide if visible
        }
    });
});

