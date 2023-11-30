export default function SchoolInfo({ data }) {
    return (
      <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ color: '#333' }}>{data.name_with_state}</h2>
        <p style={{ color: '#555' }}>Forecasted Change in Students by 2027: <strong>{(data.students_change * 100).toFixed(2)}%</strong></p>
        <p style={{ color: '#555' }}>Forecasted Change based only on demographics: <strong>{(data.students_change_sidewalk * 100).toFixed(2)}%</strong></p>

      </div>
    );
  }
  