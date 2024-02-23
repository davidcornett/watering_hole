const MAJOR_CHANGE_THRESHOLD = 0.03;

export default function SchoolInfo({ data }) {
    let scoreValue = Math.round(parseFloat(data.score));
    let score = `Selectivity Score: ${scoreValue}%`;
    let demographics = data.students_change_sidewalk;
    let rank = data.Rank;

    const demographicDetails = (value) => {
      if (value >= MAJOR_CHANGE_THRESHOLD) {
        return { message: 'Strong growth', color: 'green' };
      } else if (value >= 0) { 
        return { message: 'Slow growth' };
      
      } else if (value >= -MAJOR_CHANGE_THRESHOLD) { 
        return { message: 'Slow decline' };
      
      } else {
        return { message: 'Significant decline', color: 'red' };
      }
    };

    const details = demographicDetails(demographics);

    const formatChange= (value) => {
      const formattedValue = (value * 100).toFixed(2);
      return value >= 0 ? `+${formattedValue}%` : `${formattedValue}%`;
    };

    return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ color: '#333' }}>Factors</h2>
      <ol style={{ color: '#555', paddingLeft: '20px' }}>
        <li>Demographic Trend: <strong style={{ color: details.color }}>{details.message}</strong></li>
        <li>{`${score}`}</li>
        <li>Academic programs in growing fields: better than {rank} of other institutions</li>
      </ol>
    </div>


    );
}
  