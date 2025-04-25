import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import DoctorList from './components/DoctorList';
import './App.css';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [consultationType, setConsultationType] = useState(searchParams.get('consultation') || '');
  const [selectedSpecialties, setSelectedSpecialties] = useState(
    searchParams.getAll('specialty') || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  
  // Fetch doctors data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        const data = await response.json();
        console.log('API Data:', data); // Log the data to see its structure
        setDoctors(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);
  
  // Apply filters and sort when any filter changes or when doctors data is loaded
  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (consultationType) params.set('consultation', consultationType);
    selectedSpecialties.forEach(specialty => params.append('specialty', specialty));
    if (sortBy) params.set('sort', sortBy);
    
    setSearchParams(params);
    
    // Filter and sort doctors
    if (doctors.length > 0) {
      let filtered = [...doctors];
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(doctor => 
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply consultation type filter
      if (consultationType) {
        filtered = filtered.filter(doctor => {
          if (consultationType === 'video') return doctor.video_consult;
          if (consultationType === 'clinic') return doctor.in_clinic;
          return true;
        });
      }
      
      // Apply specialty filters
      if (selectedSpecialties.length > 0) {
        filtered = filtered.filter(doctor => 
          selectedSpecialties.some(selectedSpecialty => 
            doctor.specialities?.some(spec => 
              spec.name.toLowerCase() === selectedSpecialty.toLowerCase()
            )
          )
        );
      }
      
      // Apply sorting
      if (sortBy === 'fees') {
        filtered.sort((a, b) => {
          // Extract numeric fee values (removing currency symbols and spaces)
          const feeA = parseInt(a.fees.replace(/[^\d]/g, ''));
          const feeB = parseInt(b.fees.replace(/[^\d]/g, ''));
          return feeA - feeB;
        });
      } else if (sortBy === 'experience') {
        filtered.sort((a, b) => {
          // Extract years from experience strings
          const expA = parseInt(a.experience.match(/\d+/)?.[0] || 0);
          const expB = parseInt(b.experience.match(/\d+/)?.[0] || 0);
          return expB - expA; // Sort by experience in descending order
        });
      }
      
      setFilteredDoctors(filtered);
    }
  }, [doctors, searchQuery, consultationType, selectedSpecialties, sortBy]);
  
  // Handler functions
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };
  
  const handleConsultationChange = (type) => {
    setConsultationType(type);
  };
  
  const handleSpecialtyChange = (specialty, isChecked) => {
    // Clear all if 'specialty' is an array and 'isChecked' is false
    if (Array.isArray(specialty) && isChecked === false) {
      setSelectedSpecialties([]);
      return;
    }
  
    // Otherwise, toggle individual specialty
    if (isChecked) {
      setSelectedSpecialties(prev => [...prev, specialty]);
    } else {
      setSelectedSpecialties(prev => prev.filter(s => s !== specialty));
    }
  };
  
  
  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };
  
  return (
    <div className="app">
      <Navbar />
      <header className="app-header">
        <SearchBar 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange} 
          doctors={doctors}
        />
      </header>
      
      <div className="app-content">
        <FilterPanel 
          consultationType={consultationType}
          onConsultationChange={handleConsultationChange}
          selectedSpecialties={selectedSpecialties}
          onSpecialtyChange={handleSpecialtyChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          doctors={doctors}
        />
        
        <main className="doctor-list-container">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <DoctorList doctors={filteredDoctors} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;