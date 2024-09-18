import React, { useState, useEffect } from 'react';  
import { useParams } from 'react-router-dom';
import axios from 'axios';  
import 'bootstrap/dist/css/bootstrap.min.css';  
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import toastify CSS

const EditMember = ({ onUpdateSuccess }) => {
    const { memberId } = useParams(); 
    const [member, setMember] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/members/${memberId}`);
                setMember(response.data);
            } catch (error) {
                console.error('Error fetching member data:', error);
                toast.error('Error fetching member data');  // Show error toast if fetching fails
            }
        };
        if (memberId) {
            fetchMember(); // Only fetch if memberId exists
        }
    }, [memberId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMember({ ...member, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.put(`http://127.0.0.1:5000/edit-member/${memberId}`, member, {
                headers: { 'Content-Type': 'application/json' },
            });
            toast.success('Member updated successfully');  // Show success toast
            if (onUpdateSuccess) {
                onUpdateSuccess();
            }
        } catch (error) {
            toast.error('Error updating member. Please try again.');  // Show error toast
            console.error('Error updating member:', error);
        }
    };
    

    return (
        <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: '100vh' }}>
            <ToastContainer />  {/* Toast container to display the notifications */}
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
