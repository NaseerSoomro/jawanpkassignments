import { Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from 'axios';
import BAGrid from "../components/BAGrid";

const ApiHandling = () => {
    const [users, setUsers] = useState([]);
    const [dataLoader, setDataLoader] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteUser, setDeleteUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        website: ''
    });

    const getData = () => {
        setDataLoader(true);
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then((res) => {
                console.log(res.data, "Success Response")
                setUsers([...res.data]);
                setDataLoader(false);
            }).catch((err) => {
                console.log(err, "Error");
                setDataLoader(false);
            });
    };

    const handleClickOpenEdit = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            website: user.website
        });
        setEditUser(user);
        setOpenEditDialog(true);
    };

    const handleCloseEdit = () => {
        setOpenEditDialog(false);
        setEditUser(null);
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = () => {
        // Handle form submission to update user data
        axios.put(`https://jsonplaceholder.typicode.com/users/${editUser.id}`, formData)
            .then((res) => {
                const updatedUsers = users.map(user =>
                    user.id === editUser.id ? res.data : user
                );
                setUsers(updatedUsers);
                handleCloseEdit();
            }).catch((err) => {
                console.log(err, "Error updating user");
            });
    };

    const handleClickOpenDelete = (user) => {
        setDeleteUser(user);
        setOpenDeleteDialog(true);
    };

    const handleCloseDelete = () => {
        setOpenDeleteDialog(false);
        setDeleteUser(null);
    };

    const handleDelete = () => {
        axios.delete(`https://jsonplaceholder.typicode.com/users/${deleteUser.id}`)
            .then(() => {
                const updatedUsers = users.filter(user => user.id !== deleteUser.id);
                setUsers(updatedUsers);
                handleCloseDelete();
            }).catch((err) => {
                console.log(err, "Error deleting user");
            });
    };

    return (
        <Box>
            <Button variant="contained" sx={{ margin: 1 }} onClick={getData}>Get Users</Button>
            <Button variant="contained" sx={{ margin: 1 }}>Post User</Button>
            <Button variant="contained" sx={{ margin: 1 }}>Update User</Button>
            <Button variant="contained" sx={{ margin: 1 }}>Delete User</Button>

            <BAGrid dataLoader={dataLoader} gridCols={[
                {
                    key: "name",
                    label: "User Name",
                },
                {
                    key: "email",
                    label: "User Email",
                },
                {
                    key: "phone",
                    label: "Phone",
                },
                {
                    key: "website",
                    label: "Website",
                },
                {
                    key: '',
                    label: 'Edit',
                    displayField: (row) => <Button onClick={() => handleClickOpenEdit(row)} variant="contained">Edit</Button>
                },
                {
                    key: '',
                    label: 'Delete',
                    displayField: (row) => <Button onClick={() => handleClickOpenDelete(row)} variant="contained">Delete</Button>
                },
            ]} datasource={users} />

            <Dialog open={openEditDialog} onClose={handleCloseEdit}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="User Name"
                        type="text"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="User Email"
                        type="email"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        label="Phone"
                        type="text"
                        fullWidth
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="website"
                        label="Website"
                        type="text"
                        fullWidth
                        value={formData.website}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit}>Cancel</Button>
                    <Button onClick={handleSubmit}>Update</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete {deleteUser?.name}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ApiHandling;
