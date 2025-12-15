import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Formik } from 'formik';
import { updateIssue } from '../api/IssuesApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

function EditIssueModal({ issue, onUpdated, onClose }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, values }) => updateIssue(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries(['issues']);
            if (onUpdated) onUpdated();
            if (onClose) onClose();
        },
        onError: (err) => console.error('Update failed', err),
    });

    const initialValues = {
        title: issue?.title ?? '',
        description: issue?.description ?? '',
        status: issue?.status ?? 'open',
    };

    return (
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit Issue
            </Typography>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        await mutation.mutateAsync({ id: issue.id, values });
                    } catch (err) {
                        console.error(err);
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >{({ values, handleChange, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="title"
                        label="Title"
                        value={values.title}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        name="description"
                        label="Description"
                        value={values.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                    />

                    <TextField
                        select
                        name="status"
                        label="Status"
                        value={values.status}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="open">open</MenuItem>
                        <MenuItem value="closed">closed</MenuItem>
                    </TextField>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                        <Button type="submit" variant="contained" disabled={isSubmitting || mutation.isLoading}>
                            {mutation.isLoading ? 'Saving...' : 'Save'}
                        </Button>
                        <Button type="button" variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                    </Box>
                </form>
            )}</Formik>
        </Box>
    );
}

export default EditIssueModal;