export interface EmployeeFormData {
  institute: string; // renamed from instituteId
  department: string; // Change back to string
  shortCode: string;
  empType: string;
  empName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: Date | null;
  designation: string;
  permanentAddress: string;
  email: string;
  localAddress: string;
  panNo: string;
  permanentCity: string;
  permanentPinNo: string;
  drivingLicNo: string;
  sex: string;
  status: string;
  maritalStatus: string;
  dateOfJoin: Date | null;
  localCity: string;
  localPinNo: string;
  position: string;
  shift: string;
  bloodGroup: string;
  active: string;
  phoneNo: string;
  mobileNo: string;
  category: string; // Change back to string
  bankAccountNo: string;
  unaNo: string;
  profileImage: File | null;
}
