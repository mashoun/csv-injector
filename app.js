const app = Vue.createApp({
    data() {
        return {
            version: '1.1.0',
            records: null,
            headers: null,
            meta: {
                eventId: '85854',
                ticketId: ""
            },
            tickets: [
                {
                    id: '44321',
                    title: 'RSVP'
                },
                {
                    id: '44322',
                    title: 'Professional'
                },
                {
                    id: '44323',
                    title: 'Student - Other'
                },
                {
                    id: '44324',
                    title: 'Ai Enthusiast'
                },

            ]

        }
    },
    methods: {
        uploadCSV() {
            // write a function to upload a CSV file without depending on an input element
            const fileInput = document.createElement('input')
            fileInput.type = 'file'
            fileInput.accept = '.csv'
            fileInput.onchange = (event) => {
                const file = event.target.files[0]
                const reader = new FileReader()
                reader.onload = (e) => {
                    const csvData = e.target.result
                    console.log(csvData)
                    // Process the CSV data here
                    const rows = csvData.trim().split('\n').map(line => line.split(','));
                    const [headers, ...entries] = rows;

                    const records = entries.map(row => {
                        const obj = {};
                        headers.forEach((h, i) => obj[h.trim()] = row[i].trim());
                        return obj;
                    });
                    console.log(records);
                    // add isSaved property to each record
                    records.forEach(record => {
                        record.isSaved = false
                    })
                    this.records = records
                    this.headers = headers.map(header => header.trim())
                }
                reader.readAsText(file)
            }
            fileInput.click()
        },
        saveRecord(firstName, lastName, email, exp, company) {
            fetch(`https://gdg.community.dev/api/event/${this.meta.eventId}/waitlist/list/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ticket: this.meta.ticketId,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    event_survey_entry: {
                        survey: 257529,
                        fields: {
                            "1283532": null,
                            "1283533": "Other",
                            "1283534": exp,
                            "1283535": company,
                            "1283536": null
                        }
                    },
                    signup_consent: true
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Success:", data);
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Error: " + error.message)
                });


        },

        addToWaitingList() {
            // loop through all records and save them
            if (this.meta.ticketId !== "") {
                this.records.forEach(record => {
                    this.saveRecord(record.firstName, record.lastName, record.email, record.exp, record.company)
                    record.isSaved = true
                })
            } else {
                alert('Please select a ticket type first')
            }

        }
    }
})

app.mount('#app')