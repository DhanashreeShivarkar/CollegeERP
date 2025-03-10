import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../../api/axios';
import AcademicYearEditModal from "./AcademicYearEditModal";
import { Button } from "react-bootstrap";

interface AcademicYearFormInputs {
  ID?: number; 
  UNIVERSITY?: number;
  INSTITUTE?: string;
  ACADEMIC_YEAR: string;
  START_DATE: string;
  END_DATE: string;
}

interface University {
  UNIVERSITY_ID: number;
  NAME: string;
  CODE: string;
}

interface Institute {
  INSTITUTE_ID: number;
  CODE: string;
}

const AcademicYearMaster: React.FC = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AcademicYearFormInputs>();
  const [universities, setUniversities] = useState<University[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<number | "">("");
  const [error, setError] = useState("");
  const [academicYears, setAcademicYears] = useState<AcademicYearFormInputs[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showEditCard, setShowEditCard] = useState(false);
  const [editingItem, setEditingItem] = useState<AcademicYearFormInputs | null>(null);
  const [selectedItem, setSelectedItem] = useState<Partial<AcademicYearFormInputs> | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);


  useEffect(() => {
    console.log("Current editing ID:", editingId);
    const fetchUniversities = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axiosInstance.get('/api/master/universities/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUniversities(response.data);
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
        setError('Failed to load universities');
      }
    };
    fetchUniversities();
  }, []);

  const fetchInstitutes = async (universityId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axiosInstance.get(`/api/master/institutes/?university_id=${universityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setInstitutes(response.data);
      }
    } catch (error) {
      console.error('Error fetching institutes:', error);
      setError('Failed to load institutes');
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }

      const response = await axiosInstance.get('/api/master/academic-years/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setAcademicYears(response.data);
      } else {
        console.error('Unexpected response status:', response.status, response.data);
      }
    } catch (error: any) {
      if (error.response) {
        console.error('API Response Error:', error.response.data);
        alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('Error fetching academic years:', error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const onSubmit: SubmitHandler<AcademicYearFormInputs> = async (data) => {
    console.log("Editing ID at submit:", editingId);
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication token not found. Please log in again.');
            return;
        }

        const payload = {
            INSTITUTE: data.INSTITUTE,
            ACADEMIC_YEAR: data.ACADEMIC_YEAR,
            START_DATE: data.START_DATE,
            END_DATE: data.END_DATE,
        };

        console.log("Final payload before submission:", payload);

        if (editingId !== null) {
            console.log("Calling handleUpdate for ID:", editingId);
            await handleUpdate(editingId, payload);  // Call handleUpdate function
        } else {
            console.log("Creating a new record");
            // Add new record
            const response = await axiosInstance.post('/api/master/academic-years/', payload, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });

            if (response.status === 201) {
                alert('Academic Year saved successfully!');
            } else {
                console.error('Unexpected response status:', response.status, response.data);
            }
        }

        reset();
        setEditingId(null);
        setSelectedUniversity("");
        setInstitutes([]);
        await fetchAcademicYears();
    } catch (error: any) {
        if (error.response) {
            console.error('API Response Error:', error.response.data);
            alert(`Error: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error('Error saving academic year:', error.message);
            alert(`Error: ${error.message}`);
        }
    }
    setShowEditModal(false);
};

// const handleEditClick = (item: AcademicYearFormInputs) => {
//   setSelectedItem(item);
//   setShowEditModal(true);
// };
const handleEditClick = (item: AcademicYearFormInputs) => {
  console.log("Editing item:", item);
  setSelectedItem(item);
  setEditingId(item.ID || null);
  console.log("Editing ID set to:", item.ID || null); 
  setShowEditModal(true);
};

