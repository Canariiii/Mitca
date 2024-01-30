const Admin = require('../models/admin');
const User = require('../models/user');

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    console.error('Error getting all admins:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error('Error getting admin by ID:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateAdminById = async (req, res) => {
  try {
    const { adminData } = req.body;
    const adminId = req.params.adminId;
    
    console.log('Received PUT request for adminId:', adminId);
    const admin = await Admin.findByIdAndUpdate(adminId, adminData, {
      new: true,
      runValidators: true,
    });
    
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    
    res.status(200).json({ success: true, data: admin });
    
  } catch (error) {
    console.error('Error updating admin by ID:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteAdminById = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const admin = await Admin.findByIdAndDelete(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting admin by ID:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const newAdminData = req.body;
    const newAdmin = new Admin(newAdminData);
    await newAdmin.save();

    res.status(201).json({ success: true, data: newAdmin });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
