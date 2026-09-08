const userModel = require("../models/UserModel");

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
       const newUser = await userModel.create({ name, email, password });
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


module.exports = {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}