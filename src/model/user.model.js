const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "Users";

const roleType = {
  USER: "USER",
  ADMIN: "ADMIN",
  PUBLIC: "PUBLIC",
};

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(roleType), // ['ADMIN', 'PUBLIC', 'USER']
  },
  notes: {
    type: [
      {
        note: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "notes",
        },
      },
    ],
    default: [],
  },
});

userSchema.plugin(mongoosePaginate);

userSchema.pre("find", function () {
  this.populate("notes.note");
});

const userModel = mongoose.model(collection, userSchema);

async function getAllUsers() {
  try {
    const users = await userModel.find();
    return users;
  } catch (error) {
    // Handle the error
    console.error(`An error occurred: ${error.message}`);
    // You can include additional details using interpolation
    console.error(`Error details: ${error.stack}`);
  }
}

module.exports = { userModel, getAllUsers };
