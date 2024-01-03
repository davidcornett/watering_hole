const STABILITY_THRESHOLD = .03;

const OutlookCard = ({ data }) => {
    let scoreValue = Math.round(parseFloat(data.score));
    let score = `Selectivity Score: ${scoreValue}%`;
    let color;

    let totalChange = data.students_change;
    let stabilityStatus = `Stable over time (growth/decline within ±${100*STABILITY_THRESHOLD}% threshold)`;

    if (totalChange > STABILITY_THRESHOLD) {
        stabilityStatus = `Strong growth potential (${100 * STABILITY_THRESHOLD}%+)`;
        color = 'green';
    } else if (totalChange < -STABILITY_THRESHOLD) {
        color = 'red';
        stabilityStatus = (
            <div>
            Higher risk of financial difficulty <span style={{ fontWeight: 'normal' }} >, with a greater potential for:
            <ul style={{ marginLeft: '20px' }}>
                <li>Removal of certain programs/majors</li>
                <li>Becoming less selective</li>
                <li>Charging higher tuition</li>
                <li>Merging with other institutions or even closing</li>
            </ul>
            </span>
            </div>
        );
    }
  
    return (
        <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ color: '#333' }}>{data.name_with_state}</h2>
        <p style={{ color: '#555' }}>Overall Outlook: <strong style={{ color: color }}>{stabilityStatus} </strong></p>

        
        
        </div>
    );
  };
  
  export default OutlookCard;
  