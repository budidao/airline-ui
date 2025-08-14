import React, { useState } from 'react';
import { checkVouchers, generateVouchers, regenerateVouchers } from './api';
import './App.css';

const aircraftType = ['ATR', 'Airbus 320', 'Boeing 737 Max'];

function App() {
  const [form, setForm] = useState({
    name: '',
    id: '',
    flightNumber: '',
    date: '',
    aircraft: 'ATR',
  });

  const [seats, setSeats] = useState([]);
  const [updatedSeats, setUpdatedSeats] = useState([]);
  const [oldSeat, setOldSeat] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    setSeats([]);
    setUpdatedSeats([]);
    setOldSeat('');
    setLoading(true);
    try {
      const checkRes = await checkVouchers({
        flightNumber: form.flightNumber,
        date: form.date,
      });

      if (!checkRes) {
        setError('Failed, error checking voucher for this flight and date');
      } else if (checkRes.data.exists) {
        setError('Failed, vouchers already generated for this flight on this date.');
      } else {
        const generateResp = await generateVouchers(form);
        setSeats(generateResp.data.seats || []);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating vouchers.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setError('');
    setUpdatedSeats([]);
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        id: form.id,
        flightNumber: form.flightNumber,
        date: form.date,
        changeSeat: oldSeat,
      };

      const response = await regenerateVouchers(payload);
      setUpdatedSeats(response.data.seats || []);
    } catch (err) {
      console.error(err);
      setError('An error occurred while regenerating the seat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Airline Voucher Generator</h2>

      <input name="name" placeholder="Crew Name" onChange={handleChange} />
      <input name="id" placeholder="Crew ID" onChange={handleChange} />
      <input name="flightNumber" placeholder="Flight Number" onChange={handleChange} />
      <input name="date" placeholder="Flight Date (DD-MM-YY)" onChange={handleChange} />

      <select name="aircraft" onChange={handleChange} value={form.aircraft}>
        {aircraftType.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Generate Vouchers'}
      </button>

      {/* Seat replacement input */}
      <input
        placeholder="Seat to Replace (e.g. 15C)"
        value={oldSeat}
        onChange={(e) => setOldSeat(e.target.value)}
      />
      <button onClick={handleRegenerate} disabled={loading || !oldSeat}>
        {loading ? 'Regenerating...' : 'Regenerate Seat'}
      </button>

      {error && <div className="error">{error}</div>}

      {seats.length > 0 && (
        <div className="results">
          <h4>Generated Vouchers:</h4>
          <ul>
            {seats.map((seat, i) => (
              <li key={i}>{seat}</li>
            ))}
          </ul>
        </div>
      )}

      {updatedSeats.length > 0 && (
        <div className="results">
          <h4>Updated Vouchers:</h4>
          <ul>
            {updatedSeats.map((seat, i) => (
              <li key={i}>{seat}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
