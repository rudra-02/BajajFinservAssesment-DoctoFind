import { useState, useEffect } from 'react';
import './FilterPanel.css';

function FilterPanel({ 
  consultationType, 
  onConsultationChange, 
  selectedSpecialties, 
  onSpecialtyChange, 
  sortBy, 
  onSortChange, 
  doctors 
}) {
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  
  // Extract unique specialties from doctors data
  useEffect(() => {
    if (doctors.length > 0) {
      // Extract specialties from the doctors data
      const allSpecialtiesObjects = doctors.flatMap(doctor => doctor.specialities || []);
      const allSpecialties = allSpecialtiesObjects.map(spec => spec.name);
      const uniqueSpecialties = [...new Set(allSpecialties)].sort();
      setSpecialties(uniqueSpecialties);
      setFilteredSpecialties(uniqueSpecialties);
    }
  }, [doctors]);
  
  // Filter specialties when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSpecialties(specialties);
    } else {
      const filtered = specialties.filter(specialty => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSpecialties(filtered);
    }
  }, [searchTerm, specialties]);
  
  // Handle specialty search
  const handleSpecialtySearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Clear all filters
  const handleClearAllFilters = () => {
    onConsultationChange('');
    onSortChange('');
    onSpecialtyChange([], false); // Modified to clear all specialties at once
    setSearchTerm('');
  };
  
  // Clear only sort filters
  const handleClearSortFilter = () => {
    onSortChange('');
  };
  
  // Clear only specialties filters
  const handleClearSpecialtiesFilter = () => {
    onSpecialtyChange([], false); // Modified to clear all specialties at once
    setSearchTerm('');
  };
  
  // Clear only consultation type filter
  const handleClearConsultationFilter = () => {
    onConsultationChange('');
  };
  
  return (
    <aside className="filter-panel">
      {/* Sort by Section */}
      <div className="filter-section">
        <div className="filter-header-with-clear">
          <h3 data-testid="filter-header-sort">Sort by</h3>
          {sortBy && (
            <button 
              className="clear-button" 
              onClick={handleClearSortFilter}
            >
              Clear
            </button>
          )}
        </div>
        <div className="filter-options">
          <label className="radio-label">
            <input
              type="radio"
              data-testid="sort-fees"
              name="sort"
              checked={sortBy === 'fees'}
              onChange={() => onSortChange('fees')}
            />
            Price: Low-High
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              data-testid="sort-experience"
              name="sort"
              checked={sortBy === 'experience'}
              onChange={() => onSortChange('experience')}
            />
            Experience: Most Experience first
          </label>
        </div>
      </div>
      
      {/* Specialities Section */}
      <div className="filter-section">
        <div className="filter-header-with-clear">
          <h3 data-testid="filter-header-speciality">Specialities</h3>
          {(selectedSpecialties.length > 0 || searchTerm) && (
            <button 
              className="clear-button" 
              onClick={handleClearSpecialtiesFilter}
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="specialty-search">
          <input
            type="text"
            placeholder="Search specialties..."
            value={searchTerm}
            onChange={handleSpecialtySearch}
            className="specialty-search-input"
          />
        </div>
        
        <div className="filter-options specialty-options">
          {filteredSpecialties.map((specialty) => {
            // Format specialty for data-testid
            const testIdSpecialty = specialty.replace(/\s+/g, '-');
            
            return (
              <label key={specialty} className="checkbox-label">
                <input
                  type="checkbox"
                  data-testid={`filter-specialty-${testIdSpecialty}`}
                  checked={selectedSpecialties.includes(specialty)}
                  onChange={(e) => onSpecialtyChange(specialty, e.target.checked)}
                />
                {specialty}
              </label>
            );
          })}
          
          {filteredSpecialties.length === 0 && (
            <p className="no-specialties-found">No specialties found</p>
          )}
        </div>
      </div>
      
      {/* Mode of consultation Section */}
      <div className="filter-section">
        <div className="filter-header-with-clear">
          <h3 data-testid="filter-header-moc">Mode of consultation</h3>
          {consultationType && (
            <button 
              className="clear-button" 
              onClick={handleClearConsultationFilter}
            >
              Clear
            </button>
          )}
        </div>
        <div className="filter-options">
          <label className="radio-label">
            <input
              type="radio"
              data-testid="filter-video-consult"
              name="consultation"
              checked={consultationType === 'video'}
              onChange={() => onConsultationChange('video')}
            />
            Video Consultation
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              data-testid="filter-in-clinic"
              name="consultation"
              checked={consultationType === 'clinic'}
              onChange={() => onConsultationChange('clinic')}
            />
            In-clinic Consultation
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              name="consultation"
              checked={consultationType === ''}
              onChange={() => onConsultationChange('')}
            />
            All
          </label>
        </div>
      </div>
      
      {/* Clear All Filters button at the bottom */}
      {(sortBy || selectedSpecialties.length > 0 || consultationType) && (
        <button 
          className="clear-all-button" 
          onClick={handleClearAllFilters}
        >
          Clear All Filters
        </button>
      )}
    </aside>
  );
}

export default FilterPanel;