import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function generateStudentID(
  courseCode: string,
  admissionDate: Date,
  admissionType: string
): Promise<string> {
  // Get year from admission date
  const year = admissionDate.getFullYear();
  
  // Find the latest number for this combination
  const latestStudent = await prisma.mASTER_STUDENT.findFirst({
    where: {
      COURSE_CODE: courseCode,
      ADMISSION_DATE: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      },
      ADMISSION_TYPE: admissionType,
    },
    orderBy: {
      USER_ID: 'desc',
    },
  });

  // Generate next number
  const nextNumber = latestStudent ? parseInt(latestStudent.USER_ID.slice(-3)) + 1 : 1;
  
  // Format the ID: BT2023F001
  return `${courseCode}${year}${admissionType}${nextNumber.toString().padStart(3, '0')}`;
}

export async function generateEmployeeID(
  employeeType: string,
  joiningDate: Date
): Promise<string> {
  // Get year from joining date
  const year = joiningDate.getFullYear();
  
  // Find the latest number for this combination
  const latestEmployee = await prisma.mASTER_FACULTY.findFirst({
    where: {
      EMPLOYEE_TYPE: employeeType,
      JOINING_DATE: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      },
    },
    orderBy: {
      USER_ID: 'desc',
    },
  });

  // Generate next number
  const nextNumber = latestEmployee ? parseInt(latestEmployee.USER_ID.slice(-3)) + 1 : 1;
  
  // Format the ID: EM2023T001
  return `EM${year}${employeeType}${nextNumber.toString().padStart(3, '0')}`;
}

// Generate random password
export function generatePassword(): string {
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}
