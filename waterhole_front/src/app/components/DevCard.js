export default function DevCard({ data }) {

    const formatChange= (value) => {
      const formattedValue = (value * 100).toFixed(2);
      return value >= 0 ? `+${formattedValue}%` : `${formattedValue}%`;
    };

    return (
      <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ color: '#333' }}>Dev Info</h2>
        <p style={{ color: '#555' }}>Forecasted change in students by 2027: <strong style={{ color: data.students_change >= 0 ? 'green' : 'red' }}>{formatChange(data.students_change)}</strong></p>
        <p style={{ color: '#555' }}>Demographic change: <strong style={{ color: data.students_change_sidewalk >= 0 ? 'green' : 'red' }}>{formatChange(data.students_change_sidewalk)}</strong></p>
      </div>
    );
}