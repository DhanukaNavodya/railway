import express from 'express';
import {
  getAllAttendance, 
  getTodayAttendance, 
  updateEditTimes,
  addAttendance,
  addAttendanceWithShift,
  updateAttendanceStatus
} from '../controllers/attendance.controller.js'

const router = express.Router();

router.get('/', getAllAttendance);
router.get('/today', getTodayAttendance);
router.post('/', addAttendance);                                     // Add attendance (auto-detect shift)
router.post('/with-shift', addAttendanceWithShift);                  // Add attendance (specify shift)
router.put('/:id/edit-times', updateEditTimes);
router.put('/:id/status', updateAttendanceStatus);                   // Update attendance status

export default router;