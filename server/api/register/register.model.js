'use strict';

import mongoose from 'mongoose';

var RegisterSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Register', RegisterSchema);
