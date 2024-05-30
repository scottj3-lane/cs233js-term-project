const apiKey = '$2a$10$PsVyRp6f8ZC8IMd6QNSSde8kUZExlSI8NGpXxqBClHoysVwuKnQLm';
const url = `https://api.jsonbin.io/v3/b`;
const binname = 'Sample';

// data used
const data = {
  "users": [
    {
      "name": "Jane Doe",
      "age": "30"
    }
  ]
};

// create a bin
async function createNewBin(data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
                'X-Bin-Name': binName
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('Success:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

createNewBin(data);
