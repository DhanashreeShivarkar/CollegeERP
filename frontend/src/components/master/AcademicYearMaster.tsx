import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../../api/axios';

interface AcademicYearFormInputs {
  UNIVERSITY: number;
  INSTITUTE_CODE: string;
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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AcademicYearFormInputs>();
  const [universities, setUniversities] = useState<University[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<number | "">("");
  const [error, setError] = useState("");
  const [academicYears, setAcademicYears] = useState<AcademicYearFormInputs[]>([]);

  useEffect(() => {
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
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication token not found. Please log in again.');
            return;
        }

        const payload = {
          INSTITUTE_CODE: data.INSTITUTE_CODE,
          ACADEMIC_YEAR: data.ACADEMIC_YEAR,
          START_DATE: data.START_DATE,
          END_DATE: data.END_DATE,
        };

        const response = await axiosInstance.post('/api/master/academic-years/', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 201) {
            alert('Academic Year saved successfully!');
            reset();
            setSelectedUniversity("");
            setInstitutes([]);
        } else {
            console.error('Unexpected response status:', response.status, response.data);
        }
    } catch (error: any) {
        if (error.response) {
            console.error('API Response Error:', error.response.data);
            alert(`Error: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error('Error saving academic year:', error.message);
            alert(`Error: ${error.message}`);
        }
    }
  };

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const universityId = parseInt(e.target.value);
    setSelectedUniversity(universityId || "");
    setInstitutes([]); // Reset institutes on university change
    if (universityId) {
      fetchInstitutes(universityId);
    }
  };

  const handleShowClick = () => {
    fetchAcademicYears();
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
              <select className="form-control" {...register('INSTITUTE_CODE', { required: 'Institute Code is required' })} defaultValue="">
                <option value="">Select Institute</option>
                {institutes.map((institute) => (
                  <option key={institute.INSTITUTE_ID} value={institute.CODE}>{institute.CODE}</option>
                ))}
              </select>
              {errors.INSTITUTE_CODE && <p className="text-danger mt-1">{errors.INSTITUTE_CODE.message}</p>}
            </motion.div>

            <motion.div className="mb-3" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} whileHover={{ scale: 1.02 }}>
              <label>Academic Year</label>
              <input type="text" className="form-control" placeholder="Enter Academic Year" {...register('ACADEMIC_YEAR', { required: 'Academic Year is required' })} />
              {errors.ACADEMIC_YEAR && <p className="text-danger mt-1">{errors.ACADEMIC_YEAR.message}</p>}
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
              <button type="submit" className="btn btn-primary me-2">Save</button>
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
                      <td>{entry.INSTITUTE_CODE}</td>
                      <td>{entry.ACADEMIC_YEAR}</td>
                      <td>{entry.START_DATE}</td>
                      <td>{entry.END_DATE}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AcademicYearMaster;