import { createUseStyles } from "react-jss";

export const useStyle = createUseStyles({
    container: {
        display:'flex',
        justifyContent:'space-between',
        borderColor:'#273234',
        background:'#12171c',
        borderRadius: '7px',
        padding:'1rem',
        margin:'1rem 2rem'
    },
    logo:{

    },
    linksContainer:{
        display:'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    link:{
        textDecoration: 'none',
        margin: '0 5px',
        borderRadius: '5px',
        color: '#FFF',
        fontSize: '16px',
        padding: '10px 15px',
        position: 'relative',
        transition: 'all 0.2s ease',
        '&:hover':{
            backgroundColor: 'rgba(250, 250, 250, 0.1)'
        }
    },
    activeLink:{
        textDecoration: 'none',
        margin: '0 5px',
        borderRadius: '5px',
        color: '#ffcb08',
        fontSize: '16px',
        padding: '10px 15px',
        position: 'relative',
        transition: 'all 0.2s ease',
        backgroundColor: 'rgba(250, 250, 250, 0.1)'
    }
})