import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 11 },
  title: { fontSize: 18, marginBottom: 14 },
  row: { marginBottom: 6 },
  box: { marginTop: 12, padding: 12, border: "1 solid #ccc" },
});

const InvoicePDF = ({ payment }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>CivicCare Invoice</Text>

        <View style={styles.box}>
          <Text style={styles.row}>Invoice For: Premium Subscription</Text>
          <Text style={styles.row}>Email: {payment?.email}</Text>
          <Text style={styles.row}>Amount: {payment?.amount} tk</Text>
          <Text style={styles.row}>Method: {payment?.method}</Text>
          <Text style={styles.row}>Transaction ID: {payment?.transactionId}</Text>
          <Text style={styles.row}>
            Date: {payment?.createdAt ? new Date(payment.createdAt).toLocaleString() : ""}
          </Text>
        </View>

        {/* <Text style={{ marginTop: 18 }}>
          This invoice is generated for assignment purposes.
        </Text> */}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
