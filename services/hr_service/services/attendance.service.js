import db from '../config/db.js';

export const getAllAttendanceService = async () => {
  const [rows] = await db.query(`
    SELECT a.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode, d.Name as DepartmentName
    FROM hr_attendance a 
    LEFT JOIN hr_employee e ON a.EmpID = e.ID
    LEFT JOIN hr_department d ON e.department_id = d.ID
    ORDER BY a.updated_at DESC
  `);
  return rows;
};

export const getAttendanceByIdService = async (id) => {
  const [rows] = await db.query(`
    SELECT a.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode
    FROM hr_attendance a 
    LEFT JOIN hr_employee e ON a.EmpID = e.ID 
    WHERE a.ID = ?
  `, [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const createAttendanceService = async (attendanceData) => {
  const {
    EmpID, FingerprintID, InTime, OutTime, InUser = 0, OutUser = 0, 
    InApproval = 0, OutApproval = 0, Shift
  } = attendanceData;
  
  const [result] = await db.query(`
    INSERT INTO hr_attendance (
      EmpID, FingerprintID, InTime, OutTime, InUser, OutUser, 
      InApproval, OutApproval, Shift
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    EmpID, FingerprintID, InTime, OutTime, InUser, OutUser, 
    InApproval, OutApproval, Shift
  ]);
  
  return { id: result.insertId, message: 'Attendance record created successfully' };
};

export const updateAttendanceService = async (id, attendanceData) => {
  const {
    EmpID, FingerprintID, InTime, OutTime, InUser, OutUser, 
    InApproval, OutApproval, Shift
  } = attendanceData;
  
  const [result] = await db.query(`
    UPDATE hr_attendance SET 
      EmpID = ?, FingerprintID = ?, InTime = ?, OutTime = ?, 
      InUser = ?, OutUser = ?, InApproval = ?, OutApproval = ?, Shift = ?
    WHERE ID = ?
  `, [
    EmpID, FingerprintID, InTime, OutTime, InUser, OutUser, 
    InApproval, OutApproval, Shift, id
  ]);
  
  return { message: 'Attendance record updated successfully', affectedRows: result.affectedRows };
};

export const deleteAttendanceService = async (id) => {
  const [result] = await db.query('DELETE FROM hr_attendance WHERE ID = ?', [id]);
  return { message: 'Attendance record deleted successfully', affectedRows: result.affectedRows };
};

// Get attendance by employee ID
export const getAttendanceByEmployeeService = async (empId) => {
  const [rows] = await db.query(`
    SELECT a.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode, d.Name as DepartmentName
    FROM hr_attendance a 
    LEFT JOIN hr_employee e ON a.EmpID = e.ID
    LEFT JOIN hr_department d ON e.department_id = d.ID 
    WHERE a.EmpID = ?
    ORDER BY a.updated_at DESC
  `, [empId]);
  return rows;
};

// Get attendance by date range
export const getAttendanceByDateRangeService = async (startDate, endDate) => {
  const [rows] = await db.query(`
    SELECT a.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode, d.Name as DepartmentName
    FROM hr_attendance a 
    LEFT JOIN hr_employee e ON a.EmpID = e.ID
    LEFT JOIN hr_department d ON e.department_id = d.ID 
    WHERE DATE(a.updated_at) BETWEEN ? AND ?
    ORDER BY a.updated_at DESC
  `, [startDate, endDate]);
  return rows;
};

// Get today's attendance
export const getTodayAttendanceService = async () => {
  const [rows] = await db.query(`
    SELECT a.*, e.Name as EmployeeName, e.EmployeeID as EmployeeCode, d.Name as DepartmentName
    FROM hr_attendance a 
    LEFT JOIN hr_employee e ON a.EmpID = e.ID
    LEFT JOIN hr_department d ON e.department_id = d.ID
    WHERE DATE(a.updated_at) = CURDATE()
    ORDER BY a.updated_at DESC
  `);
  return rows;
};

// Clock in
export const clockInService = async (empId, fingerprintId, shift) => {
  const [result] = await db.query(`
    INSERT INTO hr_attendance (EmpID, FingerprintID, InTime, Shift, InUser, InApproval)
    VALUES (?, ?, NOW(), ?, 1, 1)
  `, [empId, fingerprintId, shift]);
  
  return { id: result.insertId, message: 'Clock in recorded successfully' };
};

// Clock out
export const clockOutService = async (id) => {
  const [result] = await db.query(`
    UPDATE hr_attendance 
    SET OutTime = NOW(), OutUser = 1, OutApproval = 1
    WHERE ID = ? AND OutTime IS NULL
  `, [id]);
  
  return { message: 'Clock out recorded successfully', affectedRows: result.affectedRows };
};

// Update approval status
export const updateApprovalStatusService = async (id, inApproval, outApproval) => {
  const [result] = await db.query(`
    UPDATE hr_attendance 
    SET InApproval = ?, OutApproval = ?
    WHERE ID = ?
  `, [inApproval, outApproval, id]);
  
  return { message: 'Approval status updated successfully', affectedRows: result.affectedRows };
}; 

// Update EditInTime and EditOutTime
export const updateEditTimesService = async (id, editInTime, editOutTime) => {
  const [result] = await db.query(`
    UPDATE hr_attendance 
    SET EditInTime = ?, EditOutTime = ?
    WHERE ID = ?
  `, [editInTime, editOutTime, id]);
  
  return { message: 'Edit times updated successfully', affectedRows: result.affectedRows };
};

// Add new attendance record with automatic shift detection and status determination
export const addAttendanceService = async (attendanceData) => {
  const {
    EmpID,
    FingerprintID,
    InTime,
    OutTime = null,
    InUser = 1,
    OutUser = 0,
    InApproval = 1,
    OutApproval = 0,
    Shift
  } = attendanceData;

  // Validate required fields
  if (!EmpID || !FingerprintID || !InTime) {
    throw new Error('EmpID, FingerprintID, and InTime are required fields');
  }

  // Get all employee shift information to determine which shift this attendance belongs to
  const [allShifts] = await db.query(`
    SELECT 
      s.id as shift_id,
      s.ShiftType,
      s.StartTime,
      s.EndTime,
      s.MaxArrivalDelay,
      s.LatestLeave,
      s.OTStartHours,
      s.Status as shift_status,
      e.Name as employee_name,
      e.EmployeeID as employee_code
    FROM hr_employee e
    INNER JOIN hr_employeeShift es ON e.ID = es.employee_id
    INNER JOIN hr_shift s ON es.shift_id = s.id
    WHERE e.ID = ? AND s.Status = 'active'
    ORDER BY s.StartTime ASC
  `, [EmpID]);

  if (allShifts.length === 0) {
    throw new Error('Employee shift information not found');
  }

  // Determine which shift this attendance belongs to based on arrival time
  const inDateTime = new Date(InTime);
  const arrivalTime = inDateTime.toTimeString().split(' ')[0]; // Get HH:MM:SS format
  
  let selectedShift = null;
  let bestMatch = null;
  let smallestTimeDiff = Infinity;

  // Find the most appropriate shift based on arrival time
  for (const shift of allShifts) {
    const shiftStartTime = shift.StartTime;
    const maxDelayMinutes = shift.MaxArrivalDelay || 0;
    
    // Calculate the time difference between arrival and shift start
    const [arrivalHours, arrivalMinutes] = arrivalTime.split(':').map(Number);
    const [shiftHours, shiftMinutes] = shiftStartTime.split(':').map(Number);
    
    const arrivalMinutesFromMidnight = arrivalHours * 60 + arrivalMinutes;
    const shiftMinutesFromMidnight = shiftHours * 60 + shiftMinutes;
    
    // Calculate time difference (handle day crossing if needed)
    let timeDiff = arrivalMinutesFromMidnight - shiftMinutesFromMidnight;
    
    // If arrival is within the acceptable range for this shift
    if (timeDiff >= 0 && timeDiff <= (maxDelayMinutes + 240)) { // Allow up to 4 hours late
      if (timeDiff < smallestTimeDiff) {
        smallestTimeDiff = timeDiff;
        bestMatch = shift;
      }
    }
  }

  // If no shift found based on timing, use the closest shift by start time
  if (!bestMatch) {
    const [arrivalHours, arrivalMinutes] = arrivalTime.split(':').map(Number);
    const arrivalMinutesFromMidnight = arrivalHours * 60 + arrivalMinutes;
    
    for (const shift of allShifts) {
      const [shiftHours, shiftMinutes] = shift.StartTime.split(':').map(Number);
      const shiftMinutesFromMidnight = shiftHours * 60 + shiftMinutes;
      
      const timeDiff = Math.abs(arrivalMinutesFromMidnight - shiftMinutesFromMidnight);
      
      if (timeDiff < smallestTimeDiff) {
        smallestTimeDiff = timeDiff;
        bestMatch = shift;
      }
    }
  }

  const shiftData = bestMatch;
  
  // Determine attendance status based on timing
  let attendanceStatus = 'Present';
  
  // Calculate if employee is late
  const shiftStartTime = shiftData.StartTime;
  const maxDelayMinutes = shiftData.MaxArrivalDelay || 0;
  
  // Create expected arrival time (shift start + max delay)
  const [hours, minutes, seconds] = shiftStartTime.split(':').map(Number);
  const shiftStartDateTime = new Date(inDateTime);
  shiftStartDateTime.setHours(hours, minutes, seconds, 0);
  
  const allowedArrivalTime = new Date(shiftStartDateTime.getTime() + (maxDelayMinutes * 60 * 1000));
  
  // Determine status based on arrival time
  if (inDateTime > allowedArrivalTime) {
    const delayMinutes = Math.floor((inDateTime - shiftStartDateTime) / (1000 * 60));
    if (delayMinutes > (maxDelayMinutes + 240)) { // More than 4 hours late
      attendanceStatus = 'Absent';
    } else {
      attendanceStatus = 'Late'; // Any late arrival is marked as 'Late' instead of 'Half Day'
    }
  } else {
    attendanceStatus = 'Present';
  }

  // If OutTime is provided, check for early departure
  if (OutTime) {
    const outDateTime = new Date(OutTime);
    const [endHours, endMinutes, endSeconds] = shiftData.EndTime.split(':').map(Number);
    const shiftEndDateTime = new Date(outDateTime);
    shiftEndDateTime.setHours(endHours, endMinutes, endSeconds, 0);
    
    // If leaving more than 1 hour early, mark as Half Day
    if (outDateTime < (shiftEndDateTime.getTime() - (60 * 60 * 1000))) {
      if (attendanceStatus === 'Present') {
        attendanceStatus = 'Half Day';
      }
    }
  }

  // Insert attendance record
  const [result] = await db.query(`
    INSERT INTO hr_attendance (
      EmpID, 
      FingerprintID, 
      InTime, 
      OutTime, 
      InUser, 
      OutUser, 
      InApproval, 
      OutApproval, 
      Shift, 
      attendance_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    EmpID,
    FingerprintID,
    InTime,
    OutTime,
    InUser,
    OutUser,
    InApproval,
    OutApproval,
    Shift || shiftData.ShiftType,
    attendanceStatus
  ]);

  return {
    id: result.insertId,
    attendance_status: attendanceStatus,
    selected_shift: {
      shift_id: shiftData.shift_id,
      shift_type: shiftData.ShiftType,
      start_time: shiftData.StartTime,
      end_time: shiftData.EndTime,
      max_delay_minutes: shiftData.MaxArrivalDelay
    },
    all_employee_shifts: allShifts.map(shift => ({
      shift_id: shift.shift_id,
      shift_type: shift.ShiftType,
      start_time: shift.StartTime,
      end_time: shift.EndTime,
      max_delay_minutes: shift.MaxArrivalDelay
    })),
    timing_analysis: {
      expected_arrival: shiftStartDateTime.toTimeString().split(' ')[0],
      allowed_arrival: allowedArrivalTime.toTimeString().split(' ')[0],
      actual_arrival: inDateTime.toTimeString().split(' ')[0],
      delay_minutes: Math.max(0, Math.floor((inDateTime - shiftStartDateTime) / (1000 * 60))),
      shift_selection_reason: bestMatch ? 'Closest match based on arrival time' : 'Default fallback'
    },
    message: 'Attendance record created successfully'
  };
};

// Add attendance with specific shift (manual shift selection)
export const addAttendanceWithShiftService = async (attendanceData) => {
  const {
    EmpID,
    FingerprintID,
    InTime,
    OutTime = null,
    InUser = 1,
    OutUser = 0,
    InApproval = 1,
    OutApproval = 0,
    shift_id, // Manually specified shift ID
    Shift
  } = attendanceData;

  // Validate required fields
  if (!EmpID || !FingerprintID || !InTime || !shift_id) {
    throw new Error('EmpID, FingerprintID, InTime, and shift_id are required fields');
  }

  // Get specific shift information
  const [shiftInfo] = await db.query(`
    SELECT 
      s.id as shift_id,
      s.ShiftType,
      s.StartTime,
      s.EndTime,
      s.MaxArrivalDelay,
      s.LatestLeave,
      s.OTStartHours,
      s.Status as shift_status,
      e.Name as employee_name,
      e.EmployeeID as employee_code
    FROM hr_employee e
    INNER JOIN hr_employeeShift es ON e.ID = es.employee_id
    INNER JOIN hr_shift s ON es.shift_id = s.id
    WHERE e.ID = ? AND s.id = ? AND s.Status = 'active'
  `, [EmpID, shift_id]);

  if (shiftInfo.length === 0) {
    throw new Error('Employee is not assigned to the specified shift or shift is inactive');
  }

  const shiftData = shiftInfo[0];
  
  // Calculate attendance status using the specified shift
  let attendanceStatus = 'Present';
  const inDateTime = new Date(InTime);
  
  const shiftStartTime = shiftData.StartTime;
  const maxDelayMinutes = shiftData.MaxArrivalDelay || 0;
  
  const [hours, minutes, seconds] = shiftStartTime.split(':').map(Number);
  const shiftStartDateTime = new Date(inDateTime);
  shiftStartDateTime.setHours(hours, minutes, seconds, 0);
  
  const allowedArrivalTime = new Date(shiftStartDateTime.getTime() + (maxDelayMinutes * 60 * 1000));
  
  if (inDateTime > allowedArrivalTime) {
    const delayMinutes = Math.floor((inDateTime - shiftStartDateTime) / (1000 * 60));
    if (delayMinutes > (maxDelayMinutes + 240)) {
      attendanceStatus = 'Absent';
    } else {
      attendanceStatus = 'Late'; // Any late arrival is marked as 'Late' instead of 'Half Day'
    }
  }

  // Check for early departure if OutTime provided
  if (OutTime) {
    const outDateTime = new Date(OutTime);
    const [endHours, endMinutes, endSeconds] = shiftData.EndTime.split(':').map(Number);
    const shiftEndDateTime = new Date(outDateTime);
    shiftEndDateTime.setHours(endHours, endMinutes, endSeconds, 0);
    
    if (outDateTime < (shiftEndDateTime.getTime() - (60 * 60 * 1000))) {
      if (attendanceStatus === 'Present') {
        attendanceStatus = 'Half Day';
      }
    }
  }

  // Insert attendance record
  const [result] = await db.query(`
    INSERT INTO hr_attendance (
      EmpID, 
      FingerprintID, 
      InTime, 
      OutTime, 
      InUser, 
      OutUser, 
      InApproval, 
      OutApproval, 
      Shift, 
      attendance_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    EmpID,
    FingerprintID,
    InTime,
    OutTime,
    InUser,
    OutUser,
    InApproval,
    OutApproval,
    Shift || shiftData.ShiftType,
    attendanceStatus
  ]);

  return {
    id: result.insertId,
    attendance_status: attendanceStatus,
    selected_shift: {
      shift_id: shiftData.shift_id,
      shift_type: shiftData.ShiftType,
      start_time: shiftData.StartTime,
      end_time: shiftData.EndTime,
      max_delay_minutes: shiftData.MaxArrivalDelay
    },
    timing_analysis: {
      expected_arrival: shiftStartDateTime.toTimeString().split(' ')[0],
      allowed_arrival: allowedArrivalTime.toTimeString().split(' ')[0],
      actual_arrival: inDateTime.toTimeString().split(' ')[0],
      delay_minutes: Math.max(0, Math.floor((inDateTime - shiftStartDateTime) / (1000 * 60))),
      shift_selection_reason: 'Manually specified shift'
    },
    message: 'Attendance record created successfully with specified shift'
  };
};

// Update attendance record (for clock out or corrections)
export const updateAttendanceStatusService = async (attendanceId, updateData) => {
  const { OutTime, InTime, attendance_status } = updateData;

  // Get existing attendance record
  const [existingRecord] = await db.query(`
    SELECT a.*, e.ID as employee_id
    FROM hr_attendance a
    INNER JOIN hr_employee e ON a.EmpID = e.ID
    WHERE a.ID = ?
  `, [attendanceId]);

  if (existingRecord.length === 0) {
    throw new Error('Attendance record not found');
  }

  const currentRecord = existingRecord[0];
  let newStatus = attendance_status || currentRecord.attendance_status;

  // If updating OutTime, recalculate status
  if (OutTime && !attendance_status) {
    // Get shift information for status calculation
    const [shiftInfo] = await db.query(`
      SELECT s.EndTime, s.LatestLeave
      FROM hr_employeeShift es
      INNER JOIN hr_shift s ON es.shift_id = s.id
      WHERE es.employee_id = ?
      LIMIT 1
    `, [currentRecord.employee_id]);

    if (shiftInfo.length > 0) {
      const outDateTime = new Date(OutTime);
      const [endHours, endMinutes, endSeconds] = shiftInfo[0].EndTime.split(':').map(Number);
      const shiftEndDateTime = new Date(outDateTime);
      shiftEndDateTime.setHours(endHours, endMinutes, endSeconds, 0);

      // Check for early departure
      if (outDateTime < (shiftEndDateTime.getTime() - (60 * 60 * 1000))) {
        if (currentRecord.attendance_status === 'Present') {
          newStatus = 'Half Day';
        }
      }
    }
  }

  // Update the record
  const updateFields = [];
  const updateValues = [];

  if (OutTime) {
    updateFields.push('OutTime = ?');
    updateValues.push(OutTime);
    updateFields.push('OutUser = ?');
    updateValues.push(1);
    updateFields.push('OutApproval = ?');
    updateValues.push(1);
  }

  if (InTime) {
    updateFields.push('InTime = ?');
    updateValues.push(InTime);
  }

  if (newStatus !== currentRecord.attendance_status) {
    updateFields.push('attendance_status = ?');
    updateValues.push(newStatus);
  }

  updateValues.push(attendanceId);

  const [result] = await db.query(`
    UPDATE hr_attendance SET ${updateFields.join(', ')}
    WHERE ID = ?
  `, updateValues);

  return {
    message: 'Attendance record updated successfully',
    attendance_status: newStatus,
    affectedRows: result.affectedRows
  };
}; 