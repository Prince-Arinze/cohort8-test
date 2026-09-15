const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
       const userExist = await userModel.findOne({email});
       if(userExist){
          return res.status(409).json({
            message: "A user with this email already exists"
          })
       } ;
        
       const genSalt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, genSalt)

       const newUser = await userModel.create({ name, email, password: hashedPassword });
       res.status(201).json({
          message: `User created successfully`,
          data: newUser
       });
    } catch (error) {
        return res.status(500).json({
            message: `Error creating user: ${error.message}`
        })
    }
}

const getAllUsers = async (req, res) => {
     try {
        const getAll = await userModel.find();
        return res.status(200).json({
            message: `All users retrieved successfully`,
            data: getAll
        });
     } catch (error) {
         return res.status(500).json({
            message: `Error fetching users: ${error.message}`
        })
     }
}


const getUser = async (req, res) => {
     const {id} = req.params;
     try {
        
        const getUser = await userModel.findById(id);
        if(!getUser){
            return res.status(404).json({
                message: `User not found`
            })
        }
        return res.status(200).json({
            message: `User retrieved successfully`,
            data: getUser
        });
     } catch (error) {
         return res.status(500).json({
            message: `Error fetching user: ${error.message}`
        })
     }
}
 const updateUser = async (req, res) => {
  const { id } = req.params;
  const {name, password} = req.body

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        name,
        password
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error updating user: ${error.message}`,
    });
  }
};

const deleteUser = async (req, res) => {
    const {id} = req.params;

    try {
        const deletedUser = await userModel.findByIdAndDelete(id);
        if(!deletedUser){
            return res.status(404).json({
                message: `User not found`
            })
        };

        return res.status(200).json({
            message: `User deleted successfully`,
            data: deletedUser
        });
    } catch (error) {
        return res.status(500).json({
            message: `Error deleting user: ${error.message}`
        })
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email}).select("+password");

        if(!user) return res.status(404).json({
            error: true,
            message: "User not found"
        });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) return res.status(401).json({
            error: true,
            message: "Invalid credentials"
        });

        const data = user.toObject();
        delete data.password;

        res.status(200).json({
            error: false,
            message: "Login successful",
            data
        })

    } catch (error) {
        return res.status(500).json({
            message: `Failed to login: ${error.message}`
        })
    }
}


module.exports = {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser, 
    loginUser
}