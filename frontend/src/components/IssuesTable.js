import { useQuery } from "@tanstack/react-query";
import { listIssues } from "../api/IssuesApi";
import Table from '@mui/material/Table';
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import CreateIssue from "./CreateIssue";
import DeleteIssue from "./DeleteIssuePrompt";
import EditIssueModal from "./EditIssueModal";

function IssuesTable() {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openDelete, setOpenDelete] = useState(false);
    const [selectedIssueId, setSelectedIssueId] = useState(null);

    const [selectedIssue, setSelectedIssue] = useState(null);

    const handleOpenDelete = (id) => {
        setSelectedIssueId(id);
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setSelectedIssueId(null);
        setOpenDelete(false);
    };

    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    const { data, error, isLoading } = useQuery({
        queryKey: ['issues'],
        queryFn: async () => {
            return listIssues();
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error! {error.message}</div>;
    if (data) console.log(data);

    return (
        <Paper sx={{ p: 2, m: 2 }} elevation={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Issue Tracker</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>Create Issue</Button>
            </Stack>

            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created On</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.data.map((issue, idx) => (
                            <TableRow
                                key={issue.id}
                                onClick={() => console.log('row clicked', issue.id)}
                                sx={{
                                    cursor: 'pointer',
                                    backgroundColor: idx % 2 === 0 ? 'background.paper' : 'action.hover',
                                    '&:hover': { backgroundColor: 'action.selected' },
                                }}
                            >
                                <TableCell>{issue.id}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{issue.title}</TableCell>
                                <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.description}</TableCell>
                                <TableCell>
                                    <Typography variant="caption" sx={{ px: 1, py: 0.5, bgcolor: issue.status === 'open' ? 'success.light' : 'grey.300', borderRadius: 1 }}>
                                        {issue.status}
                                    </Typography>
                                </TableCell>
                                <TableCell>{new Date(issue.created_on).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <IconButton size="small" color="error" onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDelete(issue.id);
                                        }} aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton size="small" onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedIssue(issue);
                                            handleOpenEdit();
                                        }} aria-label="edit">
                                            <EditIcon />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <CreateIssue onClose={handleClose} onCreated={() => { }} />
            </Modal>

            <Modal
                open={openEdit}
                onClose={handleCloseEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <EditIssueModal onClose={handleCloseEdit} issue={selectedIssue} />
            </Modal>

            <Modal
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DeleteIssue onClose={handleCloseDelete} issueId={selectedIssueId} />
            </Modal>
        </Paper>
    )
}

export default IssuesTable;