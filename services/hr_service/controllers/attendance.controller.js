import {
  getAllAttendanceService, 
  updateEditTimesService, 
  getTodayAttendanceService,
  addAttendanceService,
  addAttendanceWithShiftService,
  updateAttendanceStatusService
} from './../services/attendance.service.js'

export const getAllAttendance = async (req, res) => {
    try {
      const attendance = await getAllAttendanceService();
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

export const getTodayAttendance = async (req, res) => {
    try {
      const attendance = await getTodayAttendanceService();
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

export const updateEditTimes = async (req, res) => {
  try {
    const { id } = req.params;
    const { editInTime, editOutTime } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Attendance ID is required' });
    }
    
    if (!editInTime && !editOutTime) {
      return res.status(400).json({ error: 'At least one edit time (editInTime or editOutTime) is required' });
    }
    
    const result = await updateEditTimesService(id, editInTime, editOutTime);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new attendance record (automatic shift detection)
export const addAttendance = async (req, res) => {
  try {
    const result = await addAttendanceService(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.message.includes('required') || err.message.includes('not found')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// Add new attendance record with specific shift
export const addAttendanceWithShift = async (req, res) => {
  try {
    const result = await addAttendanceWithShiftService(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.message.includes('required') || err.message.includes('not found') || err.message.includes('not assigned')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// Update attendance status (for clock out or corrections)
export const updateAttendanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateAttendanceStatusService(id, req.body);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    res.json(result);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};