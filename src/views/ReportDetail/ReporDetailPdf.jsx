import React from 'react'
import moment from 'moment'
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer'

import { floor } from '../../utils/constanst'


const styles = StyleSheet.create({
    section: {
        margin: 10,
        padding: 10,
        fontSize: 12
    },

    table: {
        flexDirection: 'colum'
    },

    tableRow: {
        flexDirection: 'row',
        flexFlow: 1,
        justifyContent: "space-between",
        width: '100%'
    },

    tableColumn: {
        textAlign: 'center',
        width: '11.11%'
    }
})


// Renderizado para cada columna de la tabla de planes de inversión
const duplicationPlanItem = (item) => (
    <View style={styles.tableRow}>
        <Text>{item.day_number}</Text>
        <Text>{moment(item.date).format('DD-MM-YYYY')}</Text>
        <Text>{item.codigo}</Text>
        <Text>{item.description}</Text>
        <Text>{floor(item.percentage, 3) ?? ''}</Text>
        <Text>{floor(item.daily_interest, 8)}</Text>
        <Text>{floor(item.debit, 8) ?? ''}</Text>
        <Text>{floor(item.credit, 8) ?? ''}</Text>
        <Text>{floor(item.balance, 8)}</Text>
    </View>
)


const UserReport = ({ data }) => {
    return (
        <Document size="A4">
            <Page>
                <View style={styles.section}>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text>No. DÍA</Text>
                            <Text>FECHA</Text>
                            <Text>CÓDIGO</Text>
                            <Text>DESCRIPCIÓN</Text>
                            <Text>% DÍA</Text>
                            <Text>INT DIARIO</Text>
                            <Text>DÉBITO</Text>
                            <Text>CRÉDITO</Text>
                            <Text>BALANCE</Text>
                        </View>

                        {
                            data.map(item => duplicationPlanItem(item))
                        }
                    </View>
                </View>
            </Page>
        </Document>
    )
}

const UserReportPDF = ({ data }) => (
    <PDFViewer>
        <UserReport data={data} />
    </PDFViewer>
)

export default UserReportPDF