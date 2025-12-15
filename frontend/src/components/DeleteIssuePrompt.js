import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteIssue } from '../api/IssuesApi';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function DeleteIssue({ onClose, issueId }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id) => deleteIssue(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['issues']);
            onClose();
        },
        onError: (err) => {
            console.error('Delete failed', err);
        }
    });

    return (
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to delete this issue?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                <Button
                    color="error"
                    variant="contained"
                    onClick={() => mutation.mutate(issueId)}
                    disabled={mutation.isLoading}
                >
                    {mutation.isLoading ? 'Deleting...' : 'Delete'}
                </Button>
                <Button type="button" variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
            </Box>
        </Box>
    )
}

export default DeleteIssue;