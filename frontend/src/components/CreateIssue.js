import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Formik } from 'formik';
import { createIssue } from '../api/IssuesApi';
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

function CreateIssue({ onCreated, onClose }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (values) => createIssue(values),
        onSuccess: (variables) => {
            queryClient.invalidateQueries(['issues']);
            if (onCreated) onCreated(variables);
            if (onClose) onClose();
        },
        onError: (err) => {
            console.error('Create failed', err);
        },
    });

    return (
        <>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Create Issue
                </Typography>

                <Formik
                    initialValues={{ title: '', description: '', status: 'open' }}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        try {
                            await mutation.mutateAsync(values);
                            resetForm();
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
                            required
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

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                            <Button type="submit" variant="contained" disabled={isSubmitting || mutation.isLoading}>
                                {mutation.isLoading ? 'Creating...' : 'Create'}
                            </Button>
                            <Button type="button" variant="outlined" onClick={onClose}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                )}</Formik>
            </Box>
        </>
    );
}

export default CreateIssue;