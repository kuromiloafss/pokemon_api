import { useState } from 'react';
import axios from 'axios';

export default function AddUserForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // POST request ke API
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/users',
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }
      );

      setMessage({ type: 'success', text: 'Data berhasil ditambahkan!' });
      setFormData({ name: '', email: '', phone: '' });
      
      // Panggil callback untuk refresh data di parent
      if (onSuccess) onSuccess();
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menambahkan data!' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3> Tambah Pengguna Baru</h3>
      
      {message && (
        <div style={message.type === 'success' ? styles.success : styles.error}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Nama Lengkap"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <input
          type="tel"
          name="phone"
          placeholder="Nomor Telepon"
          value={formData.phone}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={styles.button}
        >
          {isSubmitting ? 'Mengirim...' : 'Simpan Data'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
};
