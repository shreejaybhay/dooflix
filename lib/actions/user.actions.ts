import User from "../database/models/user.model";
import { connect } from "../database/db";

interface CreateUserParams {
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName?: string;
  lastName?: string;
}

interface UpdateUserParams {
  email?: string;
  username?: string;
  photo?: string;
  firstName?: string;
  lastName?: string;
}

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connect();
    const newUser = await User.create(user);
    return newUser.toJSON();
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connect();
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");
    return user.toJSON();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connect();
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });
    if (!updatedUser) throw new Error("User update failed");
    return updatedUser.toJSON();
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connect();
    const userToDelete = await User.findOne({ clerkId });
    if (!userToDelete) {
      throw new Error("User not found");
    }
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    if (!deletedUser) {
      throw new Error("Failed to delete user");
    }
    return deletedUser.toJSON();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}
