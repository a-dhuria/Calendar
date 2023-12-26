import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
import ViewDownload from './ViewDownload';
 
const columns = [
    { field: 'id', headerName: 'SL. No', width: 70, headerClassName: 'super-app-theme--header' },
   
    { field: 'status', headerName: 'PO Status', width: 80, headerClassName: 'super-app-theme--header' },
    {
        field: 'action',
        headerName: 'Action',
        type: 'file',
        width: 120,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        renderCell: (params) => (
            <strong>
                <Button variant="contained" size="small" onClick={() => <ViewDownload />}>
                    Download
                </Button>
                {/* {isShown && <ViewDownload />} */}
            </strong>
        )
        // renderCell: renderDetailsButton
    }
];
 
const rows = [
    {
        id: 1,
        poNo: 'PO_CCTN_0822_001',
        poDate: '01/08/2022',
        from: '08/2022',
        to: '09/2022',
        state: 'TN',
        product: 'MLP',
        certificate: 'Document',
        quantity: '8000',
        status: 'PENDING',
        action: 'View/Download'
    }
];
 
const Document = () => {
    return (
        <>
            <Typography variant="h2" color="gray">
                Documents
            </Typography>
            <Button variant="contained" sx={{ my: 3, background: 'gray', px: 3, py: 0 }}>
                Filter
            </Button>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                flexDirection="column"
                sx={{
                    mt: -18,
                    mx: -14,
                    '& .super-app-theme--header': {
                        backgroundColor: 'gray',
                        color: 'white'
                    },
                    '& .super-app-theme--cell': {
                        color: '#86C029',
                        cursor: 'pointer'
                    }
                }}
            >
                <Box sx={{ height: 300, width: { xs: '60%', sm: '65%', md: '80%' } }}>
                    <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
                </Box>
            </Box>
        </>
    );
};
 
export default Document;