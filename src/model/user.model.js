const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { createHashValue, isValidPasswd } = require("../utils/encrypt");
const validator = require('validator');

const roleType = {
  user: "user",
  admin: "admin",
  public: "public",
};

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email format');
      }
    },
  },
  age: {
    type: Number,
    required: true,
    min: 1,             // Enforces minimum age of 1
  },
  password: {
    type: String,
    required: true,
    minlength: 5,       // Enforces minimum password length
    trim: true,
  },
  role: {
    type: String,
    enum: Object.values(roleType), // ['admin', 'public', 'user']
    default: 'user',
  },
  carts: {
    type: [
      {
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        },
        _id: false,
      },
    ],
    default: [],
  },
},
  {
    timestamps: true, // Automatically adds timestamps for created/updated at
  });

userSchema.plugin(mongoosePaginate);

userSchema.pre("find", function () {
  this.populate("carts.cart");
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this; // Reference the current user object

  if (user.isModified('password')) { // Check if password is modified
    const pswHashed = await createHashValue(user.password);
    user.password = await pswHashed; // Hash with a cost factor of 10
  }

  next();
});

const collection = "users";
const userModel = mongoose.model(collection, userSchema);

async function getAllUsers() {
  try {
    const users = await userModel.find();
    return users;
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    console.error(`Error details: ${error.stack}`);
  }
}

module.exports = { userModel, getAllUsers };
