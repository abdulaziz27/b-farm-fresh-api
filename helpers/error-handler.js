function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      // JWT authentication error
      return res.status(401).json({ message: 'User is not authorized' });
    }
  
    if (err.name === 'ValidationError') {
      // Validation error
      const errors = [];
      for (let field in err.errors) {
        errors.push({ field: field, message: err.errors[field].message });
      }
      return res.status(400).json({ errors });
    }
  
    if (err.name === 'CastError') {
        // MongoDB data type conversion error
        return res.status(400).json({ message: 'Data type conversion error' });
    }
  
    if (err.code === 11000) {
        // MongoDB duplicate key error
        return res.status(409).json({ message: 'Duplicate data' });
    }

    if (err.name === 'SyntaxError') {
        // Error sintaks JSON yang tidak valid
        return res.status(400).json({ message: 'JSON tidak valid' });
      }
    
    if (err.name === 'ReferenceError') {
        // Error referensi variabel yang tidak ditemukan
        return res.status(500).json({ message: 'Terjadi kesalahan referensi' });
    }

    if (err.name === 'RangeError') {
        // Error range angka yang tidak valid
        return res.status(400).json({ message: 'Angka tidak valid' });
      }

    if (err.name === 'MongoError') {
        // Error MongoDB
        return res.status(500).json({ message: 'Terjadi kesalahan dalam database' });
    }
  
    // Default: Server error 500
    return res.status(500).json({ message: 'Server error occurred' });
  }
  
  module.exports = errorHandler;  