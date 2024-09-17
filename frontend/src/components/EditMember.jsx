import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditMember = ({ memberId, onUpdateSuccess }) => {
    const [member, setMember] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        // Fetch member data based on the ID
        const fetchMember = async () => {
            try {
                const response = await axios.get(`127.0.0.1:5000/members/${memberId}`); // Adjust the API endpoint as necessary
                setMember(response.data); // Set member data to state
            } catch (error) {
                console.error('Error fetching member data:', error);
            }
        };
        fetchMember();
    }, [memberId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMember({ ...member, [name]: value }); // Update member state
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        try {
            await axios.post(`127.0.0.1:5000/edit-member/${memberId}`, member); // Update the member
            if (onUpdateSuccess) {
                onUpdateSuccess(); // Call the callback to notify of success
            }
        } catch (error) {
            console.error('Error updating member:', error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: '100vh' }}>
            <div className="bg-white p-4 rounded shadow" style={{ width: '80%' }}>
                <h1 className="text-2xl mb-4">EDIT MEMBER</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name:</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={member.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={member.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            className="form-control"
                            value={member.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Address:</label>
                        <input
                            type="text"
                            name="address"
                            className="form-control"
                            value={member.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">MODIFY</button>
                </form>
            </div>
        </div>
    );
};

export default EditMember;
