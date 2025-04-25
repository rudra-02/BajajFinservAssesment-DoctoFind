import './DoctorList.css';

function DoctorList({ doctors }) {
  if (doctors.length === 0) {
    return <div className="no-results">No doctors found matching your criteria.</div>;
  }
  
  return (
    <div className="doctor-list">
      {doctors.map((doctor, index) => (
        <div key={doctor.id || index} className="doctor-card" data-testid="doctor-card">
          <div className="doctor-image">
            <img src={doctor.photo || "https://via.placeholder.com/80"} alt={doctor.name} />
          </div>
          
          <div className="doctor-info">
            <h2 data-testid="doctor-name">{doctor.name}</h2>
            
            <p data-testid="doctor-specialty">
              {doctor.specialities?.map(spec => spec.name).join(', ')}
            </p>
            
            <p data-testid="doctor-experience">{doctor.experience}</p>
            
            {doctor.languages && (
              <p>Speaks: {doctor.languages.join(', ')}</p>
            )}
            
            {doctor.clinic && (
              <>
                <p className="doctor-clinic">{doctor.clinic.name}</p>
                <p className="doctor-location">{doctor.clinic.address?.locality}, {doctor.clinic.address?.city}</p>
              </>
            )}
          </div>
          
          <div className="doctor-fee-section">
            <p className="doctor-fee" data-testid="doctor-fee">{doctor.fees}</p>
            <button className="book-button">Book Appointment</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DoctorList; 