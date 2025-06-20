import {useState} from 'react'
import './App.css'

function App() {
    const [formData, setFormData] = useState({
        substance_name: '',
        amount: 0,
        location_name: '',
        year: 2025,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8000/add_record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log('Response:', data);
        alert('Record submitted!');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Substance Name:</label>
                <input
                    type="text"
                    name="substance_name"
                    value={formData.substance_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Amount:</label>
                <input
                    type="number"
                    step="any"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Location Name:</label>
                <input
                    type="text"
                    name="location_name"
                    value={formData.location_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Year:</label>
                <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default App