const handleUpdate = async (id: number | string, payload: { 
  INSTITUTE?: string; 
  ACADEMIC_YEAR: string; 
  START_DATE: string; 
  END_DATE: string; 
}) => {
  try {
      const token = localStorage.getItem('token');
      if (!token) {
          alert('Authentication token not found. Please log in again.');
          return;
      }

      await axiosInstance.put(`/api/master/academic-years/${id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
      });

      alert('Academic Year updated successfully!');
      setEditingId(null);
  } catch (error: any) {
      if (error.response) {
          console.error('API Response Error:', error.response.data);
          alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
          console.error('Error updating academic year:', error.message);
          alert(`Error: ${error.message}`);
      }
  }
};


  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        await axiosInstance.delete(`/api/master/academic-years/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Entry deleted successfully!');
        fetchAcademicYears();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const universityId = parseInt(e.target.value);
    setSelectedUniversity(universityId || "");
    setInstitutes([]); 
    if (universityId) {
      fetchInstitutes(universityId);
    }
  };

  const handleShowClick = () => {
    fetchAcademicYears();
  };

  const handleCancelEdit = () => {
    setShowEditCard(false);
    setEditingId(null);
    reset();
  };

  return (
    <motion.div className="container my-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="card shadow-lg border-0 rounded-4">  

        <div className="card-body p-5">
          <h2 className="text-center mb-4">Academic Year Master Form</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <motion.div className="mb-3" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.02 }}>
              <label>University</label>
              <select className="form-control" {...register('UNIVERSITY', { required: 'University is required' })} onChange={handleUniversityChange}>
                <option value="">Select University</option>
                {universities.map((university) => (
                  <option key={university.UNIVERSITY_ID} value={university.UNIVERSITY_ID}>{university.NAME}</option>
                ))}
              </select>
              {errors.UNIVERSITY && <p className="text-danger mt-1">{errors.UNIVERSITY.message}</p>}
            </motion.div>

            <motion.div className="mb-3" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} whileHover={{ scale: 1.02 }}>
              <label>Institute</label>
              <select className="form-control" {...register('INSTITUTE', { required: 'Institute Code is required' })} defaultValue="">
                <option value="">Select Institute</option>
                {institutes.map((institute) => (
                  <option key={institute.INSTITUTE_ID} value={institute.CODE}>{institute.CODE}</option>
                ))}
              </select>
              {errors.INSTITUTE && <p className="text-danger mt-1">{errors.INSTITUTE.message}</p>}
            </motion.div>

            <motion.div className="mb-3" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} whileHover={{ scale: 1.02 }}>
              <label htmlFor="academicYear">Academic Year</label>
              <select id="academicYear" className="form-control" {...register('ACADEMIC_YEAR', { required: 'Academic Year is required' })} defaultValue="">
                <option value="" disabled> Select Academic Year </option>
                {Array.from({ length: 10 }, (_, i) => {
                  const startYear = 2025 + i;
                  const endYear = startYear + 1;
                  return (
                  <option key={startYear} value={`${startYear}-${endYear}`}>
                    {`${startYear}-${endYear}`}
                    </option>
                    );
                    })}
                    </select>
                    {errors.ACADEMIC_YEAR && (
                      <p className="text-danger mt-1">{errors.ACADEMIC_YEAR.message}</p>
                      )}
            </motion.div>

            <motion.div className="row mb-3" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} whileHover={{ scale: 1.02 }}>
              <div className="col-md-6">
                <label>Start Date</label>
                <input type="date" className="form-control" {...register('START_DATE', { required: 'Start Date is required' })} />
                {errors.START_DATE && <p className="text-danger mt-1">{errors.START_DATE.message}</p>}
              </div>
              <div className="col-md-6">
                <label>End Date</label>
                <input type="date" className="form-control" {...register('END_DATE', { required: 'End Date is required' })} />
                {errors.END_DATE && <p className="text-danger mt-1">{errors.END_DATE.message}</p>}
              </div>
            </motion.div>

            <motion.div className="text-center" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9 }}>
            <button type="submit" className="btn btn-primary me-2">
              {editingId !== null ? 'Update' : 'Save'}
            </button>
              <button type="button" className="btn btn-outline-secondary" onClick={handleShowClick}>Show</button>
            </motion.div>
          </form>

          {academicYears.length > 0 && (
            <motion.div className="mt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <h3 className="text-center mb-4">Academic Year Entries</h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Institute Code</th>
                    <th>Academic Year</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {academicYears.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.INSTITUTE}</td>
                      <td>{entry.ACADEMIC_YEAR}</td>
                      <td>{entry.START_DATE}</td>
                      <td>{entry.END_DATE}</td>
                      <td>
                      <Button variant="primary" onClick={() => handleEditClick(entry)}>Edit</Button>

                        <button className="btn btn-danger" onClick={() => handleDeleteClick(entry.ID!)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                    {/* Modal for Editing */}
      {selectedItem && (
        <AcademicYearEditModal
          show={showEditModal}
          item={selectedItem}
        onSave={onSubmit}

          onClose={() => setShowEditModal(false)}
        />
      )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AcademicYearMaster;
