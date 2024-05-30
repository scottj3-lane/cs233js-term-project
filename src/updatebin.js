const apiKey = '$2a$10$PsVyRp6f8ZC8IMd6QNSSde8kUZExlSI8NGpXxqBClHoysVwuKnQLm';
const binId = '66590d2be41b4d34e4fc22f3';   // required for updating
const url = `https://api.jsonbin.io/v3/b/${binId}`;

// data used
const data = {
  "users": [
    {
      "name": "Jane Doe",
      "age": "30"
    }
  ]
};

// update bin
async function writeToJsonBin(data) {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('Success:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

writeToJsonBin(data);
