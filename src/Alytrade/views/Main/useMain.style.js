import { createUseStyles } from "react-jss";

export const useStyle = createUseStyles({
    container:{
        display: 'flex',
        background: '#1e272e',
        flexDirection:'column'
    },
    panelContainer:{
        display:'flex',
        padding: '2rem',
        justifyContent: 'space-between'
    },
    panel: {
        borderRadius: '7px',
        background: '#12171c',
        minHeight: '500px',
        height: 'calc(100vh - 8rem)',
        maxHeight: '860px',
        width: 'calc(50% - 1rem)',
        overflowY:'auto'
    },
    table: {
        margin: '10px',
        padding: '10px',
        textAlign:'center',
        width: "calc(100% - 1.5rem)",
        borderCollapse: "collapse",
        '& tbody': {
            '&:before':{
                content: '"-"',
                lineHeight:"0.8rem",
                display:"block",
                color:"transparent"
            }
        },
        
        '& thead>tr': {
            margin:'2rem',
            borderBottom: `solid gold 2px`,
        },
        '& th':{
            padding: "10px 0 10px 0",
        },
        '& tbody>tr': {
            borderBottom: `solid gold 0.01px`,
            color: 'white',
            
            '&:hover':{
                transition: 'all 0.2s ease',
                background: '#FFFFFF1A',
                cursor:'pointer'
            }
        },
        '& td': {
            padding: "10px 0 10px 0",
            textAlign: "center",
        }
    },
    detailsContainer:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        padding:0
    },
    detailsColumn:{
        width: 'calc(50% - 1rem)',
    },
    detailsRow:{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '2rem',
        overflowWrap: 'break-word'
    },
    name:{
        color:'#ffcb08'
    },
    value:{
        color:'white'
    },
    button:{
        backgroundColor: '#ffcb08',
        alignItems: 'center',
        backgroundColor: '#ffcb08',
        border: 'none',
        borderRadius: '25px',
        // display: 'flex',
        // flexDirection: 'row',
        // justifyContent: 'center',
        cursor: 'pointer',
        color: '#2b2b2b',
        textTransform: 'uppercase',
        padding: '8px 15px',
        fontWeight: 'bold',
        fontSize: '14px',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        '&:hover':{
            boxShadow: 'rgba(255, 203, 8, 0.5) 0px 0px 0px 3px'
        }
    },
    select:{
        backgroundColor: '#1d1d1d',
        border: '2px solid #000',
        borderRadius: '3px',
        color: '#fff',
        resize: 'none',
        padding: '8px',
        transition: 'all 0.2s ease'
    },
    input:{
        backgroundColor: '#1d1d1d',
        border: '2px solid #000',
        borderRadius: '3px',
        color: '#fff',
        resize: 'none',
        padding: '8px',
        transition: 'all 0.2s ease',
        '&:hover':{
            boxShadow: 'rgba(255, 203, 8, 0.5) 0px 0px 0px 3px'
        }
    }
})